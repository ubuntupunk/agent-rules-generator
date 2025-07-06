/**
 * Fixed test suite for template system functionality
 * Tests template loading, placeholder replacement, and file generation
 */

import { describe, test, expect } from 'bun:test';
import { 
  generateAgentFile,
  generateAgentMd,
  generateWindsurfRules,
  loadTemplate
} from '../lib/generator_lib.js';

// Mock inquirer for testing
const mockInquirer = {
  prompt: async (questions) => {
    if (questions[0]?.name === 'useTemplate') {
      return { useTemplate: true };
    }
    return {};
  }
};

const mockInquirerDecline = {
  prompt: async (questions) => {
    if (questions[0]?.name === 'useTemplate') {
      return { useTemplate: false };
    }
    return {};
  }
};

// Complete test configuration
const testConfig = {
  fileType: 'agent',
  overview: {
    projectName: 'Test Project',
    description: 'A test project for template system validation',
    version: '1.0.0',
    projectType: ['Web Application', 'CLI Tool']
  },
  technologyStack: {
    frontend: 'React 18',
    backend: 'Node.js/Express',
    database: 'PostgreSQL',
    language: 'TypeScript',
    tools: 'Vite, ESLint',
    testing: 'Jest, Cypress',
    deployment: 'Vercel'
  },
  codingStandards: {
    indentation: '2 spaces',
    quotes: 'single',
    naming: 'camelCase for variables, PascalCase for classes',
    linting: ['ESLint', 'Prettier'],
    comments: 'JSDoc for functions, inline for complex logic'
  },
  projectStructure: {
    sourceDir: 'src',
    testDir: 'tests',
    buildDir: 'dist',
    configDir: 'config',
    organization: 'Feature-based folders with shared utilities'
  },
  workflowGuidelines: {
    gitWorkflow: 'GitHub Flow',
    branchNaming: 'feature/description, bugfix/description',
    commitStyle: 'Conventional Commits',
    cicd: ['Automated Testing', 'Code Quality Checks'],
    deploymentSteps: 'Automated via CI/CD pipeline'
  },
  projectManagement: {
    methodology: ['Agile', 'Scrum'],
    issueTracking: 'GitHub Issues',
    documentation: 'README.md and docs/ folder',
    codeReview: ['Pull Requests', 'Code Review Meetings']
  }
};

