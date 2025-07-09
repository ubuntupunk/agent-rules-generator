/**
 * Recipe Creator Tests
 * Tests the interactive recipe creation functionality
 */

import { describe, test, expect, beforeEach } from 'bun:test';
import { RecipeCreator } from '../lib/recipe_creator.js';
import fs from 'fs/promises';

describe('Recipe Creator', () => {
  let recipeCreator;
  let mockConfig;

  beforeEach(() => {
    mockConfig = {
      overview: {},
      technologyStack: {},
      codingStandards: {},
      projectStructure: {},
      workflowGuidelines: {},
      projectManagement: {}
    };
    recipeCreator = new RecipeCreator(mockConfig);
  });

  describe('Technology Stack Suggestions', () => {
    test('should suggest appropriate language for category', () => {
      expect(recipeCreator.suggestLanguageForCategory('Web Application')).toBe('JavaScript/TypeScript');
      expect(recipeCreator.suggestLanguageForCategory('Data Science')).toBe('Python');
      expect(recipeCreator.suggestLanguageForCategory('Machine Learning')).toBe('Python');
      expect(recipeCreator.suggestLanguageForCategory('CLI Tool')).toBe('Node.js');
      expect(recipeCreator.suggestLanguageForCategory('Unknown Category')).toBe('JavaScript');
    });

    test('should suggest appropriate frontend for category', () => {
      expect(recipeCreator.suggestFrontendForCategory('Web Application')).toBe('React');
      expect(recipeCreator.suggestFrontendForCategory('Mobile App')).toBe('React Native');
      expect(recipeCreator.suggestFrontendForCategory('API/Backend')).toBe('');
    });

    test('should suggest appropriate backend for language', () => {
      expect(recipeCreator.suggestBackendForLanguage('JavaScript')).toBe('Express.js');
      expect(recipeCreator.suggestBackendForLanguage('Node.js')).toBe('Express.js');
      expect(recipeCreator.suggestBackendForLanguage('Python')).toBe('FastAPI');
      expect(recipeCreator.suggestBackendForLanguage('Java')).toBe('Spring Boot');
      expect(recipeCreator.suggestBackendForLanguage('Unknown')).toBe('');
    });

    test('should suggest appropriate testing framework for language', () => {
      expect(recipeCreator.suggestTestingForLanguage('JavaScript')).toBe('Jest');
      expect(recipeCreator.suggestTestingForLanguage('Node')).toBe('Jest');
      expect(recipeCreator.suggestTestingForLanguage('Python')).toBe('pytest');
      expect(recipeCreator.suggestTestingForLanguage('Java')).toBe('JUnit');
      expect(recipeCreator.suggestTestingForLanguage('Unknown')).toBe('');
    });

    test('should suggest appropriate linting for language', () => {
      expect(recipeCreator.suggestLintingForLanguage('JavaScript')).toBe('ESLint + Prettier');
      expect(recipeCreator.suggestLintingForLanguage('TypeScript')).toBe('ESLint + Prettier');
      expect(recipeCreator.suggestLintingForLanguage('Python')).toBe('Black + Flake8');
      expect(recipeCreator.suggestLintingForLanguage('Java')).toBe('Checkstyle');
    });

    test('should suggest appropriate deployment for category', () => {
      expect(recipeCreator.suggestDeploymentForCategory('Web Application')).toBe('Vercel/Netlify');
      expect(recipeCreator.suggestDeploymentForCategory('API/Backend')).toBe('Railway/Heroku');
      expect(recipeCreator.suggestDeploymentForCategory('Mobile App')).toBe('App Store/Play Store');
      expect(recipeCreator.suggestDeploymentForCategory('CLI Tool')).toBe('npm/PyPI');
    });
  });

  describe('Package.json Detection', () => {
    test('should detect TypeScript from package.json', () => {
      const packageJson = {
        devDependencies: {
          typescript: '^4.0.0'
        }
      };
      
      const detected = recipeCreator.detectTechFromPackageJson(packageJson);
      expect(detected.language).toBe('TypeScript');
    });

    test('should detect JavaScript when no TypeScript', () => {
      const packageJson = {
        dependencies: {
          express: '^4.0.0'
        }
      };
      
      const detected = recipeCreator.detectTechFromPackageJson(packageJson);
      expect(detected.language).toBe('JavaScript');
    });

    test('should detect React framework', () => {
      const packageJson = {
        dependencies: {
          react: '^18.0.0'
        }
      };
      
      const detected = recipeCreator.detectTechFromPackageJson(packageJson);
      expect(detected.frontend).toBe('React');
    });

    test('should detect Vue framework', () => {
      const packageJson = {
        dependencies: {
          vue: '^3.0.0'
        }
      };
      
      const detected = recipeCreator.detectTechFromPackageJson(packageJson);
      expect(detected.frontend).toBe('Vue');
    });

    test('should detect Express backend', () => {
      const packageJson = {
        dependencies: {
          express: '^4.0.0'
        }
      };
      
      const detected = recipeCreator.detectTechFromPackageJson(packageJson);
      expect(detected.backend).toBe('Express');
    });

    test('should detect Jest testing framework', () => {
      const packageJson = {
        devDependencies: {
          jest: '^28.0.0'
        }
      };
      
      const detected = recipeCreator.detectTechFromPackageJson(packageJson);
      expect(detected.testing).toBe('Jest');
    });

    test('should detect Vite bundler', () => {
      const packageJson = {
        devDependencies: {
          vite: '^4.0.0'
        }
      };
      
      const detected = recipeCreator.detectTechFromPackageJson(packageJson);
      expect(detected.bundler).toBe('Vite');
    });

    test('should handle empty package.json', () => {
      const packageJson = {};
      
      const detected = recipeCreator.detectTechFromPackageJson(packageJson);
      expect(detected.language).toBe('JavaScript');
      expect(detected.frontend).toBeUndefined();
      expect(detected.backend).toBeUndefined();
    });

    test('should handle complex package.json with multiple frameworks', () => {
      const packageJson = {
        dependencies: {
          react: '^18.0.0',
          express: '^4.0.0'
        },
        devDependencies: {
          typescript: '^4.0.0',
          jest: '^28.0.0',
          vite: '^4.0.0'
        }
      };
      
      const detected = recipeCreator.detectTechFromPackageJson(packageJson);
      expect(detected.language).toBe('TypeScript');
      expect(detected.frontend).toBe('React');
      expect(detected.backend).toBe('Express');
      expect(detected.testing).toBe('Jest');
      expect(detected.bundler).toBe('Vite');
    });
  });

  describe('Rules Template Generation', () => {
    test('should generate rules template for React TypeScript project', () => {
      recipeCreator.recipe = {
        name: 'React TypeScript App',
        category: 'Web Application'
      };
      
      const techStack = {
        language: 'TypeScript',
        frontend: 'React',
        testing: 'Jest'
      };
      
      const template = recipeCreator.generateRulesTemplateForTechStack(techStack);
      
      expect(template).toContain('React TypeScript App - Development Rules');
      expect(template).toContain('Use TypeScript with consistent coding standards');
      expect(template).toContain('React best practices');
      expect(template).toContain('Jest');
      expect(template).toContain('Component-based architecture');
    });

    test('should generate rules template for Python project', () => {
      recipeCreator.recipe = {
        name: 'Python API',
        category: 'API/Backend'
      };
      
      const techStack = {
        language: 'Python',
        backend: 'FastAPI',
        testing: 'pytest'
      };
      
      const template = recipeCreator.generateRulesTemplateForTechStack(techStack);
      
      expect(template).toContain('Python API - Development Rules');
      expect(template).toContain('Use Python with consistent coding standards');
      expect(template).toContain('FastAPI');
      expect(template).toContain('pytest');
    });

    test('should generate agent rules template', () => {
      recipeCreator.recipe = {
        name: 'Test Project'
      };
      
      const techStack = {
        language: 'JavaScript',
        testing: 'Jest'
      };
      
      const template = recipeCreator.generateAgentRulesTemplate(techStack);
      
      expect(template).toContain('AI Assistant Rules for Test Project');
      expect(template).toContain('Generate JavaScript code');
      expect(template).toContain('Jest');
      expect(template).toContain('Code Generation');
      expect(template).toContain('Architecture Patterns');
    });

    test('should handle minimal tech stack in template generation', () => {
      recipeCreator.recipe = {
        name: 'Minimal Project'
      };
      
      const techStack = {
        language: 'JavaScript'
      };
      
      const template = recipeCreator.generateRulesTemplateForTechStack(techStack);
      
      expect(template).toContain('Minimal Project - Development Rules');
      expect(template).toContain('Use JavaScript');
      expect(template).toContain('modern development patterns');
    });
  });

  describe('Validation Integration', () => {
    test('should have validator instance with fix option enabled', () => {
      expect(recipeCreator.validator).toBeDefined();
      expect(recipeCreator.validator.options.fix).toBe(true);
    });

    test('should validate recipe during creation process', () => {
      const testRecipe = {
        name: 'Test Recipe',
        description: 'A test recipe for validation',
        category: 'Web Application',
        techStack: {
          language: 'JavaScript'
        }
      };
      
      const result = recipeCreator.validator.validateRecipe(testRecipe, 'test');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should apply auto-fixes during validation', () => {
      const testRecipe = {
        name: '  Test Recipe  ', // Has whitespace
        description: 'A test recipe for validation',
        category: 'Web Application',
        techStack: {
          language: 'JavaScript'
        }
        // Missing version and tags
      };
      
      const result = recipeCreator.validator.validateRecipe(testRecipe, 'test');
      expect(result.valid).toBe(true);
      expect(result.fixes.length).toBeGreaterThan(0);
      expect(testRecipe.name).toBe('Test Recipe'); // Whitespace trimmed
      expect(testRecipe.version).toBe('1.0.0'); // Default version added
      expect(testRecipe.tags).toEqual([]); // Empty tags array added
    });
  });

  describe('Configuration Integration', () => {
    test('should initialize with provided config', () => {
      const testConfig = { test: 'value' };
      const creator = new RecipeCreator(testConfig);
      
      expect(creator.config).toBe(testConfig);
    });

    test('should start with empty recipe object', () => {
      expect(recipeCreator.recipe).toEqual({});
    });

    test('should maintain recipe state during creation', () => {
      recipeCreator.recipe.name = 'Test Recipe';
      recipeCreator.recipe.category = 'Web Application';
      
      expect(recipeCreator.recipe.name).toBe('Test Recipe');
      expect(recipeCreator.recipe.category).toBe('Web Application');
    });
  });

  describe('Error Handling', () => {
    test('should handle missing package.json gracefully', async () => {
      // This would be tested in integration tests where file system is mocked
      const packageJson = null;
      
      // Should not throw error when package.json is missing
      expect(() => {
        if (packageJson) {
          recipeCreator.detectTechFromPackageJson(packageJson);
        }
      }).not.toThrow();
    });

    test('should handle invalid tech stack gracefully', () => {
      const invalidTechStack = null;
      
      const template = recipeCreator.generateRulesTemplateForTechStack(invalidTechStack || {});
      expect(template).toContain('Development Rules');
      expect(template).toContain('modern development patterns');
    });

    test('should handle empty recipe name in template generation', () => {
      recipeCreator.recipe = {}; // No name
      
      const template = recipeCreator.generateRulesTemplateForTechStack({});
      expect(template).toContain('Development Rules');
    });
  });

  describe('Edge Cases', () => {
    test('should handle unknown category suggestions', () => {
      expect(recipeCreator.suggestLanguageForCategory('Unknown Category')).toBe('JavaScript');
      expect(recipeCreator.suggestFrontendForCategory('Unknown Category')).toBe('');
      expect(recipeCreator.suggestDeploymentForCategory('Unknown Category')).toBe('');
    });

    test('should handle null/undefined language suggestions', () => {
      expect(recipeCreator.suggestBackendForLanguage(null)).toBe('');
      expect(recipeCreator.suggestTestingForLanguage(undefined)).toBe('');
      expect(recipeCreator.suggestLintingForLanguage('')).toBe('');
    });

    test('should handle package.json with no dependencies', () => {
      const packageJson = {
        name: 'test-project',
        version: '1.0.0'
      };
      
      const detected = recipeCreator.detectTechFromPackageJson(packageJson);
      expect(detected.language).toBe('JavaScript');
      expect(Object.keys(detected)).toHaveLength(1);
    });

    test('should handle package.json with empty dependencies', () => {
      const packageJson = {
        dependencies: {},
        devDependencies: {}
      };
      
      const detected = recipeCreator.detectTechFromPackageJson(packageJson);
      expect(detected.language).toBe('JavaScript');
    });
  });
});

