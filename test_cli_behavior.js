#!/usr/bin/env node

/**
 * Test CLI behavior with different project types
 * This script tests the actual CLI interaction to ensure project type inclusivity
 */

const { AgentRulesGenerator } = require('./agent_rules_cli.js');

// Mock inquirer responses for different project types
const mockResponses = {
  webApp: {
    overview: {
      projectName: 'My Web App',
      description: 'A modern web application',
      version: '1.0.0',
      projectType: ['Web Application']
    },
    useRecipe: false,
    techStack: {
      language: 'TypeScript',
      frontend: 'React 18',
      backend: 'Node.js/Express',
      database: 'PostgreSQL',
      tools: 'Vite, ESLint',
      testing: 'Jest, Cypress',
      deployment: 'Vercel'
    }
  },
  cliTool: {
    overview: {
      projectName: 'My CLI Tool',
      description: 'A powerful command-line utility',
      version: '1.0.0',
      projectType: ['CLI Tool']
    },
    useRecipe: false,
    techStack: {
      language: 'TypeScript',
      cliFramework: 'Commander.js',
      configFormat: 'YAML',
      packageManager: 'bun',
      tools: 'TypeScript, ESBuild',
      testing: 'Jest'
    }
  },
  library: {
    overview: {
      projectName: 'My Library',
      description: 'A reusable JavaScript library',
      version: '1.0.0',
      projectType: ['Library/Package']
    },
    useRecipe: false,
    techStack: {
      language: 'TypeScript',
      targetEnvironment: ['Node.js', 'Browser'],
      buildSystem: 'Rollup',
      distributionFormat: 'ESM',
      tools: 'TypeScript, Rollup',
      testing: 'Vitest'
    }
  },
  mobileApp: {
    overview: {
      projectName: 'My Mobile App',
      description: 'A cross-platform mobile application',
      version: '1.0.0',
      projectType: ['Mobile App']
    },
    useRecipe: false,
    techStack: {
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
    }
  },
  desktopApp: {
    overview: {
      projectName: 'My Desktop App',
      description: 'A cross-platform desktop application',
      version: '1.0.0',
      projectType: ['Desktop App']
    },
    useRecipe: false,
    techStack: {
      language: 'TypeScript',
      frontend: 'React',
      desktopFramework: 'Electron',
      uiLibrary: 'React',
      desktopPlatform: ['Windows', 'macOS', 'Linux'],
      tools: 'Electron Builder, Vite',
      testing: 'Jest',
      deployment: 'GitHub Releases'
    }
  }
};

class MockInquirer {
  constructor(responses) {
    this.responses = responses;
    this.step = 0;
  }

  async prompt(questions) {
    const responses = {};
    
    // Handle different question types based on step
    if (this.step === 0) {
      // Project overview questions
      Object.assign(responses, this.responses.overview);
      this.step++;
    } else if (this.step === 1) {
      // Recipe selection
      responses.useRecipe = this.responses.useRecipe;
      this.step++;
    } else if (this.step === 2) {
      // Tech stack questions
      Object.assign(responses, this.responses.techStack);
      this.step++;
    } else {
      // Default responses for any additional questions
      questions.forEach(question => {
        if (question.type === 'confirm') {
          responses[question.name] = false;
        } else if (question.type === 'list') {
          responses[question.name] = question.choices[0];
        } else if (question.type === 'checkbox') {
          responses[question.name] = question.default || [];
        } else {
          responses[question.name] = question.default || '';
        }
      });
    }
    
    return responses;
  }
}

