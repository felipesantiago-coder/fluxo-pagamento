import { NextRequest, NextResponse } from 'next/server';
import { setupTwoFactor, verifyAndEnableTwoFactor } from '@/lib/auth-system';

// Rota para configurar 2FA
export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        message: 'ID do usuário é obrigatório'
      }, { status: 400 });
    }

    return setupTwoFactor(userId);
  } catch (error) {
    console.error('Erro na rota POST /2fa/setup:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro interno do servidor'
    }, { status: 500 });
  }
}

// Rota para verificar e habilitar 2FA
export async function PUT(request: NextRequest) {
  try {
    const { userId, code, secret } = await request.json();
    
    if (!userId || !code || !secret) {
      return NextResponse.json({
        success: false,
        message: 'ID do usuário, código e secret são obrigatórios'
      }, { status: 400 });
    }

    return verifyAndEnableTwoFactor(userId, code, secret);
  } catch (error) {
    console.error('Erro na rota PUT /2fa/setup:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro interno do servidor'
    }, { status: 500 });
  }
}