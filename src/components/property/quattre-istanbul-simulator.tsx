'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Calculator, Home, Download, FileText, Check, AlertTriangle, Info, Calendar, DollarSign, Percent, Building } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface SimulationData {
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
  excessPaymentOption: 'all' | 'monthly' | 'semester' | 'habitese'
}

interface Installment {
  number: number
  date: string
  value: number
}

export function QuattreIstanbulSimulator() {
  const [simulation, setSimulation] = useState<SimulationData>({
    propertyValue: 500000,
    discountPercent: 0,
    downPaymentValue: 50000,
    downPaymentDate: new Date().toISOString().split('T')[0],
    downPaymentInstallments: 1,
    monthlyInstallmentValue: 1500,
    semesterInstallmentValue: 9000,
    maxMonthlyInstallments: 48,
    maxSemesterInstallments: 6,
    unit: 'Apartamento 1201',
    realtorName: '',
    excessPaymentOption: 'all'
  })

  const [installments, setInstallments] = useState<{
    downPayment: Installment[]
    monthly: Installment[]
    semester: Installment[]
  }>({
    downPayment: [],
    monthly: [],
    semester: []
  })

  const [isCalculating, setIsCalculating] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [lowCaptationWarning, setLowCaptationWarning] = useState(false)

  // Property data
  const property = {
    name: 'Quattre - Torre Istambul',
    description: 'Luxury apartments in the heart of Istanbul with stunning city views and premium amenities',
    image: 'https://z-cdn-media.chatglm.cn/files/51f82699-7f07-4ef4-a847-b3cacdefa8cb.png?auth_key=1865891936-73b4fe675f764dca87dfb04aa5b78fa6-0-c330a6ed8e7ff15e1a1d33757ea42f79',
    features: ['Swimming Pool', 'Modern Design', 'City View', 'Premium Location', 'Gym', 'Security 24/7'],
    deliveryDate: 'November 2027',
    priceRange: 'Starting from $500,000'
  }

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  // Parse currency input
  const parseCurrency = (value: string) => {
    const numericValue = value.replace(/[R$\s.]/g, '').replace(',', '.')
    return parseFloat(numericValue) || 0
  }

  // Format currency input
  const formatCurrencyInput = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(value)
  }

  // Add months to date
  const addMonths = (date: Date, months: number) => {
    const result = new Date(date)
    result.setMonth(result.getMonth() + months)
    return result
  }

  // Format date
  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  // Calculate months between dates
  const monthsBetweenDates = (startDate: Date, endDate: Date) => {
    const yearDiff = endDate.getFullYear() - startDate.getFullYear()
    const monthDiff = endDate.getMonth() - startDate.getMonth()
    return yearDiff * 12 + monthDiff
  }

  // Calculate payment flow
  const calculatePaymentFlow = () => {
    setIsCalculating(true)
    
    setTimeout(() => {
      const finalPropertyValue = simulation.propertyValue * (1 - simulation.discountPercent / 100)
      const downPaymentDate = new Date(simulation.downPaymentDate)
      const deliveryDate = new Date(Date.UTC(2027, 10, 30)) // November 2027
      const paymentLimitDate = new Date(Date.UTC(2027, 9, 30)) // October 2027
      
      const totalMonths = monthsBetweenDates(downPaymentDate, paymentLimitDate)
      const monthlyInstallments = Math.min(totalMonths, simulation.maxMonthlyInstallments)
      const semesterInstallments = Math.floor(totalMonths / 6)
      const finalSemesterInstallments = Math.min(semesterInstallments, simulation.maxSemesterInstallments)
      
      // Calculate values paid during construction
      const monthlyPaidDuringConstruction = simulation.monthlyInstallmentValue * monthlyInstallments
      const semesterPaidDuringConstruction = simulation.semesterInstallmentValue * finalSemesterInstallments
      
      // Calculate total capture during construction
      const totalCaptation = simulation.downPaymentValue + monthlyPaidDuringConstruction + semesterPaidDuringConstruction
      const captationPercent = (totalCaptation / finalPropertyValue) * 100
      
      // Check if capture is below 25%
      if (captationPercent < 25 && captationPercent > 0) {
        setLowCaptationWarning(true)
      } else {
        setLowCaptationWarning(false)
      }
      
      // Calculate habitese amount
      const habiteseAmount = finalPropertyValue - totalCaptation
      
      // Generate installment tables
      const downPaymentInstallments: Installment[] = []
      for (let i = 1; i <= simulation.downPaymentInstallments; i++) {
        const installmentDate = addMonths(downPaymentDate, i - 1)
        downPaymentInstallments.push({
          number: i,
          date: formatDate(installmentDate),
          value: simulation.downPaymentValue / simulation.downPaymentInstallments
        })
      }
      
      const monthlyInstallmentsList: Installment[] = []
      for (let i = 1; i <= monthlyInstallments; i++) {
        const installmentDate = addMonths(downPaymentDate, i)
        monthlyInstallmentsList.push({
          number: i,
          date: formatDate(installmentDate),
          value: simulation.monthlyInstallmentValue
        })
      }
      
      const semesterInstallmentsList: Installment[] = []
      for (let i = 1; i <= finalSemesterInstallments; i++) {
        const installmentDate = addMonths(downPaymentDate, i * 6)
        semesterInstallmentsList.push({
          number: i,
          date: formatDate(installmentDate),
          value: simulation.semesterInstallmentValue
        })
      }
      
      setInstallments({
        downPayment: downPaymentInstallments,
        monthly: monthlyInstallmentsList,
        semester: semesterInstallmentsList
      })
      
      setSimulation(prev => ({
        ...prev,
        downPaymentValue: simulation.downPaymentValue || (finalPropertyValue * 0.10)
      }))
      
      setShowResults(true)
      setIsCalculating(false)
    }, 1000)
  }

  // Clear all fields
  const clearAllFields = () => {
    setSimulation({
      propertyValue: 500000,
      discountPercent: 0,
      downPaymentValue: 50000,
      downPaymentDate: new Date().toISOString().split('T')[0],
      downPaymentInstallments: 1,
      monthlyInstallmentValue: 1500,
      semesterInstallmentValue: 9000,
      maxMonthlyInstallments: 48,
      maxSemesterInstallments: 6,
      unit: 'Apartamento 1201',
      realtorName: '',
      excessPaymentOption: 'all'
    })
    setShowResults(false)
    setLowCaptationWarning(false)
  }

  // Generate PDF
  const generatePDF = () => {
    alert('Função de geração de PDF será implementada com jsPDF')
  }

  // Update simulation when inputs change
  const updateSimulation = (field: keyof SimulationData, value: any) => {
    setSimulation(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-12">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">{property.name}</h1>
            <p className="text-xl opacity-90">Simulador Avançado de Fluxo de Pagamento</p>
            <p className="text-lg opacity-75 mt-2">Entrega Prevista: {property.deliveryDate}</p>
          </div>
        </div>
      </section>

      <div className="container px-4 mx-auto py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Property Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Informações do Imóvel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video relative mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={property.image}
                    alt={property.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{property.name}</h3>
                    <p className="text-muted-foreground">{property.description}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {property.features.map((feature, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-sm text-muted-foreground">Price Range</p>
                      <p className="font-semibold text-primary">{property.priceRange}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Delivery Date</p>
                      <p className="font-semibold">{property.deliveryDate}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {/* Summary Card */}
            <Card className="bg-gradient-to-r from-primary to-primary/80 text-white">
              <CardHeader>
                <CardTitle>Resumo do Financiamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm opacity-90 mb-1">Valor do Imóvel</p>
                    <h5 className="text-xl font-bold">
                      {formatCurrency(simulation.propertyValue)}
                    </h5>
                  </div>
                  <div>
                    <p className="text-sm opacity-90 mb-1">Valor com Desconto</p>
                    <h5 className="text-xl font-bold">
                      {formatCurrency(simulation.propertyValue * (1 - simulation.discountPercent / 100))}
                    </h5>
                  </div>
                </div>
                
                {showResults && (
                  <div className="mt-4">
                    <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                      <div 
                        className="bg-white h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${Math.min(100, (simulation.downPaymentValue / (simulation.propertyValue * (1 - simulation.discountPercent / 100))) * 100)}%` 
                        }}
                      />
                    </div>
                    <p className="text-center text-sm">
                      Captação durante obras: {((simulation.downPaymentValue / (simulation.propertyValue * (1 - simulation.discountPercent / 100))) * 100).toFixed(2)}%
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Flow Details */}
            {showResults && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Detalhamento do Fluxo de Pagamento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Sinal</p>
                        <h5 className="font-semibold text-lg">{formatCurrency(simulation.downPaymentValue)}</h5>
                        <p className="text-xs text-muted-foreground">
                          {((simulation.downPaymentValue / (simulation.propertyValue * (1 - simulation.discountPercent / 100))) * 100).toFixed(2)}% - Até 2 parcelas sem juros
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Parcelas Mensais</p>
                        <h5 className="font-semibold text-lg">{formatCurrency(simulation.monthlyInstallmentValue * simulation.maxMonthlyInstallments)}</h5>
                        <p className="text-xs text-muted-foreground">
                          {Math.min(monthsBetweenDates(new Date(simulation.downPaymentDate), new Date(Date.UTC(2027, 9, 30))), simulation.maxMonthlyInstallments)} de {simulation.maxMonthlyInstallments} parcelas durante a obra
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Parcelas Semestrais</p>
                        <h5 className="font-semibold text-lg">{formatCurrency(simulation.semesterInstallmentValue * simulation.maxSemesterInstallments)}</h5>
                        <p className="text-xs text-muted-foreground">
                          {Math.floor(monthsBetweenDates(new Date(simulation.downPaymentDate), new Date(Date.UTC(2027, 9, 30))) / 6)} de {simulation.maxSemesterInstallments} parcelas durante a obra
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Habitese-se</p>
                        <h5 className="font-semibold text-lg">{formatCurrency((simulation.propertyValue * (1 - simulation.discountPercent / 100)) - simulation.downPaymentValue - (simulation.monthlyInstallmentValue * Math.min(monthsBetweenDates(new Date(simulation.downPaymentDate), new Date(Date.UTC(2027, 9, 30))), simulation.maxMonthlyInstallments)) - (simulation.semesterInstallmentValue * Math.floor(monthsBetweenDates(new Date(simulation.downPaymentDate), new Date(Date.UTC(2027, 9, 30))) / 6)))}</h5>
                        <p className="text-xs text-muted-foreground">
                          Inclui saldo de mensais + semestrais + saldo final
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>Observação:</strong> O valor do Habitese-se inclui:
                    </p>
                    <ul className="text-sm text-blue-800 dark:text-blue-200 mt-2 ml-4">
                      <li>• Parcelas mensais restantes</li>
                      <li>• Parcelas semestrais restantes</li>
                      <li>• Saldo final do imóvel</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation */}
            <div className="flex gap-4">
              <Button asChild variant="outline" className="flex-1">
                <Link href="/properties">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar para Propriedades
                </Link>
              </Button>
              <Button 
                onClick={generatePDF} 
                className="flex-1"
                disabled={!showResults}
              >
                <Download className="mr-2 h-4 w-4" />
                Gerar PDF da Proposta
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}