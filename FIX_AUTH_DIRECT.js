// 🛠️ DIRECT AUTH FIX SCRIPT 🛠️
// 
// This script directly creates a compatible admin user
// and tests the login process
// Run this in the browser console on the application page

(function directAuthFix() {
  console.log('🛠️ Starting direct authentication fix...');
  
  try {
    // Wait for CryptoJS to be available
    function waitForCryptoJS(callback, maxAttempts = 50) {
      let attempts = 0;
      
      function check() {
        attempts++;
        if (typeof CryptoJS !== 'undefined' && CryptoJS.AES && CryptoJS.SHA256) {
          console.log('✅ CryptoJS is available');
          callback();
        } else if (attempts < maxAttempts) {
          console.log(`⏳ Waiting for CryptoJS... (${attempts}/${maxAttempts})`);
          setTimeout(check, 100);
        } else {
          console.error('❌ CryptoJS not available after waiting');
          callback(new Error('CryptoJS not available'));
        }
      }
      
      check();
    }
    
    waitForCryptoJS(function(error) {
      if (error) {
        console.error('❌ Cannot proceed without CryptoJS');
        alert('❌ ERROR: CryptoJS not available. Please make sure you are on the application page and it has fully loaded.');
        return;
      }
      
      try {
        // Step 1: Clear any existing data to avoid conflicts
        console.log('\n🗑️ Step 1: Clearing existing data...');
        localStorage.removeItem('real_estate_auth');
        localStorage.removeItem('auth_state');
        console.log('✅ Cleared existing auth data');
        
        // Step 2: Create admin user with exact same method as app
        console.log('\n👑 Step 2: Creating admin user...');
        
        const SECRET_KEY = 'your-secret-key-here';
        const username = 'adminfluxo';
        const password = 'adminfluxo123';
        
        // Hash password exactly like the app does
        const hashedPassword = CryptoJS.SHA256(password).toString();
        console.log('🔐 Password hash:', hashedPassword);
        
        // Create user object exactly like the app expects
        const adminUser = {
          id: 'admin-001',
          username: username,
          email: 'admin@realestate.com',
          password: hashedPassword,
          twoFactorEnabled: false,
          createdAt: new Date().toISOString()
        };
        
        console.log('👤 Admin user object:', adminUser);
        
        // Step 3: Encrypt exactly like the app does
        console.log('\n🔒 Step 3: Encrypting user data...');
        
        const users = { [username]: adminUser };
        const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(users), SECRET_KEY).toString();
        
        console.log('📏 Encrypted data length:', encryptedData.length);
        console.log('🔍 Encrypted data preview:', encryptedData.substring(0, 100) + '...');
        console.log('🔐 Encryption format check:', encryptedData.startsWith('U2FsdGVkX1') ? '✅ Correct (AES)' : '❌ Wrong format');
        
        // Step 4: Save to localStorage
        console.log('\n💾 Step 4: Saving to localStorage...');
        
        localStorage.setItem('real_estate_auth', encryptedData);
        console.log('✅ Saved to localStorage with key: real_estate_auth');
        
        // Step 5: Verify the data was saved correctly
        console.log('\n✅ Step 5: Verification...');
        
        const savedData = localStorage.getItem('real_estate_auth');
        if (savedData && savedData === encryptedData) {
          console.log('✅ Data saved correctly');
          
          // Test decryption
          const decryptedBytes = CryptoJS.AES.decrypt(savedData, SECRET_KEY);
          const decryptedUsers = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));
          
          if (decryptedUsers[username]) {
            console.log('✅ User decrypted correctly');
            console.log('👤 Username:', decryptedUsers[username].username);
            console.log('🔐 Password hash:', decryptedUsers[username].password);
            
            // Test password validation
            const testHash = CryptoJS.SHA256(password).toString();
            const isValid = decryptedUsers[username].password === testHash;
            console.log('🔐 Password validation test:', isValid ? '✅ PASS' : '❌ FAIL');
            
            if (isValid) {
              console.log('\n🎉 SUCCESS! Admin user created and verified!');
              console.log('📋 Login credentials:');
              console.log('   Username: adminfluxo');
              console.log('   Password: adminfluxo123');
              console.log('\n🌐 You can now login to the application.');
              
              alert('🎉 SUCCESS! Admin user created!\n\nUsername: adminfluxo\nPassword: adminfluxo123\n\nYou can now login to the application.');
              
              // Optional: Auto-fill the login form
              setTimeout(() => {
                try {
                  const usernameField = document.querySelector('input[name="username"]');
                  const passwordField = document.querySelector('input[name="password"]');
                  
                  if (usernameField && passwordField) {
                    console.log('\n🤖 Auto-filling login form...');
                    usernameField.value = 'adminfluxo';
                    passwordField.value = 'adminfluxo123';
                    console.log('✅ Login form filled automatically');
                    
                    // Focus on username field
                    usernameField.focus();
                    console.log('🎯 Ready to login! Just press Enter or click the login button.');
                  } else {
                    console.log('⚠️ Login form not found for auto-fill');
                  }
                } catch (e) {
                  console.log('⚠️ Could not auto-fill login form:', e.message);
                }
              }, 1000);
              
            } else {
              console.error('❌ Password validation failed');
              alert('❌ ERROR: Password validation failed during creation.');
            }
          } else {
            console.error('❌ User decryption failed');
            alert('❌ ERROR: Could not verify created user.');
          }
        } else {
          console.error('❌ Data not saved correctly');
          alert('❌ ERROR: Could not save user data to localStorage.');
        }
        
      } catch (error) {
        console.error('❌ Error during user creation:', error);
        console.error('❌ Stack trace:', error.stack);
        alert('❌ ERROR: Failed to create admin user. Check console for details.');
      }
    });
    
  } catch (error) {
    console.error('❌ Script initialization failed:', error);
    console.error('❌ Stack trace:', error.stack);
    alert('❌ ERROR: Script failed to initialize. Check console for details.');
  }
})();