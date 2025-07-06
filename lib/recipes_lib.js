const fs = require('fs').promises;
const path = require('path');
const https = require('https');
const yaml = require('js-yaml');
const os = require('os');

// Configuration for remote recipes
const REMOTE_RECIPES_CONFIG = {
  // GitHub API endpoint for recipes directory
  githubApiUrl: 'https://api.github.com/repos/ubuntupunk/agent-rules-recipes/contents/recipes',
  // Raw GitHub URL for downloading recipe files
  githubRawUrl: 'https://raw.githubusercontent.com/ubuntupunk/agent-rules-recipes/main/recipes',
  // Local cache directory
  cacheDir: path.join(os.homedir(), '.agent-rules-cache'),
  // Cache expiration time (in milliseconds) - 24 hours
  cacheExpiration: 24 * 60 * 60 * 1000,
  // Fallback to local recipes if remote fails
  fallbackToLocal: true
};

/**
 * Ensures the cache directory exists
 */
async function ensureCacheDir() {
  try {
    await fs.mkdir(REMOTE_RECIPES_CONFIG.cacheDir, { recursive: true });
  } catch (error) {
    console.warn('Warning: Could not create cache directory');
  }
}

/**
 * Makes an HTTPS request and returns the response data
 * @param {string} url - URL to fetch
 * @param {Object} options - Request options
 * @returns {Promise<string>} Response data
 */
async function httpsRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const headers = {
      'User-Agent': 'Agent-Rules-Generator/1.0.0',
      ...(options.headers || {})
    };

    // Add GitHub token if available
    const githubToken = process.env.GITHUB_TOKEN;
    if (githubToken && url.includes('api.github.com')) {
      headers['Authorization'] = `token ${githubToken}`;
    }

    const req = https.request(url, { 
      method: options.method || 'GET',
      headers
    }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          // For HEAD requests, we don't expect a body
          if (options.method === 'HEAD') {
            resolve({ statusCode: res.statusCode, headers: res.headers });
          } else {
            try {
              // Try to parse JSON, fall back to raw data if not JSON
              const result = url.includes('api.github.com') ? JSON.parse(data) : data;
              resolve(result);
            } catch (e) {
              resolve(data);
            }
          }
        } else {
          let errorMessage = `Request failed with status ${res.statusCode}`;
          try {
            const errorData = JSON.parse(data);
            errorMessage = errorData.message || errorMessage;
            if (errorData.documentation_url) {
              errorMessage += `\nDocumentation: ${errorData.documentation_url}`;
            }
          } catch (e) {}
          
          const error = new Error(errorMessage);
          error.statusCode = res.statusCode;
          error.response = data;
          reject(error);
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    // Set timeout
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout after 10 seconds'));
    });
    
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    
    req.end();
  });
}

/**
 * Downloads a recipe file from the remote repository
 * @param {string} fileName - Name of the recipe file
 * @returns {Promise<string>} Recipe file content
 */
async function downloadRecipeFile(fileName) {
  // Construct the raw content URL
  const rawUrl = `${REMOTE_RECIPES_CONFIG.githubRawUrl}/${fileName}`;
  
  try {
    // Make a direct request to the raw content URL
    const response = await httpsRequest(rawUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3.raw',
        'User-Agent': 'Agent-Rules-Generator/1.0.0'
      }
    });
    
    if (!response) {
      throw new Error('Received empty response from server');
    }
    
    return response;
  } catch (error) {
    const enhancedError = new Error(`Failed to download file ${fileName}: ${error.message}`);
    enhancedError.originalError = error;
    enhancedError.fileName = fileName;
    console.error(`Failed to download file ${fileName}:`, error.message);
    throw enhancedError;
  }
}

/**
 * Gets the cache file path for a recipe
 * @param {string} fileName - Recipe file name
 * @returns {string} Cache file path
 */
function getCacheFilePath(fileName) {
  return path.join(REMOTE_RECIPES_CONFIG.cacheDir, fileName);
}

/**
 * Gets the cache metadata file path
 * @returns {string} Cache metadata file path
 */
function getCacheMetadataPath() {
  return path.join(REMOTE_RECIPES_CONFIG.cacheDir, 'cache-metadata.json');
}

/**
 * Checks if the cache is still valid
 * @returns {Promise<boolean>} True if cache is valid
 */
