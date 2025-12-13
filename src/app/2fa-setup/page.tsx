'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, QrCode, Key, Copy, Check, AlertCircle, ArrowLeft } from 'lucide-react';

export default function TwoFactorSetupPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [setupData, setSetupData] = useState<any>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedCodes, setCopiedCodes] = useState<number[]>([]);

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
      
      // Se já tem 2FA configurado, redirecionar para verificação
      if (parsedUser.twoFactorEnabled) {
        router.push('/2fa-verify');
        return;
      }

      // Iniciar configuração 2FA
      setupTwoFactor(parsedUser.id, token);
    } catch (error) {
      router.push('/login');
    }
  }, [router]);

  const setupTwoFactor = async (userId: string, token: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/2fa/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId })
      });

      const data = await response.json();

      if (data.success) {
        setSetupData(data);
      } else {
        setError(data.message || 'Erro ao configurar 2FA');
      }
    } catch (error) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndEnable = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Por favor, digite o código de 6 dígitos');
      return;
    }

    try {
      setVerifying(true);
      setError('');

      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/2fa/setup', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user.id,
          code: verificationCode,
          secret: setupData.secret
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        // Atualizar dados do usuário
        const updatedUser = { ...user, twoFactorEnabled: true };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Redirecionar para verificação após 2 segundos
        setTimeout(() => {
          router.push('/2fa-verify');
        }, 2000);
      } else {
        setError(data.message || 'Código inválido');
      }
    } catch (error) {
      setError('Erro ao verificar código');
    } finally {
      setVerifying(false);
    }
  };

  const copyToClipboard = (text: string, type: 'secret' | 'code', index?: number) => {
    navigator.clipboard.writeText(text);
    
    if (type === 'secret') {
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
    } else if (type === 'code' && index !== undefined) {
      setCopiedCodes([...copiedCodes, index]);
      setTimeout(() => {
        setCopiedCodes(copiedCodes.filter(i => i !== index));
      }, 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2FA Configurado!
            </h2>
            <p className="text-gray-600 mb-6">
              Autenticação de dois fatores foi configurada com sucesso.
            </p>
            <p className="text-sm text-gray-500">
              Redirecionando para verificação...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => router.push('/login')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para o login
          </button>
          
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Configurar Autenticação de Dois Fatores
          </h1>
          <p className="text-xl text-gray-600">
            Proteja sua conta com uma camada adicional de segurança
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <span className="text-red-800 text-sm font-medium">{error}</span>
          </div>
        )}

        {setupData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* QR Code Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <QrCode className="w-6 h-6 text-blue-600 mr-3" />
                <h2 className="text-xl font-bold text-gray-900">Escaneie o QR Code</h2>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6 mb-6 text-center">
                <div className="w-48 h-48 bg-white rounded-lg mx-auto mb-4 flex items-center justify-center border-2 border-gray-200">
                  <QrCode className="w-24 h-24 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600">
                  Use um aplicativo como Google Authenticator ou Authy
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Ou digite manualmente:</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <code className="text-sm font-mono text-gray-800 break-all">
                      {setupData.secret}
                    </code>
                    <button
                      onClick={() => copyToClipboard(setupData.secret, 'secret')}
                      className="ml-2 p-2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {copiedSecret ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <Key className="w-6 h-6 text-blue-600 mr-3" />
                <h2 className="text-xl font-bold text-gray-900">Verificar Configuração</h2>
              </div>

              <div className="space-y-6">
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
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Digite o código de 6 dígitos do seu aplicativo autenticador
                  </p>
                </div>

                <button
                  onClick={handleVerifyAndEnable}
                  disabled={verifying || verificationCode.length !== 6}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none transition-all duration-200 font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
                >
                  {verifying ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2"></div>
                      Verificando...
                    </>
                  ) : (
                    'Verificar e Ativar 2FA'
                  )}
                </button>
              </div>

              {/* Backup Codes */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Códigos de Backup</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Guarde estes códigos em um lugar seguro. Eles podem ser usados para acessar sua conta se você perder o acesso ao seu aplicativo autenticador.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {setupData.backupCodes?.map((code: string, index: number) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg p-3 flex items-center justify-between"
                    >
                      <code className="text-sm font-mono text-gray-800">
                        {code}
                      </code>
                      <button
                        onClick={() => copyToClipboard(code, 'code', index)}
                        className="ml-2 p-1 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {copiedCodes.includes(index) ? (
                          <Check className="w-3 h-3 text-green-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}