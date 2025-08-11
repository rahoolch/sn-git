const app = require('./app');
const http = require('http');

// Simple test function
function runTests() {
  console.log('🧪 Running tests...');
  
  // Test 1: Check if app exports correctly
  if (typeof app === 'function') {
    console.log('✅ App exports correctly');
  } else {
    console.log('❌ App export failed');
    process.exit(1);
  }
  
  // Test 2: Start server and test endpoints
  const server = app.listen(3001, () => {
    console.log('✅ Test server started on port 3001');
    
    // Test health endpoint
    http.get('http://localhost:3001/health', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const response = JSON.parse(data);
        if (response.status === 'healthy') {
          console.log('✅ Health endpoint test passed');
        } else {
          console.log('❌ Health endpoint test failed');
          process.exit(1);
        }
        
        // Test root endpoint
        http.get('http://localhost:3001/', (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            const response = JSON.parse(data);
            if (response.message && response.status === 'running') {
              console.log('✅ Root endpoint test passed');
              console.log('🎉 All tests passed!');
              server.close();
              process.exit(0);
            } else {
              console.log('❌ Root endpoint test failed');
              server.close();
              process.exit(1);
            }
          });
        }).on('error', (err) => {
          console.log('❌ Root endpoint test failed:', err.message);
          server.close();
          process.exit(1);
        });
      });
    }).on('error', (err) => {
      console.log('❌ Health endpoint test failed:', err.message);
      server.close();
      process.exit(1);
    });
  });
}

runTests();