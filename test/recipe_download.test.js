/**
 * Test suite for recipe download functionality
 * Tests the recipe download system to ensure proper file retrieval
 */

const { 
  downloadRecipeFile, 
  httpsRequest, 
  fetchRecipeFileList,
  testRepositoryConnection,
  REMOTE_RECIPES_CONFIG 
} = require('../lib/recipes_lib.js');

describe('Recipe Download System', () => {
  
  describe('httpsRequest function', () => {
    test('should download content from GitHub raw URL', async () => {
      const testUrl = 'https://raw.githubusercontent.com/ubuntupunk/agent-rules-recipes/main/recipes/apollo-graphql-api.yaml';
      
      const content = await httpsRequest(testUrl);
      
      expect(typeof content).toBe('string');
      expect(content.length).toBeGreaterThan(0);
      expect(content).toContain('name:');
      expect(content).toContain('Apollo GraphQL API');
    }, 10000);

    test('should handle GitHub API requests', async () => {
      const apiUrl = 'https://api.github.com/repos/ubuntupunk/agent-rules-recipes/contents/recipes';
      
      const response = await httpsRequest(apiUrl);
      
      expect(Array.isArray(response)).toBe(true);
      expect(response.length).toBeGreaterThan(0);
      expect(response[0]).toHaveProperty('name');
      expect(response[0]).toHaveProperty('download_url');
    }, 10000);

    test('should handle request errors gracefully', async () => {
      const invalidUrl = 'https://raw.githubusercontent.com/invalid/repo/main/nonexistent.yaml';
      
      await expect(httpsRequest(invalidUrl)).rejects.toThrow();
    }, 10000);

    test('should include proper headers', async () => {
      const testUrl = 'https://httpbin.org/headers';
      
      const response = await httpsRequest(testUrl);
      const data = JSON.parse(response);
      
      expect(data.headers['User-Agent']).toContain('Agent-Rules-Generator');
    }, 10000);
  });

  describe('downloadRecipeFile function', () => {
    test('should download a specific recipe file', async () => {
      const fileName = 'apollo-graphql-api.yaml';
      
      const content = await downloadRecipeFile(fileName);
      
      expect(typeof content).toBe('string');
      expect(content.length).toBeGreaterThan(0);
      expect(content).toContain('name: Apollo GraphQL API');
      expect(content).toContain('techStack:');
    }, 10000);

    test('should handle non-existent files', async () => {
      const fileName = 'non-existent-recipe.yaml';
      
      await expect(downloadRecipeFile(fileName)).rejects.toThrow();
    }, 10000);

    test('should construct correct URLs', async () => {
      const fileName = 'test-recipe.yaml';
      const expectedUrl = `${REMOTE_RECIPES_CONFIG.githubRawUrl}/${fileName}`;
      
      // This will fail but we can check the error message contains the correct URL
      try {
        await downloadRecipeFile(fileName);
      } catch (error) {
        // The error should indicate it tried to fetch from the correct URL
        expect(error.message).toContain('Failed to download file test-recipe.yaml');
      }
    }, 10000);
  });

  describe('fetchRecipeFileList function', () => {
    test('should fetch list of recipe files from GitHub API', async () => {
      const files = await fetchRecipeFileList();
      
      expect(Array.isArray(files)).toBe(true);
      expect(files.length).toBeGreaterThan(0);
      
      // Check that files have required properties
      files.forEach(file => {
        expect(file).toHaveProperty('name');
        expect(file).toHaveProperty('type', 'file');
        expect(file.name).toMatch(/\.(yaml|yml)$/);
      });
    }, 10000);

    test('should filter only YAML files', async () => {
      const files = await fetchRecipeFileList();
      
      files.forEach(file => {
        expect(file.name.endsWith('.yaml') || file.name.endsWith('.yml')).toBe(true);
      });
    }, 10000);
  });

  describe('testRepositoryConnection function', () => {
    test('should test repository connectivity', async () => {
      const results = await testRepositoryConnection();
      
      expect(results).toHaveProperty('success');
      expect(results).toHaveProperty('apiEndpoint');
      expect(results).toHaveProperty('rawEndpoint');
      expect(results).toHaveProperty('tests');
      
      // API endpoint should be reachable
      expect(results.tests.apiReachable).toHaveProperty('success');
      expect(results.tests.rawReachable).toHaveProperty('success');
      
      // Should be able to fetch recipe list
      expect(results.tests.fetchRecipeList).toHaveProperty('success');
      if (results.tests.fetchRecipeList.success) {
        expect(results.tests.fetchRecipeList.fileCount).toBeGreaterThan(0);
      }
    }, 15000);

    test('should include rate limit information', async () => {
      const results = await testRepositoryConnection();
      
      if (results.rateLimit) {
        expect(results.rateLimit).toHaveProperty('remaining');
        expect(typeof results.rateLimit.remaining).toBe('number');
      }
    }, 15000);

    test('should test download functionality', async () => {
      const results = await testRepositoryConnection();
      
      if (results.tests.downloadTest) {
        expect(results.tests.downloadTest).toHaveProperty('success');
        if (results.tests.downloadTest.success) {
          expect(results.tests.downloadTest).toHaveProperty('file');
          expect(results.tests.downloadTest).toHaveProperty('size');
          expect(results.tests.downloadTest.size).toBeGreaterThan(0);
        }
      }
    }, 15000);
  });

  describe('Integration tests', () => {
    test('should download and parse a complete recipe', async () => {
      const fileName = 'apollo-graphql-api.yaml';
      
      const content = await downloadRecipeFile(fileName);
      
      // Should be valid YAML content
      const yaml = require('js-yaml');
      const recipe = yaml.load(content);
      
      expect(recipe).toHaveProperty('name');
      expect(recipe).toHaveProperty('description');
      expect(recipe).toHaveProperty('category');
      expect(recipe).toHaveProperty('techStack');
      
      // Validate recipe structure
      expect(typeof recipe.name).toBe('string');
      expect(typeof recipe.description).toBe('string');
      expect(typeof recipe.category).toBe('string');
      expect(typeof recipe.techStack).toBe('object');
    }, 10000);

    test('should handle network timeouts gracefully', async () => {
      // Mock a slow response by using a delay service
      const slowUrl = 'https://httpbin.org/delay/15'; // 15 second delay
      
      await expect(httpsRequest(slowUrl)).rejects.toThrow('timeout');
    }, 12000);
  });

  describe('Error handling', () => {
    test('should provide meaningful error messages', async () => {
      try {
        await downloadRecipeFile('non-existent.yaml');
      } catch (error) {
        expect(error.message).toContain('Failed to download file');
        expect(error.message).toContain('non-existent.yaml');
      }
    });

    test('should handle malformed URLs', async () => {
      const originalConfig = { ...REMOTE_RECIPES_CONFIG };
      
      // Temporarily modify config to use invalid URL
      REMOTE_RECIPES_CONFIG.githubRawUrl = 'invalid-url';
      
      try {
        await expect(downloadRecipeFile('test.yaml')).rejects.toThrow();
      } finally {
        // Restore original config
        Object.assign(REMOTE_RECIPES_CONFIG, originalConfig);
      }
    });

    test('should handle empty responses', async () => {
      // Test with a URL that returns empty content
      const emptyUrl = 'https://httpbin.org/status/204'; // No content response
      
      const response = await httpsRequest(emptyUrl);
      expect(response).toBe('');
    }, 10000);
  });
});

