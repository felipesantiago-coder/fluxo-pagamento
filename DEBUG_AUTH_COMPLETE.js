// 🔍 COMPREHENSIVE AUTH DEBUG SCRIPT 🔍
// 
// This script will test the complete authentication flow step by step
// Run this in the browser console on the application page

(function comprehensiveAuthDebug() {
  console.log('🔍 Starting comprehensive authentication debug...');
  
  try {
    // Step 1: Check if we're on the right page
    console.log('\n📋 STEP 1: Environment Check');
    console.log('🌐 Current URL:', window.location.href);
    console.log('📦 React available:', typeof React !== 'undefined');
    console.log('⚛️ Next.js available:', typeof next !== 'undefined');
    console.log('🔐 CryptoJS available:', typeof CryptoJS !== 'undefined');
    
    // Step 2: Check localStorage
    console.log('\n💾 STEP 2: localStorage Analysis');
    const STORAGE_KEY = 'real_estate_auth';
    const existingData = localStorage.getItem(STORAGE_KEY);
    
    console.log('🔑 Storage Key:', STORAGE_KEY);
    console.log('📊 Data exists:', !!existingData);
    
    if (existingData) {
      console.log('📏 Data length:', existingData.length);
      console.log('🔍 First 100 chars:', existingData.substring(0, 100) + '...');
      
      // Test different decryption methods
      console.log('\n🔓 STEP 3: Decryption Tests');
      
      // Test 1: CryptoJS AES
      if (typeof CryptoJS !== 'undefined' && CryptoJS.AES) {
        try {
          const SECRET_KEY = 'your-secret-key-here';
          const bytes = CryptoJS.AES.decrypt(existingData, SECRET_KEY);
          const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          console.log('✅ CryptoJS AES: SUCCESS');
          console.log('👥 Users found:', Object.keys(decrypted));
          
          // Check admin user
          if (decrypted['adminfluxo']) {
            console.log('👑 Admin user found');
            console.log('📧 Email:', decrypted['adminfluxo'].email);
            console.log('🔐 Password hash:', decrypted['adminfluxo'].password);
            console.log('🔒 2FA enabled:', decrypted['adminfluxo'].twoFactorEnabled);
          } else {
            console.log('❌ Admin user NOT found');
          }
        } catch (e) {
          console.log('❌ CryptoJS AES: FAILED -', e.message);
        }
      } else {
        console.log('⚠️ CryptoJS not available for AES test');
      }
      
      // Test 2: Base64
      try {
        const decrypted = JSON.parse(atob(existingData));
        console.log('✅ Base64: SUCCESS');
        console.log('👥 Users found:', Object.keys(decrypted));
        
        if (decrypted['adminfluxo']) {
          console.log('👑 Admin user found (Base64)');
          console.log('🔐 Password hash:', decrypted['adminfluxo'].password);
        }
      } catch (e) {
        console.log('❌ Base64: FAILED -', e.message);
      }
    }
    
    // Step 4: Test password hashing
    console.log('\n🔐 STEP 4: Password Hashing Test');
    const testPassword = 'adminfluxo123';
    
    if (typeof CryptoJS !== 'undefined' && CryptoJS.SHA256) {
      const hash = CryptoJS.SHA256(testPassword).toString();
      console.log('🔑 Input password:', testPassword);
      console.log('🔐 Generated hash:', hash);
      console.log('📏 Hash length:', hash.length);
      
      // Verify it matches the expected hash
      const expectedHash = 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3';
      console.log('✅ Hash matches expected:', hash === expectedHash);
    } else {
      console.log('❌ CryptoJS.SHA256 not available');
    }
    
    // Step 5: Test the actual validation function
    console.log('\n🧪 STEP 5: Credential Validation Test');
    
    // Try to access the app's auth functions
    try {
      // Check if we can access the auth storage
      const testUser = {
        username: 'adminfluxo',
        password: 'adminfluxo123'
      };
      
      console.log('👤 Testing user:', testUser.username);
      console.log('🔑 Testing password:', testUser.password);
      
      // Try to simulate the app's validation process
      if (existingData && typeof CryptoJS !== 'undefined' && CryptoJS.AES) {
        try {
          const SECRET_KEY = 'your-secret-key-here';
          const bytes = CryptoJS.AES.decrypt(existingData, SECRET_KEY);
          const users = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          
          const user = users[testUser.username];
          console.log('👤 User found in storage:', !!user);
          
          if (user) {
            const hashedPassword = CryptoJS.SHA256(testUser.password).toString();
            const isValid = user.password === hashedPassword;
            console.log('🔐 Stored hash:', user.password);
            console.log('🔐 Generated hash:', hashedPassword);
            console.log('✅ Passwords match:', isValid);
            
            if (isValid) {
              console.log('🎉 SUCCESS: User should be able to login!');
            } else {
              console.log('❌ FAILURE: Password hashes do not match');
            }
          } else {
            console.log('❌ User not found in storage');
          }
        } catch (e) {
          console.log('❌ Error during validation test:', e.message);
        }
      }
    } catch (e) {
      console.log('❌ Error accessing auth functions:', e.message);
    }
    
    // Step 6: Check for multiple storage entries or conflicts
    console.log('\n🔍 STEP 6: Storage Conflicts Check');
    const allKeys = Object.keys(localStorage);
    console.log('📋 All localStorage keys:', allKeys);
    
    const authRelatedKeys = allKeys.filter(key => 
      key.includes('auth') || key.includes('user') || key.includes('real_estate')
    );
    console.log('🔐 Auth-related keys:', authRelatedKeys);
    
    authRelatedKeys.forEach(key => {
      const value = localStorage.getItem(key);
      console.log(`📦 ${key}:`, value ? `${value.length} chars` : 'null');
    });
    
    // Step 7: Test manual login simulation
    console.log('\n🎭 STEP 7: Manual Login Simulation');
    
    // Create a test admin user with current encryption
    if (typeof CryptoJS !== 'undefined' && CryptoJS.AES) {
      try {
        const SECRET_KEY = 'your-secret-key-here';
        
        const testAdmin = {
          id: 'admin-001',
          username: 'adminfluxo',
          email: 'admin@realestate.com',
          password: CryptoJS.SHA256('adminfluxo123').toString(),
          twoFactorEnabled: false,
          createdAt: new Date().toISOString()
        };
        
        const testUsers = { 'adminfluxo': testAdmin };
        const testData = CryptoJS.AES.encrypt(JSON.stringify(testUsers), SECRET_KEY).toString();
        
        console.log('🔐 Creating test admin with current encryption...');
        console.log('📏 Test data length:', testData.length);
        console.log('🔍 Test data preview:', testData.substring(0, 100) + '...');
        
        // Test if we can decrypt it back
        const testBytes = CryptoJS.AES.decrypt(testData, SECRET_KEY);
        const testDecrypted = JSON.parse(testBytes.toString(CryptoJS.enc.Utf8));
        console.log('✅ Test encryption/decryption works:', testDecrypted['adminfluxo'].username === 'adminfluxo');
        
      } catch (e) {
        console.log('❌ Error in manual login simulation:', e.message);
      }
    }
    
    // Step 8: Recommendations
    console.log('\n🎯 STEP 8: Recommendations');
    
    if (!existingData) {
      console.log('📝 No user data found. Run CREATE_ADMIN.js');
    } else if (!existingData.startsWith('U2FsdGVkX1')) {
      console.log('🔄 Data encrypted with old method. Clear localStorage and run CREATE_ADMIN.js');
    } else if (typeof CryptoJS === 'undefined') {
      console.log('📦 CryptoJS not loaded. Make sure you are on the application page');
    } else {
      console.log('✅ Basic checks passed. If login still fails, there might be an issue with:');
      console.log('   - Form submission');
      console.log('   - Event handlers');
      console.log('   - State management');
      console.log('   - Browser compatibility');
    }
    
    console.log('\n🔧 Quick Fix Options:');
    console.log('1. Clear localStorage: localStorage.clear()');
    console.log('2. Run CREATE_ADMIN.js');
    console.log('3. Refresh the page');
    console.log('4. Try login again');
    
  } catch (error) {
    console.error('❌ Debug script failed:', error);
    console.error('❌ Stack trace:', error.stack);
  }
})();