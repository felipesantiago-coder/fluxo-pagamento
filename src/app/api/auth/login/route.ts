import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from '@/lib/auth-system';

export async function POST(request: NextRequest) {
  return loginUser(request);
}