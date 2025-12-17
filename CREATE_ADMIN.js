// 🚀 ADMIN USER CREATION SCRIPT 🚀
// 
// INSTRUCTIONS:
// 1. Open Real Estate application in your browser
// 2. Open browser console (F12)
// 3. Copy and paste this entire script
// 4. Press Enter
//
// This will create admin user: adminfluxo / adminfluxo123

// Load CryptoJS from the application (if available)
// If not available, we'll use a compatible approach
(function createAdmin() {
  console.log('🔧 Starting admin user creation...');
  
  // Check if CryptoJS is available from the app
  if (typeof CryptoJS !== 'undefined') {
    console.log('📦 Using CryptoJS from application');
  } else {
    console.log('⚠️ CryptoJS not found, loading from CDN...');
    // Load CryptoJS from CDN if not available
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js';
    script.onload = function() {
      console.log('✅ CryptoJS loaded successfully');
      createAdminUser();
    };
    script.onerror = function() {
      console.error('❌ Failed to load CryptoJS');
      alert('❌ ERROR: Could not load CryptoJS. Please check your internet connection.');
    };
    document.head.appendChild(script);
    return;
  }
  
  // If CryptoJS is already available, proceed immediately
  createAdminUser();
  
  function createAdminUser() {
    try {
      // Use same encryption as app
      const SECRET_KEY = 'your-secret-key-here';
      
      // Encryption compatible with the app
      const encryptData = (data) => {
        if (typeof CryptoJS !== 'undefined' && CryptoJS.AES) {
          return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
        } else {
          // Fallback to base64 if CryptoJS is not available
          console.warn('⚠️ Using fallback encryption (base64). Consider loading CryptoJS.');
          return btoa(JSON.stringify(data));
        }
      };
      
      const decryptData = (encryptedData) => {
        try {
          if (typeof CryptoJS !== 'undefined' && CryptoJS.AES) {
            const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
            return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          } else {
            // Fallback from base64
            return JSON.parse(atob(encryptedData));
          }
        } catch (e) {
          console.error('❌ Decryption failed:', e);
          return {};
        }
      };
      
      // Hash password using the same method as the app
      const hashPassword = (password) => {
        if (typeof CryptoJS !== 'undefined' && CryptoJS.SHA256) {
          return CryptoJS.SHA256(password).toString();
        } else {
          // Fallback: this won't match the app's hashing, but it's better than nothing
          console.warn('⚠️ Using fallback password hashing. This may not work with the app.');
          return btoa(password);
        }
      };

      // Admin user data with properly hashed password
      const adminUser = {
        id: 'admin-001',
        username: 'adminfluxo',
        email: 'admin@realestate.com',
        password: hashPassword('adminfluxo123'), // Properly hashed password
        twoFactorEnabled: false,
        createdAt: new Date().toISOString()
      };

      // Get existing users from storage
      const STORAGE_KEY = 'real_estate_auth';
      const existingData = localStorage.getItem(STORAGE_KEY);
      let users = {};
      
      if (existingData) {
        try {
          users = decryptData(existingData);
          console.log('📚 Found existing users:', Object.keys(users));
        } catch (e) {
          console.log('📝 Starting with fresh user storage due to decryption error');
          users = {};
        }
      }

      // Check if admin already exists
      if (users['adminfluxo']) {
        console.log('⚠️ Admin user already exists');
        console.log('📋 Username: adminfluxo');
        console.log('🔑 Password: adminfluxo123');
        console.log('🔐 Password hash:', users['adminfluxo'].password);
        alert('⚠️ Admin user already exists!\n\nYou can login with:\nUsername: adminfluxo\nPassword: adminfluxo123');
        return;
      }

      // Add admin user
      users['adminfluxo'] = adminUser;
      
      // Save to storage
      localStorage.setItem(STORAGE_KEY, encryptData(users));
      
      console.log('✅ SUCCESS! Admin user created!');
      console.log('📋 Username: adminfluxo');
      console.log('🔑 Password: adminfluxo123');
      console.log('🔐 Password hash:', adminUser.password);
      console.log('🌐 You can now login at application');
      console.log('💾 Storage key:', STORAGE_KEY);
      console.log('🔒 Encryption used:', typeof CryptoJS !== 'undefined' && CryptoJS.AES ? 'CryptoJS AES' : 'Base64 fallback');
      
      alert('✅ SUCCESS! Admin user created!\n\nUsername: adminfluxo\nPassword: adminfluxo123\n\nYou can now login to the application.');
      
    } catch (error) {
      console.error('❌ ERROR creating admin user:', error);
      console.error('❌ Stack trace:', error.stack);
      alert('❌ ERROR: Could not create admin user. Please check console for details.');
    }
  }
})();