describe('Template System - Core Functionality', () => {
  
  describe('loadTemplate function', () => {
    test('should load existing agent template', async () => {
      const template = await loadTemplate('agent-template');
      
      expect(template).toBeTruthy();
      expect(typeof template).toBe('string');
      expect(template.length).toBeGreaterThan(0);
      expect(template).toContain('{{projectName}}');
      expect(template).toContain('{{#technologyStack}}');
    });

    test('should return null for non-existent template', async () => {
      const template = await loadTemplate('non-existent-template');
      expect(template).toBeNull();
    });

    test('should handle windsurf template (currently missing)', async () => {
      const template = await loadTemplate('windsurf-template');
      expect(template).toBeNull(); // Should be null since it doesn't exist yet
    });
  });

  describe('generateAgentFile function', () => {
    test('should generate content using template when available', async () => {
      const result = await generateAgentFile(testConfig, mockInquirer);
      
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
      expect(result).toContain('Test Project');
      expect(result).toContain('1.0.0');
      expect(result).toContain('React 18');
    });

    test('should use programmatic generation when template declined', async () => {
      const result = await generateAgentFile(testConfig, mockInquirerDecline);
      
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
      expect(result).toContain('Test Project - AI Assistant Rules');
      expect(result).toContain('React 18');
    });

    test('should handle windsurf file type (no template available)', async () => {
      const windsurfConfig = { ...testConfig, fileType: 'windsurf' };
      const result = await generateAgentFile(windsurfConfig, mockInquirer);
      
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
      expect(result).toContain('Test Project - Windsurf Rules');
    });
  });

  describe('generateAgentMd function', () => {
    test('should generate complete agent.md content', () => {
      const result = generateAgentMd(testConfig);
      
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
      
      // Check essential sections
      expect(result).toContain('# Test Project - AI Assistant Rules');
      expect(result).toContain('## Project Overview');
      expect(result).toContain('## Technology Stack');
      expect(result).toContain('## Project Structure');
      expect(result).toContain('## Coding Standards');
      expect(result).toContain('## Development Workflow');
      expect(result).toContain('## AI Assistant Guidelines');
      
      // Check specific content
      expect(result).toContain('Test Project');
      expect(result).toContain('1.0.0');
      expect(result).toContain('React 18');
      expect(result).toContain('TypeScript');
      expect(result).toContain('PostgreSQL');
    });

    test('should handle empty technology stack', () => {
      const configWithEmptyTechStack = {
        ...testConfig,
        technologyStack: {}
      };
      
      const result = generateAgentMd(configWithEmptyTechStack);
      expect(result).toContain('## Technology Stack');
      expect(result).toContain('## Coding Standards');
    });

    test('should format arrays correctly', () => {
      const result = generateAgentMd(testConfig);
      
      // Check that arrays are joined properly
      expect(result).toContain('Web Application, CLI Tool');
      expect(result).toContain('Agile, Scrum');
      // Linting tools should appear in the tools section
      expect(result).toContain('ESLint');
      expect(result).toContain('Prettier');
    });
  });

  describe('generateWindsurfRules function', () => {
    test('should generate complete windsurf rules content', () => {
      const result = generateWindsurfRules(testConfig);
      
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
      
      // Check essential sections
      expect(result).toContain('# Test Project - Windsurf Rules');
      expect(result).toContain('## Project Context');
      expect(result).toContain('## Technology Stack');
      expect(result).toContain('## Code Style Rules');
      expect(result).toContain('## Code Generation Rules');
      
      // Check specific content
      expect(result).toContain('Test Project');
      expect(result).toContain('React 18');
      expect(result).toContain('TypeScript');
    });

    test('should include technology-specific guidelines', () => {
      const result = generateWindsurfRules(testConfig);
      
      expect(result).toContain('## Specific Technology Guidelines');
      // Should detect React and include guidelines
      expect(result).toContain('React Guidelines');
      expect(result).toContain('Use functional components with hooks');
      
      // Should detect Express and include guidelines
      expect(result).toContain('Express Guidelines');
      expect(result).toContain('Use proper middleware structure');
      
      // Should detect PostgreSQL and include guidelines
      expect(result).toContain('PostgreSQL Guidelines');
      expect(result).toContain('Use proper normalization');
    });

    test('should handle case-insensitive technology detection', () => {
      const configWithMixedCase = {
        ...testConfig,
        technologyStack: {
          frontend: 'REACT 18',
          backend: 'express.js',
          database: 'MongoDB Atlas'
        }
      };
      
      const result = generateWindsurfRules(configWithMixedCase);
      
      expect(result).toContain('React Guidelines');
      expect(result).toContain('Express Guidelines');
      expect(result).toContain('MongoDB Guidelines');
    });
  });

  describe('Template vs Programmatic Generation', () => {
    test('should produce different but valid output for template vs programmatic', async () => {
      // Template-based generation
      const templateResult = await generateAgentFile(testConfig, mockInquirer);
      
      // Programmatic generation
      const programmaticResult = await generateAgentFile(testConfig, mockInquirerDecline);
      
      // Both should be valid
      expect(templateResult.length).toBeGreaterThan(0);
      expect(programmaticResult.length).toBeGreaterThan(0);
      
      // Both should contain essential information
      expect(templateResult).toContain('Test Project');
      expect(programmaticResult).toContain('Test Project');
      
      expect(templateResult).toContain('React 18');
      expect(programmaticResult).toContain('React 18');
      
      // They might have different formatting but same content
      expect(templateResult).toContain('TypeScript');
      expect(programmaticResult).toContain('TypeScript');
    });
  });

  describe('Error Handling', () => {
    test('should handle minimal configuration', () => {
      const minimalConfig = {
        fileType: 'agent',
        overview: {
          projectName: 'Minimal Project',
          description: 'Minimal test',
          version: '1.0.0',
          projectType: ['Test']
        },
        technologyStack: {},
        codingStandards: { 
          linting: [], 
          indentation: '2 spaces', 
          quotes: 'single', 
          naming: 'camelCase', 
          comments: 'JSDoc' 
        },
        projectStructure: { 
          sourceDir: 'src', 
          testDir: 'test', 
          buildDir: 'dist', 
          configDir: 'config', 
          organization: 'Standard' 
        },
        workflowGuidelines: { 
          gitWorkflow: 'Git Flow', 
          branchNaming: 'feature/', 
          commitStyle: 'Standard', 
          cicd: [], 
          deploymentSteps: 'Manual' 
        },
        projectManagement: { 
          methodology: [], 
          issueTracking: 'GitHub', 
          documentation: 'README', 
          codeReview: [] 
        }
      };
      
      expect(() => generateAgentMd(minimalConfig)).not.toThrow();
      
      const result = generateAgentMd(minimalConfig);
      expect(result).toContain('Minimal Project');
    });

    test('should handle empty arrays gracefully', () => {
      const configWithEmptyArrays = {
        ...testConfig,
        codingStandards: {
          ...testConfig.codingStandards,
          linting: []
        },
        projectManagement: {
          ...testConfig.projectManagement,
          methodology: [],
          codeReview: []
        }
      };
      
      const result = generateAgentMd(configWithEmptyArrays);
      expect(result).toContain('## Coding Standards');
      expect(result).toContain('## Project Management');
    });
  });

  describe('Technology Detection', () => {
    test('should detect Vue.js and generate appropriate guidelines', () => {
      const vueConfig = {
        ...testConfig,
        technologyStack: {
          ...testConfig.technologyStack,
          frontend: 'Vue 3'
        }
      };
      
      const result = generateWindsurfRules(vueConfig);
      expect(result).toContain('Vue Guidelines');
      expect(result).toContain('Use Composition API');
    });

    test('should detect FastAPI and generate appropriate guidelines', () => {
      const fastApiConfig = {
        ...testConfig,
        technologyStack: {
          ...testConfig.technologyStack,
          backend: 'FastAPI'
        }
      };
      
      const result = generateWindsurfRules(fastApiConfig);
      expect(result).toContain('FastAPI Guidelines');
      expect(result).toContain('Use proper type hints');
    });

    test('should not generate guidelines for unknown technologies', () => {
      const unknownTechConfig = {
        ...testConfig,
        technologyStack: {
          frontend: 'UnknownFramework',
          backend: 'CustomServer',
          database: 'NewDatabase'
        }
      };
      
      const result = generateWindsurfRules(unknownTechConfig);
      
      // Should not contain any specific guidelines for unknown tech
      expect(result).not.toContain('UnknownFramework Guidelines');
      expect(result).not.toContain('CustomServer Guidelines');
      expect(result).not.toContain('NewDatabase Guidelines');
      
      // But should still have the general structure
      expect(result).toContain('## Specific Technology Guidelines');
    });
  });
});

