'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth/provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Shield, ArrowLeft } from 'lucide-react'
import QRCode from 'qrcode'

export function TwoFactorForm() {
  const { verifyTwoFactor } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [token, setToken] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await verifyTwoFactor(token)
      if (!result.success) {
        setError(result.error || 'Invalid verification code')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Autenticação de Dois Fatores</CardTitle>
          <CardDescription>
            Digite o código de 6 dígitos do seu aplicativo autenticador
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="verification-code">Código de Verificação</Label>
              <Input
                id="verification-code"
                type="text"
                placeholder="000000"
                value={token}
                onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                pattern="[0-9]{6}"
                required
                disabled={isLoading}
                className="text-center text-lg tracking-widest"
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={isLoading || token.length !== 6}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                'Verificar'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export function TwoFactorSetup() {
  const { enableTwoFactor, confirmTwoFactor } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState(1)
  const [secret, setSecret] = useState('')
  const [qrCode, setQrCode] = useState('')
  const [token, setToken] = useState('')

  useEffect(() => {
    if (step === 1) {
      const setupTwoFactor = async () => {
        const { secret: newSecret, qrCode: newQrCode } = await enableTwoFactor()
        setSecret(newSecret)
        
        // Generate QR Code
        QRCode.toDataURL(newQrCode, {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        })
          .then(url => setQrCode(url))
          .catch(err => console.error('Error generating QR code:', err))
      }
      
      setupTwoFactor()
    }
  }, [step, enableTwoFactor])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await confirmTwoFactor(secret)
      if (!result.success) {
        setError(result.error || 'Failed to enable 2FA')
      } else {
        setStep(3)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (step === 3) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold">2FA Ativado com Sucesso</CardTitle>
            <CardDescription>
              Sua conta agora está protegida com autenticação de dois fatores.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.reload()} className="w-full">
              Continuar
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {step === 1 ? 'Configurar Autenticação de Dois Fatores' : 'Verificar Configuração'}
          </CardTitle>
          <CardDescription className="text-center">
            {step === 1 
              ? 'Escaneie o código QR com seu aplicativo autenticador'
              : 'Digite o código de verificação para confirmar a configuração'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 ? (
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <div className="bg-white p-4 rounded-lg inline-block">
                  {qrCode ? (
                    <img src={qrCode} alt="QR Code" className="w-48 h-48" />
                  ) : (
                    <div className="w-48 h-48 bg-gray-200 animate-pulse rounded" />
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Não consegue escanear? Use esta chave secreta:
                  </p>
                  <code className="text-xs bg-muted p-2 rounded block break-all">
                    {secret}
                  </code>
                </div>
              </div>
              <Button onClick={() => setStep(2)} className="w-full">
                Next
              </Button>
            </div>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="verification-code">Verification Code</Label>
                <Input
                  id="verification-code"
                  type="text"
                  placeholder="000000"
                  value={token}
                  onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  pattern="[0-9]{6}"
                  required
                  disabled={isLoading}
                  className="text-center text-lg tracking-widest"
                />
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="flex space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
                <Button type="submit" className="flex-1" disabled={isLoading || token.length !== 6}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    'Ativar 2FA'
                  )}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}