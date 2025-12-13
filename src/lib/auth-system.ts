// Sistema de Autenticação Serverless-Compatible com 2FA
// Adaptado para Vercel e ambientes serverless

import { NextRequest, NextResponse } from 'next/server';

// Interface para usuário
interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'user';
  isAdmin: boolean;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  createdAt: string;
  lastLogin?: string;
}

// Interface para dados de login
interface LoginData {
  email: string;
  password: string;
}

// Interface para resposta de login
interface LoginResponse {
  success: boolean;
  user?: Omit<User, 'password' | 'twoFactorSecret'>;
  token?: string;
  requiresTwoFactor?: boolean;
  message?: string;
}

// Interface para configuração 2FA
interface TwoFactorSetupResponse {
  success: boolean;
  secret?: string;
  qrCode?: string;
  backupCodes?: string[];
  message?: string;
}

// Interface para verificação 2FA
interface TwoFactorVerifyResponse {
  success: boolean;
  verified?: boolean;
  token?: string;
  message?: string;
}

// Usuários em memória (compatível com serverless)
const DEFAULT_USERS: User[] = [
  {
    id: '1',
    email: 'admin@quattre.com',
    password: 'admin123',
    name: 'Administrador',
    role: 'admin',
    isAdmin: true,
    twoFactorEnabled: false,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    email: 'corretor@quattre.com',
    password: 'corretor123',
    name: 'Corretor Padrão',
    role: 'user',
    isAdmin: false,
    twoFactorEnabled: false,
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    email: 'user@quattre.com',
    password: 'user123',
    name: 'Usuário com 2FA',
    role: 'user',
    isAdmin: false,
    twoFactorEnabled: true,
    twoFactorSecret: 'JBSWY3DPEHPK3PXP', // Secret para testes
    createdAt: new Date().toISOString()
  }
];

// Sistema de armazenamento serverless
class UserStorage {
  private static users: User[] = DEFAULT_USERS;
  
  static getUsers(): User[] {
    return this.users;
  }
  
  static getUserByEmail(email: string): User | null {
    return this.users.find(user => user.email === email) || null;
  }
  
  static getUserById(id: string): User | null {
    return this.users.find(user => user.id === id) || null;
  }
  
  static updateUser(id: string, updates: Partial<User>): boolean {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) return false;
    
    this.users[userIndex] = { ...this.users[userIndex], ...updates };
    return true;
  }

  static enableTwoFactor(userId: string, secret: string): boolean {
    return this.updateUser(userId, { 
      twoFactorEnabled: true, 
      twoFactorSecret: secret 
    });
  }

  static disableTwoFactor(userId: string): boolean {
    return this.updateUser(userId, { 
      twoFactorEnabled: false, 
      twoFactorSecret: undefined 
    });
  }
}

// Sistema de tokens JWT-like
class TokenManager {
  static generateSessionToken(user: User): string {
    const tokenData = {
      id: user.id,
      email: user.email,
      timestamp: Date.now(),
      exp: Date.now() + (24 * 60 * 60 * 1000), // 24 horas
      twoFactorVerified: true
    };
    
    const token = Buffer.from(JSON.stringify(tokenData)).toString('base64');
    return token;
  }

  static generateTempToken(user: User): string {
    const tokenData = {
      id: user.id,
      email: user.email,
      timestamp: Date.now(),
      exp: Date.now() + (10 * 60 * 1000), // 10 minutos
      twoFactorVerified: false
    };
    
    const token = Buffer.from(JSON.stringify(tokenData)).toString('base64');
    return token;
  }
  
  static verifyToken(token: string): User | null {
    try {
      const tokenData = JSON.parse(Buffer.from(token, 'base64').toString());
      
      // Verificar expiração
      if (Date.now() > tokenData.exp) {
        return null;
      }
      
      return UserStorage.getUserById(tokenData.id);
    } catch {
      return null;
    }
  }

  static isTokenTwoFactorVerified(token: string): boolean {
    try {
      const tokenData = JSON.parse(Buffer.from(token, 'base64').toString());
      return tokenData.twoFactorVerified || false;
    } catch {
      return false;
    }
  }
}

