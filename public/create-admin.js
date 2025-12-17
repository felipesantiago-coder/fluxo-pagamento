// Create admin user script - run this in browser console
(function createAdminUser() {
  const adminUser = {
    id: 'admin-001',
    username: 'adminfluxo',
    email: 'admin@realestate.com',
    password: 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', // SHA256 hash of 'adminfluxo123'
    twoFactorEnabled: false,
    createdAt: new Date().toISOString()
  }

  // Get existing users
  const stored = localStorage.getItem('real_estate_auth')
  const users = stored ? JSON.parse(atob(stored)) : {}
  
  // Add admin user if not exists
  if (!users['adminfluxo']) {
    users['adminfluxo'] = adminUser
    localStorage.setItem('real_estate_auth', btoa(JSON.stringify(users)))
    console.log('✅ Admin user created successfully!')
    console.log('Username: adminfluxo')
    console.log('Password: adminfluxo123')
    alert('Admin user created! Username: adminfluxo, Password: adminfluxo123')
  } else {
    console.log('ℹ️ Admin user already exists')
  }
})();