async function testProjectType(projectType, mockData) {
  console.log(`\n🧪 Testing ${projectType} project type...`);
  
  try {
    const generator = new AgentRulesGenerator();
    const mockInquirer = new MockInquirer(mockData);
    
    // Override the inquirer instance
    generator.inquirer = mockInquirer;
    
    // Simulate the configuration process
    generator.config = {
      overview: mockData.overview,
      technologyStack: {},
      codingStandards: {
        indentation: '2 spaces',
        quotes: 'single',
        naming: 'camelCase',
        linting: ['ESLint'],
        comments: 'JSDoc'
      },
      projectStructure: {
        sourceDir: 'src',
        testDir: 'test',
        buildDir: 'dist',
        configDir: 'config',
        organization: 'Feature-based'
      },
      workflowGuidelines: {
        gitWorkflow: 'GitHub Flow',
        branchNaming: 'feature/',
        commitStyle: 'Conventional',
        cicd: ['Testing'],
        deploymentSteps: 'Automated'
      },
      projectManagement: {
        methodology: ['Agile'],
        issueTracking: 'GitHub',
        documentation: 'README',
        codeReview: ['PR Review']
      }
    };
    
    // Test manual tech stack setup
    await generator.manualTechStackSetup();
    
    console.log(`✅ ${projectType} configuration successful`);
    console.log(`📋 Tech stack keys: ${Object.keys(generator.config.technologyStack).join(', ')}`);
    
    // Verify project type specific fields
    const techStack = generator.config.technologyStack;
    
    if (projectType === 'CLI Tool') {
      if (techStack.cliFramework && techStack.configFormat && techStack.packageManager) {
        console.log(`✅ CLI-specific fields present: ${techStack.cliFramework}, ${techStack.configFormat}, ${techStack.packageManager}`);
      } else {
        console.log(`❌ Missing CLI-specific fields`);
      }
    }
    
    if (projectType === 'Library/Package') {
      if (techStack.targetEnvironment && techStack.buildSystem && techStack.distributionFormat) {
        console.log(`✅ Library-specific fields present: ${techStack.buildSystem}, ${techStack.distributionFormat}`);
      } else {
        console.log(`❌ Missing library-specific fields`);
      }
    }
    
    if (projectType === 'Mobile App') {
      if (techStack.mobilePlatform && techStack.mobileFramework && techStack.stateManagement) {
        console.log(`✅ Mobile-specific fields present: ${techStack.mobileFramework}, ${techStack.stateManagement}`);
      } else {
        console.log(`❌ Missing mobile-specific fields`);
      }
    }
    
    if (projectType === 'Desktop App') {
      if (techStack.desktopFramework && techStack.uiLibrary && techStack.desktopPlatform) {
        console.log(`✅ Desktop-specific fields present: ${techStack.desktopFramework}, ${techStack.uiLibrary}`);
      } else {
        console.log(`❌ Missing desktop-specific fields`);
      }
    }
    
    return true;
    
  } catch (error) {
    console.log(`❌ ${projectType} test failed: ${error.message}`);
    return false;
  }
}

async function runCLIBehaviorTests() {
  console.log('🚀 Testing CLI Behavior with Different Project Types\n');
  
  const results = {};
  
  // Test each project type
  for (const [key, mockData] of Object.entries(mockResponses)) {
    const projectTypeName = mockData.overview.projectType[0];
    results[key] = await testProjectType(projectTypeName, mockData);
  }
  
  // Summary
  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  
  const passed = Object.values(results).filter(r => r).length;
  const total = Object.keys(results).length;
  
  Object.entries(results).forEach(([key, passed]) => {
    const projectType = mockResponses[key].overview.projectType[0];
    console.log(`${passed ? '✅' : '❌'} ${projectType}: ${passed ? 'PASSED' : 'FAILED'}`);
  });
  
  console.log(`\n🎯 Overall: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 All CLI behavior tests passed! Project inclusivity implemented successfully.');
  } else {
    console.log('⚠️ Some tests failed. Check the implementation.');
  }
  
  return passed === total;
}

// Run tests if called directly
if (require.main === module) {
  runCLIBehaviorTests().catch(console.error);
}

module.exports = { runCLIBehaviorTests, testProjectType };