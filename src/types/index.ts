export interface User {
  id: string
  username: string
  email: string
  password: string
  twoFactorSecret?: string
  twoFactorEnabled: boolean
  createdAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  requiresTwoFactor: boolean
  tempUserId?: string
}

export interface Property {
  id: string
  name: string
  description: string
  image: string
  features: string[]
}

export interface SimulationData {
  propertyValue: number
  discountPercent: number
  downPaymentValue: number
  downPaymentDate: string
  downPaymentInstallments: number
  monthlyInstallmentValue: number
  semesterInstallmentValue: number
  maxMonthlyInstallments: number
  maxSemesterInstallments: number
  unit: string
  realtorName: string
}