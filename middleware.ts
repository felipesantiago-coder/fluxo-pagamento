import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Função para verificar token
function verifyToken(token: string): any {
  try {
    const tokenData = JSON.parse(Buffer.from(token, 'base64').toString());
    
    // Verificar expiração
    if (Date.now() > tokenData.exp) {
      return null;
    }
    
    return tokenData;
  } catch {
    return null;
  }
}

// Função para verificar se 2FA foi verificado
function isTwoFactorVerified(token: string): boolean {
  try {
    const tokenData = JSON.parse(Buffer.from(token, 'base64').toString());
    return tokenData.twoFactorVerified || false;
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Páginas públicas que não requerem autenticação
  const publicPaths = ['/login', '/2fa-setup', '/2fa-verify'];
  
  // Páginas que requerem autenticação completa
  const protectedPaths = ['/simulator'];
  
  // API routes
  const apiPrefix = '/api/';

  // Se for uma rota de API, deixar passar
  if (pathname.startsWith(apiPrefix)) {
    return NextResponse.next();
  }

  // Obter token do localStorage ou cookie
  const token = request.cookies.get('authToken')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');

  // Se não há token e não é página pública, redirecionar para login
  if (!token && !publicPaths.includes(pathname)) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Se há token, verificar validade
  if (token) {
    const tokenData = verifyToken(token);
    
    // Token inválido ou expirado
    if (!tokenData) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('reason', 'expired');
      return NextResponse.redirect(loginUrl);
    }

    // Se está tentando acessar página pública já logado
    if (publicPaths.includes(pathname)) {
      // Verificar se 2FA está configurado
      const userCookie = request.cookies.get('user')?.value;
      if (userCookie) {
        try {
          const user = JSON.parse(userCookie);
          
          // Se 2FA está configurado mas não verificado, redirecionar para verificação
          if (user.twoFactorEnabled && !isTwoFactorVerified(token)) {
            const verifyUrl = new URL('/2fa-verify', request.url);
            return NextResponse.redirect(verifyUrl);
          }
          
          // Se 2FA não está configurado, redirecionar para configuração
          if (!user.twoFactorEnabled) {
            const setupUrl = new URL('/2fa-setup', request.url);
            return NextResponse.redirect(setupUrl);
          }
          
          // Se tudo está ok, redirecionar para o simulador
          const simulatorUrl = new URL('/simulator', request.url);
          return NextResponse.redirect(simulatorUrl);
        } catch (error) {
          // Se não conseguir parsear user, continuar para página pública
        }
      }
    }

    // Se está tentando acessar página protegida
    if (protectedPaths.includes(pathname)) {
      const userCookie = request.cookies.get('user')?.value;
      
      if (!userCookie) {
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
      }

      try {
        const user = JSON.parse(userCookie);
        
        // Se 2FA está configurado mas não verificado, redirecionar para verificação
        if (user.twoFactorEnabled && !isTwoFactorVerified(token)) {
          const verifyUrl = new URL('/2fa-verify', request.url);
          return NextResponse.redirect(verifyUrl);
        }
        
        // Se 2FA não está configurado, redirecionar para configuração
        if (!user.twoFactorEnabled) {
          const setupUrl = new URL('/2fa-setup', request.url);
          return NextResponse.redirect(setupUrl);
        }
        
        // Se está tudo ok, permitir acesso
        return NextResponse.next();
      } catch (error) {
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
      }
    }
  }

  // Para todas as outras rotas, permitir acesso
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};