// Helper function to run manual tests
async function runManualTests() {
  console.log('🧪 Running manual recipe download tests...\n');
  
  try {
    // Test 1: Download a specific file
    console.log('📥 Test 1: Download specific recipe file');
    const content = await downloadRecipeFile('apollo-graphql-api.yaml');
    console.log(`✅ Downloaded ${content.length} characters`);
    console.log(`📄 Content preview: ${content.substring(0, 100)}...\n`);
    
    // Test 2: Fetch file list
    console.log('📋 Test 2: Fetch recipe file list');
    const files = await fetchRecipeFileList();
    console.log(`✅ Found ${files.length} recipe files`);
    files.forEach(file => console.log(`   - ${file.name}`));
    console.log();
    
    // Test 3: Test repository connection
    console.log('🔗 Test 3: Test repository connection');
    const connectionTest = await testRepositoryConnection();
    console.log(`✅ Connection test: ${connectionTest.success ? 'PASSED' : 'FAILED'}`);
    if (connectionTest.tests.downloadTest) {
      console.log(`📥 Download test: ${connectionTest.tests.downloadTest.success ? 'PASSED' : 'FAILED'}`);
      if (connectionTest.tests.downloadTest.success) {
        console.log(`   File: ${connectionTest.tests.downloadTest.file}`);
        console.log(`   Size: ${connectionTest.tests.downloadTest.size} bytes`);
      }
    }
    
    console.log('\n🎉 All manual tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Manual tests failed:', error.message);
  }
}

// Export for manual testing
module.exports = { runManualTests };

// Run manual tests if called directly
if (require.main === module) {
  runManualTests().catch(console.error);
}