// Gerador de secret para 2FA
class TwoFactorAuth {
  static generateSecret(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = '';
    for (let i = 0; i < 32; i++) {
      secret += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return secret;
  }

  static generateBackupCodes(): string[] {
    const codes: string[] = [];
    for (let i = 0; i < 10; i++) {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      codes.push(code);
    }
    return codes;
  }

  static verifyCode(secret: string, token: string): boolean {
    // Simulação de verificação TOTP
    // Em produção, usar biblioteca como 'otplib'
    
    // Para testes, aceitar códigos específicos
    if (secret === 'JBSWY3DPEHPK3PXP') {
      // Aceitar códigos de teste para o usuário pré-configurado
      const testCodes = ['123456', '000000', '111111'];
      return testCodes.includes(token);
    }
    
    const timeStep = Math.floor(Date.now() / 30000); // 30 segundos
    const expectedToken = this.generateTOTP(secret, timeStep);
    
    // Verificar token atual e adjacentes (para tolerância de tempo)
    return (
      token === expectedToken ||
      token === this.generateTOTP(secret, timeStep - 1) ||
      token === this.generateTOTP(secret, timeStep + 1)
    );
  }

  private static generateTOTP(secret: string, timeStep: number): string {
    // Simulação simplificada - em produção usar algoritmo TOTP real
    const hash = require('crypto')
      .createHmac('sha1', secret)
      .update(Buffer.alloc(8, timeStep))
      .digest('hex');
    
    const offset = parseInt(hash.substring(hash.length - 1), 16);
    const binary = parseInt(hash.substring(offset * 2, offset * 2 + 8), 16) & 0x7fffffff;
    return (binary % 1000000).toString().padStart(6, '0');
  }
}

// Função principal de login
export async function loginUser(request: NextRequest): Promise<NextResponse<LoginResponse>> {
  try {
    const loginData: LoginData = await request.json();
    const { email, password } = loginData;
    
    // Validação básica
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        message: 'E-mail e senha são obrigatórios'
      }, { status: 400 });
    }
    
    // Buscar usuário
    const user = UserStorage.getUserByEmail(email);
    if (!user || user.password !== password) {
      return NextResponse.json({
        success: false,
        message: 'E-mail ou senha incorretos'
      }, { status: 401 });
    }
    
    // Atualizar último login
    UserStorage.updateUser(user.id, { lastLogin: new Date().toISOString() });
    
    // Verificar se 2FA está habilitado
    if (user.twoFactorEnabled) {
      // Gerar token temporário que requer verificação 2FA
      const tempToken = TokenManager.generateTempToken(user);
      
      return NextResponse.json({
        success: true,
        requiresTwoFactor: true,
        token: tempToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isAdmin: user.isAdmin,
          twoFactorEnabled: user.twoFactorEnabled,
          createdAt: user.createdAt,
          lastLogin: new Date().toISOString()
        }
      });
    } else {
      // Gerar token de sessão completo
      const sessionToken = TokenManager.generateSessionToken(user);
      
      return NextResponse.json({
        success: true,
        token: sessionToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isAdmin: user.isAdmin,
          twoFactorEnabled: user.twoFactorEnabled,
          createdAt: user.createdAt,
          lastLogin: new Date().toISOString()
        }
      });
    }
    
  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro interno do servidor'
    }, { status: 500 });
  }
}

// Função para configurar 2FA
export async function setupTwoFactor(userId: string): Promise<NextResponse<TwoFactorSetupResponse>> {
  try {
    const user = UserStorage.getUserById(userId);
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'Usuário não encontrado'
      }, { status: 404 });
    }

    if (user.twoFactorEnabled) {
      return NextResponse.json({
        success: false,
        message: '2FA já está configurado para este usuário'
      }, { status: 400 });
    }

    const secret = TwoFactorAuth.generateSecret();
    const backupCodes = TwoFactorAuth.generateBackupCodes();

    // Em produção, gerar QR code real
    const qrCode = `otpauth://totp/Sistema:${user.email}?secret=${secret}&issuer=Sistema`;

    return NextResponse.json({
      success: true,
      secret,
      qrCode,
      backupCodes
    });
    
  } catch (error) {
    console.error('Erro na configuração 2FA:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro interno do servidor'
    }, { status: 500 });
  }
}

// Função para verificar e habilitar 2FA
export async function verifyAndEnableTwoFactor(userId: string, code: string, secret: string): Promise<NextResponse<TwoFactorVerifyResponse>> {
  try {
    const user = UserStorage.getUserById(userId);
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'Usuário não encontrado'
      }, { status: 404 });
    }

    const isValid = TwoFactorAuth.verifyCode(secret, code);
    
    if (isValid) {
      UserStorage.enableTwoFactor(userId, secret);
      
      return NextResponse.json({
        success: true,
        verified: true,
        message: '2FA configurado com sucesso'
      });
    } else {
      return NextResponse.json({
        success: false,
        verified: false,
        message: 'Código inválido'
      }, { status: 400 });
    }
    
  } catch (error) {
    console.error('Erro na verificação 2FA:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro interno do servidor'
    }, { status: 500 });
  }
}

// Função para verificar código 2FA no login
export async function verifyTwoFactorLogin(userId: string, code: string): Promise<NextResponse<TwoFactorVerifyResponse>> {
  try {
    const user = UserStorage.getUserById(userId);
    if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
      return NextResponse.json({
        success: false,
        message: '2FA não configurado para este usuário'
      }, { status: 400 });
    }

    const isValid = TwoFactorAuth.verifyCode(user.twoFactorSecret, code);
    
    if (isValid) {
      const sessionToken = TokenManager.generateSessionToken(user);
      
      return NextResponse.json({
        success: true,
        verified: true,
        token: sessionToken,
        message: 'Verificação 2FA concluída com sucesso'
      });
    } else {
      return NextResponse.json({
        success: false,
        verified: false,
        message: 'Código inválido'
      }, { status: 400 });
    }
    
  } catch (error) {
    console.error('Erro na verificação 2FA:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro interno do servidor'
    }, { status: 500 });
  }
}

// Função para verificar status de autenticação
export async function verifyAuth(request: NextRequest): Promise<NextResponse> {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        authenticated: false,
        message: 'Token não fornecido'
      }, { status: 401 });
    }
    
    const token = authHeader.substring(7);
    const user = TokenManager.verifyToken(token);
    
    if (!user) {
      return NextResponse.json({
        authenticated: false,
        message: 'Token inválido ou expirado'
      }, { status: 401 });
    }
    
    // Verificar se 2FA foi verificado
    const isTwoFactorVerified = TokenManager.isTokenTwoFactorVerified(token);
    
    return NextResponse.json({
      authenticated: true,
      twoFactorVerified: isTwoFactorVerified,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isAdmin: user.isAdmin,
        twoFactorEnabled: user.twoFactorEnabled
      }
    });
    
  } catch (error) {
    console.error('Erro na verificação de autenticação:', error);
    return NextResponse.json({
      authenticated: false,
      message: 'Erro interno do servidor'
    }, { status: 500 });
  }
}