async function isCacheValid() {
  try {
    const metadataPath = getCacheMetadataPath();
    const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf8'));
    const now = Date.now();
    return (now - metadata.lastUpdate) < REMOTE_RECIPES_CONFIG.cacheExpiration;
  } catch (error) {
    return false;
  }
}

/**
 * Updates the cache metadata
 * @param {Array} recipeFiles - List of recipe files
 */
async function updateCacheMetadata(recipeFiles) {
  try {
    const metadata = {
      lastUpdate: Date.now(),
      recipeFiles: recipeFiles.map(file => ({
        name: file.name,
        sha: file.sha
      }))
    };
    
    const metadataPath = getCacheMetadataPath();
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
  } catch (error) {
    console.warn('Warning: Could not update cache metadata');
  }
}

/**
 * Loads recipes from cache
 * @returns {Promise<Object>} Cached recipes
 */
async function loadCachedRecipes() {
  try {
    const cacheDir = REMOTE_RECIPES_CONFIG.cacheDir;
    const files = await fs.readdir(cacheDir);
    const recipes = {};
    
    for (const file of files) {
      if (file.endsWith('.yml') || file.endsWith('.yaml')) {
        const filePath = path.join(cacheDir, file);
        const content = await fs.readFile(filePath, 'utf8');
        const recipe = yaml.load(content);
        const recipeName = path.basename(file, path.extname(file));
        recipes[recipeName] = recipe;
      }
    }
    
    return recipes;
  } catch (error) {
    return {};
  }
}

/**
 * Loads local recipes as fallback
 * @returns {Promise<Object>} Local recipes
 */
async function loadLocalRecipes() {
  try {
    const recipesDir = path.join(__dirname, '..', 'recipes');
    const files = await fs.readdir(recipesDir);
    const recipes = {};
    
    for (const file of files) {
      if (file.endsWith('.yml') || file.endsWith('.yaml')) {
        const filePath = path.join(recipesDir, file);
        const content = await fs.readFile(filePath, 'utf8');
        const recipe = yaml.load(content);
        const recipeName = path.basename(file, path.extname(file));
        recipes[recipeName] = recipe;
      }
    }
    
    return recipes;
  } catch (error) {
    return {};
  }
}

/**
 * Fetches and caches recipes from the remote repository
 * @returns {Promise<Object>} Remote recipes
 */
async function fetchAndCacheRemoteRecipes() {
  try {
    console.log('Fetching recipes from remote repository...');
    
    await ensureCacheDir();
    const recipeFiles = await fetchRecipeFileList();
    
    if (recipeFiles.length === 0) {
      throw new Error('No recipe files found in remote repository');
    }
    
    const recipes = {};
    
    for (const fileInfo of recipeFiles) {
      try {
        const content = await downloadRecipeFile(fileInfo.name);
        const recipe = yaml.load(content);
        const recipeName = path.basename(fileInfo.name, path.extname(fileInfo.name));
        
        // Validate recipe structure
        if (validateRecipe(recipe)) {
          recipes[recipeName] = recipe;
          
          // Cache the recipe file
          const cacheFilePath = getCacheFilePath(fileInfo.name);
          await fs.writeFile(cacheFilePath, content);
        } else {
          console.warn(`Warning: Invalid recipe structure in ${fileInfo.name}`);
        }
      } catch (error) {
        console.warn(`Warning: Could not load recipe ${fileInfo.name}: ${error.message}`);
      }
    }
    
    // Update cache metadata
    await updateCacheMetadata(recipeFiles);
    
    console.log(`Successfully loaded ${Object.keys(recipes).length} recipes from remote repository`);
    return recipes;
    
  } catch (error) {
    console.warn(`Warning: Could not fetch remote recipes: ${error.message}`);
    return {};
  }
}

/**
 * Loads all available recipes with intelligent caching and fallback
 * @param {boolean} forceRefresh - Force refresh from remote repository
 * @returns {Promise<Object>} Object containing all loaded recipes
 */
