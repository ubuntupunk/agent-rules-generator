/**
 * Test suite for Windsurf integration functionality
 * Tests the Windsurf scraper integration with the main CLI
 */

import { describe, test, expect } from 'bun:test';
import { 
  fetchWindsurfRecipes,
  listWindsurfRecipes,
  searchWindsurfRecipes,
  getWindsurfCacheInfo,
  clearWindsurfCache
} from '../lib/windsurf_scraper.js';

describe('Windsurf Integration', () => {
  
  describe('fetchWindsurfRecipes function', () => {
    test('should fetch and cache Windsurf recipes', async () => {
      const recipes = await fetchWindsurfRecipes();
      
      expect(typeof recipes).toBe('object');
      expect(Object.keys(recipes).length).toBeGreaterThan(0);
      
      // Check recipe structure
      const firstRecipe = Object.values(recipes)[0];
      expect(firstRecipe).toHaveProperty('name');
      expect(firstRecipe).toHaveProperty('description');
      expect(firstRecipe).toHaveProperty('category');
      expect(firstRecipe).toHaveProperty('techStack');
      expect(firstRecipe).toHaveProperty('windsurfRules');
      expect(firstRecipe).toHaveProperty('source');
    }, 20000);
  });

  describe('listWindsurfRecipes function', () => {
    test('should list Windsurf recipes with metadata', async () => {
      const recipes = await listWindsurfRecipes();
      
      expect(Array.isArray(recipes)).toBe(true);
      expect(recipes.length).toBeGreaterThan(0);
      
      // Check recipe list structure
      recipes.forEach(recipe => {
        expect(recipe).toHaveProperty('key');
        expect(recipe).toHaveProperty('name');
        expect(recipe).toHaveProperty('description');
        expect(recipe).toHaveProperty('category');
        expect(recipe).toHaveProperty('techStack');
      });
    }, 15000);
  });

  describe('searchWindsurfRecipes function', () => {
    test('should search Windsurf recipes by technology', async () => {
      const reactRecipes = await searchWindsurfRecipes('react');
      
      expect(Array.isArray(reactRecipes)).toBe(true);
      // Should find at least some React-related recipes
      expect(reactRecipes.length).toBeGreaterThan(0);
    }, 15000);

    test('should search Windsurf recipes by language', async () => {
      const pythonRecipes = await searchWindsurfRecipes('python');
      
      expect(Array.isArray(pythonRecipes)).toBe(true);
      // Should find Python-related recipes
      expect(pythonRecipes.length).toBeGreaterThan(0);
    }, 15000);

    test('should return empty array for non-existent technology', async () => {
      const nonExistentRecipes = await searchWindsurfRecipes('nonexistentframework');
      
      expect(Array.isArray(nonExistentRecipes)).toBe(true);
      expect(nonExistentRecipes.length).toBe(0);
    }, 15000);
  });

  describe('cache management', () => {
    test('should provide cache information', async () => {
      // First ensure we have some cache
      await fetchWindsurfRecipes();
      
      const cacheInfo = await getWindsurfCacheInfo();
      
      expect(cacheInfo).toHaveProperty('exists');
      expect(cacheInfo).toHaveProperty('cacheDir');
      
      if (cacheInfo.exists) {
        expect(cacheInfo).toHaveProperty('lastUpdated');
        expect(cacheInfo).toHaveProperty('recipeCount');
        expect(cacheInfo).toHaveProperty('ageMs');
        expect(cacheInfo).toHaveProperty('isValid');
      }
    }, 15000);

    test('should clear cache successfully', async () => {
      // Ensure cache exists first
      await fetchWindsurfRecipes();
      
      const success = await clearWindsurfCache();
      expect(typeof success).toBe('boolean');
      
      // Check that cache is cleared
      const cacheInfo = await getWindsurfCacheInfo();
      expect(cacheInfo.exists).toBe(false);
    }, 15000);
  });

  describe('recipe content validation', () => {
    test('should have valid Windsurf rules content', async () => {
      const recipes = await fetchWindsurfRecipes();
      const recipeKeys = Object.keys(recipes);
      
      expect(recipeKeys.length).toBeGreaterThan(0);
      
      // Check first few recipes for valid content
      for (let i = 0; i < Math.min(3, recipeKeys.length); i++) {
        const recipe = recipes[recipeKeys[i]];
        
        expect(recipe.windsurfRules).toBeTruthy();
        expect(typeof recipe.windsurfRules).toBe('string');
        expect(recipe.windsurfRules.length).toBeGreaterThan(50);
        
        // Should contain typical rule patterns
        const rules = recipe.windsurfRules.toLowerCase();
        const hasRulePatterns = rules.includes('#') || 
                               rules.includes('-') || 
                               rules.includes('use') ||
                               rules.includes('follow') ||
                               rules.includes('prefer');
        
        expect(hasRulePatterns).toBe(true);
      }
    }, 20000);

    test('should detect technologies correctly', async () => {
      const recipes = await fetchWindsurfRecipes();
      const recipeValues = Object.values(recipes);
      
      // Should have at least one recipe with detected technology
      const hasReactRecipe = recipeValues.some(recipe => 
        recipe.techStack.frontend === 'React' || 
        recipe.name.toLowerCase().includes('react')
      );
      
      const hasPythonRecipe = recipeValues.some(recipe => 
        recipe.techStack.language === 'Python' || 
        recipe.name.toLowerCase().includes('python')
      );
      
      expect(hasReactRecipe || hasPythonRecipe).toBe(true);
    }, 15000);
  });
});

// Manual test function for debugging
async function runManualWindsurfTests() {
  console.log('🌊 Running manual Windsurf integration tests...\n');
  
  try {
    // Test 1: Fetch recipes
    console.log('📥 Test 1: Fetch Windsurf recipes');
    const recipes = await fetchWindsurfRecipes();
    console.log(`✅ Fetched ${Object.keys(recipes).length} recipes`);
    
    // Test 2: List recipes
    console.log('\n📋 Test 2: List recipes');
    const recipeList = await listWindsurfRecipes();
    console.log(`✅ Listed ${recipeList.length} recipes:`);
    recipeList.slice(0, 3).forEach((recipe, i) => {
      console.log(`   ${i + 1}. ${recipe.name} (${recipe.category})`);
    });
    
    // Test 3: Search recipes
    console.log('\n🔍 Test 3: Search for React recipes');
    const reactRecipes = await searchWindsurfRecipes('react');
    console.log(`✅ Found ${reactRecipes.length} React-related recipes`);
    
    // Test 4: Cache info
    console.log('\n📊 Test 4: Cache information');
    const cacheInfo = await getWindsurfCacheInfo();
    console.log(`✅ Cache exists: ${cacheInfo.exists}`);
    if (cacheInfo.exists) {
      console.log(`   Recipe count: ${cacheInfo.recipeCount}`);
      console.log(`   Last updated: ${new Date(cacheInfo.lastUpdated).toLocaleString()}`);
    }
    
    console.log('\n🎉 All manual Windsurf tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Manual Windsurf tests failed:', error.message);
  }
}

// Export for manual testing
export { runManualWindsurfTests };

// Run manual tests if called directly
if (import.meta.main) {
  runManualWindsurfTests().catch(console.error);
}