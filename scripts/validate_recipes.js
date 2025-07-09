#!/usr/bin/env node

/**
 * Recipe Validation Script
 * Validates recipe files for structure, content, and consistency
 * 
 * Usage:
 *   node scripts/validate_recipes.js [options]
 *   
 * Options:
 *   --file <path>     Validate a specific recipe file
 *   --dir <path>      Validate all recipes in a directory
 *   --remote          Validate remote recipes from GitHub
 *   --fix             Attempt to fix common issues
 *   --verbose         Show detailed validation output
 *   --help            Show this help message
 */

const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');
const { fileFormatHandler } = require('../lib/file_format_handler');

class RecipeValidator {
  constructor(options = {}) {
    this.options = {
      verbose: false,
      fix: false,
      ...options
    };
    this.errors = [];
    this.warnings = [];
    this.fixes = [];
  }

  /**
   * Validate a single recipe object
   * @param {Object} recipe - Recipe object to validate
   * @param {string} source - Source identifier (file path, URL, etc.)
   * @returns {Object} Validation result
   */
  validateRecipe(recipe, source = 'unknown') {
    const result = {
      valid: true,
      errors: [],
      warnings: [],
      fixes: []
    };

    // Required fields validation
    const requiredFields = ['name', 'description', 'category', 'techStack'];
    for (const field of requiredFields) {
      if (!recipe[field]) {
        result.errors.push(`Missing required field: ${field}`);
        result.valid = false;
      }
    }

    // Name validation
    if (recipe.name) {
      if (typeof recipe.name !== 'string') {
        result.errors.push('Recipe name must be a string');
        result.valid = false;
      } else if (recipe.name.length < 3) {
        result.errors.push('Recipe name must be at least 3 characters long');
        result.valid = false;
      } else if (recipe.name.length > 100) {
        result.warnings.push('Recipe name is very long (>100 characters)');
      }
    }

    // Description validation
    if (recipe.description) {
      if (typeof recipe.description !== 'string') {
        result.errors.push('Recipe description must be a string');
        result.valid = false;
      } else if (recipe.description.length < 10) {
        result.warnings.push('Recipe description is very short (<10 characters)');
      } else if (recipe.description.length > 500) {
        result.warnings.push('Recipe description is very long (>500 characters)');
      }
    }

    // Category validation
    const validCategories = [
      'Web Application',
      'Mobile App',
      'Desktop App',
      'API/Backend',
      'Library/Package',
      'CLI Tool',
      'Game Development',
      'Data Science',
      'Machine Learning',
      'DevOps',
      'Other'
    ];

    if (recipe.category && !validCategories.includes(recipe.category)) {
      result.warnings.push(`Category '${recipe.category}' is not in the standard list. Consider using: ${validCategories.join(', ')}`);
    }

    // Tech stack validation
    if (recipe.techStack) {
      if (typeof recipe.techStack !== 'object' || Array.isArray(recipe.techStack)) {
        result.errors.push('Tech stack must be an object');
        result.valid = false;
      } else {
        // Check for common tech stack fields
        const commonFields = ['language', 'frontend', 'backend', 'database', 'testing', 'deployment'];
        const hasCommonField = commonFields.some(field => recipe.techStack[field]);
        
        if (!hasCommonField && Object.keys(recipe.techStack).length === 0) {
          result.warnings.push('Tech stack is empty - consider adding common fields like language, frontend, backend, etc.');
        }

        // Validate tech stack values
        for (const [key, value] of Object.entries(recipe.techStack)) {
          if (typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'boolean') {
            result.warnings.push(`Tech stack field '${key}' should be a simple value (string, number, or boolean)`);
          }
        }
      }
    }

    // Tags validation (optional field)
    if (recipe.tags) {
      if (!Array.isArray(recipe.tags)) {
        result.errors.push('Tags must be an array');
        result.valid = false;
      } else {
        recipe.tags.forEach((tag, index) => {
          if (typeof tag !== 'string') {
            result.errors.push(`Tag at index ${index} must be a string`);
            result.valid = false;
          }
        });
      }
    }

    // Author validation (optional field)
    if (recipe.author && typeof recipe.author !== 'string') {
      result.warnings.push('Author should be a string');
    }

    // Version validation (optional field)
    if (recipe.version) {
      const semverRegex = /^\d+\.\d+\.\d+(-[a-zA-Z0-9-]+)?$/;
      if (!semverRegex.test(recipe.version)) {
        result.warnings.push('Version should follow semantic versioning (e.g., 1.0.0)');
      }
    }

    // Windsurf rules validation (optional field)
    if (recipe.windsurfRules) {
      if (typeof recipe.windsurfRules !== 'string') {
        result.errors.push('Windsurf rules must be a string');
        result.valid = false;
      } else if (recipe.windsurfRules.length < 10) {
        result.warnings.push('Windsurf rules are very short - consider adding more detailed guidelines');
      }
    }

    // Agent rules validation (optional field)
    if (recipe.agentRules) {
      if (typeof recipe.agentRules !== 'string') {
        result.errors.push('Agent rules must be a string');
        result.valid = false;
      }
    }

    // Auto-fix suggestions
    if (this.options.fix) {
      if (!recipe.tags) {
        result.fixes.push('Added empty tags array');
        recipe.tags = [];
      }
      
      if (!recipe.version) {
        result.fixes.push('Added default version 1.0.0');
        recipe.version = '1.0.0';
      }
      
      if (recipe.name && typeof recipe.name === 'string') {
        const trimmedName = recipe.name.trim();
        if (trimmedName !== recipe.name) {
          result.fixes.push('Trimmed whitespace from name');
          recipe.name = trimmedName;
        }
      }
    }

    return result;
  }

