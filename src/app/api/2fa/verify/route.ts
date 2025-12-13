import { NextRequest, NextResponse } from 'next/server';
import { verifyTwoFactorLogin } from '@/lib/auth-system';

// Rota para verificar código 2FA no login
export async function POST(request: NextRequest) {
  try {
    const { userId, code, backupCode } = await request.json();
    
    if (!userId || (!code && !backupCode)) {
      return NextResponse.json({
        success: false,
        message: 'ID do usuário e código (TOTP ou backup) são obrigatórios'
      }, { status: 400 });
    }

    return verifyTwoFactorLogin(userId, code);
  } catch (error) {
    console.error('Erro na rota POST /2fa/verify:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro interno do servidor'
    }, { status: 500 });
  }
}