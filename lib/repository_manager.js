/**
 * Repository Management Module
 * Handles repository settings and connection testing
 */

const chalk = require('chalk');
const inquirer = require('inquirer');
const { 
  updateRemoteConfig, 
  testRepositoryConnection,
  REMOTE_RECIPES_CONFIG 
} = require('./recipes_lib');

class RepositoryManager {
  constructor() {
    this.inquirer = inquirer;
  }

  /**
   * Main repository settings interface
   */
  async repositorySettings() {
    console.log(chalk.blue('\n⚙️ Repository Settings'));
    
    const { action } = await this.inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          'View current settings',
          'Update repository URL',
          'Test repository connection',
          'Reset to defaults',
          'Advanced settings',
          'Back to main menu'
        ]
      }
    ]);

    switch (action) {
      case 'View current settings':
        await this.showCurrentSettings();
        break;
      case 'Update repository URL':
        await this.updateRepositoryUrl();
        break;
      case 'Test repository connection':
        await this.testConnection();
        break;
      case 'Reset to defaults':
        await this.resetToDefaults();
        break;
      case 'Advanced settings':
        await this.advancedSettings();
        break;
    }
  }

  /**
   * Display current repository settings
   */
  async showCurrentSettings() {
    console.log(chalk.blue('\n📋 Current Repository Settings'));
    
    console.log(chalk.cyan('\n🔗 Repository Configuration:'));
    console.log(chalk.gray(`GitHub API URL: ${REMOTE_RECIPES_CONFIG.githubApiUrl}`));
    console.log(chalk.gray(`GitHub Raw URL: ${REMOTE_RECIPES_CONFIG.githubRawUrl}`));
    console.log(chalk.gray(`Cache Directory: ${REMOTE_RECIPES_CONFIG.cacheDir}`));
    console.log(chalk.gray(`Cache Expiration: ${REMOTE_RECIPES_CONFIG.cacheExpiration / (1000 * 60 * 60)} hours`));
    console.log(chalk.gray(`Fallback to Local: ${REMOTE_RECIPES_CONFIG.fallbackToLocal ? 'Yes' : 'No'}`));
    
    // Show GitHub token status
    const hasToken = process.env.GITHUB_TOKEN ? 'Yes (authenticated)' : 'No (public access only)';
    console.log(chalk.gray(`GitHub Token: ${hasToken}`));
  }

  /**
   * Update repository URL
   */
  async updateRepositoryUrl() {
    console.log(chalk.blue('\n🔄 Update Repository URL'));
    console.log(chalk.gray('Current repository: ubuntupunk/agent-rules-recipes'));
    
    const { newRepo } = await this.inquirer.prompt([
      {
        type: 'input',
        name: 'newRepo',
        message: 'Enter new repository (format: owner/repo):',
        validate: input => {
          if (!input.trim()) return 'Repository name is required';
          if (!input.includes('/')) return 'Format should be owner/repo';
          return true;
        }
      }
    ]);

    const { confirm } = await this.inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: `Update repository to ${newRepo}?`,
        default: false
      }
    ]);

    if (confirm) {
      try {
        const newConfig = {
          githubApiUrl: `https://api.github.com/repos/${newRepo}/contents/recipes`,
          githubRawUrl: `https://raw.githubusercontent.com/${newRepo}/main/recipes`
        };
        
        updateRemoteConfig(newConfig);
        console.log(chalk.green(`✅ Repository updated to ${newRepo}`));
        console.log(chalk.yellow('⚠️ You may need to refresh recipes to use the new repository'));
        
      } catch (error) {
        console.log(chalk.red(`❌ Error updating repository: ${error.message}`));
      }
    }
  }

  /**
   * Test repository connection
   */
  async testConnection() {
    console.log(chalk.blue('\n🔗 Testing repository connection...'));
    
    try {
      const results = await testRepositoryConnection();
      
      console.log(chalk.green('\n✅ Connection test completed'));
      console.log(chalk.gray(`📡 API endpoint: ${results.apiEndpoint}`));
      console.log(chalk.gray(`🌐 Raw endpoint: ${results.rawEndpoint}`));
      
      if (results.tests) {
        console.log(chalk.blue('\n📊 Test results:'));
        Object.entries(results.tests).forEach(([test, result]) => {
          const status = result.success ? '✅' : '❌';
          console.log(chalk.gray(`${status} ${test}: ${result.success ? 'PASSED' : 'FAILED'}`));
          if (result.duration) {
            console.log(chalk.gray(`   Duration: ${result.duration}ms`));
          }
          if (result.error) {
            console.log(chalk.red(`   Error: ${result.error}`));
          }
          if (result.fileCount) {
            console.log(chalk.gray(`   Files found: ${result.fileCount}`));
          }
          if (result.file && result.size) {
            console.log(chalk.gray(`   Test file: ${result.file} (${result.size} bytes)`));
          }
        });
      }
      
      if (results.rateLimit) {
        console.log(chalk.blue('\n📈 GitHub API Rate Limit:'));
        console.log(chalk.gray(`Remaining: ${results.rateLimit.remaining}/${results.rateLimit.limit}`));
        if (results.rateLimit.reset) {
          console.log(chalk.gray(`Reset: ${new Date(results.rateLimit.reset).toLocaleString()}`));
        }
        
        // Warn if rate limit is low
        if (results.rateLimit.remaining < 100) {
          console.log(chalk.yellow('⚠️ GitHub API rate limit is running low'));
          console.log(chalk.gray('Consider using a GitHub token for higher limits'));
        }
      }
      
      // Overall assessment
      const allTestsPassed = results.tests && Object.values(results.tests).every(test => test.success);
      if (allTestsPassed) {
        console.log(chalk.green('\n🎉 All connection tests passed! Repository is accessible.'));
      } else {
        console.log(chalk.yellow('\n⚠️ Some connection tests failed. Check network connectivity and repository settings.'));
      }
      
    } catch (error) {
      console.error(chalk.red(`❌ Connection test failed: ${error.message}`));
      console.log(chalk.gray('\n💡 Troubleshooting tips:'));
      console.log(chalk.gray('   - Check your internet connection'));
      console.log(chalk.gray('   - Verify the repository exists and is public'));
      console.log(chalk.gray('   - Try setting a GitHub token for authentication'));
    }
  }

  /**
   * Reset repository settings to defaults
   */
  async resetToDefaults() {
    const { confirm } = await this.inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Reset repository settings to defaults? This will restore the original ubuntupunk/agent-rules-recipes repository.',
        default: false
      }
    ]);

    if (confirm) {
      try {
        const defaultConfig = {
          githubApiUrl: 'https://api.github.com/repos/ubuntupunk/agent-rules-recipes/contents/recipes',
          githubRawUrl: 'https://raw.githubusercontent.com/ubuntupunk/agent-rules-recipes/main/recipes',
          cacheExpiration: 24 * 60 * 60 * 1000, // 24 hours
          fallbackToLocal: true
        };
        
        updateRemoteConfig(defaultConfig);
        console.log(chalk.green('✅ Repository settings reset to defaults'));
        
      } catch (error) {
        console.log(chalk.red(`❌ Error resetting settings: ${error.message}`));
      }
    }
  }

  /**
   * Advanced repository settings
   */
  async advancedSettings() {
    console.log(chalk.blue('\n⚙️ Advanced Repository Settings'));
    
    const { setting } = await this.inquirer.prompt([
      {
        type: 'list',
        name: 'setting',
        message: 'Which setting would you like to modify?',
        choices: [
          'Cache expiration time',
          'Fallback to local recipes',
          'GitHub token setup',
          'Custom API endpoints',
          'Back to repository menu'
        ]
      }
    ]);

    switch (setting) {
      case 'Cache expiration time':
        await this.updateCacheExpiration();
        break;
      case 'Fallback to local recipes':
        await this.updateFallbackSetting();
        break;
      case 'GitHub token setup':
        await this.setupGitHubToken();
        break;
      case 'Custom API endpoints':
        await this.updateCustomEndpoints();
        break;
    }
  }

  /**
   * Update cache expiration time
   */
  async updateCacheExpiration() {
    const currentHours = REMOTE_RECIPES_CONFIG.cacheExpiration / (1000 * 60 * 60);
    
    const { hours } = await this.inquirer.prompt([
      {
        type: 'number',
        name: 'hours',
        message: `Cache expiration time in hours (current: ${currentHours}):`,
        default: currentHours,
        validate: input => input > 0 || 'Must be greater than 0'
      }
    ]);

    try {
      updateRemoteConfig({
        cacheExpiration: hours * 60 * 60 * 1000
      });
      console.log(chalk.green(`✅ Cache expiration updated to ${hours} hours`));
    } catch (error) {
      console.log(chalk.red(`❌ Error updating cache expiration: ${error.message}`));
    }
  }

  /**
   * Update fallback setting
   */
  async updateFallbackSetting() {
    const { fallback } = await this.inquirer.prompt([
      {
        type: 'confirm',
        name: 'fallback',
        message: 'Enable fallback to local recipes when remote fails?',
        default: REMOTE_RECIPES_CONFIG.fallbackToLocal
      }
    ]);

    try {
      updateRemoteConfig({ fallbackToLocal: fallback });
      console.log(chalk.green(`✅ Fallback setting updated: ${fallback ? 'enabled' : 'disabled'}`));
    } catch (error) {
      console.log(chalk.red(`❌ Error updating fallback setting: ${error.message}`));
    }
  }

  /**
   * GitHub token setup guidance
   */
  async setupGitHubToken() {
    console.log(chalk.blue('\n🔑 GitHub Token Setup'));
    
    const hasToken = !!process.env.GITHUB_TOKEN;
    
    if (hasToken) {
      console.log(chalk.green('✅ GitHub token is already configured'));
      console.log(chalk.gray('This provides higher API rate limits and access to private repositories'));
    } else {
      console.log(chalk.yellow('⚠️ No GitHub token configured'));
      console.log(chalk.gray('\nTo set up a GitHub token:'));
      console.log(chalk.gray('1. Go to https://github.com/settings/tokens'));
      console.log(chalk.gray('2. Generate a new token with "repo" permissions'));
      console.log(chalk.gray('3. Set the environment variable: export GITHUB_TOKEN=your_token'));
      console.log(chalk.gray('4. Restart the application'));
      
      console.log(chalk.blue('\n💡 Benefits of using a GitHub token:'));
      console.log(chalk.gray('• Higher API rate limits (5000 vs 60 requests/hour)'));
      console.log(chalk.gray('• Access to private repositories'));
      console.log(chalk.gray('• Better reliability for recipe fetching'));
    }
  }

  /**
   * Update custom API endpoints
   */
  async updateCustomEndpoints() {
    console.log(chalk.blue('\n🔧 Custom API Endpoints'));
    console.log(chalk.yellow('⚠️ Advanced setting - only modify if you know what you\'re doing'));
    
    const { apiUrl } = await this.inquirer.prompt([
      {
        type: 'input',
        name: 'apiUrl',
        message: 'GitHub API URL:',
        default: REMOTE_RECIPES_CONFIG.githubApiUrl
      }
    ]);

    const { rawUrl } = await this.inquirer.prompt([
      {
        type: 'input',
        name: 'rawUrl',
        message: 'GitHub Raw URL:',
        default: REMOTE_RECIPES_CONFIG.githubRawUrl
      }
    ]);

    const { confirm } = await this.inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Update API endpoints?',
        default: false
      }
    ]);

    if (confirm) {
      try {
        updateRemoteConfig({
          githubApiUrl: apiUrl,
          githubRawUrl: rawUrl
        });
        console.log(chalk.green('✅ API endpoints updated'));
        console.log(chalk.yellow('⚠️ Test the connection to verify the new endpoints work'));
      } catch (error) {
        console.log(chalk.red(`❌ Error updating endpoints: ${error.message}`));
      }
    }
  }

  /**
   * Get repository status for display in other modules
   */
  async getRepositoryStatus() {
    try {
      const results = await testRepositoryConnection();
      const allTestsPassed = results.tests && Object.values(results.tests).every(test => test.success);
      
      return {
        connected: allTestsPassed,
        apiEndpoint: results.apiEndpoint,
        rawEndpoint: results.rawEndpoint,
        rateLimit: results.rateLimit,
        lastTested: new Date().toISOString()
      };
    } catch (error) {
      return {
        connected: false,
        error: error.message,
        lastTested: new Date().toISOString()
      };
    }
  }
}

module.exports = RepositoryManager;