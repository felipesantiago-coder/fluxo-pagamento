'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, ArrowRight, AlertCircle, Eye, EyeOff, User, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success && data.token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        
        // Verificar se 2FA é necessário
        if (data.requiresTwoFactor || data.user.twoFactorEnabled) {
          // Se 2FA está configurado ou requerido, redirecionar para verificação
          router.push('/2fa-verify');
        } else {
          // Se 2FA não está configurado, redirecionar para configuração
          router.push('/2fa-setup');
        }
      } else {
        setError(data.message || 'E-mail ou senha incorretos');
      }
    } catch (error) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo
          </h1>
          <p className="text-gray-600">
            Faça login para acessar sua conta
          </p>
        </div>

        {/* Card de Login */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo de E-mail */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                E-mail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>
            </div>

            {/* Campo de Senha */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="•••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-200"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Mensagem de Erro */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                <span className="text-red-800 text-sm font-medium">{error}</span>
              </div>
            )}

            {/* Botão de Login */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none transition-all duration-200 font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Entrando...</span>
                </>
              ) : (
                <>
                  <span>Entrar</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Links Adicionais */}
        <div className="mt-8 text-center space-y-4">
          <div className="text-sm text-gray-600">
            <a href="#" className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">
              Esqueceu sua senha?
            </a>
          </div>
          
          <div className="text-sm text-gray-500">
            Ainda não tem uma conta?{' '}
            <a href="#" className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">
              Cadastre-se
            </a>
          </div>
        </div>

        {/* Informações de Teste */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-100">
          <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Usuários de Teste</span>
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-blue-200">
              <div>
                <div className="font-medium text-gray-900">Administrador</div>
                <div className="text-sm text-gray-600">admin@quattre.com</div>
                <div className="text-xs text-orange-600 mt-1">Precisa configurar 2FA</div>
              </div>
              <div className="text-sm font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded">
                admin123
              </div>
            </div>
            <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-blue-200">
              <div>
                <div className="font-medium text-gray-900">Corretor</div>
                <div className="text-sm text-gray-600">corretor@quattre.com</div>
                <div className="text-xs text-orange-600 mt-1">Precisa configurar 2FA</div>
              </div>
              <div className="text-sm font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded">
                corretor123
              </div>
            </div>
            <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-green-200">
              <div>
                <div className="font-medium text-gray-900">Usuário com 2FA</div>
                <div className="text-sm text-gray-600">user@quattre.com</div>
                <div className="text-xs text-green-600 mt-1">2FA já configurado</div>
              </div>
              <div className="text-sm font-mono bg-green-100 text-green-800 px-2 py-1 rounded">
                user123
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-xs text-yellow-800">
              <strong>Para testes:</strong> Use o código <code className="bg-yellow-100 px-1 rounded">123456</code> para verificação 2FA do usuário pré-configurado.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>© 2024 Sistema de Autenticação. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
}