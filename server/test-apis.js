const API_URL = 'http://localhost:5000/api';
let authToken = null;

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
};

// Test helper function
async function testEndpoint(name, method, url, data = null, headers = {}) {
  try {
    log.test(`Testing ${name}...`);
    const fetchOptions = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };
    
    if (data && (method === 'POST' || method === 'PUT')) {
      fetchOptions.body = JSON.stringify(data);
    }
    
    const response = await fetch(`${API_URL}${url}`, fetchOptions);
    const responseData = await response.json().catch(() => ({}));
    
    if (response.status >= 200 && response.status < 300) {
      log.success(`${name} - Status: ${response.status}`);
      return { success: true, data: responseData, status: response.status };
    } else {
      log.error(`${name} - Unexpected status: ${response.status}`);
      return { success: false, status: response.status, error: responseData.message };
    }
  } catch (error) {
    log.error(`${name} - Error: ${error.message}`);
    return { success: false, status: 'Network Error', error: error.message };
  }
}

// Test results tracker
const results = {
  passed: 0,
  failed: 0,
  total: 0,
};

function recordResult(success, name) {
  results.total++;
  if (success) {
    results.passed++;
  } else {
    results.failed++;
  }
}

async function runTests() {
  console.log('\n' + '='.repeat(60));
  console.log(`${colors.cyan}Backend API Testing${colors.reset}`);
  console.log('='.repeat(60) + '\n');

  // Test 1: Health Check
  log.info('Testing Health Check Endpoint');
  const healthResult = await testEndpoint('GET /api/health', 'GET', '/health');
  recordResult(healthResult.success, 'Health Check');

  // Test 2: Root endpoint (not under /api)
  log.info('\nTesting Root Endpoint');
  try {
    log.test('Testing GET /...');
    const response = await fetch('http://localhost:5000/');
    const responseData = await response.json().catch(() => ({}));
    if (response.status === 200) {
      log.success('GET / - Status: 200');
      recordResult(true, 'Root');
    } else {
      log.error(`GET / - Unexpected status: ${response.status}`);
      recordResult(false, 'Root');
    }
  } catch (error) {
    log.error(`GET / - Error: ${error.message}`);
    recordResult(false, 'Root');
  }

  // Test 3: Hero API (Public)
  log.info('\nTesting Hero API (Public)');
  const heroResult = await testEndpoint('GET /api/hero', 'GET', '/hero');
  recordResult(heroResult.success, 'Get Hero');

  // Test 4: About API (Public)
  log.info('\nTesting About API (Public)');
  const aboutResult = await testEndpoint('GET /api/about', 'GET', '/about');
  recordResult(aboutResult.success, 'Get About');

  // Test 5: Services API (Public)
  log.info('\nTesting Services API (Public)');
  const servicesResult = await testEndpoint('GET /api/services', 'GET', '/services');
  recordResult(servicesResult.success, 'Get Services');
  
  // Test 6: Get Service by Slug
  const serviceSlugResult = await testEndpoint('GET /api/services/app-design', 'GET', '/services/app-design');
  recordResult(serviceSlugResult.success, 'Get Service by Slug');

  // Test 7: Projects API (Public)
  log.info('\nTesting Projects API (Public)');
  const projectsResult = await testEndpoint('GET /api/projects', 'GET', '/projects');
  recordResult(projectsResult.success, 'Get Projects');

  // Test 8: Education API (Public)
  log.info('\nTesting Education API (Public)');
  const educationResult = await testEndpoint('GET /api/education', 'GET', '/education');
  recordResult(educationResult.success, 'Get Education');

  // Test 9: CV API (Public)
  log.info('\nTesting CV API (Public)');
  const cvInfoResult = await testEndpoint('GET /api/cv/info', 'GET', '/cv/info');
  recordResult(cvInfoResult.success, 'Get CV Info');

  // Test 10: Contact API (Public POST)
  log.info('\nTesting Contact API (Public)');
  const contactData = {
    name: 'Test User',
    email: 'test@example.com',
    subject: 'Test Subject',
    message: 'This is a test message',
  };
  const contactResult = await testEndpoint('POST /api/contact', 'POST', '/contact', contactData);
  recordResult(contactResult.success, 'Send Contact Message');

  // Test 11: Feedback API (Public POST)
  log.info('\nTesting Feedback API (Public)');
  const feedbackData = {
    name: 'Test User',
    email: 'test@example.com',
    rating: 5,
    feedback: 'This is a test feedback',
  };
  const feedbackResult = await testEndpoint('POST /api/feedback', 'POST', '/feedback', feedbackData);
  recordResult(feedbackResult.success, 'Submit Feedback');

  // Test 12: Admin Login
  log.info('\nTesting Admin API');
  const loginData = {
    username: 'admin',
    password: 'admin123',
  };
  const loginResult = await testEndpoint('POST /api/admin/login', 'POST', '/admin/login', loginData);
  recordResult(loginResult.success, 'Admin Login');
  
  if (loginResult.success && loginResult.data?.token) {
    authToken = loginResult.data.token;
    log.success('Auth token obtained');

    // Test 13: Get Admin Me (Protected)
    const getMeResult = await testEndpoint(
      'GET /api/admin/me',
      'GET',
      '/admin/me',
      null,
      { Authorization: `Bearer ${authToken}` }
    );
    recordResult(getMeResult.success, 'Get Admin Me');

    // Test 14: Get Messages (Protected)
    log.info('\nTesting Protected Contact Endpoints');
    const messagesResult = await testEndpoint(
      'GET /api/contact',
      'GET',
      '/contact',
      null,
      { Authorization: `Bearer ${authToken}` }
    );
    recordResult(messagesResult.success, 'Get Messages');

    // Test 15: Get Feedback (Protected)
    log.info('\nTesting Protected Feedback Endpoints');
    const getFeedbackResult = await testEndpoint(
      'GET /api/feedback',
      'GET',
      '/feedback',
      null,
      { Authorization: `Bearer ${authToken}` }
    );
    recordResult(getFeedbackResult.success, 'Get Feedback');

    // Test 16: Update Hero (Protected)
    log.info('\nTesting Protected Hero Endpoint');
    const updateHeroData = {
      name: 'Manoj V',
      designation: 'Software Developer',
    };
    const updateHeroResult = await testEndpoint(
      'PUT /api/hero',
      'PUT',
      '/hero',
      updateHeroData,
      { Authorization: `Bearer ${authToken}` }
    );
    recordResult(updateHeroResult.success, 'Update Hero');

    // Test 17: Update About (Protected)
    log.info('\nTesting Protected About Endpoint');
    const updateAboutResult = await testEndpoint(
      'PUT /api/about',
      'PUT',
      '/about',
      { description: 'Updated description' },
      { Authorization: `Bearer ${authToken}` }
    );
    recordResult(updateAboutResult.success, 'Update About');

    // Test 18: Update Services (Protected)
    log.info('\nTesting Protected Services Endpoint');
    const updateServicesResult = await testEndpoint(
      'PUT /api/services',
      'PUT',
      '/services',
      { sectionTitle: 'My Services' },
      { Authorization: `Bearer ${authToken}` }
    );
    recordResult(updateServicesResult.success, 'Update Services');
  } else {
    log.error('Failed to get auth token, skipping protected endpoint tests');
  }

  // Print Summary
  console.log('\n' + '='.repeat(60));
  console.log(`${colors.cyan}Test Summary${colors.reset}`);
  console.log('='.repeat(60));
  console.log(`Total Tests: ${results.total}`);
  console.log(`${colors.green}Passed: ${results.passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${results.failed}${colors.reset}`);
  console.log(`Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`);
  console.log('='.repeat(60) + '\n');

  if (results.failed === 0) {
    console.log(`${colors.green}All tests passed! ✓${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`${colors.red}Some tests failed. Please check the errors above.${colors.reset}\n`);
    process.exit(1);
  }
}

// Run tests
runTests().catch((error) => {
  console.error('Test runner error:', error);
  process.exit(1);
});