async function loadRecipes(forceRefresh = false) {
  let recipes = {};
  
  // Try to load from cache first if not forcing refresh
  if (!forceRefresh && await isCacheValid()) {
    console.log('Loading recipes from cache...');
    recipes = await loadCachedRecipes();
    
    if (Object.keys(recipes).length > 0) {
      return recipes;
    }
  }
  
  // Try to fetch from remote repository
  recipes = await fetchAndCacheRemoteRecipes();
  
  // If remote fetch failed or returned no recipes, try cache
  if (Object.keys(recipes).length === 0) {
    console.log('Falling back to cached recipes...');
    recipes = await loadCachedRecipes();
  }
  
  // If still no recipes and fallback is enabled, try local recipes
  if (Object.keys(recipes).length === 0 && REMOTE_RECIPES_CONFIG.fallbackToLocal) {
    console.log('Falling back to local recipes...');
    recipes = await loadLocalRecipes();
  }
  
  if (Object.keys(recipes).length === 0) {
    console.warn('Warning: No recipes could be loaded from any source');
  }
  
  return recipes;
}

/**
 * Forces a refresh of recipes from the remote repository
 * @returns {Promise<Object>} Fresh recipes from remote repository
 */
async function refreshRecipes() {
  return await loadRecipes(true);
}

/**
 * Clears the local recipe cache
 */
async function clearCache() {
  try {
    const cacheDir = REMOTE_RECIPES_CONFIG.cacheDir;
    const files = await fs.readdir(cacheDir);
    
    for (const file of files) {
      await fs.unlink(path.join(cacheDir, file));
    }
    
    console.log('Recipe cache cleared successfully');
  } catch (error) {
    console.warn('Warning: Could not clear recipe cache');
  }
}

/**
 * Gets cache information
 * @returns {Promise<Object>} Cache information
 */
async function getCacheInfo() {
  try {
    const metadataPath = getCacheMetadataPath();
    const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf8'));
    const cacheAge = Date.now() - metadata.lastUpdate;
    
    return {
      lastUpdate: new Date(metadata.lastUpdate),
      cacheAge: cacheAge,
      isValid: cacheAge < REMOTE_RECIPES_CONFIG.cacheExpiration,
      recipeCount: metadata.recipeFiles.length,
      cacheDir: REMOTE_RECIPES_CONFIG.cacheDir
    };
  } catch (error) {
    return {
      lastUpdate: null,
      cacheAge: null,
      isValid: false,
      recipeCount: 0,
      cacheDir: REMOTE_RECIPES_CONFIG.cacheDir
    };
  }
}

/**
 * Searches for recipes matching given criteria
 * @param {string} query - Search query
 * @param {Object} recipes - Object containing all recipes
 * @returns {Array} Array of matching recipe keys
 */
function searchRecipes(query, recipes) {
  const searchTerm = query.toLowerCase();
  const matches = [];
  
  for (const [key, recipe] of Object.entries(recipes)) {
    const searchableText = [
      recipe.name,
      recipe.description,
      recipe.category,
      JSON.stringify(recipe.techStack),
      JSON.stringify(recipe.tags || [])
    ].join(' ').toLowerCase();
    
    if (searchableText.includes(searchTerm)) {
      matches.push(key);
    }
  }
  
  return matches;
}

/**
 * Gets a specific recipe by name
 * @param {string} recipeName - Name of the recipe to get
 * @returns {Promise<Object|null>} Recipe object or null if not found
 */
async function getRecipe(recipeName) {
  const recipes = await loadRecipes();
  return recipes[recipeName] || null;
}

/**
 * Lists all available recipes with basic info
 * @returns {Promise<Array>} Array of recipe summaries
 */
async function listRecipes() {
  const recipes = await loadRecipes();
  return Object.entries(recipes).map(([key, recipe]) => ({
    key,
    name: recipe.name,
    description: recipe.description,
    category: recipe.category,
    tags: recipe.tags || []
  }));
}

/**
 * Validates a recipe structure
 * @param {Object} recipe - Recipe object to validate
 * @returns {boolean} True if valid, false otherwise
 */
function validateRecipe(recipe) {
  const requiredFields = ['name', 'description', 'category', 'techStack'];
  
  for (const field of requiredFields) {
    if (!recipe[field]) {
      return false;
    }
  }
  
  return true;
}

/**
 * Updates the remote recipes configuration
 * @param {Object} config - New configuration options
 */
function updateRemoteConfig(config) {
  Object.assign(REMOTE_RECIPES_CONFIG, config);
}

/**
 * Tests the connection to the remote repository with detailed validation
 * @returns {Promise<Object>} Test results with status and details
 */
