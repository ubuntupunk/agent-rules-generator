#!/usr/bin/env node

/**
 * Simple CLI behavior test for project type inclusivity
 */

const { getProjectTypeQuestions, analyzeProjectTypes } = require('../lib/project_types.js');

async function testProjectTypeQuestions() {
  console.log('🧪 Testing Project Type Question Generation\n');
  
  const testCases = [
    {
      name: 'Web Application',
      types: ['Web Application'],
      expectedFields: ['language', 'frontend', 'backend', 'database', 'tools', 'testing', 'deployment']
    },
    {
      name: 'CLI Tool',
      types: ['CLI Tool'],
      expectedFields: ['language', 'cliFramework', 'configFormat', 'packageManager', 'tools', 'testing'],
      excludedFields: ['frontend', 'backend', 'database', 'deployment']
    },
    {
      name: 'Library/Package',
      types: ['Library/Package'],
      expectedFields: ['language', 'targetEnvironment', 'buildSystem', 'distributionFormat', 'tools', 'testing'],
      excludedFields: ['frontend', 'backend', 'database', 'deployment']
    },
    {
      name: 'Mobile App',
      types: ['Mobile App'],
      expectedFields: ['language', 'frontend', 'backend', 'database', 'mobilePlatform', 'mobileFramework', 'stateManagement', 'tools', 'testing', 'deployment']
    },
    {
      name: 'Desktop App',
      types: ['Desktop App'],
      expectedFields: ['language', 'frontend', 'desktopFramework', 'uiLibrary', 'desktopPlatform', 'tools', 'testing', 'deployment'],
      excludedFields: ['backend', 'database']
    }
  ];
  
  let allPassed = true;
  
  for (const testCase of testCases) {
    console.log(`📋 Testing ${testCase.name}...`);
    
    try {
      const questions = getProjectTypeQuestions(testCase.types);
      const questionNames = questions.map(q => q.name);
      
      // Check expected fields
      const missingFields = testCase.expectedFields.filter(field => !questionNames.includes(field));
      if (missingFields.length > 0) {
        console.log(`❌ Missing expected fields: ${missingFields.join(', ')}`);
        allPassed = false;
      } else {
        console.log(`✅ All expected fields present`);
      }
      
      // Check excluded fields
      if (testCase.excludedFields) {
        const unexpectedFields = testCase.excludedFields.filter(field => questionNames.includes(field));
        if (unexpectedFields.length > 0) {
          console.log(`❌ Unexpected fields present: ${unexpectedFields.join(', ')}`);
          allPassed = false;
        } else {
          console.log(`✅ No excluded fields present`);
        }
      }
      
      console.log(`📝 Generated ${questions.length} questions: ${questionNames.join(', ')}\n`);
      
    } catch (error) {
      console.log(`❌ Error testing ${testCase.name}: ${error.message}\n`);
      allPassed = false;
    }
  }
  
  return allPassed;
}

async function testProjectTypeAnalysis() {
  console.log('🔍 Testing Project Type Analysis\n');
  
  const testCases = [
    {
      name: 'Web Application',
      types: ['Web Application'],
      expected: { requiresFrontend: true, requiresBackend: true, requiresDatabase: true, requiresDeployment: true }
    },
    {
      name: 'CLI Tool',
      types: ['CLI Tool'],
      expected: { requiresFrontend: false, requiresBackend: false, requiresDatabase: false, requiresDeployment: false }
    },
    {
      name: 'API/Backend',
      types: ['API/Backend'],
      expected: { requiresFrontend: false, requiresBackend: true, requiresDatabase: true, requiresDeployment: true }
    },
    {
      name: 'Mixed Types',
      types: ['CLI Tool', 'Web Application'],
      expected: { requiresFrontend: true, requiresBackend: true, requiresDatabase: true, requiresDeployment: true }
    }
  ];
  
  let allPassed = true;
  
  for (const testCase of testCases) {
    console.log(`🔍 Testing ${testCase.name}...`);
    
    try {
      const result = analyzeProjectTypes(testCase.types);
      
      let passed = true;
      for (const [key, expectedValue] of Object.entries(testCase.expected)) {
        if (result[key] !== expectedValue) {
          console.log(`❌ ${key}: expected ${expectedValue}, got ${result[key]}`);
          passed = false;
          allPassed = false;
        }
      }
      
      if (passed) {
        console.log(`✅ Analysis correct: ${JSON.stringify(result)}`);
      }
      
    } catch (error) {
      console.log(`❌ Error analyzing ${testCase.name}: ${error.message}`);
      allPassed = false;
    }
    
    console.log();
  }
  
  return allPassed;
}

async function testContextAwareMessages() {
  console.log('💬 Testing Context-Aware Messages\n');
  
  const testCases = [
    {
      name: 'Web Application Frontend',
      types: ['Web Application'],
      field: 'frontend',
      expectedInMessage: ['React', 'Vue', 'Angular']
    },
    {
      name: 'Mobile App Frontend',
      types: ['Mobile App'],
      field: 'frontend',
      expectedInMessage: ['React Native', 'Flutter']
    },
    {
      name: 'Desktop App Frontend',
      types: ['Desktop App'],
      field: 'frontend',
      expectedInMessage: ['React', 'Vue', 'Svelte']
    }
  ];
  
  let allPassed = true;
  
  for (const testCase of testCases) {
    console.log(`💬 Testing ${testCase.name}...`);
    
    try {
      const questions = getProjectTypeQuestions(testCase.types);
      const question = questions.find(q => q.name === testCase.field);
      
      if (!question) {
        console.log(`❌ Question for ${testCase.field} not found`);
        allPassed = false;
        continue;
      }
      
      const message = question.message.toLowerCase();
      const foundTerms = testCase.expectedInMessage.filter(term => 
        message.includes(term.toLowerCase())
      );
      
      if (foundTerms.length > 0) {
        console.log(`✅ Context-aware message contains: ${foundTerms.join(', ')}`);
        console.log(`📝 Message: "${question.message}"`);
      } else {
        console.log(`❌ Message doesn't contain expected terms: ${testCase.expectedInMessage.join(', ')}`);
        console.log(`📝 Message: "${question.message}"`);
        allPassed = false;
      }
      
    } catch (error) {
      console.log(`❌ Error testing ${testCase.name}: ${error.message}`);
      allPassed = false;
    }
    
    console.log();
  }
  
  return allPassed;
}

async function runSimpleCLITests() {
  console.log('🚀 Simple CLI Behavior Tests for Project Inclusivity\n');
  
  const results = {
    questions: await testProjectTypeQuestions(),
    analysis: await testProjectTypeAnalysis(),
    messages: await testContextAwareMessages()
  };
  
  console.log('📊 Test Results Summary:');
  console.log('========================');
  
  const passed = Object.values(results).filter(r => r).length;
  const total = Object.keys(results).length;
  
  Object.entries(results).forEach(([test, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASSED' : 'FAILED'}`);
  });
  
  console.log(`\n🎯 Overall: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 All CLI behavior tests passed! Project inclusivity working correctly.');
  } else {
    console.log('⚠️ Some tests failed. Check the implementation.');
  }
  
  return passed === total;
}

// Run tests if called directly
if (require.main === module) {
  runSimpleCLITests().catch(console.error);
}

module.exports = { runSimpleCLITests };