/**
 * Recipe Creator Module
 * Interactive recipe creation with built-in validation
 * 
 * This module provides a guided interface for creating new recipes
 * with real-time validation and auto-completion suggestions.
 */

const chalk = require('chalk');
const inquirer = require('inquirer').default;
const fs = require('fs').promises;
const path = require('path');
const { RecipeValidator } = require('../scripts/validate_recipes.js');

class RecipeCreator {
  constructor(config) {
    this.config = config;
    this.validator = new RecipeValidator({ fix: true });
    this.recipe = {};
  }

  /**
   * Start the interactive recipe creation process
   * @returns {Promise<Object>} Created recipe object
   */
  async createRecipe() {
    console.log(chalk.blue('\n🍳 Recipe Creator'));
    console.log(chalk.gray('Create a new recipe with guided prompts and auto-validation\n'));

    try {
      // Step 1: Basic Information
      await this.collectBasicInfo();
      
      // Step 2: Technology Stack
      await this.collectTechStack();
      
      // Step 3: Optional Fields
      await this.collectOptionalFields();
      
      // Step 4: Rules and Guidelines
      await this.collectRules();
      
      // Step 5: Validation and Review
      await this.validateAndReview();
      
      // Step 6: Save Recipe
      await this.saveRecipe();
      
      return this.recipe;
      
    } catch (error) {
      console.error(chalk.red(`❌ Recipe creation failed: ${error.message}`));
      throw error;
    }
  }

