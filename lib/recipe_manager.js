/**
 * Recipe Management Module
 * Handles recipe selection, searching, and application
 */

const chalk = require('chalk');
const inquirer = require('inquirer');
const { 
  loadRecipes, 
  searchRecipes, 
  refreshRecipes,
  getRecipe
} = require('./recipes_lib');
const {
  fetchWindsurfRecipes,
  listWindsurfRecipes,
  searchWindsurfRecipes,
  refreshWindsurfRecipes
} = require('./windsurf_scraper');

class RecipeManager {
  constructor(config) {
    this.config = config;
  }

  async selectRecipe() {
    console.log(chalk.blue('\n🍳 Recipe Selection'));
    
    const { choice } = await inquirer.prompt([
      {
        type: 'list',
        name: 'choice',
        message: 'How would you like to set up your project?',
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

    if (choice === 'Use a recipe (recommended)') {
      return await this.browseRecipes();
    }

    if (choice === 'Manual setup') {
      return 'manual';
    }

    if (choice === 'Search recipes') {
      await this.searchRecipesCommand();
      return await this.selectRecipe();
    }

    if (choice === 'Windsurf recipes') {
      await this.handleWindsurfRecipes();
      return await this.selectRecipe();
    }

    if (choice === 'Refresh recipes') {
      await this.refreshRecipesCommand();
      return await this.selectRecipe();
    }

    if (choice === 'Cache management') {
      return 'cache_management';
    }

    if (choice === 'Repository settings') {
      return 'repository_settings';
    }
  }

  async browseRecipes() {
    console.log(chalk.blue('\n📋 Loading recipes...'));
    
    try {
      const recipes = await loadRecipes();
      const recipeKeys = Object.keys(recipes);
      
      if (recipeKeys.length === 0) {
        console.log(chalk.yellow('No recipes found. Try refreshing recipes first.'));
        return await this.selectRecipe();
      }

      console.log(chalk.green(`\n✅ Found ${recipeKeys.length} recipes:\n`));
      
      recipeKeys.forEach((key, index) => {
        const recipe = recipes[key];
        console.log(chalk.cyan(`${index + 1}. ${recipe.name}`));
        console.log(chalk.gray(`   ${recipe.description}`));
        console.log(chalk.gray(`   Category: ${recipe.category}`));
        console.log();
      });

      const { selectedRecipe } = await inquirer.prompt([
        {
          type: 'list',
          name: 'selectedRecipe',
          message: 'Select a recipe:',
          choices: recipeKeys.map(key => ({
            name: `${recipes[key].name} - ${recipes[key].description}`,
            value: key
          }))
        }
      ]);

      await this.applyRecipe(selectedRecipe, recipes);
      return 'recipe_applied';

    } catch (error) {
      console.log(chalk.red(`❌ Error loading recipes: ${error.message}`));
      return await this.selectRecipe();
    }
  }

  async applyRecipe(recipeKey, recipes) {
    const recipe = recipes[recipeKey];
    console.log(chalk.green(`\n✅ Selected recipe: ${recipe.name}`));
    
    // Apply the recipe's tech stack to our configuration
    this.config.technologyStack = { ...recipe.techStack };
    
    console.log(chalk.gray(`📋 Applied tech stack: ${JSON.stringify(recipe.techStack)}`));
    
    // Ask if user wants to customize
    const { customize } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'customize',
        message: 'Would you like to customize the tech stack?',
        default: false
      }
    ]);

    if (customize) {
      return 'customize_tech_stack';
    }

    return 'recipe_applied';
  }

  async searchRecipesCommand() {
    const { query } = await inquirer.prompt([
      {
        type: 'input',
        name: 'query',
        message: 'Search recipes (technology, framework, etc.):',
        validate: input => input.trim().length > 0 || 'Please enter a search term'
      }
    ]);

    console.log(chalk.blue(`\n🔍 Searching recipes for: "${query}"`));

    try {
      const recipes = await loadRecipes();
      const matchingKeys = await searchRecipes(query, recipes);
      
      if (matchingKeys.length === 0) {
        console.log(chalk.yellow('No matching recipes found.'));
        return;
      }

      console.log(chalk.green(`\n✅ Found ${matchingKeys.length} matching recipes:`));
      
      matchingKeys.forEach((key, index) => {
        const recipe = recipes[key];
        console.log(chalk.cyan(`${index + 1}. ${recipe.name}`));
        console.log(chalk.gray(`   ${recipe.description}`));
        console.log(chalk.gray(`   Category: ${recipe.category}`));
        console.log();
      });

    } catch (error) {
      console.log(chalk.red(`❌ Error searching recipes: ${error.message}`));
    }
  }

  async refreshRecipesCommand() {
    console.log(chalk.blue('\n🔄 Refreshing recipes from remote repository...'));
    try {
      const recipes = await refreshRecipes();
      const count = Object.keys(recipes).length;
      console.log(chalk.green(`✅ Successfully refreshed ${count} recipes`));
    } catch (error) {
      console.error(chalk.red(`❌ Error refreshing recipes: ${error.message}`));
    }
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
          'Back to main menu'
        ]
      }
    ]);

    if (action === 'Browse Windsurf recipes') {
      await this.browseWindsurfRecipes();
    } else if (action === 'Search Windsurf recipes') {
      await this.searchWindsurfRecipes();
    } else if (action === 'Refresh Windsurf recipes') {
      await this.refreshWindsurfRecipes();
    }
  }

  async browseWindsurfRecipes() {
    console.log(chalk.blue('\n📋 Loading Windsurf recipes...'));
    
    try {
      const recipes = await listWindsurfRecipes();
      
      if (recipes.length === 0) {
        console.log(chalk.yellow('No Windsurf recipes found. Try refreshing first.'));
        return;
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

        await this.applyWindsurfRecipe(selectedRecipe);
      }

    } catch (error) {
      console.log(chalk.red(`❌ Error loading Windsurf recipes: ${error.message}`));
    }
  }

  async applyWindsurfRecipe(recipeKey) {
    console.log(chalk.blue(`\n🌊 Applying Windsurf recipe: ${recipeKey}`));
    
    try {
      const windsurfRecipes = await fetchWindsurfRecipes();
      const recipe = windsurfRecipes[recipeKey];
      
      if (!recipe) {
        console.log(chalk.red('❌ Recipe not found'));
        return;
      }

      this.config.technologyStack = { ...recipe.techStack };
      this.config.windsurfRules = recipe.windsurfRules;
      
      console.log(chalk.green(`✅ Applied Windsurf recipe: ${recipe.name}`));
      console.log(chalk.gray(`📋 Tech stack: ${JSON.stringify(recipe.techStack)}`));
      
      const { customize } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'customize',
          message: 'Would you like to customize the tech stack?',
          default: false
        }
      ]);

      if (customize) {
        return 'customize_tech_stack';
      }

    } catch (error) {
      console.log(chalk.red(`❌ Error applying Windsurf recipe: ${error.message}`));
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
}

module.exports = { RecipeManager };