// Manual test function for debugging
async function runManualTemplateTests() {
  console.log('🧪 Running manual template system tests...\n');
  
  try {
    // Test 1: Load template
    console.log('📄 Test 1: Load agent template');
    const template = await loadTemplate('agent-template');
    console.log(`✅ Template loaded: ${template ? template.length : 0} characters`);
    console.log(`📄 Contains placeholders: ${template ? (template.includes('{{projectName}}') ? 'Yes' : 'No') : 'N/A'}`);
    
    // Test 2: Generate agent file
    console.log('\n🤖 Test 2: Generate agent file');
    const agentResult = await generateAgentFile(testConfig, mockInquirer);
    console.log(`✅ Agent file generated: ${agentResult.length} characters`);
    console.log(`📄 Contains project name: ${agentResult.includes('Test Project') ? 'Yes' : 'No'}`);
    
    // Test 3: Generate windsurf file
    console.log('\n🌊 Test 3: Generate windsurf file');
    const windsurfConfig = { ...testConfig, fileType: 'windsurf' };
    const windsurfResult = await generateAgentFile(windsurfConfig, mockInquirer);
    console.log(`✅ Windsurf file generated: ${windsurfResult.length} characters`);
    console.log(`📄 Contains project name: ${windsurfResult.includes('Test Project') ? 'Yes' : 'No'}`);
    
    // Test 4: Technology guidelines
    console.log('\n⚙️ Test 4: Technology-specific guidelines');
    const guidelines = windsurfResult.match(/### \w+ Guidelines/g) || [];
    console.log(`✅ Technology guidelines generated: ${guidelines.length > 0 ? 'Yes' : 'No'}`);
    if (guidelines.length > 0) {
      console.log(`📄 Found guidelines: ${guidelines.join(', ')}`);
    }
    
    console.log('\n🎉 All manual template tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Manual template tests failed:', error.message);
  }
}

// Export for manual testing
export { runManualTemplateTests, testConfig };

// Run manual tests if called directly
if (import.meta.main) {
  runManualTemplateTests().catch(console.error);
}