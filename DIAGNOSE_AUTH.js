// 🔍 AUTHENTICATION DIAGNOSTIC SCRIPT 🔍
// 
// INSTRUCTIONS:
// 1. Open Real Estate application in your browser
// 2. Open browser console (F12)
// 3. Copy and paste this entire script
// 4. Press Enter
//
// This script will help diagnose authentication issues

(function diagnoseAuth() {
  console.log('🔍 Starting authentication diagnosis...');
  
  try {
    // Check localStorage
    const STORAGE_KEY = 'real_estate_auth';
    const existingData = localStorage.getItem(STORAGE_KEY);
    
    console.log('📦 Storage Key:', STORAGE_KEY);
    console.log('📋 Existing Data:', existingData ? 'Found' : 'Not found');
    
    if (existingData) {
      console.log('📊 Data Length:', existingData.length, 'characters');
      console.log('📝 Data Preview:', existingData.substring(0, 100) + '...');
      
      // Try to determine encryption type
      if (existingData.startsWith('U2FsdGVkX1')) {
        console.log('🔐 Encryption Type: CryptoJS AES (Correct)');
      } else if (existingData.includes(' ') || existingData.match(/^[A-Za-z0-9+/]*={0,2}$/)) {
        console.log('🔐 Encryption Type: Base64 (Old script)');
      } else {
        console.log('🔐 Encryption Type: Unknown');
      }
      
      // Try to decrypt with different methods
      console.log('\n🔓 Attempting decryption...');
      
      // Method 1: Try CryptoJS AES
      if (typeof CryptoJS !== 'undefined' && CryptoJS.AES) {
        try {
          const SECRET_KEY = 'your-secret-key-here';
          const bytes = CryptoJS.AES.decrypt(existingData, SECRET_KEY);
          const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          console.log('✅ CryptoJS AES Decryption: SUCCESS');
          console.log('👥 Users found:', Object.keys(decrypted));
          
          // Check if admin exists
          if (decrypted['adminfluxo']) {
            console.log('👑 Admin user found:', decrypted['adminfluxo']);
            console.log('🔐 Admin password hash:', decrypted['adminfluxo'].password);
          } else {
            console.log('❌ Admin user NOT found');
          }
        } catch (e) {
          console.log('❌ CryptoJS AES Decryption: FAILED -', e.message);
        }
      } else {
        console.log('⚠️ CryptoJS not available');
      }
      
      // Method 2: Try Base64
      try {
        const decrypted = JSON.parse(atob(existingData));
        console.log('✅ Base64 Decryption: SUCCESS');
        console.log('👥 Users found:', Object.keys(decrypted));
        
        // Check if admin exists
        if (decrypted['adminfluxo']) {
          console.log('👑 Admin user found:', decrypted['adminfluxo']);
          console.log('🔐 Admin password hash:', decrypted['adminfluxo'].password);
        } else {
          console.log('❌ Admin user NOT found');
        }
      } catch (e) {
        console.log('❌ Base64 Decryption: FAILED -', e.message);
      }
    }
    
    // Test password hashing
    console.log('\n🔐 Testing password hashing...');
    const testPassword = 'adminfluxo123';
    
    if (typeof CryptoJS !== 'undefined' && CryptoJS.SHA256) {
      const cryptoHash = CryptoJS.SHA256(testPassword).toString();
      console.log('🔑 CryptoJS SHA256:', cryptoHash);
      console.log('📏 Hash length:', cryptoHash.length);
    } else {
      console.log('⚠️ CryptoJS not available for hashing test');
    }
    
    // Check application state
    console.log('\n🌐 Application State Check:');
    console.log('📦 CryptoJS Available:', typeof CryptoJS !== 'undefined');
    console.log('🔧 CryptoJS Version:', typeof CryptoJS !== 'undefined' ? CryptoJS.version || 'Unknown' : 'N/A');
    console.log('🔐 AES Available:', typeof CryptoJS !== 'undefined' && !!CryptoJS.AES);
    console.log('🔑 SHA256 Available:', typeof CryptoJS !== 'undefined' && !!CryptoJS.SHA256);
    
    // Check for existing admin user
    console.log('\n👑 Admin User Check:');
    if (existingData) {
      // Try both decryption methods
      let users = {};
      
      try {
        if (typeof CryptoJS !== 'undefined' && CryptoJS.AES) {
          const SECRET_KEY = 'your-secret-key-here';
          const bytes = CryptoJS.AES.decrypt(existingData, SECRET_KEY);
          users = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        }
      } catch (e) {
        try {
          users = JSON.parse(atob(existingData));
        } catch (e2) {
          console.log('❌ Could not decrypt user data');
        }
      }
      
      if (users['adminfluxo']) {
        console.log('✅ Admin user exists in storage');
        console.log('👤 Username:', users['adminfluxo'].username);
        console.log('📧 Email:', users['adminfluxo'].email);
        console.log('🔐 Password Hash:', users['adminfluxo'].password);
        console.log('🔒 2FA Enabled:', users['adminfluxo'].twoFactorEnabled);
        console.log('📅 Created:', users['adminfluxo'].createdAt);
        
        // Test password validation
        if (typeof CryptoJS !== 'undefined' && CryptoJS.SHA256) {
          const inputHash = CryptoJS.SHA256(testPassword).toString();
          const isValid = users['adminfluxo'].password === inputHash;
          console.log('🔐 Password Validation:', isValid ? '✅ VALID' : '❌ INVALID');
          console.log('🔑 Expected Hash:', inputHash);
          console.log('🔑 Stored Hash:', users['adminfluxo'].password);
        }
      } else {
        console.log('❌ Admin user NOT found in storage');
      }
    }
    
    console.log('\n🎯 Recommendations:');
    if (!existingData) {
      console.log('📝 No user data found. Run CREATE_ADMIN.js to create admin user.');
    } else if (!existingData.startsWith('U2FsdGVkX1')) {
      console.log('🔄 Data appears to be encrypted with old method. Clear localStorage and run CREATE_ADMIN.js again.');
    } else if (typeof CryptoJS === 'undefined') {
      console.log('📦 CryptoJS not loaded. Make sure you run this script on the application page.');
    } else {
      console.log('✅ Everything looks good! Try logging in with adminfluxo / adminfluxo123');
    }
    
  } catch (error) {
    console.error('❌ Diagnosis failed:', error);
    console.error('❌ Stack trace:', error.stack);
  }
})();