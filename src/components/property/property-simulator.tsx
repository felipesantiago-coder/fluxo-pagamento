'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Calculator, Home } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { QuattreIstanbulSimulator } from './quattre-istanbul-simulator'

const propertyData = {
  'quattre-istanbul': {
    name: 'Quattre - Istanbul',
    description: 'Luxury apartments in the heart of Istanbul with stunning city views and premium amenities',
    image: 'https://z-cdn-media.chatglm.cn/files/51f82699-7f07-4ef4-a847-b3cacdefa8cb.png?auth_key=1865891936-73b4fe675f764dca87dfb04aa5b78fa6-0-c330a6ed8e7ff15e1a1d33757ea42f79',
    features: ['Swimming Pool', 'Modern Design', 'City View', 'Premium Location', 'Gym', 'Security 24/7'],
    deliveryDate: 'November 2027',
    priceRange: 'Starting from $500,000'
  },
  'villa-bianco': {
    name: 'Villa Bianco',
    description: 'Elegant villas with Mediterranean architecture and sea views',
    image: 'https://z-cdn-media.chatglm.cn/files/3bcbc253-f682-4f66-8741-64522093aea7.jpeg?auth_key=1865891936-6b1e25f5bffd48e1bfa4d89e329261ee-0-c2a67dce52c7e89dd604a2c4fbcbc258',
    features: ['Private Pool', 'Garden', 'Sea View', 'Luxury Finishes', 'Spacious Layout', 'Terrace'],
    deliveryDate: 'June 2027',
    priceRange: 'Starting from $750,000'
  },
  'venice-park': {
    name: 'Venice Park',
    description: 'Contemporary residences inspired by Venetian elegance with canal views',
    image: 'https://z-cdn-media.chatglm.cn/files/7ac55a42-fea2-41c1-8a5b-dc166435fb08.jpg?auth_key=1865891936-f85bd6e1a0864ae8b8431476bb6143d2-0-a998f447f1c0ae9318b47787b7dbd446',
    features: ['Canal Views', 'Modern Amenities', 'Prime Location', 'Exclusive Design', 'Concierge', 'Parking'],
    deliveryDate: 'December 2027',
    priceRange: 'Starting from $600,000'
  },
  'moment': {
    name: 'Moment',
    description: 'Modern urban living spaces designed for contemporary lifestyles',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
    features: ['Smart Home', 'City Center', 'Rooftop Terrace', 'Fitness Center', 'Co-working Space', 'Pet Friendly'],
    deliveryDate: 'March 2028',
    priceRange: 'Starting from $350,000'
  },
  'unite': {
    name: 'Unité',
    description: 'Innovative architectural masterpiece combining functionality with aesthetic excellence',
    image: 'https://images.unsplash.com/photo-1448630360428-65456885c650?w=800&h=600&fit=crop',
    features: ['Award-winning Design', 'Art Gallery', 'Wine Cellar', 'Private Cinema', 'Spa', 'Butler Service'],
    deliveryDate: 'September 2027',
    priceRange: 'Starting from $1,200,000'
  }
}

interface PropertySimulatorProps {
  propertyId: string
}

export function PropertySimulator({ propertyId }: PropertySimulatorProps) {
  // Use specific simulator for Quattre Istanbul
  if (propertyId === 'quattre-istanbul') {
    return <QuattreIstanbulSimulator />
  }

  const property = propertyData[propertyId as keyof typeof propertyData]

  if (!property) {
    return (
      <div className="min-h-screen">
        <div className="container px-4 mx-auto py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Property Not Found</h1>
            <p className="text-xl text-muted-foreground mb-8">
              The property you're looking for doesn't exist.
            </p>
            <Button asChild>
              <Link href="/properties">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Properties
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-12">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">{property.name}</h1>
            <p className="text-xl opacity-90">Payment Simulator</p>
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
                  <Home className="h-5 w-5" />
                  Property Details
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

          {/* Simulator Coming Soon */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Payment Simulator
                </CardTitle>
                <CardDescription>
                  Advanced financing calculator for this property
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-12">
                  <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Calculator className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Simulador em Desenvolvimento</h3>
                  <p className="text-muted-foreground mb-6">
                    O simulador avançado para {property.name} está em desenvolvimento. 
                    Em breve incluirá opções completas de financiamento, cronogramas de pagamento e cálculos detalhados.
                  </p>
                  <div className="space-y-3 text-left max-w-md mx-auto">
                    <h4 className="font-medium">Funcionalidades em desenvolvimento:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Opções flexíveis de entrada</li>
                      <li>• Cronogramas de pagamento personalizáveis</li>
                      <li>• Cálculos em tempo real</li>
                      <li>• Geração de relatórios em PDF</li>
                      <li>• Múltiplos cenários de financiamento</li>
                      <li>• Opções de moeda e taxa de juros</li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Button asChild variant="outline" className="flex-1">
                    <Link href="/properties">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Voltar para Propriedades
                    </Link>
                  </Button>
                  <Button asChild className="flex-1">
                    <Link href="/properties/quattre-istanbul">
                      Ver Simulador Completo
                      <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Contact Card */}
            <Card>
              <CardHeader>
                <CardTitle>Interessado em {property.name}?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Entre em contato com nossos especialistas para saber mais sobre esta propriedade e as opções de financiamento disponíveis.
                </p>
                <Button className="w-full">
                  Contatar Equipe de Vendas
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}