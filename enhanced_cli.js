#!/usr/bin/env node

const inquirer = require('inquirer').default || require('inquirer');
const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');
const figlet = require('figlet');
const { generateAgentFile } = require('./lib/generator_lib');
const { loadRecipes, searchRecipes, refreshRecipes, clearCache, getCacheInfo, updateRemoteConfig } = require('./lib/recipes_lib');

class AgentRulesGenerator {
  constructor() {
    this.config = {
      overview: {},
      codingStandards: {},
      projectStructure: {},
      technologyStack: {},
      projectManagement: {},
      workflowGuidelines: {}
    };
  }

  async init() {
    console.log(chalk.cyan(figlet.textSync('Agent Rules', { horizontalLayout: 'full' })));
    console.log(chalk.yellow('🤖 Generate .agent.md or .windsurfrules files for your project\n'));

    // Check for command line arguments
    const args = process.argv.slice(2);
    if (args.length > 0) {
      return await this.handleCliCommands(args);
    }

    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          { name: 'Generate agent rules file', value: 'generate' },
          { name: 'Manage recipes', value: 'recipes' },
          { name: 'Configure remote repository', value: 'configure' }
        ]
      }
    ]);

    switch (action) {
      case 'generate':
        await this.generateAgentRules();
        break;
      case 'recipes':
        await this.manageRecipes();
        break;
      case 'configure':
        await this.configureRemoteRepository();
        break;
    }
  }

  async handleCliCommands(args) {
    const command = args[0];
    
    switch (command) {
      case 'refresh':
        await this.refreshRecipesCommand();
        break;
      case 'clear-cache':
        await this.clearCacheCommand();
        break;
      case 'cache-info':
        await this.showCacheInfo();
        break;
      case 'list-recipes':
        await this.listRecipesCommand();
        break;
      case 'help':
        this.showHelp();
        break;
      default:
        console.log(chalk.red(`Unknown command: ${command}`));
        this.showHelp();
    }
  }

  async refreshRecipesCommand() {
    console.log(chalk.blue('🔄 Refreshing recipes from remote repository...'));
    try {
      const recipes = await refreshRecipes();
      const count = Object.keys(recipes).length;
      console.log(chalk.green(`✅ Successfully refreshed ${count} recipes`));
    } catch (error) {
      console.error(chalk.red(`❌ Error refreshing recipes: ${error.message}`));
    }
  }

  async clearCacheCommand() {
    console.log(chalk.blue('🗑️  Clearing recipe cache...'));
    try {
      await clearCache();
      console.log(chalk.green('✅ Recipe cache cleared successfully'));
    } catch (error) {
      console.error(chalk.red(`❌ Error clearing cache: ${error.message}`));
    }
  }

  async showCacheInfo() {
    const info = await getCacheInfo();
    console.log(chalk.blue('\n📊 Cache Information'));
    console.log(`Cache Directory: ${info.cacheDir}`);
    console.log(`Last Update: ${info.lastUpdate ? info.lastUpdate.toLocaleString() : 'Never'}`);
    console.log(`Cache Valid: ${info.isValid ? '✅ Yes' : '❌ No'}`);
    console.log(`Recipe Count: ${info.recipeCount}`);
    if (info.cacheAge) {
      const hours = Math.floor(info.cacheAge / (1000 * 60 * 60));
      const minutes = Math.floor((info.cacheAge % (1000 * 60 * 60)) / (1000 * 60));
      console.log(`Cache Age: ${hours}h ${minutes}m`);
    }
  }

  async listRecipesCommand() {
    console.log(chalk.blue('📋 Loading available recipes...'));
    try {
      const recipes = await loadRecipes();
      const count = Object.keys(recipes).length;
      
      if (count === 0) {
        console.log(chalk.yellow('No recipes found'));
        return;
      }

      console.log(chalk.green(`\n📦 Found ${count} recipes:\n`));
      
      for (const [key, recipe] of Object.entries(recipes)) {
        console.log(chalk.cyan(`• ${recipe.name}`));
        console.log(chalk.gray(`  ${recipe.description}`));
        console.log(chalk.gray(`  Category: ${recipe.category}`));
        if (recipe.tags && recipe.tags.length > 0) {
          console.log(chalk.gray(`  Tags: ${recipe.tags.join(', ')}`));
        }
        console.log();
      }
    } catch (error) {
      console.error(chalk.red(`❌ Error loading recipes: ${error.message}`));
    }
  }

  showHelp() {
    console.log(chalk.blue('\n🔧 Agent Rules Generator CLI\n'));
    console.log('Usage: agent-rules-generator [command]\n');
    console.log('Commands:');
    console.log('  generate         Generate agent rules file (default)');
    console.log('  refresh          Refresh recipes from remote repository');
    console.log('  clear-cache      Clear local recipe cache');
    console.log('  cache-info       Show cache information');
    console.log('  list-recipes     List all available recipes');
    console.log('  help             Show this help message\n');
  }

  async generateAgentRules() {
    const { fileType } = await inquirer.prompt([
      {
        type: 'list',
        name: 'fileType',
        message: 'What type of file would you like to generate?',
        choices: [
          { name: '.agent.md (Cursor AI)', value: 'agent' },
          { name: '.windsurfrules (Windsurf)', value: 'windsurf' }
        ]
      }
    ]);

    this.config.fileType = fileType;
    await this.collectProjectInfo();
  }

  async manageRecipes() {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'Recipe management:',
        choices: [
          { name: 'List available recipes', value: 'list' },
          { name: 'Refresh recipes from remote', value: 'refresh' },
          { name: 'Clear cache', value: 'clear' },
          { name: 'Show cache info', value: 'info' },
          { name: 'Back to main menu', value: 'back' }
        ]
      }
    ]);

    switch (action) {
      case 'list':
        await this.listRecipesCommand();
        break;
      case 'refresh':
        await this.refreshRecipesCommand();
        break;
      case 'clear':
        await this.clearCacheCommand();
        break;
      case 'info':
        await this.showCacheInfo();
        break;
      case 'back':
        return;
    }

    // Return to recipe management menu
    await this.manageRecipes();
  }

  async configureRemoteRepository() {
    console.log(chalk.blue('\n🔧 Configure Remote Repository'));
    console.log(chalk.gray('Configure the remote repository for community recipes\n'));

    const { githubRepo, cacheExpiration } = await inquirer.prompt([
      {
        type: 'input',
        name: 'githubRepo',
        message: 'GitHub repository (owner/repo):',
        default: 'your-username/agent-rules-recipes',
        validate: input => {
          if (!input.includes('/')) {
            return 'Please enter in format: owner/repo';
          }
          return true;
        }
      },
      {
        type: 'list',
        name: 'cacheExpiration',
        message: 'Cache expiration time:',
        choices: [
          { name: '1 hour', value: 1 },
          { name: '6 hours', value: 6 },
          { name: '24 hours (default)', value: 24 },
          { name: '1 week', value: 168 }
        ]
      }
    ]);

    const repoUrl = `https://api.github.com/repos/${githubRepo}/contents/recipes`;
    const rawUrl = `https://raw.githubusercontent.com/${githubRepo}/main/recipes`;

    updateRemoteConfig({
      githubApiUrl: repoUrl,
      githubRawUrl: rawUrl,
      cacheExpiration: cacheExpiration * 60 * 60 * 1000
    });

    console.log(chalk.green('✅ Remote repository configuration updated'));
    console.log(chalk.gray(`Repository: ${githubRepo}`));
    console.log(chalk.gray(`Cache expiration: ${cacheExpiration} hours`));

    const { testConnection } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'testConnection',
        message: 'Test connection to remote repository?',
        default: true
      }
    ]);

    if (testConnection) {
      console.log(chalk.blue('\n🔄 Testing connection...'));
      try {
        const recipes = await refreshRecipes();
        const count = Object.keys(recipes).length;
        console.log(chalk.green(`✅ Successfully connected! Found ${count} recipes`));
      } catch (error) {
        console.error(chalk.red(`❌ Connection failed: ${error.message}`));
      }
    }
  }

  async collectProjectInfo() {
    // Overview Section
    console.log(chalk.blue('\n📋 Project Overview'));
    const overview = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'Project name:',
        validate: input => input.trim() !== '' || 'Project name is required'
      },
      {
        type: 'input',
        name: 'description',
        message: 'Project description:',
        validate: input => input.trim() !== '' || 'Description is required'
      },
      {
        type: 'input',
        name: 'version',
        message: 'Version:',
        default: '1.0.0'
      },
      {
        type: 'checkbox',
        name: 'projectType',
        message: 'Project type(s):',
        choices: [
          'Web Application',
          'API/Backend',
          'Mobile App',
          'Desktop App',
          'Library/Package',
          'CLI Tool',
          'Other'
        ]
      }
    ]);

    this.config.overview = overview;

    // Technology Stack
    console.log(chalk.blue('\n🛠️  Technology Stack'));
    await this.collectTechStack();

    // Coding Standards
    console.log(chalk.blue('\n📝 Coding Standards'));
    await this.collectCodingStandards();

    // Project Structure
    console.log(chalk.blue('\n📁 Project Structure'));
    await this.collectProjectStructure();

    // Project Management
    console.log(chalk.blue('\n📊 Project Management'));
    await this.collectProjectManagement();

    // Workflow Guidelines
    console.log(chalk.blue('\n🔄 Workflow Guidelines'));
    await this.collectWorkflowGuidelines();

    // Generate and save file
    await this.generateAndSave();
  }

  async collectTechStack() {
    const { useRecipe } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'useRecipe',
        message: 'Would you like to use a pre-built recipe for a common tech stack?',
        default: true
      }
    ]);

    if (useRecipe) {
      await this.selectRecipe();
    } else {
      await this.manualTechStackSetup();
    }
  }

  async selectRecipe() {
    console.log(chalk.blue('📦 Loading recipes...'));
    
    try {
      const recipes = await loadRecipes();
      const recipeKeys = Object.keys(recipes);
      
      if (recipeKeys.length === 0) {
        console.log(chalk.yellow('No recipes found. You can:'));
        console.log('• Set up manually');
        console.log('• Configure a remote repository');
        console.log('• Check your internet connection');
        
        const { action } = await inquirer.prompt([
          {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
              { name: 'Set up manually', value: 'manual' },
              { name: 'Configure remote repository', value: 'configure' },
              { name: 'Try refreshing recipes', value: 'refresh' }
            ]
          }
        ]);

        switch (action) {
          case 'manual':
            await this.manualTechStackSetup();
            return;
          case 'configure':
            await this.configureRemoteRepository();
            return await this.selectRecipe();
          case 'refresh':
            await this.refreshRecipesCommand();
            return await this.selectRecipe();
        }
        return;
      }

      const recipeChoices = recipeKeys.map(key => ({
        name: `${recipes[key].name} - ${recipes[key].description}`,
        value: key,
        short: recipes[key].name
      }));

      const { selectedRecipe, customizeRecipe } = await inquirer.prompt([
        {
          type: 'list',
          name: 'selectedRecipe',
          message: 'Select a recipe:',
          choices: recipeChoices,
          pageSize: 10
        },
        {
          type: 'confirm',
          name: 'customizeRecipe',
          message: 'Would you like to customize the selected recipe?',
          default: false
        }
      ]);

      const recipe = recipes[selectedRecipe];
      this.config.technologyStack = { ...recipe.techStack };

      console.log(chalk.green(`✅ Selected recipe: ${recipe.name}`));

      if (customizeRecipe) {
        await this.customizeTechStack();
      }
    } catch (error) {
      console.error(chalk.red(`❌ Error loading recipes: ${error.message}`));
      console.log(chalk.yellow('Falling back to manual setup...'));
      await this.manualTechStackSetup();
    }
  }

  async manualTechStackSetup() {
    const techStack = await inquirer.prompt([
      {
        type: 'input',
        name: 'frontend',
        message: 'Frontend framework/library (e.g., React, Vue, Angular):'
      },
      {
        type: 'input',
        name: 'backend',
        message: 'Backend framework (e.g., Node.js/Express, Django, Rails):'
      },
      {
        type: 'input',
        name: 'database',
        message: 'Database (e.g., PostgreSQL, MongoDB, MySQL):'
      },
      {
        type: 'input',
        name: 'language',
        message: 'Primary programming language(s):'
      },
      {
        type: 'input',
        name: 'tools',
        message: 'Build tools/bundlers (e.g., Webpack, Vite, Parcel):'
      },
      {
        type: 'input',
        name: 'testing',
        message: 'Testing framework (e.g., Jest, Vitest, Cypress):'
      },
      {
        type: 'input',
        name: 'deployment',
        message: 'Deployment platform (e.g., Vercel, Netlify, AWS):'
      }
    ]);

    this.config.technologyStack = techStack;
  }

  async customizeTechStack() {
     const current = this.config.technologyStack;
     const customized = await inquirer.prompt([
       {
         type: 'input',
         name: 'frontend',
         message: 'Frontend:',
         default: current.frontend
       },
       {
         type: 'input',
         name: 'backend',
         message: 'Backend:',
         default: current.backend
       },
       {
         type: 'input',
         name: 'database',
         message: 'Database:',
         default: current.database
       },
       {
         type: 'input',
         name: 'language',
         message: 'Language:',
         default: current.language
       },
       {
         type: 'input',
         name: 'tools',
         message: 'Build tools:',
         default: current.tools
       },
       {
         type: 'input',
         name: 'testing',
         message: 'Testing:',
         default: current.testing
       },
       {
         type: 'input',
         name: 'deployment',
         message: 'Deployment:',
         default: current.deployment
       }
     ]);
 
     this.config.technologyStack = customized;
   }
 
   async collectCodingStandards() {
     const standards = await inquirer.prompt([
       {
         type: 'checkbox',
         name: 'linting',
         message: 'Code linting/formatting tools:',
         choices: ['ESLint', 'Prettier', 'Stylelint', 'Black', 'Rubocop', 'Other']
       },
       {
         type: 'list',
         name: 'indentation',
         message: 'Indentation style:',
         choices: ['2 spaces', '4 spaces', 'tabs']
       },
       {
         type: 'list',
         name: 'quotes',
         message: 'Quote style:',
         choices: ['single', 'double', 'backticks for templates']
       },
       {
         type: 'input',
         name: 'naming',
         message: 'Naming conventions (e.g., camelCase, snake_case):',
         default: 'camelCase for variables, PascalCase for classes'
       },
       {
         type: 'input',
         name: 'comments',
         message: 'Comment style preferences:',
         default: 'JSDoc for functions, inline comments for complex logic'
       }
     ]);
 
     this.config.codingStandards = standards;
   }
 
   async collectProjectStructure() {
     const structure = await inquirer.prompt([
       {
         type: 'input',
         name: 'sourceDir',
         message: 'Source code directory:',
         default: 'src'
       },
       {
         type: 'input',
         name: 'testDir',
         message: 'Test directory:',
         default: 'tests'
       },
       {
         type: 'input',
         name: 'buildDir',
         message: 'Build output directory:',
         default: 'dist'
       },
       {
         type: 'input',
         name: 'configDir',
         message: 'Configuration files location:',
         default: 'config'
       },
       {
         type: 'input',
         name: 'organization',
         message: 'Code organization pattern:',
         default: 'Feature-based folders with shared utilities'
       }
     ]);
 
     this.config.projectStructure = structure;
   }
 
   async collectProjectManagement() {
     const management = await inquirer.prompt([
       {
         type: 'checkbox',
         name: 'methodology',
         message: 'Development methodology:',
         choices: ['Agile', 'Scrum', 'Kanban', 'Waterfall', 'Other']
       },
       {
         type: 'input',
         name: 'issueTracking',
         message: 'Issue tracking system:',
         default: 'GitHub Issues'
       },
       {
         type: 'input',
         name: 'documentation',
         message: 'Documentation location:',
         default: 'README.md and docs/ folder'
       },
       {
         type: 'checkbox',
         name: 'codeReview',
         message: 'Code review process:',
         choices: ['Pull Requests', 'Pair Programming', 'Code Review Meetings', 'Automated Review']
       }
     ]);
 
     this.config.projectManagement = management;
   }
 
   async collectWorkflowGuidelines() {
     const workflow = await inquirer.prompt([
       {
         type: 'list',
         name: 'gitWorkflow',
         message: 'Git workflow:',
         choices: ['Git Flow', 'GitHub Flow', 'GitLab Flow', 'Feature Branch', 'Trunk-based']
       },
       {
         type: 'input',
         name: 'branchNaming',
         message: 'Branch naming convention:',
         default: 'feature/description, bugfix/description, hotfix/description'
       },
       {
         type: 'input',
         name: 'commitStyle',
         message: 'Commit message style:',
         default: 'Conventional Commits'
       },
       {
         type: 'checkbox',
         name: 'cicd',
         message: 'CI/CD processes:',
         choices: ['Automated Testing', 'Code Quality Checks', 'Security Scanning', 'Automated Deployment']
       },
       {
         type: 'input',
         name: 'deploymentSteps',
         message: 'Deployment process:',
         default: 'Automated via CI/CD pipeline'
       }
     ]);
 
     this.config.workflowGuidelines = workflow;
   }
 
   async generateAndSave() {
     try {
       const content = await generateAgentFile(this.config, inquirer); // Pass inquirer instance
       const filename = this.config.fileType === 'agent' ? '.agent.md' : '.windsurfrules';
       
       await fs.writeFile(filename, content);
       
       console.log(chalk.green(`\n✅ ${filename} has been generated successfully!`));
       console.log(chalk.cyan(`📄 File saved as: ${path.resolve(filename)}`));
       
       const { openFile } = await inquirer.prompt([
         {
           type: 'confirm',
           name: 'openFile',
           message: 'Would you like to preview the generated file?',
           default: true
         }
       ]);
 
       if (openFile) {
         console.log(chalk.gray('\n--- Generated File Preview ---'));
         console.log(content);
         console.log(chalk.gray('--- End of File ---\n'));
       }
     } catch (error) {
       console.error(chalk.red(`❌ Error generating file: ${error.message}`));
     }
   }
 } 
 
 // CLI entry point
 async function main() {
   try {
     const generator = new AgentRulesGenerator();
     await generator.init();
   } catch (error) {
     if (error.isTtyError) {
       console.error(chalk.red('❌ This CLI requires an interactive terminal'));
     } else {
       console.error(chalk.red(`❌ Error: ${error.message}`));
     }
     process.exit(1);
   }
 }
 
 // Run if called directly
 if (require.main === module) {
   main();
 }
 
 module.exports = { AgentRulesGenerator }; 