// Admin User Creation Script
// Execute this in the browser console on the application

(function() {
  console.log('🔧 Creating admin user...');
  
  // Hash password function
  const hashPassword = (password) => {
    // Simple hash for browser environment
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
  };

  // Admin user data
  const adminUser = {
    id: 'admin-001',
    username: 'adminfluxo',
    email: 'admin@realestate.com',
    password: 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', // SHA256 of 'adminfluxo123'
    twoFactorEnabled: false,
    createdAt: new Date().toISOString()
  };

  try {
    // Get existing auth data
    const stored = localStorage.getItem('real_estate_auth');
    let authData = {};
    
    if (stored) {
      try {
        // Try to decrypt if it's encrypted
        authData = JSON.parse(atob(stored));
      } catch (e) {
        // If parsing fails, start fresh
        authData = {};
      }
    }

    // Add admin user if doesn't exist
    if (!authData['adminfluxo']) {
      authData['adminfluxo'] = adminUser;
      localStorage.setItem('real_estate_auth', btoa(JSON.stringify(authData)));
      
      console.log('✅ Admin user created successfully!');
      console.log('Username: adminfluxo');
      console.log('Password: adminfluxo123');
      console.log('🔑 You can now login with these credentials');
      
      alert('✅ Admin user created!\n\nUsername: adminfluxo\nPassword: adminfluxo123\n\nYou can now login with these credentials.');
    } else {
      console.log('ℹ️ Admin user already exists');
      alert('ℹ️ Admin user already exists in the system.');
    }
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    alert('❌ Error creating admin user. Check console for details.');
  }
})();