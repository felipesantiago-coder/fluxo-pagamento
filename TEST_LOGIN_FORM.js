// 🧪 LOGIN FORM TEST SCRIPT 🧪
// 
// This script tests the login form directly
// Run this in the browser console on the application page

(function testLoginForm() {
  console.log('🧪 Starting login form test...');
  
  try {
    // Step 1: Check if we're on the login page
    console.log('\n📋 Step 1: Environment Check');
    console.log('🌐 Current URL:', window.location.href);
    
    const loginForm = document.querySelector('form');
    const usernameInput = document.querySelector('input[name="username"]');
    const passwordInput = document.querySelector('input[name="password"]');
    const submitButton = document.querySelector('button[type="submit"]');
    
    console.log('📝 Login form found:', !!loginForm);
    console.log('👤 Username input found:', !!usernameInput);
    console.log('🔑 Password input found:', !!passwordInput);
    console.log('🔘 Submit button found:', !!submitButton);
    
    if (!loginForm || !usernameInput || !passwordInput) {
      console.log('❌ Login form not found. Make sure you are on the login page.');
      return;
    }
    
    // Step 2: Fill the form with admin credentials
    console.log('\n📝 Step 2: Filling login form...');
    
    const testUsername = 'adminfluxo';
    const testPassword = 'adminfluxo123';
    
    usernameInput.value = testUsername;
    passwordInput.value = testPassword;
    
    console.log('👤 Username filled:', testUsername);
    console.log('🔑 Password filled:', testPassword);
    
    // Trigger change events to ensure React picks up the changes
    usernameInput.dispatchEvent(new Event('input', { bubbles: true }));
    usernameInput.dispatchEvent(new Event('change', { bubbles: true }));
    passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
    passwordInput.dispatchEvent(new Event('change', { bubbles: true }));
    
    console.log('✅ Form filled and events triggered');
    
    // Step 3: Check localStorage before login
    console.log('\n💾 Step 3: localStorage check before login...');
    
    const authData = localStorage.getItem('real_estate_auth');
    console.log('📊 Auth data exists:', !!authData);
    
    if (authData) {
      console.log('📏 Auth data length:', authData.length);
      
      if (typeof CryptoJS !== 'undefined' && CryptoJS.AES) {
        try {
          const SECRET_KEY = 'your-secret-key-here';
          const bytes = CryptoJS.AES.decrypt(authData, SECRET_KEY);
          const users = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          
          const adminUser = users[testUsername];
          console.log('👑 Admin user found:', !!adminUser);
          
          if (adminUser) {
            console.log('🔐 Stored password hash:', adminUser.password);
            
            const testHash = CryptoJS.SHA256(testPassword).toString();
            console.log('🔐 Test password hash:', testHash);
            console.log('✅ Passwords match:', adminUser.password === testHash);
          }
        } catch (e) {
          console.log('❌ Error decrypting auth data:', e.message);
        }
      }
    }
    
    // Step 4: Monitor console for login attempts
    console.log('\n🔍 Step 4: Setting up login monitoring...');
    
    // Override console.log to capture authentication logs
    const originalLog = console.log;
    const authLogs = [];
    
    console.log = function(...args) {
      authLogs.push(args.join(' '));
      originalLog.apply(console, args);
    };
    
    // Step 5: Submit the form
    console.log('\n🚀 Step 5: Ready to submit form...');
    console.log('🎯 Options:');
    console.log('1. Click the login button manually');
    console.log('2. Call: submitButton.click()');
    console.log('3. Call: loginForm.requestSubmit()');
    console.log('4. Call: testLoginSubmission()');
    
    // Helper function to test login submission
    window.testLoginSubmission = function() {
      console.log('\n🔥 Testing login submission...');
      
      // Create a submit event
      const submitEvent = new Event('submit', { 
        bubbles: true, 
        cancelable: true 
      });
      
      // Submit the form
      loginForm.dispatchEvent(submitEvent);
      
      // Alternative: direct form submission
      setTimeout(() => {
        if (loginForm.requestSubmit) {
          loginForm.requestSubmit();
        } else {
          submitButton.click();
        }
      }, 100);
      
      // Check results after a delay
      setTimeout(() => {
        console.log('\n📊 Login attempt results:');
        console.log('📝 Auth logs collected:', authLogs.length);
        
        // Look for error messages
        const errorElements = document.querySelectorAll('[role="alert"], .error, .alert-danger');
        console.log('❌ Error elements found:', errorElements.length);
        
        errorElements.forEach((el, index) => {
          console.log(`❌ Error ${index + 1}:`, el.textContent);
        });
        
        // Check for success indicators
        const successElements = document.querySelectorAll('.success, .alert-success');
        console.log('✅ Success elements found:', successElements.length);
        
        // Check URL changes
        console.log('🌐 Current URL after login:', window.location.href);
        
        // Restore original console.log
        console.log = originalLog;
        
        console.log('\n🎯 Login test completed. Check the results above.');
      }, 2000);
    };
    
    console.log('\n✅ Login form test setup complete!');
    console.log('💡 To test the login, run: testLoginSubmission()');
    
  } catch (error) {
    console.error('❌ Login form test failed:', error);
    console.error('❌ Stack trace:', error.stack);
  }
})();