/**
 * Technology Stack Collection Module
 * Handles tech stack setup and customization based on project types
 */

const chalk = require('chalk');
const inquirer = require('inquirer');
const { getProjectTypeQuestions } = require('./project_types');

class TechStackCollector {
  constructor(config) {
    this.config = config;
  }

  async collectTechStack() {
    console.log(chalk.blue('\n⚙️ Technology Stack'));
    
    const { setupMethod } = await inquirer.prompt([
      {
        type: 'list',
        name: 'setupMethod',
        message: 'How would you like to configure your technology stack?',
        choices: [
          'Use project type specific questions (recommended)',
          'Manual setup (all technologies)',
          'Skip for now'
        ]
      }
    ]);

    if (setupMethod === 'Use project type specific questions (recommended)') {
      await this.projectTypeBasedSetup();
    } else if (setupMethod === 'Manual setup (all technologies)') {
      await this.manualTechStackSetup();
    } else {
      console.log(chalk.yellow('⏭️ Skipping technology stack configuration'));
      this.config.technologyStack = {};
    }
  }

  async projectTypeBasedSetup() {
    console.log(chalk.blue('\n🎯 Project Type Based Setup'));
    
    if (!this.config.overview?.projectType) {
      console.log(chalk.yellow('⚠️ Project type not set. Using manual setup instead.'));
      return await this.manualTechStackSetup();
    }

    const questions = getProjectTypeQuestions(this.config.overview.projectType);
    const techStack = await inquirer.prompt(questions);

    this.config.technologyStack = techStack;
    console.log(chalk.green('✅ Technology stack configured based on project type'));
  }

  async manualTechStackSetup() {
    console.log(chalk.blue('\n🔧 Manual Technology Stack Setup'));
    
    const techStack = await inquirer.prompt([
      {
        type: 'input',
        name: 'language',
        message: 'Primary programming language(s):',
        default: 'JavaScript/TypeScript'
      },
      {
        type: 'input',
        name: 'frontend',
        message: 'Frontend framework/library (e.g., React, Vue, Angular):',
        when: () => this.requiresFrontend()
      },
      {
        type: 'input',
        name: 'backend',
        message: 'Backend framework (e.g., Node.js/Express, Django, Rails):',
        when: () => this.requiresBackend()
      },
      {
        type: 'input',
        name: 'database',
        message: 'Database (e.g., PostgreSQL, MongoDB, MySQL):',
        when: () => this.requiresDatabase()
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
        message: 'Deployment platform (e.g., Vercel, Netlify, AWS):',
        when: () => this.requiresDeployment()
      }
    ]);

    this.config.technologyStack = techStack;
    console.log(chalk.green('✅ Technology stack configured manually'));
  }

  async customizeTechStack() {
    console.log(chalk.blue('\n🎨 Customize Technology Stack'));
    
    const current = this.config.technologyStack;
    const questions = getProjectTypeQuestions(this.config.overview.projectType);
    
    // Set defaults from current values
    questions.forEach(question => {
      if (current[question.name]) {
        question.default = current[question.name];
      }
    });

    const customized = await inquirer.prompt(questions);
    this.config.technologyStack = customized;
    
    console.log(chalk.green('✅ Technology stack customized'));
  }

  requiresFrontend() {
    const projectTypes = this.config.overview?.projectType || [];
    return projectTypes.some(type => 
      ['Web Application', 'Mobile App', 'Desktop App'].includes(type)
    );
  }

  requiresBackend() {
    const projectTypes = this.config.overview?.projectType || [];
    return projectTypes.some(type => 
      ['Web Application', 'API/Backend', 'Mobile App'].includes(type)
    );
  }

  requiresDatabase() {
    const projectTypes = this.config.overview?.projectType || [];
    return projectTypes.some(type => 
      ['Web Application', 'API/Backend', 'Mobile App'].includes(type)
    );
  }

  requiresDeployment() {
    const projectTypes = this.config.overview?.projectType || [];
    return projectTypes.some(type => 
      ['Web Application', 'API/Backend', 'Mobile App', 'Desktop App'].includes(type)
    );
  }
}

module.exports = { TechStackCollector };