  /**
   * Validate a recipe file
   * @param {string} filePath - Path to the recipe file
   * @returns {Object} Validation result
   */
  async validateFile(filePath) {
    try {
      // Check if file format is supported
      if (!fileFormatHandler.isSupportedFormat(filePath)) {
        const ext = path.extname(filePath);
        return {
          valid: false,
          errors: [`Unsupported file format: ${ext}. Supported formats: .json, .yaml, .yml`],
          warnings: [],
          fixes: []
        };
      }

      let recipes;
      try {
        recipes = await fileFormatHandler.readFile(filePath);
      } catch (parseError) {
        const format = fileFormatHandler.isJsonFormat(filePath) ? 'JSON' : 'YAML';
        return {
          valid: false,
          errors: [`Invalid ${format}: ${parseError.message}`],
          warnings: [],
          fixes: []
        };
      }

      const results = [];

      if (Array.isArray(recipes)) {
        // Multiple recipes in array
        recipes.forEach((recipe, index) => {
          const result = this.validateRecipe(recipe, `${filePath}[${index}]`);
          result.source = `${filePath}[${index}]`;
          results.push(result);
        });
      } else if (typeof recipes === 'object') {
        // Single recipe or recipes object
        if (recipes.name && recipes.description) {
          // Single recipe
          const result = this.validateRecipe(recipes, filePath);
          result.source = filePath;
          results.push(result);
        } else {
          // Object with multiple recipes
          for (const [key, recipe] of Object.entries(recipes)) {
            const result = this.validateRecipe(recipe, `${filePath}.${key}`);
            result.source = `${filePath}.${key}`;
            result.key = key;
            results.push(result);
          }
        }
      } else {
        return {
          valid: false,
          errors: ['Recipe file must contain an object or array'],
          warnings: [],
          fixes: []
        };
      }

      return {
        valid: results.every(r => r.valid),
        results,
        filePath
      };

    } catch (error) {
      return {
        valid: false,
        errors: [`Failed to read file: ${error.message}`],
        warnings: [],
        fixes: [],
        filePath
      };
    }
  }

  /**
   * Validate all recipe files in a directory
   * @param {string} dirPath - Directory path
   * @returns {Array} Array of validation results
   */
  async validateDirectory(dirPath) {
    try {
      const supportedFiles = await fileFormatHandler.getSupportedFiles(dirPath);
      
      const results = [];
      for (const file of supportedFiles) {
        const filePath = path.join(dirPath, file);
        const result = await this.validateFile(filePath);
        results.push(result);
      }

      return results;
    } catch (error) {
      throw new Error(`Failed to read directory: ${error.message}`);
    }
  }

  /**
   * Validate remote recipes from GitHub
   * @returns {Object} Validation result
   */
  async validateRemoteRecipes() {
    try {
      const { loadRecipes } = require('../lib/recipes_lib');
      const recipes = await loadRecipes();
      
      const results = [];
      for (const [key, recipe] of Object.entries(recipes)) {
        const result = this.validateRecipe(recipe, `remote.${key}`);
        result.source = `remote.${key}`;
        result.key = key;
        results.push(result);
      }

      return {
        valid: results.every(r => r.valid),
        results,
        source: 'remote'
      };
    } catch (error) {
      return {
        valid: false,
        errors: [`Failed to load remote recipes: ${error.message}`],
        warnings: [],
        fixes: []
      };
    }
  }

