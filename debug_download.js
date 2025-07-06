#!/usr/bin/env node

/**
 * Debug the specific download issue in the recipes library
 */

const https = require('https');

// Recreate the httpsRequest function with debugging
async function debugHttpsRequest(url, options = {}) {
  console.log(`🔍 Debug httpsRequest: ${url}`);
  console.log(`🔍 Options:`, options);
  
  return new Promise((resolve, reject) => {
    const headers = {
      'User-Agent': 'Agent-Rules-Generator/1.0.0',
      ...(options.headers || {})
    };

    console.log(`🔍 Final headers:`, headers);

    const req = https.request(url, { 
      method: options.method || 'GET',
      headers
    }, (res) => {
      console.log(`🔍 Response status: ${res.statusCode}`);
      console.log(`🔍 Response headers:`, res.headers);
      
      let data = '';
      
      res.on('data', (chunk) => {
        console.log(`🔍 Received chunk: ${chunk.length} bytes, type: ${typeof chunk}`);
        console.log(`🔍 Chunk preview: "${chunk.toString().substring(0, 50)}..."`);
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`🔍 Total data length: ${data.length} chars`);
        console.log(`🔍 Data type: ${typeof data}`);
        
        if (res.statusCode >= 200 && res.statusCode < 300) {
          // For HEAD requests, we don't expect a body
          if (options.method === 'HEAD') {
            resolve({ statusCode: res.statusCode, headers: res.headers });
          } else {
            try {
              // Try to parse JSON, fall back to raw data if not JSON
              const result = url.includes('api.github.com') ? JSON.parse(data) : data;
              console.log(`🔍 Returning result type: ${typeof result}, length: ${typeof result === 'string' ? result.length : 'N/A'}`);
              resolve(result);
            } catch (e) {
              console.log(`🔍 JSON parse failed, returning raw data: ${data.length} chars`);
              resolve(data);
            }
          }
        } else {
          let errorMessage = `Request failed with status ${res.statusCode}`;
          try {
            const errorData = JSON.parse(data);
            errorMessage = errorData.message || errorMessage;
          } catch (e) {}
          
          const error = new Error(errorMessage);
          error.statusCode = res.statusCode;
          error.response = data;
          reject(error);
        }
      });
    });
    
    req.on('error', (error) => {
      console.log(`🔍 Request error: ${error.message}`);
      reject(error);
    });
    
    // Set timeout
    req.setTimeout(10000, () => {
      console.log(`🔍 Request timeout`);
      req.destroy();
      reject(new Error('Request timeout after 10 seconds'));
    });
    
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    
    req.end();
  });
}

// Test the download with debugging
async function testDownload() {
  const fileName = 'apollo-graphql-api.yaml';
  const rawUrl = `https://raw.githubusercontent.com/ubuntupunk/agent-rules-recipes/main/recipes/${fileName}`;
  
  console.log('🧪 Testing download with debugging...\n');
  
  try {
    const response = await debugHttpsRequest(rawUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3.raw',
        'User-Agent': 'Agent-Rules-Generator/1.0.0'
      }
    });
    
    console.log('\n✅ Download successful!');
    console.log(`📄 Content length: ${response.length} chars`);
    console.log(`📄 Content preview:\n${response.substring(0, 200)}...`);
    
    return response;
  } catch (error) {
    console.error('\n❌ Download failed:', error.message);
    throw error;
  }
}

// Test the actual library function
async function testLibraryDownload() {
  console.log('\n🧪 Testing library download function...\n');
  
  try {
    // Import the library
    const recipesLib = require('./lib/recipes_lib.js');
    console.log('📚 Available exports:', Object.keys(recipesLib));
    
    if (recipesLib.downloadRecipeFile) {
      console.log('🔍 Found downloadRecipeFile function');
      
      const result = await recipesLib.downloadRecipeFile('apollo-graphql-api.yaml');
      console.log(`📄 Library result type: ${typeof result}`);
      console.log(`📄 Library result length: ${result ? result.length : 'null'} chars`);
      console.log(`📄 Library result preview: ${result ? result.substring(0, 100) : 'null'}...`);
      
      return result;
    } else {
      console.log('❌ downloadRecipeFile function not found in exports');
      return null;
    }
  } catch (error) {
    console.error('❌ Library test failed:', error.message);
    throw error;
  }
}

// Run tests
async function runDebugTests() {
  try {
    // Test 1: Debug version
    const debugResult = await testDownload();
    
    // Test 2: Library version
    const libraryResult = await testLibraryDownload();
    
    // Compare results
    console.log('\n📊 Comparison:');
    console.log(`Debug version: ${debugResult ? debugResult.length : 0} chars`);
    console.log(`Library version: ${libraryResult ? libraryResult.length : 0} chars`);
    
    if (debugResult && debugResult.length > 0 && (!libraryResult || libraryResult.length === 0)) {
      console.log('\n🔧 Issue identified: Library function is not working correctly');
      console.log('💡 The raw HTTPS request works, but the library wrapper has issues');
    }
    
  } catch (error) {
    console.error('Debug tests failed:', error);
  }
}

if (require.main === module) {
  runDebugTests().catch(console.error);
}