#!/usr/bin/env node

/**
 * Investigate Windsurf directory structure
 * This script helps us understand the HTML structure to improve our scraper
 */

const https = require('https');
const fs = require('fs').promises;

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

async function investigateWindsurf() {
  console.log('🔍 Investigating Windsurf directory structure...\n');
  
  try {
    const html = await httpsRequest('https://windsurf.com/editor/directory');
    
    // Save the HTML for inspection
    await fs.writeFile('windsurf_directory.html', html, 'utf8');
    console.log('💾 Saved HTML to windsurf_directory.html');
    
    // Analyze the structure
    console.log('\n📊 HTML Analysis:');
    console.log(`📄 Total length: ${html.length} characters`);
    
    // Look for common patterns
    const patterns = {
      'React components': /<[A-Z][a-zA-Z]*[^>]*>/g,
      'Class names': /class="([^"]*)"/g,
      'Data attributes': /data-[a-z-]+="[^"]*"/g,
      'Links': /<a[^>]*href="([^"]*)"[^>]*>/g,
      'Headings': /<h[1-6][^>]*>(.*?)<\/h[1-6]>/g,
      'Script tags': /<script[^>]*>/g,
      'JSON data': /"[^"]*":\s*[{\[].*?[}\]]/g
    };
    
    Object.entries(patterns).forEach(([name, pattern]) => {
      const matches = html.match(pattern) || [];
      console.log(`${name}: ${matches.length} matches`);
      
      if (matches.length > 0 && matches.length < 10) {
        console.log(`  Examples: ${matches.slice(0, 3).join(', ')}`);
      }
    });
    
    // Look for specific windsurf-related content
    console.log('\n🌊 Windsurf-specific content:');
    const windsurfPatterns = [
      'windsurf',
      'rules',
      'project',
      'template',
      'directory',
      'example'
    ];
    
    windsurfPatterns.forEach(term => {
      const regex = new RegExp(term, 'gi');
      const matches = html.match(regex) || [];
      console.log(`"${term}": ${matches.length} occurrences`);
    });
    
    // Check if it's a SPA (Single Page Application)
    console.log('\n⚛️ SPA Detection:');
    const isSPA = html.includes('react') || html.includes('vue') || html.includes('angular') || 
                  html.includes('__NEXT_DATA__') || html.includes('window.__INITIAL_STATE__');
    console.log(`Likely SPA: ${isSPA ? 'Yes' : 'No'}`);
    
    if (isSPA) {
      console.log('💡 This appears to be a Single Page Application.');
      console.log('   The content might be loaded dynamically via JavaScript.');
      console.log('   We may need to:');
      console.log('   - Use a headless browser (Puppeteer/Playwright)');
      console.log('   - Find API endpoints that serve the data');
      console.log('   - Look for JSON data in script tags');
    }
    
    // Look for JSON data that might contain project information
    console.log('\n🔍 Looking for JSON data...');
    const jsonMatches = html.match(/<script[^>]*>.*?({.*?}|\[.*?\]).*?<\/script>/gs) || [];
    console.log(`Found ${jsonMatches.length} script tags with potential JSON`);
    
    jsonMatches.slice(0, 3).forEach((match, i) => {
      console.log(`\nScript ${i + 1} preview:`);
      console.log(match.substring(0, 200) + '...');
    });
    
    // Look for API endpoints
    console.log('\n🔗 Looking for API endpoints...');
    const apiPatterns = [
      /\/api\/[^"'\s]*/g,
      /https?:\/\/[^"'\s]*api[^"'\s]*/g,
      /fetch\s*\(\s*['"`]([^'"`]*)/g,
      /axios\.[^(]*\(\s*['"`]([^'"`]*)/g
    ];
    
    apiPatterns.forEach((pattern, i) => {
      const matches = html.match(pattern) || [];
      if (matches.length > 0) {
        console.log(`API pattern ${i + 1}: ${matches.slice(0, 3).join(', ')}`);
      }
    });
    
  } catch (error) {
    console.error('❌ Investigation failed:', error.message);
    
    if (error.message.includes('Status 404')) {
      console.log('\n💡 The URL might be incorrect. Let me check some alternatives:');
      const alternatives = [
        'https://windsurf.com/directory',
        'https://windsurf.com/templates',
        'https://windsurf.com/examples',
        'https://windsurf.com/docs/directory',
        'https://windsurf.com/editor/templates'
      ];
      
      for (const url of alternatives) {
        try {
          console.log(`🔍 Trying: ${url}`);
          const response = await httpsRequest(url);
          console.log(`✅ ${url} - Success (${response.length} chars)`);
          break;
        } catch (e) {
          console.log(`❌ ${url} - ${e.message}`);
        }
      }
    }
  }
}

if (require.main === module) {
  investigateWindsurf().catch(console.error);
}