  /**
   * Display validation results
   * @param {Object|Array} results - Validation results
   */
  displayResults(results) {
    if (Array.isArray(results)) {
      // Multiple file results
      let totalValid = 0;
      let totalInvalid = 0;
      let totalWarnings = 0;

      console.log(chalk.blue('\n📋 Recipe Validation Results\n'));

      results.forEach(fileResult => {
        if (fileResult.results) {
          // File with multiple recipes
          console.log(chalk.cyan(`📄 ${fileResult.filePath}`));
          
          fileResult.results.forEach(result => {
            if (result.valid) {
              totalValid++;
              console.log(chalk.green(`  ✅ ${result.source || 'Recipe'}: Valid`));
            } else {
              totalInvalid++;
              console.log(chalk.red(`  ❌ ${result.source || 'Recipe'}: Invalid`));
              result.errors.forEach(error => {
                console.log(chalk.red(`     • ${error}`));
              });
            }

            if (result.warnings.length > 0) {
              totalWarnings += result.warnings.length;
              result.warnings.forEach(warning => {
                console.log(chalk.yellow(`     ⚠️  ${warning}`));
              });
            }

            if (this.options.fix && result.fixes.length > 0) {
              result.fixes.forEach(fix => {
                console.log(chalk.blue(`     🔧 ${fix}`));
              });
            }
          });
        } else {
          // Single file result
          if (fileResult.valid) {
            totalValid++;
            console.log(chalk.green(`✅ ${fileResult.filePath}: Valid`));
          } else {
            totalInvalid++;
            console.log(chalk.red(`❌ ${fileResult.filePath}: Invalid`));
            fileResult.errors.forEach(error => {
              console.log(chalk.red(`   • ${error}`));
            });
          }
        }
      });

      console.log(chalk.blue('\n📊 Summary:'));
      console.log(chalk.green(`✅ Valid recipes: ${totalValid}`));
      console.log(chalk.red(`❌ Invalid recipes: ${totalInvalid}`));
      console.log(chalk.yellow(`⚠️  Total warnings: ${totalWarnings}`));

    } else {
      // Single result
      if (results.results) {
        // Multiple recipes in single result
        console.log(chalk.blue('\n📋 Recipe Validation Results\n'));
        
        let validCount = 0;
        let invalidCount = 0;
        let warningCount = 0;

        results.results.forEach(result => {
          if (result.valid) {
            validCount++;
            console.log(chalk.green(`✅ ${result.source}: Valid`));
          } else {
            invalidCount++;
            console.log(chalk.red(`❌ ${result.source}: Invalid`));
            result.errors.forEach(error => {
              console.log(chalk.red(`   • ${error}`));
            });
          }

          if (result.warnings.length > 0) {
            warningCount += result.warnings.length;
            result.warnings.forEach(warning => {
              console.log(chalk.yellow(`   ⚠️  ${warning}`));
            });
          }

          if (this.options.fix && result.fixes.length > 0) {
            result.fixes.forEach(fix => {
              console.log(chalk.blue(`   🔧 ${fix}`));
            });
          }
        });

        console.log(chalk.blue('\n📊 Summary:'));
        console.log(chalk.green(`✅ Valid recipes: ${validCount}`));
        console.log(chalk.red(`❌ Invalid recipes: ${invalidCount}`));
        console.log(chalk.yellow(`⚠️  Total warnings: ${warningCount}`));
      }
    }
  }