async function testRepositoryConnection() {
  const results = {
    apiEndpoint: REMOTE_RECIPES_CONFIG.githubApiUrl,
    rawEndpoint: REMOTE_RECIPES_CONFIG.githubRawUrl,
    tests: {},
    success: false,
    error: null
  };

  try {
    // Test 1: Check if API endpoint is reachable
    results.tests.apiReachable = await testEndpointReachability(REMOTE_RECIPES_CONFIG.githubApiUrl);
    
    // Test 2: Check if raw endpoint is reachable by testing a known file
    const testRawFile = 'react_recipe.yaml'; // Replace with a known file in your repository
    const testRawUrl = `${REMOTE_RECIPES_CONFIG.githubRawUrl}/${testRawFile}`;
    results.tests.rawReachable = await testEndpointReachability(testRawUrl);
    
    // Test 3: Check GitHub rate limits
    const rateLimit = await checkRateLimit();
    results.rateLimit = rateLimit;
    results.tests.rateLimit = rateLimit.remaining > 0;
    
    // Test 4: Try to fetch recipe list
    try {
      const startTime = Date.now();
      const files = await fetchRecipeFileList();
      results.tests.fetchRecipeList = {
        success: true,
        fileCount: files.length,
        duration: Date.now() - startTime
      };
      
      // If we have files, try to download one as a test
      if (files.length > 0) {
        const testFile = files[0];
        try {
          const content = await downloadRecipeFile(testFile.name);
          results.tests.downloadTest = {
            success: true,
            file: testFile.name,
            size: content.length
          };
        } catch (error) {
          results.tests.downloadTest = {
            success: false,
            error: error.message,
            file: testFile.name
          };
          throw new Error(`Failed to download test file: ${error.message}`);
        }
      }
      
      results.success = true;
    } catch (error) {
      results.tests.fetchRecipeList = {
        success: false,
        error: error.message
      };
      throw error;
    }
  } catch (error) {
    results.error = error.message;
    results.success = false;
  }
  
  return results;
}

/**
 * Tests if an endpoint is reachable
 * @private
 * @param {string} url - URL to test
 * @returns {Promise<Object>} Reachability test results
 */
async function testEndpointReachability(url) {
  const startTime = Date.now();
  try {
    const response = await httpsRequest(url, { method: 'HEAD' });
    return {
      success: true,
      statusCode: response.statusCode,
      duration: Date.now() - startTime
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      duration: Date.now() - startTime
    };
  }
}

/**
 * Checks GitHub API rate limits
 * @private
 * @returns {Promise<Object>} Rate limit information
 */
async function checkRateLimit() {
  try {
    const response = await httpsRequest('https://api.github.com/rate_limit');
    const data = JSON.parse(response);
    return {
      limit: data.resources.core.limit,
      remaining: data.resources.core.remaining,
      reset: new Date(data.resources.core.reset * 1000).toISOString(),
      used: data.resources.core.used
    };
  } catch (error) {
    return {
      error: error.message,
      remaining: 0
    };
  }
}

/**
 * Fetches the list of recipe files from GitHub API
 * @returns {Promise<Array>} Array of recipe file information
 */
async function fetchRecipeFileList() {
  try {
    const files = await httpsRequest(REMOTE_RECIPES_CONFIG.githubApiUrl);
    
    if (!Array.isArray(files)) {
      console.warn('Warning: Unexpected response format from GitHub API');
      return [];
    }

    const recipeFiles = files.filter(file => {
      // Check if file has the required properties and is a YAML file
      return file && 
             file.type === 'file' && 
             file.name && 
             (file.name.endsWith('.yaml') || file.name.endsWith('.yml'));
    });

    console.log(`Found ${recipeFiles.length} recipe files`);
    return recipeFiles;
  } catch (error) {
    console.warn('Warning: Could not fetch recipe list from remote repository');
    console.error('Error details:', error.message);
    return [];
  }
}

module.exports = {
  loadRecipes,
  refreshRecipes,
  clearCache,
  getCacheInfo,
  searchRecipes,
  getRecipe,
  listRecipes,
  validateRecipe,
  updateRemoteConfig,
  testRepositoryConnection,
  REMOTE_RECIPES_CONFIG,
  // Export internal functions for testing and debugging
  downloadRecipeFile,
  httpsRequest,
  fetchRecipeFileList,
  ensureCacheDir,
  loadCachedRecipes,
  loadLocalRecipes,
  fetchAndCacheRemoteRecipes
};