  /**
   * Collect basic recipe information
   */
  async collectBasicInfo() {
    console.log(chalk.cyan('📋 Basic Information'));
    
    const basicInfo = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Recipe name:',
        validate: (input) => {
          if (!input || input.trim().length < 3) {
            return 'Recipe name must be at least 3 characters long';
          }
          if (input.length > 100) {
            return 'Recipe name must be less than 100 characters';
          }
          return true;
        },
        filter: (input) => input.trim()
      },
      {
        type: 'input',
        name: 'description',
        message: 'Recipe description:',
        validate: (input) => {
          if (!input || input.trim().length < 10) {
            return 'Description must be at least 10 characters long';
          }
          if (input.length > 500) {
            return 'Description must be less than 500 characters';
          }
          return true;
        },
        filter: (input) => input.trim()
      },
      {
        type: 'list',
        name: 'category',
        message: 'Project category:',
        choices: [
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
        ]
      },
      {
        type: 'input',
        name: 'customCategory',
        message: 'Enter custom category:',
        when: (answers) => answers.category === 'Other',
        validate: (input) => {
          if (!input || input.trim().length < 2) {
            return 'Custom category must be at least 2 characters long';
          }
          return true;
        }
      }
    ]);

    // Use custom category if provided
    if (basicInfo.customCategory) {
      basicInfo.category = basicInfo.customCategory;
      delete basicInfo.customCategory;
    }

    Object.assign(this.recipe, basicInfo);
    console.log(chalk.green('✅ Basic information collected\n'));
  }

  /**
   * Collect technology stack information
   */
  async collectTechStack() {
    console.log(chalk.cyan('⚙️ Technology Stack'));
    
    const techStackMethod = await inquirer.prompt([
      {
        type: 'list',
        name: 'method',
        message: 'How would you like to define the technology stack?',
        choices: [
          { name: 'Guided setup (recommended)', value: 'guided' },
          { name: 'Manual entry', value: 'manual' },
          { name: 'Import from current project', value: 'import' }
        ]
      }
    ]);

    switch (techStackMethod.method) {
      case 'guided':
        await this.guidedTechStackSetup();
        break;
      case 'manual':
        await this.manualTechStackSetup();
        break;
      case 'import':
        await this.importTechStackFromProject();
        break;
    }

    console.log(chalk.green('✅ Technology stack configured\n'));
  }

  /**
   * Guided technology stack setup based on category
   */
  async guidedTechStackSetup() {
    const category = this.recipe.category;
    let questions = [];

    // Common questions for all categories
    questions.push({
      type: 'input',
      name: 'language',
      message: 'Primary programming language:',
      default: this.suggestLanguageForCategory(category),
      validate: (input) => input.trim().length > 0 || 'Language is required'
    });

    // Category-specific questions
    if (['Web Application', 'Mobile App'].includes(category)) {
      questions.push({
        type: 'input',
        name: 'frontend',
        message: 'Frontend framework/library:',
        default: this.suggestFrontendForCategory(category)
      });
    }

    if (['Web Application', 'API/Backend', 'Mobile App'].includes(category)) {
      questions.push({
        type: 'input',
        name: 'backend',
        message: 'Backend framework:',
        default: this.suggestBackendForLanguage(this.recipe.language)
      });

      questions.push({
        type: 'input',
        name: 'database',
        message: 'Database:',
        default: 'PostgreSQL'
      });
    }

    // Common development tools
    questions.push(
      {
        type: 'input',
        name: 'testing',
        message: 'Testing framework:',
        default: this.suggestTestingForLanguage(this.recipe.language)
      },
      {
        type: 'input',
        name: 'linting',
        message: 'Linting/formatting tools:',
        default: this.suggestLintingForLanguage(this.recipe.language)
      },
      {
        type: 'input',
        name: 'deployment',
        message: 'Deployment platform:',
        default: this.suggestDeploymentForCategory(category)
      }
    );

    const techStack = await inquirer.prompt(questions);
    
    // Remove empty values
    Object.keys(techStack).forEach(key => {
      if (!techStack[key] || techStack[key].trim() === '') {
        delete techStack[key];
      }
    });

    this.recipe.techStack = techStack;
  }

  /**
   * Manual technology stack setup
   */
  async manualTechStackSetup() {
    console.log(chalk.gray('Enter technology stack as key-value pairs. Press Enter with empty key to finish.'));
    
    const techStack = {};
    let addingMore = true;

    while (addingMore) {
      const entry = await inquirer.prompt([
        {
          type: 'input',
          name: 'key',
          message: 'Technology field (e.g., language, frontend, backend):',
          validate: (input) => {
            if (!input.trim()) return true; // Allow empty to finish
            if (techStack[input.trim()]) {
              return `Field '${input.trim()}' already exists`;
            }
            return true;
          }
        }
      ]);

      if (!entry.key.trim()) {
        addingMore = false;
        continue;
      }

      const value = await inquirer.prompt([
        {
          type: 'input',
          name: 'value',
          message: `Value for '${entry.key}':`,
          validate: (input) => input.trim().length > 0 || 'Value cannot be empty'
        }
      ]);

      techStack[entry.key.trim()] = value.value.trim();
      
      console.log(chalk.green(`✅ Added: ${entry.key} = ${value.value}`));
    }

    this.recipe.techStack = techStack;
  }

  /**
   * Import technology stack from current project
   */
  async importTechStackFromProject() {
    try {
      // Try to detect from package.json
      const packageJson = JSON.parse(await fs.readFile('package.json', 'utf8'));
      const detectedTech = this.detectTechFromPackageJson(packageJson);
      
      if (Object.keys(detectedTech).length > 0) {
        console.log(chalk.blue('🔍 Detected technologies from package.json:'));
        Object.entries(detectedTech).forEach(([key, value]) => {
          console.log(chalk.gray(`  ${key}: ${value}`));
        });

        const { useDetected } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'useDetected',
            message: 'Use detected technologies?',
            default: true
          }
        ]);

        if (useDetected) {
          this.recipe.techStack = detectedTech;
          
          // Allow manual additions
          const { addMore } = await inquirer.prompt([
            {
              type: 'confirm',
              name: 'addMore',
              message: 'Add additional technologies?',
              default: false
            }
          ]);

          if (addMore) {
            await this.manualTechStackSetup();
          }
          return;
        }
      }
    } catch (error) {
      console.log(chalk.yellow('⚠️ Could not detect technologies from current project'));
    }

    // Fallback to manual setup
    await this.manualTechStackSetup();
  }

  /**
   * Collect optional fields
   */
  async collectOptionalFields() {
    console.log(chalk.cyan('📝 Optional Information'));
    
    const optionalInfo = await inquirer.prompt([
      {
        type: 'input',
        name: 'author',
        message: 'Author name (optional):',
        default: process.env.USER || process.env.USERNAME || ''
      },
      {
        type: 'input',
        name: 'version',
        message: 'Recipe version:',
        default: '1.0.0',
        validate: (input) => {
          const semverRegex = /^\d+\.\d+\.\d+(-[a-zA-Z0-9-]+)?$/;
          if (!semverRegex.test(input)) {
            return 'Version must follow semantic versioning (e.g., 1.0.0)';
          }
          return true;
        }
      },
      {
        type: 'input',
        name: 'tags',
        message: 'Tags (comma-separated):',
        filter: (input) => {
          if (!input.trim()) return [];
          return input.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        }
      }
    ]);

    // Remove empty values
    Object.keys(optionalInfo).forEach(key => {
      if (!optionalInfo[key] || (Array.isArray(optionalInfo[key]) && optionalInfo[key].length === 0)) {
        delete optionalInfo[key];
      }
    });

    Object.assign(this.recipe, optionalInfo);
    console.log(chalk.green('✅ Optional information collected\n'));
  }

  /**
   * Collect rules and guidelines
   */
  async collectRules() {
    console.log(chalk.cyan('📜 Rules and Guidelines'));
    
    const { includeRules } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'includeRules',
        message: 'Include Windsurf/Agent rules in this recipe?',
        default: true
      }
    ]);

    if (!includeRules) {
      console.log(chalk.gray('Skipping rules configuration\n'));
      return;
    }

    const rulesMethod = await inquirer.prompt([
      {
        type: 'list',
        name: 'method',
        message: 'How would you like to create the rules?',
        choices: [
          { name: 'Generate template based on tech stack', value: 'template' },
          { name: 'Write custom rules', value: 'custom' },
          { name: 'Import from existing file', value: 'import' },
          { name: 'Skip rules for now', value: 'skip' }
        ]
      }
    ]);

    switch (rulesMethod.method) {
      case 'template':
        await this.generateRulesTemplate();
        break;
      case 'custom':
        await this.collectCustomRules();
        break;
      case 'import':
        await this.importRulesFromFile();
        break;
      case 'skip':
        console.log(chalk.gray('Skipping rules configuration'));
        break;
    }

    console.log(chalk.green('✅ Rules configuration completed\n'));
  }

  /**
   * Generate rules template based on technology stack
   */
  async generateRulesTemplate() {
    const template = this.generateRulesTemplateForTechStack(this.recipe.techStack);
    
    console.log(chalk.blue('\n📋 Generated Rules Template:'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(template.substring(0, 300) + (template.length > 300 ? '...' : ''));
    console.log(chalk.gray('─'.repeat(50)));

    const { useTemplate } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'useTemplate',
        message: 'Use this generated template?',
        default: true
      }
    ]);

    if (useTemplate) {
      this.recipe.windsurfRules = template;
      this.recipe.agentRules = this.generateAgentRulesTemplate(this.recipe.techStack);
    }
  }

  /**
   * Collect custom rules from user input
   */
  async collectCustomRules() {
    const customRules = await inquirer.prompt([
      {
        type: 'editor',
        name: 'windsurfRules',
        message: 'Enter Windsurf rules (opens in your default editor):',
        default: '# Windsurf Rules\n\n## Guidelines\n- Add your project-specific rules here\n'
      },
      {
        type: 'editor',
        name: 'agentRules',
        message: 'Enter Agent rules (opens in your default editor):',
        default: '# AI Assistant Rules\n\n## Code Generation\n- Add your AI assistant guidelines here\n'
      }
    ]);

    Object.assign(this.recipe, customRules);
  }

  /**
   * Import rules from existing file
   */
  async importRulesFromFile() {
    const { filePath } = await inquirer.prompt([
      {
        type: 'input',
        name: 'filePath',
        message: 'Path to rules file (.md, .txt, or .windsurfrules):',
        validate: async (input) => {
          try {
            await fs.access(input);
            return true;
          } catch {
            return 'File not found';
          }
        }
      }
    ]);

    try {
      const content = await fs.readFile(filePath, 'utf8');
      this.recipe.windsurfRules = content;
      console.log(chalk.green(`✅ Imported rules from ${filePath}`));
    } catch (error) {
      console.log(chalk.red(`❌ Failed to import rules: ${error.message}`));
    }
  }

  /**
   * Validate and review the created recipe
   */
  async validateAndReview() {
    console.log(chalk.cyan('🔍 Validation and Review'));
    
    // Run validation
    const validationResult = this.validator.validateRecipe(this.recipe, 'new-recipe');
    
    // Display validation results
    if (validationResult.valid) {
      console.log(chalk.green('✅ Recipe validation passed!'));
    } else {
      console.log(chalk.red('❌ Recipe validation failed:'));
      validationResult.errors.forEach(error => {
        console.log(chalk.red(`  • ${error}`));
      });
    }

    if (validationResult.warnings.length > 0) {
      console.log(chalk.yellow('\n⚠️ Warnings:'));
      validationResult.warnings.forEach(warning => {
        console.log(chalk.yellow(`  • ${warning}`));
      });
    }

    if (validationResult.fixes.length > 0) {
      console.log(chalk.blue('\n🔧 Auto-fixes applied:'));
      validationResult.fixes.forEach(fix => {
        console.log(chalk.blue(`  • ${fix}`));
      });
    }

    // Show recipe preview
    console.log(chalk.blue('\n📋 Recipe Preview:'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(JSON.stringify(this.recipe, null, 2));
    console.log(chalk.gray('─'.repeat(50)));

    const { proceed } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'proceed',
        message: 'Save this recipe?',
        default: true
      }
    ]);

    if (!proceed) {
      throw new Error('Recipe creation cancelled by user');
    }

    console.log(chalk.green('✅ Recipe validated and approved\n'));
  }

  /**
   * Save the recipe to file
   */
  async saveRecipe() {
    console.log(chalk.cyan('💾 Save Recipe'));
    
    const saveOptions = await inquirer.prompt([
      {
        type: 'input',
        name: 'filename',
        message: 'Recipe filename:',
        default: `${this.recipe.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.json`,
        validate: (input) => {
          if (!input.trim()) return 'Filename cannot be empty';
          if (!input.endsWith('.json')) return 'Filename must end with .json';
          return true;
        }
      },
      {
        type: 'list',
        name: 'location',
        message: 'Save location:',
        choices: [
          { name: 'Current directory', value: '.' },
          { name: 'recipes/ directory', value: 'recipes' },
          { name: 'Custom path', value: 'custom' }
        ]
      },
      {
        type: 'input',
        name: 'customPath',
        message: 'Enter custom directory path:',
        when: (answers) => answers.location === 'custom',
        validate: async (input) => {
          try {
            await fs.access(input);
            return true;
          } catch {
            return 'Directory does not exist';
          }
        }
      }
    ]);

    const directory = saveOptions.customPath || saveOptions.location;
    const filePath = path.join(directory, saveOptions.filename);

    try {
      // Create directory if it doesn't exist
      if (directory !== '.') {
        await fs.mkdir(directory, { recursive: true });
      }

      // Save recipe
      await fs.writeFile(filePath, JSON.stringify(this.recipe, null, 2));
      
      console.log(chalk.green(`✅ Recipe saved to: ${filePath}`));
      
      // Offer to add to git
      const { addToGit } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'addToGit',
          message: 'Add recipe to git?',
          default: true
        }
      ]);

      if (addToGit) {
        try {
          const { exec } = require('child_process');
          exec(`git add "${filePath}"`, (error) => {
            if (!error) {
              console.log(chalk.green('✅ Recipe added to git'));
            }
          });
        } catch (error) {
          console.log(chalk.yellow('⚠️ Could not add to git automatically'));
        }
      }

    } catch (error) {
      throw new Error(`Failed to save recipe: ${error.message}`);
    }
  }

  // Helper methods for suggestions
  suggestLanguageForCategory(category) {
    const suggestions = {
      'Web Application': 'JavaScript/TypeScript',
      'Mobile App': 'JavaScript/TypeScript',
      'Desktop App': 'JavaScript/TypeScript',
      'API/Backend': 'Node.js',
      'Library/Package': 'JavaScript',
      'CLI Tool': 'Node.js',
      'Game Development': 'JavaScript',
      'Data Science': 'Python',
      'Machine Learning': 'Python',
      'DevOps': 'Python/Bash'
    };
    return suggestions[category] || 'JavaScript';
  }

  suggestFrontendForCategory(category) {
    if (category === 'Web Application') return 'React';
    if (category === 'Mobile App') return 'React Native';
    return '';
  }

  suggestBackendForLanguage(language) {
    if (language?.includes('JavaScript') || language?.includes('Node')) return 'Express.js';
    if (language?.includes('Python')) return 'FastAPI';
    if (language?.includes('Java')) return 'Spring Boot';
    return '';
  }

  suggestTestingForLanguage(language) {
    if (language?.includes('JavaScript') || language?.includes('Node')) return 'Jest';
    if (language?.includes('Python')) return 'pytest';
    if (language?.includes('Java')) return 'JUnit';
    return '';
  }

  suggestLintingForLanguage(language) {
    if (language?.includes('JavaScript') || language?.includes('TypeScript')) return 'ESLint + Prettier';
    if (language?.includes('Python')) return 'Black + Flake8';
    if (language?.includes('Java')) return 'Checkstyle';
    return '';
  }

  suggestDeploymentForCategory(category) {
    if (category === 'Web Application') return 'Vercel/Netlify';
    if (category === 'API/Backend') return 'Railway/Heroku';
    if (category === 'Mobile App') return 'App Store/Play Store';
    if (category === 'CLI Tool') return 'npm/PyPI';
    return '';
  }

  /**
   * Detect technologies from package.json
   */
  detectTechFromPackageJson(packageJson) {
    const detected = {};
    
    // Detect language
    if (packageJson.devDependencies?.typescript || packageJson.dependencies?.typescript) {
      detected.language = 'TypeScript';
    } else {
      detected.language = 'JavaScript';
    }

    // Detect frontend frameworks
    const frontendFrameworks = ['react', 'vue', 'angular', 'svelte', 'solid-js'];
    for (const framework of frontendFrameworks) {
      if (packageJson.dependencies?.[framework] || packageJson.devDependencies?.[framework]) {
        detected.frontend = framework.charAt(0).toUpperCase() + framework.slice(1);
        break;
      }
    }

    // Detect backend frameworks
    const backendFrameworks = ['express', 'fastify', 'koa', 'hapi'];
    for (const framework of backendFrameworks) {
      if (packageJson.dependencies?.[framework]) {
        detected.backend = framework.charAt(0).toUpperCase() + framework.slice(1);
        break;
      }
    }

    // Detect testing frameworks
    const testingFrameworks = ['jest', 'vitest', 'mocha', 'jasmine'];
    for (const framework of testingFrameworks) {
      if (packageJson.devDependencies?.[framework]) {
        detected.testing = framework.charAt(0).toUpperCase() + framework.slice(1);
        break;
      }
    }

    // Detect bundlers
    const bundlers = ['webpack', 'vite', 'parcel', 'rollup'];
    for (const bundler of bundlers) {
      if (packageJson.devDependencies?.[bundler]) {
        detected.bundler = bundler.charAt(0).toUpperCase() + bundler.slice(1);
        break;
      }
    }

    return detected;
  }

  /**
   * Generate rules template based on tech stack
   */
  generateRulesTemplateForTechStack(techStack) {
    const language = techStack.language || 'JavaScript';
    const frontend = techStack.frontend || '';
    const backend = techStack.backend || '';
    
    return `# ${this.recipe.name} - Development Rules

## Code Guidelines
- Use ${language} with consistent coding standards
- Follow ${frontend ? `${frontend} best practices` : 'modern development patterns'}
- Implement proper error handling and validation
- Write clean, readable, and maintainable code

## Architecture
${frontend ? `- Component-based architecture with ${frontend}` : '- Modular architecture'}
${backend ? `- RESTful API design with ${backend}` : '- Clean API interfaces'}
- Separation of concerns and single responsibility principle
- Proper dependency injection and inversion of control

## Testing
- Write unit tests for all business logic
- Implement integration tests for API endpoints
- Maintain test coverage above 80%
- Use ${techStack.testing || 'appropriate testing framework'}

## Performance
- Optimize for performance and scalability
- Implement proper caching strategies
- Monitor and profile application performance
- Use lazy loading and code splitting where appropriate

## Security
- Implement proper authentication and authorization
- Validate all user inputs and sanitize data
- Use HTTPS and secure communication protocols
- Follow OWASP security guidelines

## Documentation
- Document all public APIs and interfaces
- Include README with setup and usage instructions
- Comment complex business logic and algorithms
- Maintain up-to-date technical documentation`;
  }

  /**
   * Generate agent rules template
   */
  generateAgentRulesTemplate(techStack) {
    const language = techStack.language || 'JavaScript';
    
    return `# AI Assistant Rules for ${this.recipe.name}

## Code Generation
- Generate ${language} code following project conventions
- Use modern syntax and best practices
- Include proper error handling and validation
- Add meaningful comments for complex logic

## Architecture Patterns
- Follow established project structure and patterns
- Implement proper separation of concerns
- Use dependency injection where appropriate
- Generate modular and reusable components

## Testing
- Include unit tests for generated code
- Use ${techStack.testing || 'appropriate testing framework'}
- Test both positive and negative scenarios
- Maintain high test coverage standards

## Documentation
- Generate comprehensive JSDoc comments
- Include usage examples in documentation
- Document API endpoints and interfaces
- Provide clear setup and configuration instructions`;
  }
}

module.exports = { RecipeCreator };