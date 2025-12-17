# Real Estate Platform

A modern, professional real estate platform with advanced property simulation tools and secure authentication.

## Features

- **Modern Authentication System**: Complete login/registration with two-factor authentication (2FA)
- **Property Discovery**: Browse exclusive properties with detailed information
- **Advanced Simulators**: Sophisticated payment and financing calculators
- **Dark/Light Theme**: User-selectable theme with system preference support
- **Responsive Design**: Apple-inspired design that works on all devices
- **Offline-First**: All authentication and data stored locally
- **PDF Generation**: Export payment schedules and proposals

## Properties

- **Quattre - Istanbul**: Luxury apartments with full payment simulator
- **Villa Bianco**: Mediterranean villas with sea views
- **Venice Park**: Contemporary residences with canal views
- **Moment**: Modern urban living spaces
- **Unité**: Boutique residences with premium amenities

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 with shadcn/ui components
- **Authentication**: Custom local storage-based auth with 2FA
- **PDF Generation**: jsPDF with autoTable
- **Icons**: Lucide React
- **Themes**: next-themes

## Getting Started

1. Install dependencies:
   ```bash
   bun install
   ```

2. Run the development server:
   ```bash
   bun run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Authentication

The application uses a local storage-based authentication system:

- **Registration**: Create an account with username, email, and password
- **Login**: Secure login with password hashing
- **2FA Setup**: Optional two-factor authentication using TOTP
- **QR Code**: Scan with authenticator apps (Google Authenticator, Authy, etc.)

## Property Simulators

Each property includes a sophisticated payment simulator with:

- Real-time calculations
- Flexible payment schedules
- Down payment options
- Monthly and semester installments
- PDF report generation
- Progress tracking

## Deployment

This application is ready for Vercel deployment:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

The application uses only client-side storage, so no database configuration is required.

## Security Features

- Password hashing with SHA-256
- Encrypted local storage
- Two-factor authentication (TOTP)
- QR code generation for authenticator apps
- Session management

## Theme System

- Light/Dark theme toggle
- System preference detection
- Persistent theme selection
- Smooth transitions

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - see LICENSE file for details.