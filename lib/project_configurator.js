/**
 * Project Configuration Module
 * Handles collection of project information, coding standards, structure, etc.
 */

const chalk = require('chalk');
const inquirer = require('inquirer');

class ProjectConfigurator {
  constructor(config) {
    this.config = config;
  }

  async collectProjectInfo() {
    console.log(chalk.blue('\n📋 Project Information'));
    
    const projectInfo = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'Project name:',
        validate: input => input.trim().length > 0 || 'Project name is required'
      },
      {
        type: 'input',
        name: 'description',
        message: 'Project description:',
        validate: input => input.trim().length > 0 || 'Description is required'
      },
      {
        type: 'input',
        name: 'version',
        message: 'Version:',
        default: '1.0.0',
        validate: input => /^\d+\.\d+\.\d+/.test(input) || 'Please use semantic versioning (e.g., 1.0.0)'
      },
      {
        type: 'checkbox',
        name: 'projectType',
        message: 'Project type (select all that apply):',
        choices: [
          'Web Application',
          'API/Backend',
          'Mobile App',
          'Desktop App',
          'Library/Package',
          'CLI Tool',
          'Other'
        ],
        validate: input => input.length > 0 || 'Please select at least one project type'
      }
    ]);

    this.config.overview = projectInfo;
    console.log(chalk.green('✅ Project information collected'));
  }

  async collectCodingStandards() {
    console.log(chalk.blue('\n📏 Coding Standards'));
    
    const codingStandards = await inquirer.prompt([
      {
        type: 'list',
        name: 'indentation',
        message: 'Indentation style:',
        choices: ['2 spaces', '4 spaces', 'tabs'],
        default: '2 spaces'
      },
      {
        type: 'list',
        name: 'quotes',
        message: 'Quote style:',
        choices: ['single', 'double'],
        default: 'single'
      },
      {
        type: 'input',
        name: 'naming',
        message: 'Naming conventions:',
        default: 'camelCase for variables, PascalCase for classes'
      },
      {
        type: 'checkbox',
        name: 'linting',
        message: 'Linting tools:',
        choices: ['ESLint', 'Prettier', 'JSHint', 'TSLint', 'Pylint', 'Rubocop', 'Other'],
        default: ['ESLint', 'Prettier']
      },
      {
        type: 'input',
        name: 'comments',
        message: 'Comment style guidelines:',
        default: 'JSDoc for functions, inline comments for complex logic'
      }
    ]);

    this.config.codingStandards = codingStandards;
    console.log(chalk.green('✅ Coding standards configured'));
  }

  async collectProjectStructure() {
    console.log(chalk.blue('\n🏗️ Project Structure'));
    
    const projectStructure = await inquirer.prompt([
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
        message: 'Configuration directory:',
        default: 'config'
      },
      {
        type: 'input',
        name: 'organization',
        message: 'Organization pattern:',
        default: 'Feature-based folders with shared utilities'
      }
    ]);

    this.config.projectStructure = projectStructure;
    console.log(chalk.green('✅ Project structure defined'));
  }

  async collectWorkflowGuidelines() {
    console.log(chalk.blue('\n🔄 Development Workflow'));
    
    const workflowGuidelines = await inquirer.prompt([
      {
        type: 'list',
        name: 'gitWorkflow',
        message: 'Git workflow:',
        choices: ['Git Flow', 'GitHub Flow', 'GitLab Flow', 'Custom'],
        default: 'GitHub Flow'
      },
      {
        type: 'input',
        name: 'branchNaming',
        message: 'Branch naming convention:',
        default: 'feature/description, bugfix/description, hotfix/description'
      },
      {
        type: 'list',
        name: 'commitStyle',
        message: 'Commit message style:',
        choices: ['Conventional Commits', 'Angular', 'Custom'],
        default: 'Conventional Commits'
      },
      {
        type: 'checkbox',
        name: 'cicd',
        message: 'CI/CD processes:',
        choices: ['Automated Testing', 'Code Quality Checks', 'Security Scanning', 'Performance Testing', 'Deployment'],
        default: ['Automated Testing', 'Code Quality Checks']
      },
      {
        type: 'input',
        name: 'deploymentSteps',
        message: 'Deployment process:',
        default: 'Automated via CI/CD pipeline'
      }
    ]);

    this.config.workflowGuidelines = workflowGuidelines;
    console.log(chalk.green('✅ Workflow guidelines established'));
  }

  async collectProjectManagement() {
    console.log(chalk.blue('\n📊 Project Management'));
    
    const projectManagement = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'methodology',
        message: 'Development methodology:',
        choices: ['Agile', 'Scrum', 'Kanban', 'Waterfall', 'Custom'],
        default: ['Agile']
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
        message: 'Documentation approach:',
        default: 'README.md and docs/ folder'
      },
      {
        type: 'checkbox',
        name: 'codeReview',
        message: 'Code review process:',
        choices: ['Pull Requests', 'Code Review Meetings', 'Pair Programming', 'Automated Review'],
        default: ['Pull Requests']
      }
    ]);

    this.config.projectManagement = projectManagement;
    console.log(chalk.green('✅ Project management configured'));
  }
}

module.exports = { ProjectConfigurator };