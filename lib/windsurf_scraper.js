#!/usr/bin/env node

/**
 * Simple Windsurf Rules Scraper
 * Direct extraction of code blocks from windsurf directory
 */

const https = require('https');
const fs = require('fs').promises;
const path = require('path');
const yaml = require('js-yaml');

function httpsRequest(url) {
  return new Promise((resolve, reject) => {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (compatible; Agent-Rules-Generator-Scraper/1.0)',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    };

    const req = https.request(url, { headers }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data);
        } else {
          reject(new Error(`Status ${res.statusCode}: ${data}`));
        }
      });
    });
    
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
    req.end();
  });
}

function extractRulesFromHtml(html) {
  const rules = [];
  
  // Find all code blocks
  const codeBlockRegex = /<code[^>]*>([\s\S]*?)<\/code>/g;
  let match;
  let ruleIndex = 1;
  
  while ((match = codeBlockRegex.exec(html)) !== null) {
    let content = match[1]
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/&#39;/g, "'")
      .trim();
    
    // Check if this looks like windsurfrules content
    if (content.length > 50 && 
        (content.includes('# ') || content.includes('## ') || 
         content.includes('- ') || content.includes('Use ') ||
         content.includes('Follow ') || content.includes('Prefer '))) {
      
      // Try to extract a title from the content or nearby HTML
      let title = `Windsurf Rules ${ruleIndex}`;
      
      // Look for common patterns that might indicate the project type
      if (content.toLowerCase().includes('react')) {
        title = `React Project Rules ${ruleIndex}`;
      } else if (content.toLowerCase().includes('vue')) {
        title = `Vue Project Rules ${ruleIndex}`;
      } else if (content.toLowerCase().includes('python')) {
        title = `Python Project Rules ${ruleIndex}`;
      } else if (content.toLowerCase().includes('typescript')) {
        title = `TypeScript Project Rules ${ruleIndex}`;
      } else if (content.toLowerCase().includes('expo')) {
        title = `Expo React Native Rules ${ruleIndex}`;
      } else if (content.toLowerCase().includes('prisma')) {
        title = `Prisma Database Rules ${ruleIndex}`;
      } else if (content.toLowerCase().includes('matplotlib')) {
        title = `Python Data Science Rules ${ruleIndex}`;
      }
      
      rules.push({
        title,
        content,
        index: ruleIndex
      });
      
      ruleIndex++;
    }
  }
  
  return rules;
}

function convertToRecipe(rule) {
  const content = rule.content.toLowerCase();
  
  // Detect project type
  let projectType = 'Web Application';
  if (content.includes('cli') || content.includes('command')) {
    projectType = 'CLI Tool';
  } else if (content.includes('mobile') || content.includes('react native') || content.includes('expo')) {
    projectType = 'Mobile App';
  } else if (content.includes('electron') || content.includes('desktop')) {
    projectType = 'Desktop App';
  } else if (content.includes('api') || content.includes('backend') || content.includes('server')) {
    projectType = 'API/Backend';
  } else if (content.includes('library') || content.includes('package') || content.includes('npm')) {
    projectType = 'Library/Package';
  }
  
  // Detect technologies
  const techStack = {};
  
  // Frontend frameworks
  if (content.includes('react')) techStack.frontend = 'React';
  else if (content.includes('vue')) techStack.frontend = 'Vue';
  else if (content.includes('angular')) techStack.frontend = 'Angular';
  else if (content.includes('svelte')) techStack.frontend = 'Svelte';
  
  // Backend frameworks
  if (content.includes('express')) techStack.backend = 'Express';
  else if (content.includes('fastapi')) techStack.backend = 'FastAPI';
  else if (content.includes('django')) techStack.backend = 'Django';
  else if (content.includes('spring')) techStack.backend = 'Spring Boot';
  else if (content.includes('node')) techStack.backend = 'Node.js';
  
  // Languages
  if (content.includes('typescript')) techStack.language = 'TypeScript';
  else if (content.includes('javascript')) techStack.language = 'JavaScript';
  else if (content.includes('python')) techStack.language = 'Python';
  else if (content.includes('java')) techStack.language = 'Java';
  else if (content.includes('rust')) techStack.language = 'Rust';
  
  // Databases
  if (content.includes('prisma')) techStack.database = 'Prisma';
  else if (content.includes('postgresql') || content.includes('postgres')) techStack.database = 'PostgreSQL';
  else if (content.includes('mongodb') || content.includes('mongo')) techStack.database = 'MongoDB';
  else if (content.includes('mysql')) techStack.database = 'MySQL';
  else if (content.includes('sqlite')) techStack.database = 'SQLite';
  
  // Mobile specific
  if (content.includes('expo')) techStack.mobileFramework = 'Expo';
  if (content.includes('react native')) techStack.mobileFramework = 'React Native';
  
  // Data science
  if (content.includes('matplotlib')) techStack.tools = 'Matplotlib, Data Science';
  
  // Create recipe
  const recipe = {
    name: rule.title,
    description: `Windsurf rules extracted from directory - ${rule.title}`,
    category: projectType,
    tags: ['windsurf', 'scraped', 'directory'],
    techStack,
    source: {
      type: 'windsurf-directory',
      url: 'https://windsurf.com/editor/directory',
      scrapedAt: new Date().toISOString(),
      index: rule.index
    },
    windsurfRules: rule.content
  };
  
  return recipe;
}

