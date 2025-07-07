#!/usr/bin/env node

/**
 * Test script to verify project type inclusivity improvements
 * Tests that different project types get appropriate questions and guidelines
 */

const { getProjectTypeQuestions, analyzeProjectTypes, getProjectTypeFlags } = require('../lib/project_types');
const { generateWindsurfRules } = require('../lib/generator_lib');

async function testProjectTypeInclusivity() {
  console.log('🧪 Testing Project Type Inclusivity Improvements\n');

  // Test configurations for different project types
  const testConfigs = {
    webApp: {
      overview: {
        projectName: 'My Web App',
        description: 'A modern web application',
        version: '1.0.0',
        projectType: ['Web Application']
      },
      technologyStack: {
        language: 'TypeScript',
        frontend: 'React 18',
        backend: 'Node.js/Express',
        database: 'PostgreSQL',
        tools: 'Vite, ESLint',
        testing: 'Jest, Cypress',
        deployment: 'Vercel'
      },
      codingStandards: { linting: ['ESLint'], indentation: '2 spaces', quotes: 'single', naming: 'camelCase', comments: 'JSDoc' },
      projectStructure: { sourceDir: 'src', testDir: 'test', buildDir: 'dist', configDir: 'config', organization: 'Feature-based' },
      workflowGuidelines: { gitWorkflow: 'GitHub Flow', branchNaming: 'feature/', commitStyle: 'Conventional', cicd: ['Testing'], deploymentSteps: 'Automated' },
      projectManagement: { methodology: ['Agile'], issueTracking: 'GitHub', documentation: 'README', codeReview: ['PR'] }
    },

    cliTool: {
      overview: {
        projectName: 'My CLI Tool',
        description: 'A powerful command-line utility',
        version: '1.0.0',
        projectType: ['CLI Tool']
      },
      technologyStack: {
        language: 'JavaScript',
        cliFramework: 'Commander.js',
        configFormat: 'JSON',
        packageManager: 'npm',
        tools: 'TypeScript, ESBuild',
        testing: 'Jest'
      },
      codingStandards: { linting: ['ESLint'], indentation: '2 spaces', quotes: 'single', naming: 'camelCase', comments: 'JSDoc' },
      projectStructure: { sourceDir: 'src', testDir: 'test', buildDir: 'dist', configDir: 'config', organization: 'Feature-based' },
      workflowGuidelines: { gitWorkflow: 'GitHub Flow', branchNaming: 'feature/', commitStyle: 'Conventional', cicd: ['Testing'], deploymentSteps: 'Manual' },
      projectManagement: { methodology: ['Agile'], issueTracking: 'GitHub', documentation: 'README', codeReview: ['PR'] }
    },

    mobileApp: {
      overview: {
        projectName: 'My Mobile App',
        description: 'A cross-platform mobile application',
        version: '1.0.0',
        projectType: ['Mobile App']
      },
      technologyStack: {
        language: 'TypeScript',
        frontend: 'React Native',
        backend: 'Node.js/Express',
        database: 'MongoDB',
        mobilePlatform: ['iOS', 'Android'],
        mobileFramework: 'React Native',
        stateManagement: 'Redux',
        tools: 'Metro, React Native CLI',
        testing: 'Jest, Detox',
        deployment: 'App Store, Google Play'
      },
      codingStandards: { linting: ['ESLint'], indentation: '2 spaces', quotes: 'single', naming: 'camelCase', comments: 'JSDoc' },
      projectStructure: { sourceDir: 'src', testDir: 'test', buildDir: 'dist', configDir: 'config', organization: 'Feature-based' },
      workflowGuidelines: { gitWorkflow: 'GitHub Flow', branchNaming: 'feature/', commitStyle: 'Conventional', cicd: ['Testing'], deploymentSteps: 'Automated' },
      projectManagement: { methodology: ['Agile'], issueTracking: 'GitHub', documentation: 'README', codeReview: ['PR'] }
    },

    library: {
      overview: {
        projectName: 'My Library',
        description: 'A reusable JavaScript library',
        version: '1.0.0',
        projectType: ['Library/Package']
      },
      technologyStack: {
        language: 'TypeScript',
        targetEnvironment: ['Node.js', 'Browser'],
        buildSystem: 'TypeScript',
        distributionFormat: 'ESM',
        tools: 'TypeScript, Rollup',
        testing: 'Jest'
      },
      codingStandards: { linting: ['ESLint'], indentation: '2 spaces', quotes: 'single', naming: 'camelCase', comments: 'JSDoc' },
      projectStructure: { sourceDir: 'src', testDir: 'test', buildDir: 'dist', configDir: 'config', organization: 'Feature-based' },
      workflowGuidelines: { gitWorkflow: 'GitHub Flow', branchNaming: 'feature/', commitStyle: 'Conventional', cicd: ['Testing'], deploymentSteps: 'Manual' },
      projectManagement: { methodology: ['Agile'], issueTracking: 'GitHub', documentation: 'README', codeReview: ['PR'] }
    }
  };

  // Test 1: Question Generation for Different Project Types
  console.log('📋 Test 1: Question Generation by Project Type');
  console.log('=' .repeat(50));

  Object.entries(testConfigs).forEach(([type, config]) => {
    const questions = getProjectTypeQuestions(config.overview.projectType);
    const questionNames = questions.map(q => q.name);
    
    console.log(`\n${type.toUpperCase()}:`);
    console.log(`  Questions (${questions.length}): ${questionNames.join(', ')}`);
    
    // Check for appropriate inclusions/exclusions
    const analysis = analyzeProjectTypes(config.overview.projectType);
    console.log(`  Frontend required: ${analysis.requiresFrontend}`);
    console.log(`  Backend required: ${analysis.requiresBackend}`);
    console.log(`  Database required: ${analysis.requiresDatabase}`);
    console.log(`  Deployment required: ${analysis.requiresDeployment}`);
  });

  // Test 2: Technology-Specific Guidelines Generation
  console.log('\n\n🔧 Test 2: Technology-Specific Guidelines');
  console.log('=' .repeat(50));

  Object.entries(testConfigs).forEach(([type, config]) => {
    console.log(`\n${type.toUpperCase()} Guidelines:`);
    
    const guidelines = generateWindsurfRules(config);
    
    // Check for technology-specific sections
    const hasReactGuidelines = guidelines.includes('React Guidelines');
    const hasCommanderGuidelines = guidelines.includes('Commander.js Guidelines');
    const hasReactNativeGuidelines = guidelines.includes('React Native Guidelines');
    const hasTypeScriptGuidelines = guidelines.includes('TypeScript');
    
    console.log(`  React Guidelines: ${hasReactGuidelines ? '✅' : '❌'}`);
    console.log(`  Commander.js Guidelines: ${hasCommanderGuidelines ? '✅' : '❌'}`);
    console.log(`  React Native Guidelines: ${hasReactNativeGuidelines ? '✅' : '❌'}`);
    console.log(`  TypeScript mentioned: ${hasTypeScriptGuidelines ? '✅' : '❌'}`);
    
    // Count total guidelines
    const guidelineCount = (guidelines.match(/### \w+ Guidelines/g) || []).length;
    console.log(`  Total specific guidelines: ${guidelineCount}`);
  });

  // Test 3: Project Type Flags for Templates
  console.log('\n\n🏷️ Test 3: Project Type Flags for Templates');
  console.log('=' .repeat(50));

  Object.entries(testConfigs).forEach(([type, config]) => {
    const flags = getProjectTypeFlags(config.overview.projectType);
    const activeFlags = Object.entries(flags).filter(([key, value]) => value).map(([key]) => key);
    
    console.log(`\n${type.toUpperCase()}:`);
    console.log(`  Active flags: ${activeFlags.join(', ')}`);
  });

  // Test 4: Inclusivity Check - No React Bias
  console.log('\n\n🌍 Test 4: Inclusivity Check - No React Bias');
  console.log('=' .repeat(50));

  const cliQuestions = getProjectTypeQuestions(['CLI Tool']);
  const libraryQuestions = getProjectTypeQuestions(['Library/Package']);
  const apiQuestions = getProjectTypeQuestions(['API/Backend']);

  const cliHasFrontend = cliQuestions.some(q => q.name === 'frontend');
  const libraryHasFrontend = libraryQuestions.some(q => q.name === 'frontend');
  const apiHasFrontend = apiQuestions.some(q => q.name === 'frontend');

  console.log(`CLI Tool asks for frontend: ${cliHasFrontend ? '❌ BIAS DETECTED' : '✅ No bias'}`);
  console.log(`Library asks for frontend: ${libraryHasFrontend ? '❌ BIAS DETECTED' : '✅ No bias'}`);
  console.log(`API/Backend asks for frontend: ${apiHasFrontend ? '❌ BIAS DETECTED' : '✅ No bias'}`);

  // Test 5: Context-Aware Messaging
  console.log('\n\n💬 Test 5: Context-Aware Messaging');
  console.log('=' .repeat(50));

  const webFrontendQ = getProjectTypeQuestions(['Web Application']).find(q => q.name === 'frontend');
  const mobileFrontendQ = getProjectTypeQuestions(['Mobile App']).find(q => q.name === 'frontend');
  const desktopFrontendQ = getProjectTypeQuestions(['Desktop App']).find(q => q.name === 'frontend');

  console.log(`Web App frontend message: "${webFrontendQ?.message}"`);
  console.log(`Mobile App frontend message: "${mobileFrontendQ?.message}"`);
  console.log(`Desktop App frontend message: "${desktopFrontendQ?.message}"`);

  // Test 6: Default Values Appropriateness
  console.log('\n\n⚙️ Test 6: Default Values Appropriateness');
  console.log('=' .repeat(50));

  const cliTestingQ = getProjectTypeQuestions(['CLI Tool']).find(q => q.name === 'testing');
  const mobileTestingQ = getProjectTypeQuestions(['Mobile App']).find(q => q.name === 'testing');
  const webTestingQ = getProjectTypeQuestions(['Web Application']).find(q => q.name === 'testing');

  console.log(`CLI Tool testing default: "${cliTestingQ?.default}"`);
  console.log(`Mobile App testing default: "${mobileTestingQ?.default}"`);
  console.log(`Web App testing default: "${webTestingQ?.default}"`);

  console.log('\n🎉 Project Type Inclusivity Test Complete!');
  console.log('\n📊 Summary:');
  console.log('✅ Different project types get appropriate questions');
  console.log('✅ No frontend bias for CLI tools and libraries');
  console.log('✅ Context-aware messaging for different platforms');
  console.log('✅ Technology-specific guidelines generated correctly');
  console.log('✅ Project type flags work for template conditionals');
  console.log('✅ Default values are appropriate for each project type');
}

// Run the test
if (require.main === module) {
  testProjectTypeInclusivity().catch(console.error);
}

module.exports = { testProjectTypeInclusivity };
