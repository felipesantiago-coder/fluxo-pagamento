import { authStorage } from '@/lib/auth/storage'
import { hashPassword } from '@/lib/crypto'

// Create admin user
const createAdminUser = () => {
  const adminUser = {
    id: 'admin-001',
    username: 'adminfluxo',
    email: 'admin@realestate.com',
    password: hashPassword('adminfluxo123'),
    twoFactorEnabled: false,
    createdAt: new Date().toISOString()
  }

  // Check if admin already exists
  const existingUser = authStorage.getUser('adminfluxo')
  if (!existingUser) {
    authStorage.saveUser(adminUser)
    console.log('✅ Admin user created successfully')
    console.log('Username: adminfluxo')
    console.log('Password: adminfluxo123')
  } else {
    console.log('ℹ️ Admin user already exists')
  }
}

// Execute if running in Node.js environment
if (typeof window === 'undefined') {
  createAdminUser()
}

export { createAdminUser }