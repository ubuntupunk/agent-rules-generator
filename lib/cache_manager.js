/**
 * Cache Management Module
 * Handles cache operations for recipes and Windsurf data
 */

const chalk = require('chalk');
const inquirer = require('inquirer');
const { 
  getCacheInfo, 
  clearCache 
} = require('./recipes_lib');
const { 
  getWindsurfCacheInfo, 
  clearWindsurfCache 
} = require('./windsurf_scraper');
const { formatBytes } = require('./cleanup_utils');

class CacheManager {
  constructor() {
    this.inquirer = inquirer;
  }

  /**
   * Main cache management interface
   */
  async cacheManagement() {
    console.log(chalk.blue('\n📦 Cache Management'));
    
    const { action } = await this.inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          'View cache information',
          'Clear recipe cache',
          'Clear Windsurf cache',
          'Clear all caches',
          'Cache usage statistics',
          'Back to main menu'
        ]
      }
    ]);

    switch (action) {
      case 'View cache information':
        await this.showCacheInfo();
        break;
      case 'Clear recipe cache':
        await this.clearRecipeCache();
        break;
      case 'Clear Windsurf cache':
        await this.clearWindsurfCacheCommand();
        break;
      case 'Clear all caches':
        await this.clearAllCaches();
        break;
      case 'Cache usage statistics':
        await this.showCacheUsage();
        break;
    }
  }

  /**
   * Display comprehensive cache information
   */
  async showCacheInfo() {
    console.log(chalk.blue('\n📊 Cache Information'));
    
    try {
      // Recipe cache info
      console.log(chalk.cyan('\n🍳 Recipe Cache:'));
      const recipeInfo = await getCacheInfo();
      
      if (recipeInfo.exists) {
        console.log(chalk.green('✅ Recipe cache exists'));
        console.log(chalk.gray(`📁 Cache directory: ${recipeInfo.cacheDir}`));
        console.log(chalk.gray(`📅 Last updated: ${new Date(recipeInfo.lastUpdated).toLocaleString()}`));
        console.log(chalk.gray(`📋 Recipe count: ${recipeInfo.recipeCount}`));
        console.log(chalk.gray(`⏰ Cache age: ${Math.round(recipeInfo.ageMs / (1000 * 60 * 60))} hours`));
        console.log(chalk.gray(`✅ Cache valid: ${recipeInfo.isValid ? 'Yes' : 'No (expired)'}`));
      } else {
        console.log(chalk.yellow('📭 No recipe cache found'));
      }

      // Windsurf cache info
      console.log(chalk.cyan('\n🌊 Windsurf Cache:'));
      const windsurfInfo = await getWindsurfCacheInfo();
      
      if (windsurfInfo.exists) {
        console.log(chalk.green('✅ Windsurf cache exists'));
        console.log(chalk.gray(`📁 Cache directory: ${windsurfInfo.cacheDir}`));
        console.log(chalk.gray(`📅 Last updated: ${new Date(windsurfInfo.lastUpdated).toLocaleString()}`));
        console.log(chalk.gray(`📋 Recipe count: ${windsurfInfo.recipeCount}`));
        console.log(chalk.gray(`⏰ Cache age: ${Math.round(windsurfInfo.ageMs / (1000 * 60 * 60))} hours`));
        console.log(chalk.gray(`✅ Cache valid: ${windsurfInfo.isValid ? 'Yes' : 'No (expired)'}`));
      } else {
        console.log(chalk.yellow('📭 No Windsurf cache found'));
      }
      
    } catch (error) {
      console.error(chalk.red(`❌ Error getting cache info: ${error.message}`));
    }
  }

  /**
   * Clear recipe cache
   */
  async clearRecipeCache() {
    const { confirm } = await this.inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Are you sure you want to clear the recipe cache?',
        default: false
      }
    ]);

    if (confirm) {
      console.log(chalk.blue('\n🗑️ Clearing recipe cache...'));
      
      try {
        const success = await clearCache();
        if (success) {
          console.log(chalk.green('✅ Recipe cache cleared successfully'));
        } else {
          console.log(chalk.yellow('⚠️ Cache may not have existed or could not be cleared'));
        }
      } catch (error) {
        console.log(chalk.red(`❌ Error clearing recipe cache: ${error.message}`));
      }
    }
  }

  /**
   * Clear Windsurf cache
   */
  async clearWindsurfCacheCommand() {
    const { confirm } = await this.inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Are you sure you want to clear the Windsurf cache?',
        default: false
      }
    ]);

    if (confirm) {
      console.log(chalk.blue('\n🗑️ Clearing Windsurf cache...'));
      
      try {
        const success = await clearWindsurfCache();
        if (success) {
          console.log(chalk.green('✅ Windsurf cache cleared successfully'));
        } else {
          console.log(chalk.yellow('⚠️ Cache may not have existed or could not be cleared'));
        }
      } catch (error) {
        console.log(chalk.red(`❌ Error clearing Windsurf cache: ${error.message}`));
      }
    }
  }

  /**
   * Clear all caches
   */
  async clearAllCaches() {
    const { confirm } = await this.inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Are you sure you want to clear ALL caches? This will remove both recipe and Windsurf caches.',
        default: false
      }
    ]);

    if (confirm) {
      console.log(chalk.blue('\n🗑️ Clearing all caches...'));
      
      let recipeSuccess = false;
      let windsurfSuccess = false;
      
      try {
        recipeSuccess = await clearCache();
        console.log(chalk.gray(`Recipe cache: ${recipeSuccess ? 'cleared' : 'failed'}`));
      } catch (error) {
        console.log(chalk.red(`Recipe cache error: ${error.message}`));
      }
      
      try {
        windsurfSuccess = await clearWindsurfCache();
        console.log(chalk.gray(`Windsurf cache: ${windsurfSuccess ? 'cleared' : 'failed'}`));
      } catch (error) {
        console.log(chalk.red(`Windsurf cache error: ${error.message}`));
      }
      
      if (recipeSuccess && windsurfSuccess) {
        console.log(chalk.green('✅ All caches cleared successfully'));
      } else if (recipeSuccess || windsurfSuccess) {
        console.log(chalk.yellow('⚠️ Some caches cleared, others may not have existed'));
      } else {
        console.log(chalk.red('❌ Failed to clear caches'));
      }
    }
  }

  /**
   * Show cache usage statistics
   */
  async showCacheUsage() {
    console.log(chalk.blue('\n📈 Cache Usage Statistics'));
    
    try {
      const { getCacheUsage } = require('./cleanup_utils');
      const usage = await getCacheUsage();
      
      console.log(chalk.green(`\n💾 Total cache size: ${formatBytes(usage.totalSize)}`));
      
      if (Object.keys(usage.directories).length > 0) {
        console.log(chalk.cyan('\n📁 Cache breakdown:'));
        Object.entries(usage.directories).forEach(([dir, size]) => {
          console.log(chalk.gray(`   ${dir}: ${formatBytes(size)}`));
        });
      } else {
        console.log(chalk.yellow('📭 No cache directories found'));
      }
      
    } catch (error) {
      console.error(chalk.red(`❌ Error getting cache usage: ${error.message}`));
    }
  }

  /**
   * Get cache summary for display in other modules
   */
  async getCacheSummary() {
    try {
      const recipeInfo = await getCacheInfo();
      const windsurfInfo = await getWindsurfCacheInfo();
      
      return {
        recipe: {
          exists: recipeInfo.exists,
          count: recipeInfo.recipeCount || 0,
          valid: recipeInfo.isValid || false
        },
        windsurf: {
          exists: windsurfInfo.exists,
          count: windsurfInfo.recipeCount || 0,
          valid: windsurfInfo.isValid || false
        }
      };
    } catch (error) {
      return {
        recipe: { exists: false, count: 0, valid: false },
        windsurf: { exists: false, count: 0, valid: false }
      };
    }
  }

  /**
   * Check if any caches need attention (expired, etc.)
   */
  async checkCacheHealth() {
    try {
      const summary = await this.getCacheSummary();
      const issues = [];
      
      if (summary.recipe.exists && !summary.recipe.valid) {
        issues.push('Recipe cache has expired');
      }
      
      if (summary.windsurf.exists && !summary.windsurf.valid) {
        issues.push('Windsurf cache has expired');
      }
      
      return {
        healthy: issues.length === 0,
        issues
      };
    } catch (error) {
      return {
        healthy: false,
        issues: ['Cache health check failed']
      };
    }
  }
}

module.exports = CacheManager;