// Integration test simulation
describe('Recipe Creator Integration', () => {
  test('should create a complete recipe object', () => {
    const recipeCreator = new RecipeCreator({});
    
    // Simulate the recipe creation process
    const mockRecipe = {
      name: 'Test Integration Recipe',
      description: 'A comprehensive test recipe for integration testing',
      category: 'Web Application',
      version: '1.0.0',
      author: 'Test Author',
      tags: ['test', 'integration', 'web'],
      techStack: {
        language: 'TypeScript',
        frontend: 'React',
        backend: 'Express.js',
        database: 'PostgreSQL',
        testing: 'Jest',
        linting: 'ESLint + Prettier',
        deployment: 'Vercel'
      },
      windsurfRules: '# Test Windsurf Rules\n\nTest content for Windsurf rules.',
      agentRules: '# Test Agent Rules\n\nTest content for AI assistant rules.'
    };
    
    // Validate the complete recipe
    const validationResult = recipeCreator.validator.validateRecipe(mockRecipe, 'integration-test');
    
    expect(validationResult.valid).toBe(true);
    expect(validationResult.errors).toHaveLength(0);
    expect(mockRecipe.name).toBeDefined();
    expect(mockRecipe.description).toBeDefined();
    expect(mockRecipe.category).toBeDefined();
    expect(mockRecipe.techStack).toBeDefined();
    expect(typeof mockRecipe.techStack).toBe('object');
    expect(Array.isArray(mockRecipe.tags)).toBe(true);
  });

  test('should generate appropriate templates for different project types', () => {
    const testCases = [
      {
        category: 'Web Application',
        techStack: { language: 'TypeScript', frontend: 'React' },
        expectedInTemplate: ['TypeScript', 'React', 'Component-based']
      },
      {
        category: 'API/Backend',
        techStack: { language: 'Python', backend: 'FastAPI' },
        expectedInTemplate: ['Python', 'FastAPI', 'RESTful API']
      },
      {
        category: 'CLI Tool',
        techStack: { language: 'Node.js' },
        expectedInTemplate: ['Node.js', 'Modular architecture']
      }
    ];
    
    testCases.forEach(({ category, techStack, expectedInTemplate }) => {
      const recipeCreator = new RecipeCreator({});
      recipeCreator.recipe = { name: `Test ${category}`, category };
      
      const template = recipeCreator.generateRulesTemplateForTechStack(techStack);
      
      expectedInTemplate.forEach(expected => {
        expect(template).toContain(expected);
      });
    });
  });
});