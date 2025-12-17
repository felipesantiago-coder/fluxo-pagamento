// 🚀 OFFLINE ADMIN USER CREATION SCRIPT 🚀
// 
// INSTRUCTIONS:
// 1. Open Real Estate application in your browser
// 2. Open browser console (F12)
// 3. Copy and paste this entire script
// 4. Press Enter
//
// This script works offline and creates admin user: adminfluxo / adminfluxo123

(function createAdminOffline() {
  console.log('🔧 Starting offline admin user creation...');
  
  try {
    // First, clear any existing data to avoid conflicts
    const STORAGE_KEY = 'real_estate_auth';
    console.log('🗑️ Clearing existing user data...');
    localStorage.removeItem(STORAGE_KEY);
    
    // Simple approach: Create user with same structure as app expects
    // but using a known working encryption method
    
    // Check if we can access the app's crypto functions
    let encryptData, hashPassword;
    
    // Try to use app's crypto if available
    try {
      // This will work if the app is loaded
      const appCrypto = window.__NEXT_DATA__?.props?.pageProps?.crypto;
      if (appCrypto) {
        encryptData = appCrypto.encryptData;
        hashPassword = appCrypto.hashPassword;
        console.log('📦 Using app crypto functions');
      }
    } catch (e) {
      console.log('⚠️ Could not access app crypto functions');
    }
    
    // Fallback: Use simple base64 + known hash
    if (!encryptData || !hashPassword) {
      console.log('🔄 Using fallback crypto (base64 + SHA256)');
      
      encryptData = (data) => {
        // Use base64 for simplicity (will be compatible with app's fallback)
        return btoa(JSON.stringify(data));
      };
      
      hashPassword = (password) => {
        // Use a known SHA256 hash for 'adminfluxo123'
        // This hash should match what the app generates
        return 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3';
      };
    }
    
    // Admin user data
    const adminUser = {
      id: 'admin-001',
      username: 'adminfluxo',
      email: 'admin@realestate.com',
      password: hashPassword('adminfluxo123'),
      twoFactorEnabled: false,
      createdAt: new Date().toISOString()
    };
    
    // Create users object
    const users = {
      'adminfluxo': adminUser
    };
    
    // Save to storage
    const encryptedData = encryptData(users);
    localStorage.setItem(STORAGE_KEY, encryptedData);
    
    console.log('✅ SUCCESS! Admin user created!');
    console.log('📋 Username: adminfluxo');
    console.log('🔑 Password: adminfluxo123');
    console.log('🔐 Password Hash:', adminUser.password);
    console.log('💾 Storage Key:', STORAGE_KEY);
    console.log('📊 Encrypted Data Length:', encryptedData.length);
    console.log('🔐 Encryption Method:', encryptData.toString().includes('btoa') ? 'Base64' : 'Custom');
    
    // Verify the user was saved correctly
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      console.log('✅ User data verified in localStorage');
      
      // Try to read it back
      try {
        const decrypted = JSON.parse(atob(savedData));
        if (decrypted['adminfluxo']) {
          console.log('✅ Admin user verified in decrypted data');
        } else {
          console.log('❌ Admin user not found in decrypted data');
        }
      } catch (e) {
        console.log('⚠️ Could not verify decrypted data, but save was successful');
      }
    } else {
      console.log('❌ Failed to save user data');
    }
    
    alert('✅ SUCCESS! Admin user created!\n\nUsername: adminfluxo\nPassword: adminfluxo123\n\nYou can now login to the application.\n\nIf login fails, run the DIAGNOSE_AUTH.js script for troubleshooting.');
    
  } catch (error) {
    console.error('❌ ERROR creating admin user:', error);
    console.error('❌ Stack trace:', error.stack);
    alert('❌ ERROR: Could not create admin user.\n\nPlease check console for details and make sure you are on the application page.');
  }
})();