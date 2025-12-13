'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Key, AlertCircle, ArrowLeft } from 'lucide-react';

export default function TwoFactorVerifyPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCode, setBackupCode] = useState('');
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Verificar se usuário está logado
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Se não tem 2FA configurado, redirecionar para configuração
      if (!parsedUser.twoFactorEnabled) {
        router.push('/2fa-setup');
        return;
      }
    } catch (error) {
      router.push('/login');
    }
  }, [router]);

  const handleVerify = async () => {
    if (useBackupCode && !backupCode) {
      setError('Por favor, digite o código de backup');
      return;
    }
    
    if (!useBackupCode && (!verificationCode || verificationCode.length !== 6)) {
      setError('Por favor, digite o código de 6 dígitos');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/2fa/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user.id,
          code: useBackupCode ? undefined : verificationCode,
          backupCode: useBackupCode ? backupCode : undefined
        })
      });

      const data = await response.json();

      if (data.success && data.token) {
        // Atualizar token com verificação 2FA completa
        localStorage.setItem('authToken', data.token);
        
        // Redirecionar para o simulador
        router.push('/simulator');
      } else {
        setError(data.message || 'Código inválido');
      }
    } catch (error) {
      setError('Erro ao verificar código');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={handleLogout}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para o login
          </button>
          
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Verificação de Dois Fatores
          </h1>
          <p className="text-gray-600">
            Digite o código do seu aplicativo autenticador
          </p>
        </div>

        {/* Card de Verificação */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Key className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Código de Verificação
            </h2>
            <p className="text-sm text-gray-600">
              Abra seu aplicativo autenticador e digite o código de 6 dígitos
            </p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleVerify(); }} className="space-y-6">
            {/* Campo de Código */}
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                Código de 6 dígitos
              </label>
              <input
                id="code"
                type="text"
                placeholder="000000"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-center text-2xl font-mono"
                maxLength={6}
                autoFocus
              />
            </div>

            {/* Mensagem de Erro */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                <span className="text-red-800 text-sm font-medium">{error}</span>
              </div>
            )}

            {/* Botão de Verificação */}
            <button
              type="submit"
              disabled={loading || verificationCode.length !== 6}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none transition-all duration-200 font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2"></div>
                  Verificando...
                </>
              ) : (
                'Verificar'
              )}
            </button>
          </form>

          {/* Ajuda */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                Problemas para acessar?
              </p>
              <button
                onClick={handleLogout}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Sair desta conta
              </button>
            </div>
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-100">
          <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center">
            <Shield className="w-4 h-4 mr-2" />
            Proteção Adicional
          </h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              Esta camada de segurança protege sua conta contra acesso não autorizado
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              O código é válido por 30 segundos
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              Mantenha seu aplicativo autenticador seguro
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}