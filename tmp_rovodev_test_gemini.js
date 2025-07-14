#!/usr/bin/env node

/**
 * Test script for Gemini CLI configuration
 */

const GeminiManager = require('./lib/gemini_manager');

async function testGeminiManager() {
  console.log('Testing Gemini Manager...\n');
  
  const geminiManager = new GeminiManager();
  
  // Test checking current configuration
  console.log('1. Checking current configuration...');
  const status = await geminiManager.checkGeminiConfig();
  console.log('Status:', JSON.stringify(status, null, 2));
  
  // Test local configuration
  console.log('\n2. Testing local configuration...');
  const localResult = await geminiManager.configureGemini('local');
  console.log('Local config result:', localResult);
  
  // Test global configuration
  console.log('\n3. Testing global configuration...');
  const globalResult = await geminiManager.configureGemini('global');
  console.log('Global config result:', globalResult);
  
  // Check configuration again
  console.log('\n4. Checking configuration after setup...');
  const finalStatus = await geminiManager.checkGeminiConfig();
  console.log('Final status:', JSON.stringify(finalStatus, null, 2));
}

testGeminiManager().catch(console.error);