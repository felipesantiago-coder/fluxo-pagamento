import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-system';

export async function POST(request: NextRequest) {
  return verifyAuth(request);
}

export async function GET(request: NextRequest) {
  return verifyAuth(request);
}