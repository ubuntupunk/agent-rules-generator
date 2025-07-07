/**
 * Windsurf Integration Manager
 * Handles all Windsurf-related operations including recipe browsing and application
 */

const chalk = require('chalk');
const inquirer = require('inquirer');
const {
  fetchWindsurfRecipes,
  listWindsurfRecipes,
  searchWindsurfRecipes,
  refreshWindsurfRecipes,
  getWindsurfCacheInfo,
  clearWindsurfCache
} = require('./windsurf_scraper');

class WindsurfManager {
  constructor(config) {
    this.config = config;
  }

  async handleWindsurfRecipes() {
    console.log(chalk.blue('\n🌊 Windsurf Recipes'));
    
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do with Windsurf recipes?',
        choices: [
          'Browse Windsurf recipes',
          'Search Windsurf recipes',
          'Refresh Windsurf recipes',
          'Windsurf cache info',
          'Clear Windsurf cache',
          'Back to main menu'
        ]
      }
    ]);

    switch (action) {
      case 'Browse Windsurf recipes':
        return await this.browseWindsurfRecipes();
      case 'Search Windsurf recipes':
        await this.searchWindsurfRecipes();
        break;
      case 'Refresh Windsurf recipes':
        await this.refreshWindsurfRecipes();
        break;
      case 'Windsurf cache info':
        await this.showWindsurfCacheInfo();
        break;
      case 'Clear Windsurf cache':
        await this.clearWindsurfCache();
        break;
    }

    return null;
  }

  async browseWindsurfRecipes() {
    console.log(chalk.blue('\n📋 Loading Windsurf recipes...'));
    
    try {
      const recipes = await listWindsurfRecipes();
      
      if (recipes.length === 0) {
        console.log(chalk.yellow('No Windsurf recipes found. Try refreshing first.'));
        return null;
      }

      console.log(chalk.green(`\n✅ Found ${recipes.length} Windsurf recipes:\n`));
      
      recipes.forEach((recipe, index) => {
        console.log(chalk.cyan(`${index + 1}. ${recipe.name}`));
        console.log(chalk.gray(`   Category: ${recipe.category}`));
        console.log(chalk.gray(`   Tech Stack: ${JSON.stringify(recipe.techStack)}`));
        console.log();
      });

      const { useWindsurfRecipe } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'useWindsurfRecipe',
          message: 'Would you like to use one of these Windsurf recipes?',
          default: false
        }
      ]);

      if (useWindsurfRecipe) {
        const { selectedRecipe } = await inquirer.prompt([
          {
            type: 'list',
            name: 'selectedRecipe',
            message: 'Select a Windsurf recipe:',
            choices: recipes.map((recipe) => ({
              name: `${recipe.name} (${recipe.category})`,
              value: recipe.key
            }))
          }
        ]);

        return await this.applyWindsurfRecipe(selectedRecipe);
      }

      return null;
    } catch (error) {
      console.log(chalk.red(`❌ Error loading Windsurf recipes: ${error.message}`));
      return null;
    }
  }

  async applyWindsurfRecipe(recipeKey) {
    console.log(chalk.blue(`\n🌊 Applying Windsurf recipe: ${recipeKey}`));
    
    try {
      const windsurfRecipes = await fetchWindsurfRecipes();
      const recipe = windsurfRecipes[recipeKey];
      
      if (!recipe) {
        console.log(chalk.red('❌ Recipe not found'));
        return null;
      }

      // Apply the recipe's tech stack to our configuration
      this.config.technologyStack = { ...recipe.techStack };
      
      // Store the Windsurf rules for later use in file generation
      this.config.windsurfRules = recipe.windsurfRules;
      
      console.log(chalk.green(`✅ Applied Windsurf recipe: ${recipe.name}`));
      console.log(chalk.gray(`📋 Tech stack: ${JSON.stringify(recipe.techStack)}`));
      
      // Ask if user wants to customize
      const { customize } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'customize',
          message: 'Would you like to customize the tech stack?',
          default: false
        }
      ]);

      return { applied: true, customize, recipe, isWindsurf: true };
    } catch (error) {
      console.log(chalk.red(`❌ Error applying Windsurf recipe: ${error.message}`));
      return null;
    }
  }

  async refreshWindsurfRecipes() {
    console.log(chalk.blue('\n🔄 Refreshing Windsurf recipes...'));
    
    try {
      const recipes = await refreshWindsurfRecipes();
      const count = Object.keys(recipes).length;
      console.log(chalk.green(`✅ Successfully refreshed ${count} Windsurf recipes`));
    } catch (error) {
      console.log(chalk.red(`❌ Failed to refresh Windsurf recipes: ${error.message}`));
    }
  }

  async showWindsurfCacheInfo() {
    console.log(chalk.blue('\n📊 Windsurf Cache Information'));
    
    try {
      const info = await getWindsurfCacheInfo();
      
      if (info.exists) {
        console.log(chalk.green('\n✅ Windsurf cache exists'));
        console.log(chalk.gray(`📁 Cache directory: ${info.cacheDir}`));
        console.log(chalk.gray(`📅 Last updated: ${new Date(info.lastUpdated).toLocaleString()}`));
        console.log(chalk.gray(`📋 Recipe count: ${info.recipeCount}`));
        console.log(chalk.gray(`⏰ Cache age: ${Math.round(info.ageMs / (1000 * 60 * 60))} hours`));
        console.log(chalk.gray(`✅ Cache valid: ${info.isValid ? 'Yes' : 'No (expired)'}`));
      } else {
        console.log(chalk.yellow('📭 No Windsurf cache found'));
        console.log(chalk.gray(`📁 Cache directory: ${info.cacheDir}`));
      }
      
    } catch (error) {
      console.log(chalk.red(`❌ Error getting cache info: ${error.message}`));
    }
  }

  async clearWindsurfCache() {
    const { confirm } = await inquirer.prompt([
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
        console.log(chalk.red(`❌ Error clearing cache: ${error.message}`));
      }
    }
  }

  async searchWindsurfRecipes() {
    const { query } = await inquirer.prompt([
      {
        type: 'input',
        name: 'query',
        message: 'Search Windsurf recipes (technology, framework, etc.):',
        validate: input => input.trim().length > 0 || 'Please enter a search term'
      }
    ]);

    console.log(chalk.blue(`\n🔍 Searching Windsurf recipes for: "${query}"`));

    try {
      const matchingKeys = await searchWindsurfRecipes(query);
      
      if (matchingKeys.length === 0) {
        console.log(chalk.yellow('No matching Windsurf recipes found.'));
        return;
      }

      console.log(chalk.green(`\n✅ Found ${matchingKeys.length} matching Windsurf recipes:`));
      
      const windsurfRecipes = await fetchWindsurfRecipes();
      matchingKeys.forEach((key, index) => {
        const recipe = windsurfRecipes[key];
        console.log(chalk.cyan(`${index + 1}. ${recipe.name}`));
        console.log(chalk.gray(`   Category: ${recipe.category}`));
        console.log(chalk.gray(`   Tech Stack: ${JSON.stringify(recipe.techStack)}`));
        console.log();
      });

    } catch (error) {
      console.log(chalk.red(`❌ Error searching Windsurf recipes: ${error.message}`));
    }
  }
}

module.exports = WindsurfManager;