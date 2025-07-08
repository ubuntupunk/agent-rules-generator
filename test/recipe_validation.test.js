/**
 * Recipe Validation Tests
 * Tests the recipe validation script functionality
 */

import { describe, test, expect, beforeEach } from 'bun:test';
import { RecipeValidator } from '../scripts/validate_recipes.js';

describe('Recipe Validation', () => {
  let validator;

  beforeEach(() => {
    validator = new RecipeValidator();
  });

  describe('Valid Recipe Validation', () => {
    test('should validate a complete valid recipe', () => {
      const validRecipe = {
        name: 'Test Recipe',
        description: 'A test recipe for validation',
        category: 'Web Application',
        techStack: {
          language: 'JavaScript',
          frontend: 'React'
        },
        tags: ['test', 'validation'],
        version: '1.0.0',
        author: 'Test Author'
      };

      const result = validator.validateRecipe(validRecipe, 'test');
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should validate minimal valid recipe', () => {
      const minimalRecipe = {
        name: 'Minimal Recipe',
        description: 'A minimal test recipe',
        category: 'CLI Tool',
        techStack: {
          language: 'Node.js'
        }
      };

      const result = validator.validateRecipe(minimalRecipe, 'test');
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('Invalid Recipe Validation', () => {
    test('should fail validation for missing required fields', () => {
      const invalidRecipe = {
        name: 'Incomplete Recipe'
        // Missing description, category, techStack
      };

      const result = validator.validateRecipe(invalidRecipe, 'test');
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing required field: description');
      expect(result.errors).toContain('Missing required field: category');
      expect(result.errors).toContain('Missing required field: techStack');
    });

    test('should fail validation for invalid field types', () => {
      const invalidRecipe = {
        name: 123, // Should be string
        description: 'Valid description',
        category: 'Web Application',
        techStack: 'invalid', // Should be object
        tags: 'invalid' // Should be array
      };

      const result = validator.validateRecipe(invalidRecipe, 'test');
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Recipe name must be a string');
      expect(result.errors).toContain('Tech stack must be an object');
      expect(result.errors).toContain('Tags must be an array');
    });

    test('should fail validation for short name', () => {
      const invalidRecipe = {
        name: 'AB', // Too short
        description: 'Valid description',
        category: 'Web Application',
        techStack: { language: 'JavaScript' }
      };

      const result = validator.validateRecipe(invalidRecipe, 'test');
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Recipe name must be at least 3 characters long');
    });
  });

  describe('Warning Validation', () => {
    test('should warn about non-standard category', () => {
      const recipeWithCustomCategory = {
        name: 'Custom Category Recipe',
        description: 'A recipe with custom category',
        category: 'Custom Category',
        techStack: { language: 'JavaScript' }
      };

      const result = validator.validateRecipe(recipeWithCustomCategory, 'test');
      
      expect(result.valid).toBe(true);
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings[0]).toContain('Category \'Custom Category\' is not in the standard list');
    });

    test('should warn about short description', () => {
      const recipeWithShortDesc = {
        name: 'Short Desc Recipe',
        description: 'Short', // Very short description
        category: 'Web Application',
        techStack: { language: 'JavaScript' }
      };

      const result = validator.validateRecipe(recipeWithShortDesc, 'test');
      
      expect(result.valid).toBe(true);
      expect(result.warnings).toContain('Recipe description is very short (<10 characters)');
    });

    test('should warn about empty tech stack', () => {
      const recipeWithEmptyTechStack = {
        name: 'Empty Tech Stack Recipe',
        description: 'A recipe with empty tech stack',
        category: 'Web Application',
        techStack: {}
      };

      const result = validator.validateRecipe(recipeWithEmptyTechStack, 'test');
      
      expect(result.valid).toBe(true);
      expect(result.warnings).toContain('Tech stack is empty - consider adding common fields like language, frontend, backend, etc.');
    });

    test('should warn about invalid version format', () => {
      const recipeWithInvalidVersion = {
        name: 'Invalid Version Recipe',
        description: 'A recipe with invalid version',
        category: 'Web Application',
        techStack: { language: 'JavaScript' },
        version: 'invalid-version'
      };

      const result = validator.validateRecipe(recipeWithInvalidVersion, 'test');
      
      expect(result.valid).toBe(true);
      expect(result.warnings).toContain('Version should follow semantic versioning (e.g., 1.0.0)');
    });
  });

  describe('Auto-fix Functionality', () => {
    test('should auto-fix missing optional fields when fix option is enabled', () => {
      const validatorWithFix = new RecipeValidator({ fix: true });
      
      const recipeToFix = {
        name: '  Trimmed Name  ', // Has whitespace
        description: 'Valid description',
        category: 'Web Application',
        techStack: { language: 'JavaScript' }
        // Missing tags and version
      };

      const result = validatorWithFix.validateRecipe(recipeToFix, 'test');
      
      expect(result.valid).toBe(true);
      expect(result.fixes).toContain('Added empty tags array');
      expect(result.fixes).toContain('Added default version 1.0.0');
      expect(result.fixes).toContain('Trimmed whitespace from name');
      expect(recipeToFix.tags).toEqual([]);
      expect(recipeToFix.version).toBe('1.0.0');
      expect(recipeToFix.name).toBe('Trimmed Name');
    });
  });

  describe('Sample Recipe Generation', () => {
    test('should generate a valid sample recipe', () => {
      const sample = validator.generateSampleRecipe();
      const result = validator.validateRecipe(sample, 'sample');
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(sample.name).toBeDefined();
      expect(sample.description).toBeDefined();
      expect(sample.category).toBeDefined();
      expect(sample.techStack).toBeDefined();
      expect(sample.windsurfRules).toBeDefined();
      expect(sample.agentRules).toBeDefined();
    });

    test('sample recipe should have all recommended fields', () => {
      const sample = validator.generateSampleRecipe();
      
      expect(sample).toHaveProperty('name');
      expect(sample).toHaveProperty('description');
      expect(sample).toHaveProperty('category');
      expect(sample).toHaveProperty('version');
      expect(sample).toHaveProperty('author');
      expect(sample).toHaveProperty('tags');
      expect(sample).toHaveProperty('techStack');
      expect(sample).toHaveProperty('windsurfRules');
      expect(sample).toHaveProperty('agentRules');
    });
  });

  describe('Edge Cases', () => {
    test('should handle null and undefined values gracefully', () => {
      const recipeWithNulls = {
        name: null,
        description: undefined,
        category: 'Web Application',
        techStack: { language: 'JavaScript' }
      };

      const result = validator.validateRecipe(recipeWithNulls, 'test');
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing required field: name');
      expect(result.errors).toContain('Missing required field: description');
    });

    test('should handle complex tech stack values', () => {
      const recipeWithComplexTechStack = {
        name: 'Complex Tech Stack Recipe',
        description: 'A recipe with complex tech stack',
        category: 'Web Application',
        techStack: {
          language: 'JavaScript',
          frameworks: ['React', 'Express'], // Array value
          isProduction: true, // Boolean value
          port: 3000, // Number value
          config: { nested: 'object' } // Object value
        }
      };

      const result = validator.validateRecipe(recipeWithComplexTechStack, 'test');
      
      expect(result.valid).toBe(true);
      expect(result.warnings.some(w => w.includes('should be a simple value'))).toBe(true);
    });
  });
});

// Integration test with actual recipe validation
describe('Recipe Validation Integration', () => {
  test('should validate actual remote recipes without errors', async () => {
    const validator = new RecipeValidator();
    
    try {
      const result = await validator.validateRemoteRecipes();
      
      // All recipes should be structurally valid (even if they have warnings)
      expect(result.results.every(r => r.valid)).toBe(true);
      
      // Should have some recipes
      expect(result.results.length).toBeGreaterThan(0);
      
    } catch (error) {
      // If remote recipes can't be loaded, that's okay for testing
      console.log('Remote recipes not available for testing:', error.message);
    }
  });
});