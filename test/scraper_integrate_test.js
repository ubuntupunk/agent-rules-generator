#!/usr/bin/env node

/**
 * Comprehensive Windsurf Scraper Integration Test
 * Tests and completes the integration of Windsurf scraper into the main CLI
 */

const fs = require('fs').promises;
const path = require('path');

async function testScraperIntegration() {
  console.log('🌊 Windsurf Scraper Integration Test\n');
  
  const results = {
    scraperExists: false,
    scraperFunctional: false,
    cliImports: false,
    cliMenuOption: false,
    cliHandlers: false,
    cliRouting: false,
    integrationComplete: false
  };
  
  try {
    // Test 1: Check if windsurf_scraper.js exists and is functional
    console.log('📋 Test 1: Windsurf Scraper Module');
    try {
      const scraperPath = path.join(__dirname, '..', 'lib', 'windsurf_scraper.js');
      const scraperStats = await fs.stat(scraperPath);
      results.scraperExists = scraperStats.size > 0;
      console.log(`   ✅ Scraper file exists: ${scraperStats.size} bytes`);
      
      // Test if we can import the scraper
      const scraper = require('../lib/windsurf_scraper.js');
      const hasRequiredFunctions = [
        'fetchWindsurfRecipes',
        'listWindsurfRecipes', 
        'searchWindsurfRecipes',
        'refreshWindsurfRecipes',
        'getWindsurfCacheInfo',
        'clearWindsurfCache'
      ].every(fn => typeof scraper[fn] === 'function');
      
      results.scraperFunctional = hasRequiredFunctions;
      console.log(`   ✅ Scraper functions: ${hasRequiredFunctions ? 'All present' : 'Missing functions'}`);
      
    } catch (error) {
      console.log(`   ❌ Scraper error: ${error.message}`);
    }
    
    // Test 2: Check CLI imports
    console.log('\n📋 Test 2: CLI Import Statements');
    try {
      const cliContent = await fs.readFile(path.join(__dirname, '..', 'agent_rules_cli.js'), 'utf8');
      // Check for proper modular imports (WindsurfManager and RecipeManager handle windsurf_scraper)
      results.cliImports = cliContent.includes('WindsurfManager') && 
                          cliContent.includes('RecipeManager');
      console.log(`   ${results.cliImports ? '✅' : '❌'} Modular imports: ${results.cliImports ? 'Present (WindsurfManager, RecipeManager)' : 'Missing'}`);
    } catch (error) {
      console.log(`   ❌ CLI file error: ${error.message}`);
    }
    
    // Test 3: Check CLI menu option
    console.log('\n📋 Test 3: CLI Menu Options');
    try {
      const cliContent = await fs.readFile(path.join(__dirname, '..', 'agent_rules_cli.js'), 'utf8');
      results.cliMenuOption = cliContent.includes('Windsurf recipes');
      console.log(`   ${results.cliMenuOption ? '✅' : '❌'} Menu option: ${results.cliMenuOption ? 'Present' : 'Missing'}`);
    } catch (error) {
      console.log(`   ❌ Menu check error: ${error.message}`);
    }
    
    // Test 4: Check CLI handler methods
    console.log('\n📋 Test 4: CLI Handler Methods');
    try {
      const cliContent = await fs.readFile(path.join(__dirname, '..', 'agent_rules_cli.js'), 'utf8');
      // Check if setupTechnologyStack method includes Windsurf recipes option
      const hasWindsurfOption = cliContent.includes('Windsurf recipes');
      const hasRecipeManagerCall = cliContent.includes('recipeManager.handleWindsurfRecipes');
      
      results.cliHandlers = hasWindsurfOption && hasRecipeManagerCall;
      console.log(`   ${results.cliHandlers ? '✅' : '❌'} Handler methods: ${results.cliHandlers ? 'Present in modular structure' : 'Missing'}`);
      
      if (!results.cliHandlers) {
        if (!hasWindsurfOption) console.log('   Missing: "Windsurf recipes" menu option');
        if (!hasRecipeManagerCall) console.log('   Missing: recipeManager.handleWindsurfRecipes call');
      }
      
    } catch (error) {
      console.log(`   ❌ Handler check error: ${error.message}`);
    }
    
    // Test 5: Check CLI routing
    console.log('\n📋 Test 5: CLI Menu Routing');
    try {
      const cliContent = await fs.readFile(path.join(__dirname, '..', 'agent_rules_cli.js'), 'utf8');
      results.cliRouting = cliContent.includes("case 'Windsurf recipes'") &&
                          cliContent.includes('recipeManager.handleWindsurfRecipes()');
      console.log(`   ${results.cliRouting ? '✅' : '❌'} Menu routing: ${results.cliRouting ? 'Present' : 'Missing'}`);
    } catch (error) {
      console.log(`   ❌ Routing check error: ${error.message}`);
    }
    
    // Test 6: Test actual CLI functionality
    console.log('\n📋 Test 6: CLI Class Functionality');
    try {
      const { AgentRulesGenerator } = require('../agent_rules_cli.js');
      const generator = new AgentRulesGenerator();
      
      // Check if the refactored structure has the recipe manager with Windsurf support
      const hasRecipeManager = generator.recipeManager && typeof generator.recipeManager.handleWindsurfRecipes === 'function';
      results.cliHandlers = hasRecipeManager;
      
      console.log(`   ${hasRecipeManager ? '✅' : '❌'} CLI methods: ${hasRecipeManager ? 'Present in recipeManager' : 'Missing'}`);
      
      if (!hasRecipeManager) {
        console.log('   Missing: recipeManager.handleWindsurfRecipes method');
      }
      
    } catch (error) {
      console.log(`   ❌ CLI class error: ${error.message}`);
    }
    
    // Overall integration status
    results.integrationComplete = results.scraperExists && 
                                 results.scraperFunctional && 
                                 results.cliImports && 
                                 results.cliMenuOption && 
                                 results.cliHandlers && 
                                 results.cliRouting;
    
    // Summary
    console.log('\n📊 Integration Status Summary');
    console.log('============================');
    Object.entries(results).forEach(([test, passed]) => {
      console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASS' : 'FAIL'}`);
    });
    
    console.log(`\n🎯 Overall Status: ${results.integrationComplete ? '✅ COMPLETE' : '❌ INCOMPLETE'}`);
    
    if (!results.integrationComplete) {
      console.log('\n🔧 Required Actions:');
      if (!results.scraperExists) console.log('   - Create or fix lib/windsurf_scraper.js');
      if (!results.scraperFunctional) console.log('   - Fix windsurf_scraper.js exports');
      if (!results.cliImports) console.log('   - Fix WindsurfManager and RecipeManager imports in agent_rules_cli.js');
      if (!results.cliMenuOption) console.log('   - Add "Windsurf recipes" to menu choices');
      if (!results.cliHandlers) console.log('   - Add Windsurf handler methods to CLI class');
      if (!results.cliRouting) console.log('   - Add menu routing for Windsurf recipes');
    }
    
    return results;
    
  } catch (error) {
    console.error('❌ Integration test failed:', error.message);
    return results;
  }
}

