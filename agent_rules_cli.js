#!/usr/bin/env node

const inquirer = require('inquirer').default || require('inquirer');
const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');
const figlet = require('figlet');
const { generateAgentFile } = require('./lib/generator_lib');
const { loadRecipes, searchRecipes } = require('./lib/recipes_lib');

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
    const recipes = await loadRecipes();
    const recipeChoices = Object.keys(recipes).map(key => ({
      name: `${recipes[key].name} - ${recipes[key].description}`,
      value: key
    }));

    if (recipeChoices.length === 0) {
      console.log(chalk.yellow('No recipes found. Setting up manually...'));
      await this.manualTechStackSetup();
      return;
    }

    const { selectedRecipe, customizeRecipe } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedRecipe',
        message: 'Select a recipe:',
        choices: recipeChoices
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

    if (customizeRecipe) {
      await this.customizeTechStack();
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
      const content = generateAgentFile(this.config);
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