'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Calculator, Home, Download, FileText, Check, AlertTriangle, Info, Calendar, DollarSign, Percent, Building, RefreshCw, Trash2 } from 'lucide-react'
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
    downPaymentValue: 0,
    downPaymentDate: new Date().toISOString().split('T')[0],
    downPaymentInstallments: 1,
    monthlyInstallmentValue: 0,
    semesterInstallmentValue: 0,
    maxMonthlyInstallments: 48,
    maxSemesterInstallments: 6,
    unit: '',
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
  const [excessPaymentOptions, setExcessPaymentOptions] = useState(false)

  // Property data
  const property = {
    name: 'Quattre - Torre Istambul',
    description: 'Simulador de Fluxo de Pagamento',
    image: 'https://z-cdn-media.chatglm.cn/files/51f82699-7f07-4ef4-a847-b3cacdefa8cb.png?auth_key=1865891936-73b4fe675f764dca87dfb04aa5b78fa6-0-c330a6ed8e7ff15e1a1d33757ea42f79',
    features: ['Swimming Pool', 'Modern Design', 'City View', 'Premium Location', 'Gym', 'Security 24/7'],
    deliveryDate: 'Novembro de 2027',
    priceRange: 'Starting from $500,000'
  }

  // Constants
  const DELIVERY_DATE = new Date(Date.UTC(2027, 10, 30)) // November 2027
  const PAYMENT_LIMIT_DATE = new Date(Date.UTC(2027, 9, 30)) // October 2027

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  // Parse currency input
  const parseCurrencyValue = (value: string) => {
    const numericValue = value.replace(/[R$\s.]/g, '').replace(',', '.')
    return parseFloat(numericValue) || 0
  }

  // Format currency input
  const formatCurrencyInput = (input: HTMLInputElement) => {
    const cursorPosition = input.selectionStart
    let value = input.value.replace(/\D/g, '')
    let numericValue = parseInt(value) || 0
    let formattedValue = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(numericValue / 100)
    
    input.value = formattedValue
    return numericValue / 100
  }

  // Parse date without timezone issues
  const parseDateWithoutTimezone = (dateString: string) => {
    if (!dateString) return new Date()
    const parts = dateString.split('-')
    return new Date(Date.UTC(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])))
  }

  // Format date
  const formatDate = (date: Date) => {
    const day = String(date.getUTCDate()).padStart(2, '0')
    const month = String(date.getUTCMonth() + 1).padStart(2, '0')
    const year = date.getUTCFullYear()
    return `${day}/${month}/${year}`
  }

  // Add months to date
  const addMonths = (date: Date, months: number) => {
    const result = new Date(date)
    result.setUTCMonth(result.getUTCMonth() + months)
    return result
  }

  // Calculate months between dates
  const monthsBetweenDates = (startDate: Date, endDate: Date) => {
    const yearDiff = endDate.getUTCFullYear() - startDate.getUTCFullYear()
    const monthDiff = endDate.getUTCMonth() - startDate.getUTCMonth()
    return yearDiff * 12 + monthDiff
  }

  // Update totals calculation
  const updateTotalsCalculation = () => {
    const monthlyTotal = simulation.monthlyInstallmentValue * simulation.maxMonthlyInstallments
    const semesterTotal = simulation.semesterInstallmentValue * simulation.maxSemesterInstallments
    return { monthlyTotal, semesterTotal }
  }

  // Calculate payment flow
  const calculatePaymentFlow = () => {
    setIsCalculating(true)
    
    setTimeout(() => {
      const finalPropertyValue = simulation.propertyValue * (1 - simulation.discountPercent / 100)
      const downPaymentDate = parseDateWithoutTimezone(simulation.downPaymentDate)
      
      // Use downPaymentValue or 10% of final property value if empty
      const downPaymentValue = simulation.downPaymentValue || (finalPropertyValue * 0.10)
      
      const totalMonths = monthsBetweenDates(downPaymentDate, PAYMENT_LIMIT_DATE)
      const monthlyInstallments = Math.min(totalMonths, simulation.maxMonthlyInstallments)
      const semesterInstallments = Math.floor(totalMonths / 6)
      const finalSemesterInstallments = Math.min(semesterInstallments, simulation.maxSemesterInstallments)
      
      // Calculate values paid during construction
      const monthlyPaidDuringConstruction = simulation.monthlyInstallmentValue * monthlyInstallments
      const semesterPaidDuringConstruction = simulation.semesterInstallmentValue * finalSemesterInstallments
      
      // Calculate total capture during construction
      const totalCaptation = downPaymentValue + monthlyPaidDuringConstruction + semesterPaidDuringConstruction
      const captationPercent = (totalCaptation / finalPropertyValue) * 100
      
      // Check if capture is below 25%
      if (captationPercent < 25 && captationPercent > 0) {
        setLowCaptationWarning(true)
        setExcessPaymentOptions(true)
      } else {
        setLowCaptationWarning(false)
        setExcessPaymentOptions(false)
      }
      
      // Calculate habitese amount
      const habiteseAmount = finalPropertyValue - totalCaptation
      
      // Generate installment tables
      const downPaymentInstallmentsList: Installment[] = []
      for (let i = 1; i <= simulation.downPaymentInstallments; i++) {
        const installmentDate = addMonths(downPaymentDate, i - 1)
        downPaymentInstallmentsList.push({
          number: i,
          date: formatDate(installmentDate),
          value: downPaymentValue / simulation.downPaymentInstallments
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
        downPayment: downPaymentInstallmentsList,
        monthly: monthlyInstallmentsList,
        semester: semesterInstallmentsList
      })
      
      setSimulation(prev => ({
        ...prev,
        downPaymentValue: downPaymentValue
      }))
      
      setShowResults(true)
      setIsCalculating(false)
    }, 100)
  }

  // Clear all fields
  const clearAllFields = () => {
    setSimulation({
      propertyValue: 500000,
      discountPercent: 0,
      downPaymentValue: 0,
      downPaymentDate: new Date().toISOString().split('T')[0],
      downPaymentInstallments: 1,
      monthlyInstallmentValue: 0,
      semesterInstallmentValue: 0,
      maxMonthlyInstallments: 48,
      maxSemesterInstallments: 6,
      unit: '',
      realtorName: '',
      excessPaymentOption: 'all'
    })
    setShowResults(false)
    setLowCaptationWarning(false)
    setExcessPaymentOptions(false)
  }

  // Generate PDF
  const generatePDF = () => {
    alert('Função de geração de PDF será implementada com jsPDF')
  }

  // Update simulation when inputs change
  const updateSimulation = (field: keyof SimulationData, value: any) => {
    setSimulation(prev => ({ ...prev, [field]: value }))
    calculatePaymentFlow()
  }

  // Handle currency input formatting
  const handleCurrencyInput = (e: React.ChangeEvent<HTMLInputElement>, field: keyof SimulationData) => {
    const value = formatCurrencyInput(e.target)
    updateSimulation(field, value)
  }

  // Handle date input change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(e.target.value)
    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)
    
    if (selectedDate < currentDate) {
      const todayString = new Date().toISOString().split('T')[0]
      e.target.value = todayString
      updateSimulation('downPaymentDate', todayString)
    } else {
      updateSimulation('downPaymentDate', e.target.value)
    }
  }

  // Calculate derived values
  const finalPropertyValue = simulation.propertyValue * (1 - simulation.discountPercent / 100)
  const { monthlyTotal, semesterTotal } = updateTotalsCalculation()
  const downPaymentValue = simulation.downPaymentValue || (finalPropertyValue * 0.10)
  
  // Calculate values paid during construction
  const totalMonths = monthsBetweenDates(parseDateWithoutTimezone(simulation.downPaymentDate), PAYMENT_LIMIT_DATE)
  const monthlyInstallments = Math.min(totalMonths, simulation.maxMonthlyInstallments)
  const semesterInstallments = Math.floor(totalMonths / 6)
  const finalSemesterInstallments = Math.min(semesterInstallments, simulation.maxSemesterInstallments)
  
  const monthlyPaidDuringConstruction = simulation.monthlyInstallmentValue * monthlyInstallments
  const semesterPaidDuringConstruction = simulation.semesterInstallmentValue * finalSemesterInstallments
  
  // Calculate total capture during construction
  const totalCaptation = downPaymentValue + monthlyPaidDuringConstruction + semesterPaidDuringConstruction
  const captationPercent = finalPropertyValue > 0 ? (totalCaptation / finalPropertyValue) * 100 : 0
  
  // Calculate habitese amount
  const habiteseAmount = finalPropertyValue - totalCaptation
  
  // Calculate remaining values
  const monthlyRemaining = Math.max(0, (simulation.monthlyInstallmentValue * simulation.maxMonthlyInstallments) - monthlyPaidDuringConstruction)
  const semesterRemaining = Math.max(0, (simulation.semesterInstallmentValue * simulation.maxSemesterInstallments) - semesterPaidDuringConstruction)
  const balanceRemaining = Math.max(0, habiteseAmount - monthlyRemaining - semesterRemaining)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="bg-primary text-white py-4">
        <div className="container px-4 mx-auto">
          <Link href="/" className="text-white font-bold text-xl flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Building className="h-6 w-6" />
            Quattre - Torre Istambul
          </Link>
        </div>
      </nav>

      <div className="container px-4 mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Simulador de Fluxo de Pagamento</h1>
          <p className="text-xl text-muted-foreground">Calcule o financiamento do seu apartamento no Quattre - Torre Istambul</p>
        </div>

        {/* Step Indicator */}
        <div className="relative mb-8">
          <div className="absolute top-3 left-0 right-0 h-0.5 bg-border"></div>
          <div className="relative flex justify-between">
            <div className="flex flex-col items-center z-10">
              <div className="w-8 h-8 rounded-full bg-border flex items-center justify-center text-xs font-bold mb-1">1</div>
              <div className="text-xs">Dados Básicos</div>
            </div>
            <div className="flex flex-col items-center z-10">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold mb-1 text-white">2</div>
              <div className="text-xs">Sinal</div>
            </div>
            <div className="flex flex-col items-center z-10">
              <div className="w-8 h-8 rounded-full bg-border flex items-center justify-center text-xs font-bold mb-1">3</div>
              <div className="text-xs">Mensais</div>
            </div>
            <div className="flex flex-col items-center z-10">
              <div className="w-8 h-8 rounded-full bg-border flex items-center justify-center text-xs font-bold mb-1">4</div>
              <div className="text-xs">Semestrais</div>
            </div>
            <div className="flex flex-col items-center z-10">
              <div className="w-8 h-8 rounded-full bg-border flex items-center justify-center text-xs font-bold mb-1">5</div>
              <div className="text-xs">Resultado</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Informações do Imóvel
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded p-3 mb-4">
                  <div className="flex items-center gap-2 text-green-800 dark:text-green-200 text-sm">
                    <RefreshCw className="h-4 w-4" />
                    Cálculo automático em tempo real
                  </div>
                </div>
                
                <div className="bg-primary/10 border-l-4 border-primary rounded p-3 mb-4">
                  <div className="flex items-center gap-2 text-primary text-sm">
                    <Info className="h-4 w-4" />
                    <strong>Entrega Prevista:</strong> Novembro de 2027
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="propertyValue">Valor do Imóvel (R$)</Label>
                    <Input
                      id="propertyValue"
                      className="text-right"
                      placeholder="Ex: 500000,00"
                      value={formatCurrency(simulation.propertyValue)}
                      onChange={(e) => handleCurrencyInput(e, 'propertyValue')}
                    />
                    <p className="text-xs text-muted-foreground mt-1">Digite o valor em centavos (ex: 500000,00 para R$ 5.000,00)</p>
                  </div>
                  
                  <div>
                    <Label htmlFor="discountPercent">Percentual de Desconto (%)</Label>
                    <Input
                      id="discountPercent"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      placeholder="Ex: 5"
                      value={simulation.discountPercent}
                      onChange={(e) => updateSimulation('discountPercent', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="unit">Unidade Escolhida</Label>
                    <Input
                      id="unit"
                      placeholder="Ex: Apartamento 1201"
                      value={simulation.unit}
                      onChange={(e) => updateSimulation('unit', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="realtorName">Nome do(a) Corretor(a)</Label>
                    <Input
                      id="realtorName"
                      placeholder="Ex: Felipe Santiago"
                      value={simulation.realtorName}
                      onChange={(e) => updateSimulation('realtorName', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="downPaymentValue">Valor do Sinal (R$)</Label>
                    <Input
                      id="downPaymentValue"
                      className="text-right"
                      placeholder="Ex: 50000,00"
                      value={formatCurrency(simulation.downPaymentValue)}
                      onChange={(e) => handleCurrencyInput(e, 'downPaymentValue')}
                    />
                    <p className="text-xs text-muted-foreground mt-1">Deixe em branco para usar o valor padrão de 10% do valor final do imóvel</p>
                  </div>
                  
                  <div>
                    <Label htmlFor="downPaymentDate">Data do Primeiro Pagamento do Sinal</Label>
                    <Input
                      id="downPaymentDate"
                      type="date"
                      value={simulation.downPaymentDate}
                      onChange={handleDateChange}
                      min={new Date().toISOString().split('T')[0]}
                    />
                    <p className="text-xs text-muted-foreground mt-1">Data padrão: dia atual (não é permitido selecionar datas anteriores)</p>
                  </div>
                  
                  <div>
                    <Label htmlFor="downPaymentInstallments">Número de Parcelas do Sinal (até 2)</Label>
                    <select
                      id="downPaymentInstallments"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={simulation.downPaymentInstallments}
                      onChange={(e) => updateSimulation('downPaymentInstallments', parseInt(e.target.value))}
                    >
                      <option value="1">1 parcela</option>
                      <option value="2">2 parcelas</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="monthlyInstallmentValue">Valor de Cada Parcela Mensal (R$)</Label>
                    <Input
                      id="monthlyInstallmentValue"
                      className="text-right"
                      placeholder="Ex: 1500,00"
                      value={formatCurrency(simulation.monthlyInstallmentValue)}
                      onChange={(e) => handleCurrencyInput(e, 'monthlyInstallmentValue')}
                    />
                    <p className="text-xs text-muted-foreground mt-1">Valor de cada parcela mensal - o total será calculado automaticamente</p>
                    {monthlyTotal > 0 && (
                      <div className="bg-primary/5 rounded p-2 mt-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calculator className="h-4 w-4" />
                          <span>Total mensal: {formatCurrency(monthlyTotal)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="semesterInstallmentValue">Valor de Cada Parcela Semestral (R$)</Label>
                    <Input
                      id="semesterInstallmentValue"
                      className="text-right"
                      placeholder="Ex: 10000,00"
                      value={formatCurrency(simulation.semesterInstallmentValue)}
                      onChange={(e) => handleCurrencyInput(e, 'semesterInstallmentValue')}
                    />
                    <p className="text-xs text-muted-foreground mt-1">Valor de cada parcela semestral - o total será calculado automaticamente</p>
                    {semesterTotal > 0 && (
                      <div className="bg-primary/5 rounded p-2 mt-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calculator className="h-4 w-4" />
                          <span>Total semestral: {formatCurrency(semesterTotal)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="maxMonthlyInstallments">Número Máximo de Parcelas Mensais</Label>
                    <select
                      id="maxMonthlyInstallments"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={simulation.maxMonthlyInstallments}
                      onChange={(e) => updateSimulation('maxMonthlyInstallments', parseInt(e.target.value))}
                    >
                      <option value="48">48 parcelas</option>
                      <option value="36">36 parcelas</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="maxSemesterInstallments">Número Máximo de Parcelas Semestrais</Label>
                    <select
                      id="maxSemesterInstallments"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={simulation.maxSemesterInstallments}
                      onChange={(e) => updateSimulation('maxSemesterInstallments', parseInt(e.target.value))}
                    >
                      <option value="6">6 parcelas</option>
                      <option value="4">4 parcelas</option>
                    </select>
                  </div>
                </div>

                {/* Low Captation Warning */}
                {lowCaptationWarning && (
                  <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded p-3 mb-4 animate-pulse">
                    <div className="flex items-center gap-2 text-red-800 dark:text-red-200 font-bold">
                      <AlertTriangle className="h-5 w-5" />
                      <span>Atenção: Captação durante as obras abaixo de 25% não é permitida!</span>
                    </div>
                  </div>
                )}
                
                {/* Excess Payment Options */}
                {excessPaymentOptions && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 rounded p-4 mb-4">
                    <h6 className="font-semibold mb-3">Opções para abatimento do sinal excedente:</h6>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="excessPaymentOption"
                          value="all"
                          checked={simulation.excessPaymentOption === 'all'}
                          onChange={(e) => updateSimulation('excessPaymentOption', e.target.value)}
                          className="mr-2"
                        />
                        <span className="text-sm">Abater proporcionalmente em todos os pagamentos</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="excessPaymentOption"
                          value="monthly"
                          checked={simulation.excessPaymentOption === 'monthly'}
                          onChange={(e) => updateSimulation('excessPaymentOption', e.target.value)}
                          className="mr-2"
                        />
                        <span className="text-sm">Abater apenas nas parcelas mensais</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="excessPaymentOption"
                          value="semester"
                          checked={simulation.excessPaymentOption === 'semester'}
                          onChange={(e) => updateSimulation('excessPaymentOption', e.target.value)}
                          className="mr-2"
                        />
                        <span className="text-sm">Abater apenas nas parcelas semestrais</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="excessPaymentOption"
                          value="habitese"
                          checked={simulation.excessPaymentOption === 'habitese'}
                          onChange={(e) => updateSimulation('excessPaymentOption', e.target.value)}
                          className="mr-2"
                        />
                        <span className="text-sm">Abater apenas no habite-se</span>
                      </label>
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button onClick={clearAllFields} variant="outline" className="flex items-center gap-2">
                    <Trash2 className="h-4 w-4" />
                    Limpar Todos os Campos
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Summary Card */}
            <Card className="bg-gradient-to-r from-primary to-primary/80 text-white">
              <CardHeader>
                <CardTitle>Resumo do Financiamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm opacity-90 mb-1">Valor do Imóvel</p>
                    <h5 className="text-xl font-bold">{formatCurrency(simulation.propertyValue)}</h5>
                  </div>
                  <div>
                    <p className="text-sm opacity-90 mb-1">Valor com Desconto</p>
                    <h5 className="text-xl font-bold">{formatCurrency(finalPropertyValue)}</h5>
                  </div>
                </div>
                
                {showResults && (
                  <div className="mt-4">
                    <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                      <div 
                        className="bg-white h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, captationPercent)}%` }}
                      />
                    </div>
                    <p className="text-center text-sm">
                      Captação durante obras: {captationPercent.toFixed(2)}%
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Results */}
          <div className="space-y-6">
            {showResults && (
              <>
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
                          <h5 className="font-semibold text-lg">{formatCurrency(downPaymentValue)}</h5>
                          <p className="text-xs text-muted-foreground">
                            {((downPaymentValue / finalPropertyValue) * 100).toFixed(2)}% - Até 2 parcelas sem juros
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Parcelas Mensais</p>
                          <h5 className="font-semibold text-lg">{formatCurrency(monthlyPaidDuringConstruction)}</h5>
                          <p className="text-xs text-muted-foreground">
                            {monthlyInstallments} de {simulation.maxMonthlyInstallments} parcelas durante a obra
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Parcelas Semestrais</p>
                          <h5 className="font-semibold text-lg">{formatCurrency(semesterPaidDuringConstruction)}</h5>
                          <p className="text-xs text-muted-foreground">
                            {finalSemesterInstallments} de {simulation.maxSemesterInstallments} parcelas durante a obra
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Habitese-se</p>
                          <h5 className="font-semibold text-lg">{formatCurrency(habiteseAmount)}</h5>
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
                      <ul className="text-sm text-blue-800 dark:text-blue-200 mt-2 space-y-1">
                        <li>• Parcelas mensais restantes</li>
                        <li>• Parcelas semestrais restantes</li>
                        <li>• Saldo final do imóvel</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Installment Tables */}
                <Card>
                  <CardHeader>
                    <CardTitle>Cronograma de Pagamento</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="downpayment" className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="downpayment">Sinal</TabsTrigger>
                        <TabsTrigger value="monthly">Mensais</TabsTrigger>
                        <TabsTrigger value="semester">Semestrais</TabsTrigger>
                        <TabsTrigger value="habitese">Habite-se</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="downpayment" className="mt-4">
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left p-2">Parcela</th>
                                <th className="text-left p-2">Data</th>
                                <th className="text-right p-2">Valor (R$)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {installments.downPayment.map((installment) => (
                                <tr key={installment.number} className="border-b">
                                  <td className="p-2">{installment.number}/{simulation.downPaymentInstallments}</td>
                                  <td className="p-2">{installment.date}</td>
                                  <td className="p-2 text-right">{formatCurrency(installment.value)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="monthly" className="mt-4">
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left p-2">Parcela</th>
                                <th className="text-left p-2">Data</th>
                                <th className="text-right p-2">Valor (R$)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {installments.monthly.map((installment) => (
                                <tr key={installment.number} className="border-b">
                                  <td className="p-2">{installment.number}/{simulation.maxMonthlyInstallments}</td>
                                  <td className="p-2">{installment.date}</td>
                                  <td className="p-2 text-right">{formatCurrency(installment.value)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="semester" className="mt-4">
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left p-2">Parcela</th>
                                <th className="text-left p-2">Data</th>
                                <th className="text-right p-2">Valor (R$)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {installments.semester.map((installment) => (
                                <tr key={installment.number} className="border-b">
                                  <td className="p-2">{installment.number}/{simulation.maxSemesterInstallments}</td>
                                  <td className="p-2">{installment.date}</td>
                                  <td className="p-2 text-right">{formatCurrency(installment.value)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="habitese" className="mt-4">
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 rounded p-4">
                          <p className="font-semibold mb-2">
                            <strong>Valor do Habite-se:</strong> {formatCurrency(habiteseAmount)}
                          </p>
                          <p className="text-sm text-muted-foreground">Este valor pode ser quitado ou financiado com instituição financeira de preferência</p>
                        </div>
                        
                        <h6 className="font-semibold mb-2">Composição do Habite-se:</h6>
                        <div className="space-y-1 text-sm">
                          <div>• Parcelas mensais restantes: {formatCurrency(monthlyRemaining)}</div>
                          <div>• Parcelas semestrais restantes: {formatCurrency(semesterRemaining)}</div>
                          <div>• Saldo final do imóvel: {formatCurrency(balanceRemaining)}</div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                {/* Important Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="h-5 w-5" />
                      Informações Importantes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-primary/5 border-l-4 border-primary rounded p-4">
                      <p className="font-semibold mb-2">Observações:</p>
                      <ul className="text-sm space-y-1">
                        <li>• O sinal pode ser dividido em até 2 vezes sem juros</li>
                        <li>• As parcelas mensais começam no mês seguinte ao sinal</li>
                        <li>• A primeira parcela semestral é 6 meses após o sinal</li>
                        <li>• O número de parcelas pagas durante as obras depende da data do sinal e da entrega prevista para novembro de 2027</li>
                        <li>• As parcelas não pagas durante as obras serão incluídas no habite-se</li>
                        <li>• O habite-se pode ser quitado ou financiado com o banco de preferência</li>
                        <li>• <strong>Importante:</strong> Os valores dos saldos devedores de todas as parcelas serão corrigidos mensalmente pelo INCC (Índice Nacional de Custo da Construção)</li>
                        <li>• <strong>Captação mínima:</strong> A captação durante as obras deve ser de no mínimo 25% do valor do imóvel</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Generate PDF Button */}
                <div className="flex justify-center">
                  <Button onClick={generatePDF} className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Gerar PDF da Proposta
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-6 mt-12">
        <div className="container px-4 mx-auto text-center">
          <p className="mb-2">Quattre - Torre Istambul © 2025 - Todos os direitos reservados</p>
          <p className="text-sm opacity-75">Este é um simulador de fluxo de pagamento. Valores sujeitos a alteração sem aviso prévio.</p>
        </div>
      </footer>
    </div>
  )
}