async function testScraperFunctionality() {
  console.log('\n🧪 Testing Scraper Functionality\n');
  
  try {
    const scraper = require('../lib/windsurf_scraper.js');
    
    // Test basic functionality
    console.log('📋 Testing fetchWindsurfRecipes...');
    const recipes = await scraper.fetchWindsurfRecipes();
    console.log(`✅ Fetched ${Object.keys(recipes).length} recipes`);
    
    console.log('\n📋 Testing listWindsurfRecipes...');
    const recipeList = await scraper.listWindsurfRecipes();
    console.log(`✅ Listed ${recipeList.length} recipes`);
    
    console.log('\n📋 Testing searchWindsurfRecipes...');
    const searchResults = await scraper.searchWindsurfRecipes('react');
    console.log(`✅ Found ${searchResults.length} React recipes`);
    
    console.log('\n📋 Testing cache info...');
    const cacheInfo = await scraper.getWindsurfCacheInfo();
    console.log(`✅ Cache exists: ${cacheInfo.exists}`);
    
    return true;
    
  } catch (error) {
    console.error('❌ Scraper functionality test failed:', error.message);
    return false;
  }
}

async function main() {
  console.log('🌊 Windsurf Scraper Integration Test Suite\n');
  
  const integrationResults = await testScraperIntegration();
  
  if (integrationResults.scraperFunctional) {
    const functionalityResults = await testScraperFunctionality();
    console.log(`\n🔧 Scraper Functionality: ${functionalityResults ? '✅ WORKING' : '❌ BROKEN'}`);
  }
  
  console.log('\n🎯 Final Assessment:');
  console.log('===================');
  
  if (integrationResults.integrationComplete) {
    console.log('🎉 Windsurf integration is COMPLETE and ready to use!');
    console.log('💡 Users can access Windsurf recipes via the main CLI menu.');
  } else {
    console.log('⚠️ Windsurf integration is INCOMPLETE.');
    console.log('💡 The scraper library exists but needs to be connected to the CLI.');
    console.log('🔧 Complete the integration by adding the missing CLI components.');
  }
  
  return integrationResults.integrationComplete;
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testScraperIntegration, testScraperFunctionality };