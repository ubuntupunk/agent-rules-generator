#!/usr/bin/env node

/**
 * Agent Rules Generator CLI - Refactored Main Class
 * Interactive CLI tool to generate .agent.md and .windsurfrules files
 * 
 * This is the main orchestrator that delegates to specialized modules
 */

const inquirer = require('inquirer');
const chalk = require('chalk');
const figlet = require('figlet');

// Import all the specialized modules
const RecipeManager = require('./lib/recipe_manager');
const WindsurfManager = require('./lib/windsurf_manager');
const TechStackCollector = require('./lib/tech_stack_collector');
const ProjectConfigurator = require('./lib/project_configurator');
const FileGenerator = require('./lib/file_generator');
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

    // Initialize managers
    this.recipeManager = new RecipeManager();
    this.windsurfManager = new WindsurfManager();
    this.techStackCollector = new TechStackCollector();
    this.projectConfigurator = new ProjectConfigurator();
    this.fileGenerator = new FileGenerator();
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
    // Step 1: Collect project overview
    await this.projectConfigurator.collectProjectInfo(this.config);

    // Step 2: Set up technology stack (recipe or manual)
    await this.setupTechnologyStack();

    // Step 3: Collect remaining configuration
    await this.projectConfigurator.collectCodingStandards(this.config);
    await this.projectConfigurator.collectProjectStructure(this.config);
    await this.projectConfigurator.collectWorkflowGuidelines(this.config);
    await this.projectConfigurator.collectProjectManagement(this.config);

    // Step 4: Generate files
    await this.fileGenerator.generateFiles(this.config);

    console.log(chalk.green('\n🎉 Configuration complete! Your AI assistant rules have been generated.'));
  }

  async setupTechnologyStack() {
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
        await this.recipeManager.selectAndApplyRecipe(this.config);
        break;
      
      case 'Manual setup':
        await this.techStackCollector.manualTechStackSetup(this.config);
        break;
      
      case 'Search recipes':
        await this.recipeManager.searchRecipes();
        return await this.setupTechnologyStack(); // Return to menu
      
      case 'Windsurf recipes':
        await this.windsurfManager.handleWindsurfRecipes(this.config);
        break;
      
      case 'Refresh recipes':
        await this.recipeManager.refreshRecipes();
        return await this.setupTechnologyStack(); // Return to menu
      
      case 'Cache management':
        await this.cacheManager.handleCacheManagement();
        return await this.setupTechnologyStack(); // Return to menu
      
      case 'Repository settings':
        await this.repositoryManager.handleRepositorySettings();
        return await this.setupTechnologyStack(); // Return to menu
      
      default:
        await this.techStackCollector.manualTechStackSetup(this.config);
    }

    // Ask if user wants to customize the tech stack
    if (Object.keys(this.config.technologyStack).length > 0) {
      const { customize } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'customize',
          message: 'Would you like to customize the technology stack?',
          default: false
        }
      ]);

      if (customize) {
        await this.techStackCollector.customizeTechStack(this.config);
      }
    }
  }
}

module.exports = { AgentRulesGenerator };