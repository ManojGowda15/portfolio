const API_URL = 'http://localhost:5000/api/admin/register';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  test: (msg) => console.log(`${colors.cyan}→${colors.reset} ${msg}`),
  section: (msg) => console.log(`\n${colors.cyan}${'='.repeat(60)}${colors.reset}\n${msg}\n${'='.repeat(60)}\n`),
};

const testRegister = async () => {
  log.section('🧪 Testing Admin Register Endpoint');
  
  const testData = {
    username: 'shilpa',
    email: 'shilpar@gmail.com',
    password: 'shilpa123'
  };

  log.info(`URL: ${API_URL}`);
  log.info(`Method: POST`);
  log.info(`Body: ${JSON.stringify(testData, null, 2)}`);

  try {
    log.test('Sending request...');
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const responseData = await response.json().catch(() => ({}));

    console.log(`\n📥 Response Status: ${response.status} ${response.statusText}`);
    console.log(`📥 Response Body:`, JSON.stringify(responseData, null, 2));

    if (response.ok) {
      log.success('Admin registered successfully!');
      console.log(`   Username: ${responseData.user?.username}`);
      console.log(`   Email: ${responseData.user?.email}`);
      console.log(`   Token: ${responseData.token ? 'Present ✓' : 'Missing ✗'}`);
      console.log(`\n${colors.green}✅ TEST PASSED${colors.reset}`);
      return { success: true, data: responseData };
    } else {
      log.error(`Registration failed with status ${response.status}`);
      console.log(`   Error: ${responseData.message || 'Unknown error'}`);
      
      if (response.status === 403) {
        console.log(`\n${colors.yellow}💡 Note:${colors.reset} This means registration is blocked.`);
        console.log(`   The register endpoint has been modified to allow multiple admins.`);
        console.log(`   If you still see 403, the server may need to be restarted.`);
      } else if (response.status === 400) {
        console.log(`\n${colors.yellow}💡 Note:${colors.reset} This might be a validation error or duplicate account.`);
      }
      console.log(`\n${colors.red}❌ TEST FAILED${colors.reset}`);
      return { success: false, status: response.status, error: responseData };
    }
    
  } catch (error) {
    log.error(`Network Error: ${error.message}`);
    
    if (error.code === 'ECONNREFUSED') {
      console.log(`\n${colors.yellow}💡 Server is not running!${colors.reset}`);
      console.log(`   Please start the server with: npm run start`);
    } else {
      console.error(`\nFull error:`, error);
    }
    
    console.log(`\n${colors.red}❌ TEST FAILED${colors.reset}`);
    process.exit(1);
  }
};

// Run the test
testRegister().then(() => {
  console.log(`\n${colors.cyan}${'='.repeat(60)}${colors.reset}\n`);
  process.exit(0);
}).catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});

