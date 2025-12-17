export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Imobiliária</h3>
            <p className="text-sm text-muted-foreground">
              Encontre o imóvel dos seus sonhos com nossas ferramentas avançadas de simulação.
            </p>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Imóveis</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Quattre - Istanbul</li>
              <li>Villa Bianco</li>
              <li>Venice Park</li>
              <li>Moment</li>
              <li>Unité</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Recursos</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Simulação de Pagamento</li>
              <li>Calculadora de Financiamento</li>
              <li>Comparação de Imóveis</li>
              <li>Autenticação Segura</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Suporte</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Central de Ajuda</li>
              <li>Entre em Contato</li>
              <li>Política de Privacidade</li>
              <li>Termos de Serviço</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 Imobiliária. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}