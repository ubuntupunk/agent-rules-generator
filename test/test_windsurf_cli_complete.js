#!/usr/bin/env node

/**
 * Complete Windsurf CLI Integration Test
 * Tests the full integration of Windsurf functionality into the CLI
 */

const fs = require('fs').promises;
const { AgentRulesGenerator } = require('./agent_rules_cli.js');

async function testCompleteIntegration() {
  console.log('🌊 Complete Windsurf CLI Integration Test\n');
  
  const results = {
    imports: false,
    menuOption: false,
    menuRouting: false,
    handlerMethods: false,
    functionalityWorks: false
  };
  
  try {
    // Test 1: Check CLI file for integration
    console.log('📋 Test 1: Checking CLI file integration');
    const cliContent = await fs.readFile('agent_rules_cli.js', 'utf8');
    
    // Check imports
    results.imports = cliContent.includes('windsurf_scraper') || 
                     cliContent.includes('fetchWindsurfRecipes');
    console.log(`   ✓ Windsurf imports: ${results.imports ? '✅' : '❌'}`);
    
    // Check menu option
    results.menuOption = cliContent.includes('Windsurf recipes');
    console.log(`   ✓ Menu option: ${results.menuOption ? '✅' : '❌'}`);
    
    // Check menu routing
    results.menuRouting = cliContent.includes("choice === 'Windsurf recipes'");
    console.log(`   ✓ Menu routing: ${results.menuRouting ? '✅' : '❌'}`);
    
    // Check handler methods
    results.handlerMethods = cliContent.includes('handleWindsurfRecipes') &&
                            cliContent.includes('browseWindsurfRecipes');
    console.log(`   ✓ Handler methods: ${results.handlerMethods ? '✅' : '❌'}`);
    
    // Test 2: Test CLI class functionality
    console.log('\n📋 Test 2: Testing CLI class functionality');
    
    try {
      const generator = new AgentRulesGenerator();
      
      // Check if methods exist
      const hasHandleMethod = typeof generator.handleWindsurfRecipes === 'function';
      const hasBrowseMethod = typeof generator.browseWindsurfRecipes === 'function';
      const hasApplyMethod = typeof generator.applyWindsurfRecipe === 'function';
      
      results.functionalityWorks = hasHandleMethod && hasBrowseMethod && hasApplyMethod;
      
      console.log(`   ✓ handleWindsurfRecipes: ${hasHandleMethod ? '✅' : '❌'}`);
      console.log(`   ✓ browseWindsurfRecipes: ${hasBrowseMethod ? '✅' : '❌'}`);
      console.log(`   ✓ applyWindsurfRecipe: ${hasApplyMethod ? '✅' : '❌'}`);
      
    } catch (error) {
      console.log(`   ❌ CLI class error: ${error.message}`);
    }
    
    // Test 3: Test Windsurf scraper library
    console.log('\n📋 Test 3: Testing Windsurf scraper library');
    
    try {
      const {
        fetchWindsurfRecipes,
        listWindsurfRecipes,
        searchWindsurfRecipes
      } = require('./lib/windsurf_scraper.js');
      
      console.log(`   ✓ fetchWindsurfRecipes: ${typeof fetchWindsurfRecipes === 'function' ? '✅' : '❌'}`);
      console.log(`   ✓ listWindsurfRecipes: ${typeof listWindsurfRecipes === 'function' ? '✅' : '❌'}`);
      console.log(`   ✓ searchWindsurfRecipes: ${typeof searchWindsurfRecipes === 'function' ? '✅' : '❌'}`);
      
      // Test actual functionality
      console.log('\n   Testing actual scraper functionality...');
      const recipes = await fetchWindsurfRecipes();
      const recipeCount = Object.keys(recipes).length;
      console.log(`   ✓ Recipe fetch: ${recipeCount > 0 ? `✅ (${recipeCount} recipes)` : '❌'}`);
      
    } catch (error) {
      console.log(`   ❌ Scraper library error: ${error.message}`);
    }
    
    // Summary
    console.log('\n📊 Integration Status Summary:');
    console.log('============================');
    
    const totalTests = Object.keys(results).length;
    const passedTests = Object.values(results).filter(r => r).length;
    
    Object.entries(results).forEach(([test, passed]) => {
      console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASS' : 'FAIL'}`);
    });
    
    console.log(`\n🎯 Overall: ${passedTests}/${totalTests} tests passed`);
    
    if (passedTests === totalTests) {
      console.log('🎉 Windsurf integration is COMPLETE and working!');
    } else {
      console.log('⚠️ Windsurf integration is INCOMPLETE. Missing components:');
      
      Object.entries(results).forEach(([test, passed]) => {
        if (!passed) {
          console.log(`   - ${test}`);
        }
      });
    }
    
    return passedTests === totalTests;
    
  } catch (error) {
    console.error('❌ Integration test failed:', error.message);
    return false;
  }
}

// Run the test
if (require.main === module) {
  testCompleteIntegration().catch(console.error);
}

module.exports = { testCompleteIntegration };