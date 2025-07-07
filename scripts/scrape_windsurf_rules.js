#!/usr/bin/env node

/**
 * Windsurf Rules Scraper
 * Scrapes .windsurfrules from https://windsurf.com/editor/directory
 * and converts them into recipes for our system
 */

const https = require('https');
const fs = require('fs').promises;
const path = require('path');
const yaml = require('js-yaml');

// Configuration
const WINDSURF_DIRECTORY_URL = 'https://windsurf.com/editor/directory';
const OUTPUT_DIR = path.join(__dirname, '..', 'scraped_windsurf_rules');
const RECIPES_DIR = path.join(__dirname, '..', 'recipes');

/**
 * Make HTTPS request with proper headers
 */
function httpsRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (compatible; Agent-Rules-Generator-Scraper/1.0)',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      ...options.headers
    };

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
          resolve(data);
        } else {
          reject(new Error(`Request failed with status ${res.statusCode}: ${data}`));
        }
      });
    });
    
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.end();
  });
}

/**
 * Parse HTML to extract project information and .windsurfrules content
 */
function parseWindsurfDirectory(html) {
  const projects = [];
  
  // The content appears to be in code blocks with rules
  // Look for patterns like: <h3>Title</h3>....<code>rules content</code>
  
  // First, find all project sections with titles and code blocks
  const projectSections = [];
  
  // Look for any headings (h1, h2, h3, h4) that might contain project titles
  const headingRegex = /<h[1-6][^>]*>([^<]+)<\/h[1-6]>/g;
  let titleMatch;
  
  while ((titleMatch = headingRegex.exec(html)) !== null) {
    const title = titleMatch[1].trim();
    const titleIndex = titleMatch.index;
    
    // Skip if title is too generic or short
    if (title.length < 3 || ['Home', 'Directory', 'Examples', 'Templates'].includes(title)) {
      continue;
    }
    
    // Look for the next code block after this title (within 2000 characters)
    const remainingHtml = html.substring(titleIndex, titleIndex + 2000);
    const codeMatch = remainingHtml.match(/<code[^>]*>([\s\S]*?)<\/code>/);
    
    if (codeMatch) {
      const rulesContent = codeMatch[1]
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'")
        .replace(/&#39;/g, "'")
        .trim();
      
      // Only include if it looks like substantial rules content
      if (rulesContent.length > 30 && 
          (rulesContent.includes('#') || rulesContent.includes('-') || rulesContent.includes('rules'))) {
        projects.push({
          title: title,
          description: `Windsurf rules for ${title}`,
          rulesContent: rulesContent,
          source: 'windsurf-directory'
        });
      }
    }
  }
  
  // Also try to find code blocks directly and extract nearby titles
  const codeBlockRegex = /<code[^>]*>([\s\S]*?)<\/code>/g;
  let codeMatch;
  
  while ((codeMatch = codeBlockRegex.exec(html)) !== null) {
    const rulesContent = codeMatch[1]
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/&#39;/g, "'")
      .trim();
    
    // Check if this looks like windsurfrules content
    if (rulesContent.length > 50 && 
        (rulesContent.includes('# ') || rulesContent.includes('## ') || 
         rulesContent.includes('- ') || rulesContent.toLowerCase().includes('rules'))) {
      
      // Try to find a title before this code block
      const beforeCode = html.substring(Math.max(0, codeMatch.index - 1000), codeMatch.index);
      const titleMatch = beforeCode.match(/<h[1-6][^>]*>([^<]+)<\/h[1-6]>(?!.*<h[1-6])/);
      
      const title = titleMatch ? titleMatch[1].trim() : `Windsurf Rules ${projects.length + 1}`;
      
      // Check if we already have this content
      const isDuplicate = projects.some(p => p.rulesContent === rulesContent);
      
      if (!isDuplicate) {
        projects.push({
          title: title,
          description: `Windsurf rules for ${title}`,
          rulesContent: rulesContent,
          source: 'windsurf-directory'
        });
      }
    }
  }
  
  return projects;
}

/**
 * Extract .windsurfrules content from a project (now handled in parseWindsurfDirectory)
 */
async function extractWindsurfRules(project) {
  // Since we're getting the rules content directly from the directory page,
  // we don't need to make additional requests
  return project.rulesContent || null;
}

/**
 * Convert windsurfrules content to our recipe format
 */
function convertToRecipe(project, rulesContent) {
  // Analyze the content to determine project type and tech stack
  const content = rulesContent.toLowerCase();
  
  // Detect project type
  let projectType = 'Web Application';
  if (content.includes('cli') || content.includes('command')) {
    projectType = 'CLI Tool';
  } else if (content.includes('mobile') || content.includes('react native') || content.includes('flutter')) {
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
  if (content.includes('postgresql') || content.includes('postgres')) techStack.database = 'PostgreSQL';
  else if (content.includes('mongodb') || content.includes('mongo')) techStack.database = 'MongoDB';
  else if (content.includes('mysql')) techStack.database = 'MySQL';
  else if (content.includes('sqlite')) techStack.database = 'SQLite';
  
  // Build tools
  if (content.includes('vite')) techStack.tools = 'Vite';
  else if (content.includes('webpack')) techStack.tools = 'Webpack';
  else if (content.includes('rollup')) techStack.tools = 'Rollup';
  
  // Testing
  if (content.includes('jest')) techStack.testing = 'Jest';
  else if (content.includes('cypress')) techStack.testing = 'Cypress';
  else if (content.includes('vitest')) techStack.testing = 'Vitest';
  
  // Create recipe
  const recipe = {
    name: project.title,
    description: project.description || `Windsurf rules for ${project.title}`,
    category: projectType,
    tags: ['windsurf', 'scraped'],
    techStack,
    source: {
      type: 'windsurf-directory',
      url: project.url,
      scrapedAt: new Date().toISOString()
    },
    windsurfRules: rulesContent
  };
  
  return recipe;
}

/**
 * Save recipe to file
 */
async function saveRecipe(recipe) {
  // Create filename from recipe name
  const filename = recipe.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') + '-windsurf.yaml';
  
  const filepath = path.join(RECIPES_DIR, filename);
  
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

/**
 * Main scraping function
 */
async function scrapeWindsurfRules() {
  console.log('🌊 Starting Windsurf Rules Scraper\n');
  
  try {
    // Create output directories
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    await fs.mkdir(RECIPES_DIR, { recursive: true });
    
    // Fetch the directory page
    console.log('📡 Fetching Windsurf directory...');
    const directoryHtml = await httpsRequest(WINDSURF_DIRECTORY_URL);
    
    // Parse projects from directory
    console.log('🔍 Parsing project listings...');
    const projects = parseWindsurfDirectory(directoryHtml);
    console.log(`📋 Found ${projects.length} potential projects\n`);
    
    if (projects.length === 0) {
      console.log('⚠️ No projects found. The page structure might have changed.');
      console.log('💡 Consider updating the parsing logic or checking the URL.');
      return;
    }
    
    const results = {
      scraped: 0,
      saved: 0,
      errors: 0,
      recipes: []
    };
    
    // Process each project
    for (let i = 0; i < Math.min(projects.length, 20); i++) { // Process more since we're not making additional requests
      const project = projects[i];
      console.log(`📄 Processing: ${project.title}`);
      
      try {
        // Extract windsurfrules content (already available in project object)
        const rulesContent = await extractWindsurfRules(project);
        
        if (rulesContent) {
          results.scraped++;
          
          // Convert to recipe format
          const recipe = convertToRecipe(project, rulesContent);
          
          // Save recipe
          const savedPath = await saveRecipe(recipe);
          if (savedPath) {
            results.saved++;
            results.recipes.push(recipe.name);
          }
          
          // Save raw content for debugging
          const rawFilename = `${recipe.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-raw.txt`;
          const rawPath = path.join(OUTPUT_DIR, rawFilename);
          await fs.writeFile(rawPath, rulesContent, 'utf8');
          
        } else {
          console.log(`⚠️ No rules content found for: ${project.title}`);
        }
        
        // No rate limiting needed since we're not making additional requests
        
      } catch (error) {
        console.error(`❌ Error processing ${project.title}: ${error.message}`);
        results.errors++;
      }
    }
    
    // Summary
    console.log('\n📊 Scraping Results:');
    console.log('==================');
    console.log(`📄 Projects processed: ${Math.min(projects.length, 10)}`);
    console.log(`✅ Rules extracted: ${results.scraped}`);
    console.log(`💾 Recipes saved: ${results.saved}`);
    console.log(`❌ Errors: ${results.errors}`);
    
    if (results.recipes.length > 0) {
      console.log('\n🍳 Created recipes:');
      results.recipes.forEach(name => console.log(`   - ${name}`));
    }
    
    console.log(`\n📁 Output directories:`);
    console.log(`   - Recipes: ${RECIPES_DIR}`);
    console.log(`   - Raw content: ${OUTPUT_DIR}`);
    
  } catch (error) {
    console.error('❌ Scraping failed:', error.message);
    console.error('💡 This might be due to:');
    console.error('   - Network connectivity issues');
    console.error('   - Changes in the Windsurf directory structure');
    console.error('   - Rate limiting or access restrictions');
  }
}

/**
 * CLI interface
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
🌊 Windsurf Rules Scraper

Usage: node scripts/scrape_windsurf_rules.js [options]

Options:
  --help, -h     Show this help message
  --dry-run      Parse directory but don't download rules
  --limit N      Limit to N projects (default: 10)

Examples:
  node scripts/scrape_windsurf_rules.js
  node scripts/scrape_windsurf_rules.js --limit 5
  node scripts/scrape_windsurf_rules.js --dry-run
`);
    return;
  }
  
  if (args.includes('--dry-run')) {
    console.log('🧪 Dry run mode - parsing directory only\n');
    
    try {
      const html = await httpsRequest(WINDSURF_DIRECTORY_URL);
      const projects = parseWindsurfDirectory(html);
      
      console.log(`📋 Found ${projects.length} projects:`);
      projects.slice(0, 10).forEach((project, i) => {
        console.log(`${i + 1}. ${project.title}`);
        console.log(`   URL: ${project.url}`);
        console.log(`   Description: ${project.description || 'No description'}\n`);
      });
      
    } catch (error) {
      console.error('❌ Dry run failed:', error.message);
    }
    
    return;
  }
  
  await scrapeWindsurfRules();
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  scrapeWindsurfRules,
  parseWindsurfDirectory,
  extractWindsurfRules,
  convertToRecipe
};