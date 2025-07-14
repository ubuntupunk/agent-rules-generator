/**
 * Gemini CLI Configuration Manager
 * Handles configuration of Gemini CLI to use .agent.md as context file
 */

const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');
const chalk = require('chalk');
const inquirer = require('inquirer').default;

class GeminiManager {
  constructor() {
    this.globalConfigPath = path.join(os.homedir(), '.gemini', 'settings.json');
    this.localConfigPath = path.join(process.cwd(), '.gemini', 'settings.json');
  }

  /**
   * Configure Gemini CLI to use .agent.md as context file
   * @param {string} scope - 'local' or 'global'
   * @returns {Promise<boolean>} Success status
   */
  async configureGemini(scope = 'local') {
    try {
      const configPath = scope === 'global' ? this.globalConfigPath : this.localConfigPath;
      const configDir = path.dirname(configPath);

      console.log(chalk.blue(`\n🔧 Configuring Gemini CLI (${scope})...`));

      // Ensure the .gemini directory exists
      await this.ensureDirectoryExists(configDir);

      // Load existing configuration or create new one
      let config = {};
      if (await this.fileExists(configPath)) {
        try {
          const existingConfig = await fs.readFile(configPath, 'utf8');
          config = JSON.parse(existingConfig);
          console.log(chalk.gray(`Found existing ${scope} configuration`));
        } catch (error) {
          console.log(chalk.yellow(`Warning: Could not parse existing config, creating new one`));
        }
      }

      // Set the contextFileName to .agent.md
      config.contextFileName = '.agent.md';

      // Write the updated configuration
      await fs.writeFile(configPath, JSON.stringify(config, null, 2));

      console.log(chalk.green(`✅ Gemini CLI configured successfully (${scope})`));
      console.log(chalk.gray(`Config file: ${configPath}`));
      console.log(chalk.gray(`Context file: .agent.md`));

      return true;
    } catch (error) {
      console.error(chalk.red(`❌ Error configuring Gemini CLI: ${error.message}`));
      return false;
    }
  }

  /**
   * Check if Gemini configuration exists and show current settings
   * @returns {Promise<Object>} Configuration status
   */
  async checkGeminiConfig() {
    const status = {
      global: { exists: false, configured: false, path: this.globalConfigPath },
      local: { exists: false, configured: false, path: this.localConfigPath }
    };

    // Check global configuration
    if (await this.fileExists(this.globalConfigPath)) {
      status.global.exists = true;
      try {
        const config = JSON.parse(await fs.readFile(this.globalConfigPath, 'utf8'));
        status.global.configured = config.contextFileName === '.agent.md';
        status.global.config = config;
      } catch (error) {
        console.log(chalk.yellow(`Warning: Could not parse global config`));
      }
    }

    // Check local configuration
    if (await this.fileExists(this.localConfigPath)) {
      status.local.exists = true;
      try {
        const config = JSON.parse(await fs.readFile(this.localConfigPath, 'utf8'));
        status.local.configured = config.contextFileName === '.agent.md';
        status.local.config = config;
      } catch (error) {
        console.log(chalk.yellow(`Warning: Could not parse local config`));
      }
    }

    return status;
  }

