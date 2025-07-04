const fs = require('fs').promises;
const path = require('path');
const yaml = require('js-yaml');

/**
 * Loads all available recipes from the recipes directory
 * @returns {Object} Object containing all loaded recipes
 */
async function loadRecipes() {
  try {
    const recipesDir = path.join(__dirname, '..', 'recipes');
    const files = await fs.readdir(recipesDir);
    const recipes = {};
    
    for (const file of files) {
      if (file.endsWith('.yml') || file.endsWith('.yaml')) {
        const filePath = path.join(recipesDir, file);
        const content = await fs.readFile(filePath, 'utf8');
        const recipe = yaml.load(content);
        const recipeName = path.basename(file, path.extname(file));
        recipes[recipeName] = recipe;
      }
    }
    
    return recipes;
  } catch (error) {
    console.warn('Warning: Could not load recipes directory');
    return {};
  }
}

/**
 * Searches for recipes matching given criteria
 * @param {string} query - Search query
 * @param {Object} recipes - Object containing all recipes
 * @returns {Array} Array of matching recipe keys
 */
function searchRecipes(query, recipes) {
  const searchTerm = query.toLowerCase();
  const matches = [];
  
  for (const [key, recipe] of Object.entries(recipes)) {
    const searchableText = [
      recipe.name,
      recipe.description,
      recipe.category,
      JSON.stringify(recipe.techStack),
      JSON.stringify(recipe.tags || [])
    ].join(' ').toLowerCase();
    
    if (searchableText.includes(searchTerm)) {
      matches.push(key);
    }
  }
  
  return matches;
}

/**
 * Gets a specific recipe by name
 * @param {string} recipeName - Name of the recipe to get
 * @returns {Object|null} Recipe object or null if not found
 */
async function getRecipe(recipeName) {
  const recipes = await loadRecipes();
  return recipes[recipeName] || null;
}

/**
 * Lists all available recipes with basic info
 * @returns {Array} Array of recipe summaries
 */
async function listRecipes() {
  const recipes = await loadRecipes();
  return Object.entries(recipes).map(([key, recipe]) => ({
    key,
    name: recipe.name,
    description: recipe.description,
    category: recipe.category,
    tags: recipe.tags || []
  }));
}

/**
 * Validates a recipe structure
 * @param {Object} recipe - Recipe object to validate
 * @returns {boolean} True if valid, false otherwise
 */
function validateRecipe(recipe) {
  const requiredFields = ['name', 'description', 'category', 'techStack'];
  
  for (const field of requiredFields) {
    if (!recipe[field]) {
      return false;
    }
  }
  
  return true;
}

module.exports = {
  loadRecipes,
  searchRecipes,
  getRecipe,
  listRecipes,
  validateRecipe
};