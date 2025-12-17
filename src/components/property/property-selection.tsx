'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Building, MapPin, Home } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const properties = [
  {
    id: 'quattre-istanbul',
    name: 'Quattre - Istanbul',
    description: 'Luxury apartments in the heart of Istanbul with stunning city views and premium amenities',
    image: 'https://z-cdn-media.chatglm.cn/files/51f82699-7f07-4ef4-a847-b3cacdefa8cb.png?auth_key=1865891936-73b4fe675f764dca87dfb04aa5b78fa6-0-c330a6ed8e7ff15e1a1d33757ea42f79',
    location: 'Istanbul, Turkey',
    type: 'Luxury Apartments',
    features: ['Swimming Pool', 'Modern Design', 'City View', 'Premium Location', 'Gym', 'Security 24/7'],
    priceRange: 'Starting from $500,000',
    deliveryDate: 'November 2027'
  },
  {
    id: 'villa-bianco',
    name: 'Villa Bianco',
    description: 'Elegant Mediterranean villas with private pools and breathtaking sea views',
    image: 'https://z-cdn-media.chatglm.cn/files/3bcbc253-f682-4f66-8741-64522093aea7.jpeg?auth_key=1865891936-6b1e25f5bffd48e1bfa4d89e329261ee-0-c2a67dce52c7e89dd604a2c4fbcbc258',
    location: 'Mediterranean Coast',
    type: 'Luxury Villas',
    features: ['Private Pool', 'Garden', 'Sea View', 'Luxury Finishes', 'Spacious Layout', 'Terrace'],
    priceRange: 'Starting from $750,000',
    deliveryDate: 'June 2027'
  },
  {
    id: 'venice-park',
    name: 'Venice Park',
    description: 'Contemporary residences inspired by Venetian elegance with canal views',
    image: 'https://z-cdn-media.chatglm.cn/files/7ac55a42-fea2-41c1-8a5b-dc166435fb08.jpg?auth_key=1865891936-f85bd6e1a0864ae8b8431476bb6143d2-0-a998f447f1c0ae9318b47787b7dbd446',
    location: 'Venice, Italy',
    type: 'Contemporary Residences',
    features: ['Canal Views', 'Modern Amenities', 'Prime Location', 'Exclusive Design', 'Concierge', 'Parking'],
    priceRange: 'Starting from $600,000',
    deliveryDate: 'December 2027'
  },
  {
    id: 'moment',
    name: 'Moment',
    description: 'Modern urban living spaces designed for contemporary lifestyles',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
    location: 'Urban Center',
    type: 'Modern Apartments',
    features: ['Smart Home', 'City Center', 'Rooftop Terrace', 'Fitness Center', 'Co-working Space', 'Pet Friendly'],
    priceRange: 'Starting from $350,000',
    deliveryDate: 'March 2028'
  },
  {
    id: 'unite',
    name: 'Unité',
    description: 'Innovative architectural masterpiece combining functionality with aesthetic excellence',
    image: 'https://images.unsplash.com/photo-1448630360428-65456885c650?w=800&h=600&fit=crop',
    location: 'Architectural District',
    type: 'Boutique Residences',
    features: ['Award-winning Design', 'Art Gallery', 'Wine Cellar', 'Private Cinema', 'Spa', 'Butler Service'],
    priceRange: 'Starting from $1,200,000',
    deliveryDate: 'September 2027'
  }
]

export function PropertySelection() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container px-4 mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Selecione o Imóvel dos Seus Sonhos
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Escolha nossa coleção exclusiva de propriedades premium. Cada uma oferece recursos únicos e opções de financiamento personalizadas.
          </p>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <Card key={property.id} className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 shadow-lg">
                <div className="aspect-video relative overflow-hidden">
                  <Image
                    src={property.image}
                    alt={property.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 text-black hover:bg-white">
                      {property.type}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                        {property.name}
                      </CardTitle>
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        {property.location}
                      </div>
                    </div>
                  </div>
                  
                  <CardDescription className="text-sm leading-relaxed">
                    {property.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-1">
                      {property.features.slice(0, 3).map((feature, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {property.features.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{property.features.length - 3} more
                        </Badge>
                      )}
                    </div>
                    
                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Price Range:</span>
                        <span className="font-medium text-primary">{property.priceRange}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Delivery:</span>
                        <span className="font-medium">{property.deliveryDate}</span>
                      </div>
                    </div>
                    
                    <Button asChild className="w-full group-hover:bg-primary/90 transition-colors">
                      <Link href={`/properties/${property.id}`}>
                        Ver Simulador
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Building className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-3xl font-bold mb-4">
                Simulador Avançado de Imóveis
              </h2>
              <p className="text-lg text-muted-foreground">
                Cada propriedade possui um simulador de pagamento sofisticado que ajuda você a entender suas opções de financiamento, calcular parcelas mensais e planejar seu investimento com precisão.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
                  <Home className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold mb-2">Planos de Pagamento Flexíveis</h3>
                <p className="text-sm text-muted-foreground">
                  Personalize seu cronograma de pagamento com várias opções de entrada e planos de parcelas
                </p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                  <Building className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold mb-2">Cálculos em Tempo Real</h3>
                <p className="text-sm text-muted-foreground">
                  Obtenha resultados instantâneos com nossa calculadora avançada que atualiza em tempo real
                </p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold mb-2">Relatórios Detalhados</h3>
                <p className="text-sm text-muted-foreground">
                  Gere cronogramas de pagamento completos e exporte-os como PDF para seus registros
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}