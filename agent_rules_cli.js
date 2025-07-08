#!/usr/bin/env node

/**
 * Agent Rules Generator CLI - Refactored Main Class
 * Interactive CLI tool to generate .agent.md and .windsurfrules files
 * 
 * This is the main orchestrator that delegates to specialized modules
 */

const inquirer = require('inquirer').default;
const chalk = require('chalk');
const figlet = require('figlet');

// Import all the specialized modules with correct destructuring
const { RecipeManager } = require('./lib/recipe_manager');
const WindsurfManager = require('./lib/windsurf_manager');
const { TechStackCollector } = require('./lib/tech_stack_collector');
const { ProjectConfigurator } = require('./lib/project_configurator');
const { generateAgentFile } = require('./lib/generator_lib');
const CacheManager = require('./lib/cache_manager');
const RepositoryManager = require('./lib/repository_manager');

class AgentRulesGenerator {
  constructor() {
    this.config = {
      overview: {},
      technologyStack: {},
      codingStandards: {},
      projectStructure: {},
      workflowGuidelines: {},
      projectManagement: {},
      fileType: 'agent'
    };

    // Initialize managers with proper instantiation
    this.recipeManager = new RecipeManager(this.config);
    this.windsurfManager = new WindsurfManager();
    this.techStackCollector = new TechStackCollector(this.config);
    this.projectConfigurator = new ProjectConfigurator(this.config);
    this.cacheManager = new CacheManager();
    this.repositoryManager = new RepositoryManager();
  }

  async run() {
    try {
      await this.displayWelcome();
      await this.init();
    } catch (error) {
      console.error(chalk.red('\n❌ An error occurred:'), error.message);
      process.exit(1);
    }
  }

  async displayWelcome() {
    console.clear();
    
    try {
      const title = figlet.textSync('Agent Rules', {
        font: 'Standard',
        horizontalLayout: 'default',
        verticalLayout: 'default'
      });
      console.log(chalk.cyan(title));
    } catch (error) {
      console.log(chalk.cyan('\n🤖 Agent Rules Generator'));
    }
    
    console.log(chalk.gray('Generate .agent.md and .windsurfrules files for AI-assisted development\n'));
  }

