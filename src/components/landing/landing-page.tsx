'use client'

import { useAuth } from '@/lib/auth/provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Building, Calculator, Shield, Star } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const properties = [
  {
    id: 'quattre-istanbul',
    name: 'Quattre - Istanbul',
    description: 'Luxury apartments in the heart of Istanbul with stunning views',
    image: 'https://z-cdn-media.chatglm.cn/files/51f82699-7f07-4ef4-a847-b3cacdefa8cb.png?auth_key=1865891936-73b4fe675f764dca87dfb04aa5b78fa6-0-c330a6ed8e7ff15e1a1d33757ea42f79',
    features: ['Swimming Pool', 'Modern Design', 'City View', 'Premium Location']
  },
  {
    id: 'villa-bianco',
    name: 'Villa Bianco',
    description: 'Elegant villas with Mediterranean architecture and sea views',
    image: 'https://z-cdn-media.chatglm.cn/files/3bcbc253-f682-4f66-8741-64522093aea7.jpeg?auth_key=1865891936-6b1e25f5bffd48e1bfa4d89e329261ee-0-c2a67dce52c7e89dd604a2c4fbcbc258',
    features: ['Private Pool', 'Garden', 'Sea View', 'Luxury Finishes']
  },
  {
    id: 'venice-park',
    name: 'Venice Park',
    description: 'Contemporary residences inspired by Venetian elegance',
    image: 'https://z-cdn-media.chatglm.cn/files/7ac55a42-fea2-41c1-8a5b-dc166435fb08.jpg?auth_key=1865891936-f85bd6e1a0864ae8b8431476bb6143d2-0-a998f447f1c0ae9318b47787b7dbd446',
    features: ['Canal Views', 'Modern Amenities', 'Prime Location', 'Exclusive Design']
  }
]

const features = [
  {
    icon: Calculator,
    title: 'Advanced Simulation',
    description: 'Calculate payment plans with our sophisticated financing calculator'
  },
  {
    icon: Shield,
    title: 'Secure Authentication',
    description: 'Your data is protected with two-factor authentication'
  },
  {
    icon: Building,
    title: 'Premium Properties',
    description: 'Exclusive selection of high-end real estate opportunities'
  },
  {
    icon: Star,
    title: 'Expert Support',
    description: 'Professional guidance throughout your property journey'
  }
]

export function LandingPage() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-20 lg:py-32">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-4">
              Premium Real Estate Platform
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Find Your Dream
              <span className="text-primary"> Property</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover exclusive properties and calculate your financing options with our advanced simulation tools. Secure, simple, and sophisticated.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Button asChild size="lg" className="text-lg px-8">
                  <Link href="/properties">
                    View Properties
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <Button asChild size="lg" className="text-lg px-8">
                  <Link href="/auth">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              )}
              <Button variant="outline" size="lg" className="text-lg px-8">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Our Platform
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We provide everything you need to make informed real estate decisions
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Properties Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Featured Properties
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore our handpicked selection of premium real estate opportunities
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <Card key={property.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="aspect-video relative">
                  <Image
                    src={property.image}
                    alt={property.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{property.name}</CardTitle>
                  <CardDescription>{property.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {property.features.map((feature, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  {isAuthenticated ? (
                    <Button asChild className="w-full">
                      <Link href={`/properties/${property.id}`}>
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  ) : (
                    <Button asChild className="w-full" variant="outline">
                      <Link href="/auth">
                        Sign in to View
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your Dream Property?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of satisfied clients who found their perfect home through our platform
          </p>
          {isAuthenticated ? (
            <Button asChild size="lg" variant="secondary" className="text-lg px-8">
              <Link href="/properties">
                Browse Properties
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          ) : (
            <Button asChild size="lg" variant="secondary" className="text-lg px-8">
              <Link href="/auth">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          )}
        </div>
      </section>
    </div>
  )
}