  /**
   * Interactive Gemini configuration setup
   */
  async setupGeminiConfig() {
    console.log(chalk.blue('\n💎 Gemini CLI Configuration'));
    console.log(chalk.gray('Configure Gemini CLI to use .agent.md as the context file\n'));

    // Check current status
    const status = await this.checkGeminiConfig();

    // Show current status
    console.log(chalk.blue('Current Configuration Status:'));
    console.log(`Global: ${status.global.configured ? chalk.green('✅ Configured') : chalk.red('❌ Not configured')}`);
    console.log(`Local:  ${status.local.configured ? chalk.green('✅ Configured') : chalk.red('❌ Not configured')}`);
    console.log();

    // Ask user what they want to do
    const choices = [];
    
    if (!status.local.configured) {
      choices.push({ name: 'Configure local project (.gemini/settings.json)', value: 'local' });
    }
    
    if (!status.global.configured) {
      choices.push({ name: 'Configure globally (~/.gemini/settings.json)', value: 'global' });
    }
    
    choices.push({ name: 'Configure both local and global', value: 'both' });
    choices.push({ name: 'Show current configuration details', value: 'show' });
    choices.push({ name: 'Edit configuration file in editor', value: 'edit' });
    choices.push({ name: 'Back to main menu', value: 'back' });

    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices
      }
    ]);

    switch (action) {
      case 'local':
        await this.configureGemini('local');
        break;
      case 'global':
        await this.configureGemini('global');
        break;
      case 'both':
        await this.configureGemini('local');
        await this.configureGemini('global');
        break;
      case 'show':
        await this.showConfigurationDetails(status);
        break;
      case 'edit':
        await this.editConfigurationFile();
        break;
      case 'back':
        return;
    }

    // Ask if they want to do anything else
    const { continueConfig } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'continueConfig',
        message: 'Would you like to configure anything else for Gemini?',
        default: false
      }
    ]);

    if (continueConfig) {
      await this.setupGeminiConfig();
    }
  }

  /**
   * Show detailed configuration information
   */
  async showConfigurationDetails(status) {
    console.log(chalk.blue('\n📋 Gemini Configuration Details\n'));

    // Global configuration
    console.log(chalk.cyan('Global Configuration:'));
    console.log(`Path: ${status.global.path}`);
    console.log(`Exists: ${status.global.exists ? '✅ Yes' : '❌ No'}`);
    if (status.global.exists) {
      console.log(`Configured for .agent.md: ${status.global.configured ? '✅ Yes' : '❌ No'}`);
      if (status.global.config) {
        console.log(`Current contextFileName: ${status.global.config.contextFileName || 'Not set'}`);
      }
    }
    console.log();

    // Local configuration
    console.log(chalk.cyan('Local Configuration:'));
    console.log(`Path: ${status.local.path}`);
    console.log(`Exists: ${status.local.exists ? '✅ Yes' : '❌ No'}`);
    if (status.local.exists) {
      console.log(`Configured for .agent.md: ${status.local.configured ? '✅ Yes' : '❌ No'}`);
      if (status.local.config) {
        console.log(`Current contextFileName: ${status.local.config.contextFileName || 'Not set'}`);
      }
    }
    console.log();

    // Configuration priority explanation
    console.log(chalk.yellow('ℹ️  Configuration Priority:'));
    console.log(chalk.gray('Local configuration (.gemini/settings.json in project) takes precedence over global configuration'));
    console.log(chalk.gray('If no local config exists, Gemini CLI will use the global configuration'));
    console.log();
  }

  /**
   * Utility method to check if a file exists
   */
  async fileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Edit configuration file in default editor
   */
  async editConfigurationFile() {
    console.log(chalk.blue('\n📝 Edit Configuration File'));
    
    const { scope } = await inquirer.prompt([
      {
        type: 'list',
        name: 'scope',
        message: 'Which configuration file would you like to edit?',
        choices: [
          { name: 'Local (.gemini/settings.json in current project)', value: 'local' },
          { name: 'Global (~/.gemini/settings.json)', value: 'global' }
        ]
      }
    ]);

    const configPath = scope === 'global' ? this.globalConfigPath : this.localConfigPath;
    const configDir = path.dirname(configPath);

    try {
      // Ensure directory exists
      await this.ensureDirectoryExists(configDir);

      // Create file if it doesn't exist
      if (!(await this.fileExists(configPath))) {
        const defaultConfig = {
          contextFileName: '.agent.md'
        };
        await fs.writeFile(configPath, JSON.stringify(defaultConfig, null, 2));
        console.log(chalk.green(`Created new configuration file: ${configPath}`));
      }

      // Open in editor
      await this.openInEditor(configPath);
      
    } catch (error) {
      console.error(chalk.red(`❌ Error editing configuration: ${error.message}`));
    }
  }

  /**
   * Open file in default editor
   */
  async openInEditor(filePath) {
    return new Promise((resolve, reject) => {
      // Determine the editor to use
      const editor = process.env.EDITOR || process.env.VISUAL || this.getDefaultEditor();
      
      console.log(chalk.blue(`Opening ${filePath} in ${editor}...`));
      console.log(chalk.gray('Close the editor to continue.'));

      const editorProcess = spawn(editor, [filePath], {
        stdio: 'inherit'
      });

      editorProcess.on('close', (code) => {
        if (code === 0) {
          console.log(chalk.green('✅ File saved successfully'));
          resolve();
        } else {
          reject(new Error(`Editor exited with code ${code}`));
        }
      });

      editorProcess.on('error', (error) => {
        if (error.code === 'ENOENT') {
          console.error(chalk.red(`❌ Editor '${editor}' not found`));
          console.log(chalk.yellow('💡 Try setting the EDITOR environment variable:'));
          console.log(chalk.gray('   export EDITOR=nano'));
          console.log(chalk.gray('   export EDITOR=vim'));
          console.log(chalk.gray('   export EDITOR=code'));
        }
        reject(error);
      });
    });
  }

  /**
   * Get default editor based on platform
   */
  getDefaultEditor() {
    const platform = process.platform;
    
    if (platform === 'win32') {
      return 'notepad';
    } else if (platform === 'darwin') {
      return 'nano';
    } else {
      return 'nano';
    }
  }

  /**
   * Utility method to ensure a directory exists
   */
  async ensureDirectoryExists(dirPath) {
    try {
      await fs.mkdir(dirPath, { recursive: true });
    } catch (error) {
      if (error.code !== 'EEXIST') {
        throw error;
      }
    }
  }
}

module.exports = GeminiManager;