  async init() {
    console.log(chalk.cyan(figlet.textSync('Agent Rules', { horizontalLayout: 'full' })));
    console.log(chalk.yellow('🚀 Generate .agent.md or .windsurfrules files for your project\n'));

    // Check for command line arguments
    const args = process.argv.slice(2);
    if (args.length > 0) {
      return await this.handleCliCommands(args);
    }

    let shouldExit = false;
    while (!shouldExit) {
      const { action } = await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: 'What would you like to do?',
          choices: [
            { name: 'Generate agent rules file', value: 'generate' },
            { name: 'Manage recipes', value: 'recipes' },
            { name: 'Configure remote repository', value: 'configure' },
            { name: 'Exit', value: 'exit' }
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
        case 'exit':
          shouldExit = true;
          console.log(chalk.green('👋 Goodbye!'));
          break;
      }
    }
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

  async collectProjectInfo() {
    // Step 1: Collect project overview
    await this.projectConfigurator.collectProjectInfo();

    // Step 2: Set up technology stack (recipe or manual)
    await this.setupTechnologyStack();

    // Step 3: Collect remaining configuration
    await this.projectConfigurator.collectCodingStandards();
    await this.projectConfigurator.collectProjectStructure();
    await this.projectConfigurator.collectWorkflowGuidelines();
    await this.projectConfigurator.collectProjectManagement();

    // Step 4: Generate files
    await this.generateAndSave();

    console.log(chalk.green('\n🎉 Configuration complete! Your AI assistant rules have been generated.'));
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
        await this.recipeManager.refreshRecipesCommand();
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

  async handleCliCommands(args) {
    const command = args[0];
    
    switch (command) {
      case 'refresh':
        await this.recipeManager.refreshRecipesCommand();
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

  async listRecipesCommand() {
    console.log(chalk.blue('📋 Loading available recipes...'));
    try {
      const { loadRecipes } = require('./lib/recipes_lib');
      const recipes = await loadRecipes();
      const count = Object.keys(recipes).length;
      
      if (count === 0) {
        console.log(chalk.yellow('No recipes found'));
        return;
      }

      console.log(chalk.green(`\n📚 Found ${count} recipes:\n`));
      
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

  async clearCacheCommand() {
    console.log(chalk.blue('🗑️  Clearing recipe cache...'));
    try {
      const { clearCache } = require('./lib/recipes_lib');
      await clearCache();
      console.log(chalk.green('✅ Recipe cache cleared successfully'));
    } catch (error) {
      console.error(chalk.red(`❌ Error clearing cache: ${error.message}`));
    }
  }

  async showCacheInfo() {
    const { getCacheInfo } = require('./lib/recipes_lib');
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

  async configureRemoteRepository() {
    console.log(chalk.blue('\n⚙️  Configure Remote Repository'));
    
    const { updateRemoteConfig, REMOTE_RECIPES_CONFIG } = require('./lib/recipes_lib');
    
    // Initialize with default values if REMOTE_RECIPES_CONFIG is not available
    const defaultConfig = {
      githubApiUrl: 'https://api.github.com/repos/ubuntupunk/${githubRepo}/recipes',
      githubRawUrl: 'https://raw.githubusercontent.com/ubuntupunk/${githubRepo}/main/recipes',
      cacheExpiration: 24 * 60 * 60 * 1000 // 24 hours
    };
    
    const currentConfig = REMOTE_RECIPES_CONFIG || defaultConfig;
    
    const { githubRepo, cacheExpiration } = await inquirer.prompt([
      {
        type: 'input',
        name: 'githubRepo',
        message: 'GitHub repository (owner/repo):',
        default: currentConfig.githubApiUrl
          ? currentConfig.githubApiUrl.split('/').slice(-3, -1).join('/')
          : '',
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
        ],
        default: currentConfig.cacheExpiration 
          ? Math.floor(currentConfig.cacheExpiration / (60 * 60 * 1000))
          : 24
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
  }

  async setupTechnologyStack() {
    let result;
    const { method } = await inquirer.prompt([
      {
        type: 'list',
        name: 'method',
        message: 'How would you like to set up your technology stack?',
        choices: [
          'Use a recipe (recommended)',
          'Manual setup',
          'Search recipes',
          'Windsurf recipes',
          'Refresh recipes',
          'Cache management',
          'Repository settings'
        ]
      }
    ]);

    switch (method) {
      case 'Use a recipe (recommended)':
        result = await this.recipeManager.browseRecipes();
        break;
      
      case 'Manual setup':
        await this.techStackCollector.manualTechStackSetup();
        break;
      
      case 'Search recipes':
        await this.recipeManager.searchRecipesCommand();
        return await this.setupTechnologyStack(); // Return to menu
      
      case 'Windsurf recipes':
        result = await this.recipeManager.handleWindsurfRecipes();
        break;
      
      case 'Refresh recipes':
        await this.recipeManager.refreshRecipesCommand();
        return await this.setupTechnologyStack(); // Return to menu
      
      case 'Cache management':
        await this.cacheManager.handleCacheManagement();
        return await this.setupTechnologyStack(); // Return to menu
      
      case 'Repository settings':
        await this.repositoryManager.handleRepositorySettings();
        return await this.setupTechnologyStack(); // Return to menu
      
      default:
        await this.techStackCollector.manualTechStackSetup();
    }

    // Handle customization request from recipe application
    if (result === 'customize_tech_stack') {
      console.log(chalk.blue('\nCustomize Technology Stack'));
      console.log(chalk.gray('Current technology stack:'));
      console.log(chalk.cyan(JSON.stringify(this.config.technologyStack, null, 2)));
      
      await this.techStackCollector.customizeTechStack();
    }
  }

  async generateAndSave() {
    try {
      const content = await generateAgentFile(this.config, inquirer);
      const filename = this.config.fileType === 'agent' ? '.agent.md' : '.windsurfrules';
      
      const fs = require('fs').promises;
      const path = require('path');
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

module.exports = { AgentRulesGenerator };