  /**
   * Generate a sample recipe for reference
   * @returns {Object} Sample recipe object
   */
  generateSampleRecipe() {
    return {
      name: "React TypeScript Web App",
      description: "A modern React application with TypeScript, featuring component-based architecture and modern development tools",
      category: "Web Application",
      version: "1.0.0",
      author: "Your Name",
      tags: ["react", "typescript", "web", "frontend"],
      techStack: {
        language: "TypeScript",
        frontend: "React",
        bundler: "Vite",
        styling: "Tailwind CSS",
        testing: "Jest + React Testing Library",
        linting: "ESLint + Prettier",
        deployment: "Vercel"
      },
      windsurfRules: `# React TypeScript Project Rules

## Component Guidelines
- Use functional components with hooks
- Implement proper TypeScript interfaces for props
- Follow the single responsibility principle
- Use descriptive component and prop names

## Code Organization
- Group related components in feature folders
- Separate business logic into custom hooks
- Use absolute imports with path mapping
- Keep components under 200 lines

## Performance
- Use React.memo for expensive components
- Implement proper dependency arrays in useEffect
- Lazy load routes and heavy components
- Optimize bundle size with code splitting

## Testing
- Write unit tests for all custom hooks
- Test component behavior, not implementation
- Use data-testid for reliable element selection
- Maintain >80% test coverage`,
      agentRules: `# AI Assistant Rules for React TypeScript Project

## Code Generation
- Always use TypeScript with proper type definitions
- Generate functional components with proper interfaces
- Include error boundaries for production components
- Use modern React patterns (hooks, context, suspense)

## Best Practices
- Follow React and TypeScript best practices
- Implement proper error handling
- Use semantic HTML and accessibility features
- Include proper documentation and comments

## File Structure
- Create components in feature-based folders
- Include index.ts files for clean imports
- Separate types into dedicated files
- Follow consistent naming conventions`
    };
  }
}

// CLI functionality
async function main() {
  const args = process.argv.slice(2);
  const options = {
    verbose: args.includes('--verbose'),
    fix: args.includes('--fix')
  };

  const validator = new RecipeValidator(options);

  if (args.includes('--help')) {
    console.log(`
Recipe Validation Script

Usage:
  node scripts/validate_recipes.js [options]

Options:
  --file <path>     Validate a specific recipe file (JSON/YAML)
  --dir <path>      Validate all recipes in a directory (JSON/YAML)
  --remote          Validate remote recipes from GitHub
  --fix             Attempt to fix common issues
  --verbose         Show detailed validation output
  --sample          Generate a sample recipe file
  --help            Show this help message

Supported Formats:
  - JSON (.json)
  - YAML (.yaml, .yml)

Examples:
  node scripts/validate_recipes.js --remote
  node scripts/validate_recipes.js --file recipes/react.json
  node scripts/validate_recipes.js --file recipes/react.yaml
  node scripts/validate_recipes.js --dir ./recipes --fix
  node scripts/validate_recipes.js --sample > sample_recipe.json
`);
    return;
  }

  if (args.includes('--sample')) {
    const sample = validator.generateSampleRecipe();
    console.log(JSON.stringify(sample, null, 2));
    return;
  }

  try {
    let results;

    const fileIndex = args.indexOf('--file');
    const dirIndex = args.indexOf('--dir');

    if (fileIndex !== -1 && args[fileIndex + 1]) {
      // Validate specific file
      const filePath = args[fileIndex + 1];
      console.log(chalk.blue(`🔍 Validating file: ${filePath}`));
      results = await validator.validateFile(filePath);
    } else if (dirIndex !== -1 && args[dirIndex + 1]) {
      // Validate directory
      const dirPath = args[dirIndex + 1];
      console.log(chalk.blue(`🔍 Validating directory: ${dirPath}`));
      results = await validator.validateDirectory(dirPath);
    } else if (args.includes('--remote')) {
      // Validate remote recipes
      console.log(chalk.blue('🔍 Validating remote recipes...'));
      results = await validator.validateRemoteRecipes();
    } else {
      // Default: validate windsurf_recipes directory if it exists
      try {
        await fs.access('windsurf_recipes');
        console.log(chalk.blue('🔍 Validating windsurf_recipes directory...'));
        results = await validator.validateDirectory('windsurf_recipes');
      } catch {
        console.log(chalk.blue('🔍 Validating remote recipes (no local recipes found)...'));
        results = await validator.validateRemoteRecipes();
      }
    }

    validator.displayResults(results);

    // Exit with appropriate code
    const hasErrors = Array.isArray(results) 
      ? results.some(r => !r.valid || (r.results && r.results.some(rr => !rr.valid)))
      : !results.valid;

    process.exit(hasErrors ? 1 : 0);

  } catch (error) {
    console.error(chalk.red(`❌ Validation failed: ${error.message}`));
    process.exit(1);
  }
}

// Export for testing
module.exports = { RecipeValidator };

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error(chalk.red(`❌ Unexpected error: ${error.message}`));
    process.exit(1);
  });
}