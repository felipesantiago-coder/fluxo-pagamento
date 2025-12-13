'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Zap, Palette, CheckCircle, Code, Cloud, Server, Cpu, Globe, ArrowRight, Users, Lock, Key } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Verificar se usuário já está autenticado
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      try {
        const userData = JSON.parse(user);
        
        // Se 2FA está configurado mas não verificado, redirecionar para verificação
        if (userData.twoFactorEnabled) {
          router.push('/2fa-verify');
          return;
        }
        
        // Se 2FA não está configurado, redirecionar para configuração
        router.push('/2fa-setup');
        return;
      } catch (error) {
        // Se houver erro nos dados, redirecionar para login
        router.push('/login');
        return;
      }
    }
    
    // Se não está autenticado, redirecionar para login após mostrar a página
    const timer = setTimeout(() => {
      router.push('/login');
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [router]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-8 shadow-xl">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Sistema de Autenticação
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Sistema moderno e seguro com autenticação de dois fatores (2FA)
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Feature 1 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <Shield className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Segurança Avançada</h3>
            <p className="text-gray-600 leading-relaxed">
              Sistema robusto com tokens JWT, hash de senhas e proteção contra ataques.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <Zap className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Autenticação 2FA</h3>
            <p className="text-gray-600 leading-relaxed">
              TOTP RFC 6238 compliant com QR codes e códigos de backup.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-6">
              <Palette className="w-7 h-7 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Design Moderno</h3>
            <p className="text-gray-600 leading-relaxed">
              Interface responsiva e elegante com Tailwind CSS e componentes modernos.
            </p>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Build Status</h4>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-green-600 font-medium">✅ Otimizado</p>
            <p className="text-sm text-gray-600">Build rápido e eficiente</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">TypeScript</h4>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-green-600 font-medium">✅ 100% Tipado</p>
            <p className="text-sm text-gray-600">Segurança estática</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Serverless</h4>
              <Cloud className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-green-600 font-medium">✅ Vercel Ready</p>
            <p className="text-sm text-gray-600">Deploy instantâneo</p>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h3 className="text-xl font-bold text-gray-900 mb-8 text-center">Stack Tecnológico</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Code className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-lg font-bold text-blue-600 mb-1">16.0.10</div>
              <p className="text-sm text-gray-600">Next.js</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Cpu className="w-8 h-8 text-cyan-600" />
              </div>
              <div className="text-lg font-bold text-cyan-600 mb-1">19.2.0</div>
              <p className="text-sm text-gray-600">React</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Code className="w-8 h-8 text-blue-500" />
              </div>
              <div className="text-lg font-bold text-blue-500 mb-1">5.9.3</div>
              <p className="text-sm text-gray-600">TypeScript</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Palette className="w-8 h-8 text-teal-600" />
              </div>
              <div className="text-lg font-bold text-teal-600 mb-1">4.1.17</div>
              <p className="text-sm text-gray-600">Tailwind CSS</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mb-12">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8 inline-block max-w-md shadow-xl">
            <h2 className="text-2xl font-bold mb-4">
              🚀 Comece Agora
            </h2>
            <p className="text-lg mb-6">
              Sistema pronto para uso em produção
            </p>
            <button
              onClick={() => router.push('/login')}
              className="w-full bg-white text-blue-600 py-3 px-6 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium text-lg flex items-center justify-center space-x-2"
            >
              <span>Fazer Login</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Features List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="w-5 h-5 text-blue-600 mr-2" />
              Gestão de Usuários
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Autenticação segura com JWT</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Dois fatores obrigatório</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Sessões gerenciadas</span>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Lock className="w-5 h-5 text-green-600 mr-2" />
              Segurança Enterprise
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Hash de senhas bcrypt</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Rate limiting</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Proteção CSRF</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            © 2024 Sistema de Autenticação. Todos os direitos reservados.
          </p>
          <p className="text-gray-400 text-xs mt-2">
            Desenvolvido com Next.js 16, React 19 e TypeScript
          </p>
        </div>
      </div>
    </div>
  );
}