async function saveRecipe(recipe, outputDir) {
  // Create filename from recipe name
  const filename = recipe.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') + '.yaml';
  
  const filepath = path.join(outputDir, filename);
  
  try {
    const yamlContent = yaml.dump(recipe, {
      indent: 2,
      lineWidth: 100,
      noRefs: true
    });
    
    await fs.writeFile(filepath, yamlContent, 'utf8');
    console.log(`✅ Saved recipe: ${filename}`);
    return filepath;
  } catch (error) {
    console.error(`❌ Error saving recipe ${filename}: ${error.message}`);
    return null;
  }
}

async function scrapeWindsurfRules() {
  console.log('🌊 Simple Windsurf Rules Scraper\n');
  
  try {
    // Create output directory
    const outputDir = path.join(__dirname, '..', 'windsurf_recipes');
    await fs.mkdir(outputDir, { recursive: true });
    
    // Fetch the directory page
    console.log('📡 Fetching Windsurf directory...');
    const html = await httpsRequest('https://windsurf.com/editor/directory');
    
    // Extract rules from HTML
    console.log('🔍 Extracting rules from HTML...');
    const rules = extractRulesFromHtml(html);
    console.log(`📋 Found ${rules.length} rule sets\n`);
    
    if (rules.length === 0) {
      console.log('⚠️ No rules found. The page structure might have changed.');
      return;
    }
    
    const results = {
      processed: 0,
      saved: 0,
      errors: 0,
      recipes: []
    };
    
    // Process each rule set
    for (const rule of rules) {
      console.log(`📄 Processing: ${rule.title}`);
      results.processed++;
      
      try {
        // Convert to recipe format
        const recipe = convertToRecipe(rule);
        
        // Save recipe
        const savedPath = await saveRecipe(recipe, outputDir);
        if (savedPath) {
          results.saved++;
          results.recipes.push(recipe.name);
        }
        
        // Save raw content for debugging
        const rawFilename = `${rule.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-raw.txt`;
        const rawPath = path.join(outputDir, rawFilename);
        await fs.writeFile(rawPath, rule.content, 'utf8');
        
      } catch (error) {
        console.error(`❌ Error processing ${rule.title}: ${error.message}`);
        results.errors++;
      }
    }
    
    // Summary
    console.log('\n📊 Scraping Results:');
    console.log('==================');
    console.log(`📄 Rule sets processed: ${results.processed}`);
    console.log(`💾 Recipes saved: ${results.saved}`);
    console.log(`❌ Errors: ${results.errors}`);
    
    if (results.recipes.length > 0) {
      console.log('\n🍳 Created recipes:');
      results.recipes.forEach(name => console.log(`   - ${name}`));
    }
    
    console.log(`\n📁 Output directory: ${outputDir}`);
    
  } catch (error) {
    console.error('❌ Scraping failed:', error.message);
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
🌊 Simple Windsurf Rules Scraper

Usage: node scripts/simple_windsurf_scraper.js [options]

Options:
  --help, -h     Show this help message
  --test         Test extraction without saving

Examples:
  node scripts/simple_windsurf_scraper.js
  node scripts/simple_windsurf_scraper.js --test
`);
    return;
  }
  
  if (args.includes('--test')) {
    console.log('🧪 Test mode - extracting rules without saving\n');
    
    try {
      const html = await httpsRequest('https://windsurf.com/editor/directory');
      const rules = extractRulesFromHtml(html);
      
      console.log(`📋 Found ${rules.length} rule sets:`);
      rules.forEach((rule, i) => {
        console.log(`\n${i + 1}. ${rule.title}`);
        console.log(`   Length: ${rule.content.length} characters`);
        console.log(`   Preview: ${rule.content.substring(0, 100)}...`);
      });
      
    } catch (error) {
      console.error('❌ Test failed:', error.message);
    }
    
    return;
  }
  
  await scrapeWindsurfRules();
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

// Export functions for CLI integration
module.exports = {
  fetchWindsurfRecipes,
  getWindsurfRecipe,
  listWindsurfRecipes,
  searchWindsurfRecipes,
  refreshWindsurfRecipes,
  getWindsurfCacheInfo,
  clearWindsurfCache,
  // Export internal functions for testing
  extractRulesFromHtml,
  convertToRecipe
};
/**
 * Get Windsurf recipe by key
 */
async function getWindsurfRecipe(key) {
  const recipes = await fetchWindsurfRecipes();
  return recipes[key] || null;
}

/**
 * List all available Windsurf recipes
 */
async function listWindsurfRecipes() {
  const recipes = await fetchWindsurfRecipes();
  return Object.keys(recipes).map(key => ({
    key,
    name: recipes[key].name,
    description: recipes[key].description,
    category: recipes[key].category,
    techStack: recipes[key].techStack
  }));
}

/**
 * Search Windsurf recipes
 */
async function searchWindsurfRecipes(query) {
  const recipes = await fetchWindsurfRecipes();
  const searchTerm = query.toLowerCase();
  
  return Object.entries(recipes)
    .filter(([key, recipe]) => {
      const searchableText = [
        recipe.name,
        recipe.description,
        recipe.category,
        JSON.stringify(recipe.techStack),
        recipe.windsurfRules
      ].join(" ").toLowerCase();
      
      return searchableText.includes(searchTerm);
    })
    .map(([key]) => key);
}

/**
 * Fetch Windsurf recipes (main function)
 */
async function fetchWindsurfRecipes() {
  const outputDir = path.join(__dirname, "..", "windsurf_recipes");
  
  try {
    // Check if we have cached recipes
    const recipesPath = path.join(outputDir, "recipes.json");
    try {
      const cachedData = await fs.readFile(recipesPath, "utf8");
      const cached = JSON.parse(cachedData);
      
      // Check if cache is recent (less than 7 days old)
      const cacheAge = Date.now() - new Date(cached.timestamp).getTime();
      const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
      
      if (cacheAge < maxAge) {
        return cached.recipes;
      }
    } catch (error) {
      // No cache or invalid cache, continue to fetch
    }
    
    // Fetch fresh data
    const html = await httpsRequest("https://windsurf.com/editor/directory");
    const rules = extractRulesFromHtml(html);
    
    const recipes = {};
    rules.forEach((rule, index) => {
      const recipe = convertToRecipe(rule);
      const key = `windsurf-${index + 1}`;
      recipes[key] = recipe;
    });
    
    // Cache the results
    await fs.mkdir(outputDir, { recursive: true });
    const cacheData = {
      timestamp: new Date().toISOString(),
      recipes: recipes
    };
    await fs.writeFile(recipesPath, JSON.stringify(cacheData, null, 2), "utf8");
    
    return recipes;
    
  } catch (error) {
    console.warn("Failed to fetch Windsurf recipes:", error.message);
    
    // Try to return cached data even if expired
    try {
      const recipesPath = path.join(outputDir, "recipes.json");
      const cachedData = await fs.readFile(recipesPath, "utf8");
      const cached = JSON.parse(cachedData);
      return cached.recipes;
    } catch (cacheError) {
      return {};
    }
  }
}

/**
 * Refresh Windsurf recipes (force fetch)
 */
async function refreshWindsurfRecipes() {
  const outputDir = path.join(__dirname, "..", "windsurf_recipes");
  const recipesPath = path.join(outputDir, "recipes.json");
  
  try {
    // Remove cache to force refresh
    await fs.unlink(recipesPath);
  } catch (error) {
    // Cache does not exist, which is fine
  }
  
  return await fetchWindsurfRecipes();
}

/**
 * Get cache information
 */
async function getWindsurfCacheInfo() {
  const outputDir = path.join(__dirname, "..", "windsurf_recipes");
  const recipesPath = path.join(outputDir, "recipes.json");
  
  try {
    const stats = await fs.stat(recipesPath);
    const cachedData = await fs.readFile(recipesPath, "utf8");
    const cached = JSON.parse(cachedData);
    
    const age = Date.now() - new Date(cached.timestamp).getTime();
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
    
    return {
      exists: true,
      lastUpdated: cached.timestamp,
      recipeCount: Object.keys(cached.recipes).length,
      ageMs: age,
      isValid: age < maxAge,
      cacheDir: outputDir
    };
  } catch (error) {
    return {
      exists: false,
      cacheDir: outputDir
    };
  }
}

/**
 * Clear cache
 */
async function clearWindsurfCache() {
  const outputDir = path.join(__dirname, "..", "windsurf_recipes");
  
  try {
    await fs.rm(outputDir, { recursive: true, force: true });
    return true;
  } catch (error) {
    return false;
  }
}

