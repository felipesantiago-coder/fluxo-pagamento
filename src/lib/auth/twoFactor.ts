import * as OTPAuth from 'otpauth'

export const generateTwoFactorSecret = (): string => {
  const secret = new OTPAuth.Secret()
  return secret.base32
}

export const generateTwoFactorQR = (secret: string, username: string): string => {
  const totp = new OTPAuth.TOTP({
    issuer: 'Real Estate App',
    label: username,
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(secret)
  })

  return totp.toString()
}

export const verifyTwoFactorToken = (secret: string, token: string): boolean => {
  try {
    const totp = new OTPAuth.TOTP({
      secret: OTPAuth.Secret.fromBase32(secret),
      algorithm: 'SHA1',
      digits: 6,
      period: 30
    })

    const delta = totp.validate({
      token: token,
      window: 1
    })

    return delta !== null
  } catch {
    return false
  }
}