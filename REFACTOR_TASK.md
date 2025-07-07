# CLI Refactoring Task Tracker

## 🎯 **Objective**
Break down `agent_rules_cli.js` (779 lines, 20 methods) into manageable modules under 500 lines each.

## 📊 **Current Status**

### **✅ Modules Already Created**
- `lib/recipes_lib.js` - Recipe management and GitHub integration
- `lib/project_types.js` - Project type logic and conditional questions
- `lib/windsurf_scraper.js` - Windsurf integration functionality
- `lib/generator_lib.js` - File generation and template processing
- `lib/cleanup_utils.js` - Cleanup and maintenance utilities

### **❌ Modules Still Needed**
Based on analysis of `agent_rules_cli.js` methods:

#### **1. Recipe Manager Module** (`lib/recipe_manager.js`)
**Methods to extract:**
- `selectRecipe()` - Main recipe selection flow
- `searchRecipesCommand()` - Recipe search functionality
- `refreshRecipesCommand()` - Recipe refresh operations
- `applyRecipe()` - Apply selected recipe to configuration

**Estimated size:** ~150 lines

#### **2. Windsurf Manager Module** (`lib/windsurf_manager.js`)
**Methods to extract:**
- `handleWindsurfRecipes()` - Main Windsurf menu handler
- `browseWindsurfRecipes()` - Browse available Windsurf recipes
- `applyWindsurfRecipe()` - Apply Windsurf recipe to configuration
- `refreshWindsurfRecipes()` - Refresh Windsurf recipe cache
- `showWindsurfCacheInfo()` - Display cache information
- `clearWindsurfCache()` - Clear Windsurf cache
- `searchWindsurfRecipes()` - Search Windsurf recipes

**Estimated size:** ~200 lines

#### **3. Tech Stack Collector Module** (`lib/tech_stack_collector.js`)
**Methods to extract:**
- `collectTechStack()` - Main tech stack collection flow
- `manualTechStackSetup()` - Manual tech stack configuration
- `customizeTechStack()` - Tech stack customization

**Estimated size:** ~100 lines

#### **4. Project Configurator Module** (`lib/project_configurator.js`)
**Methods to extract:**
- `collectProjectInfo()` - Project overview collection
- `collectCodingStandards()` - Coding standards setup
- `collectProjectStructure()` - Project structure configuration
- `collectWorkflowGuidelines()` - Workflow guidelines setup
- `collectProjectManagement()` - Project management configuration

**Estimated size:** ~200 lines

#### **5. Cache Manager Module** (`lib/cache_manager.js`)
**Methods to extract:**
- `cacheManagement()` - Cache management menu
- `showCacheInfo()` - Display cache information
- `clearCacheCommand()` - Clear cache operations

**Estimated size:** ~80 lines

#### **6. Repository Manager Module** (`lib/repository_manager.js`)
**Methods to extract:**
- `repositorySettings()` - Repository settings menu
- `testConnection()` - Test repository connection

**Estimated size:** ~60 lines

### **🎯 Target Structure**

#### **Core CLI File** (`agent_rules_cli.js`)
**Keep only essential methods:**
- `constructor()` - Class initialization
- `run()` - Main application flow
- `init()` - Application initialization
- `displayWelcome()` - Welcome message
- `generateFiles()` - File generation coordination

**Target size:** ~150 lines

## 📋 **Refactoring Checklist**

### **Phase 1: Create Missing Modules**
- [ ] Create `lib/recipe_manager.js`
- [ ] Create `lib/windsurf_manager.js`
- [ ] Create `lib/tech_stack_collector.js`
- [ ] Create `lib/project_configurator.js`
- [ ] Create `lib/cache_manager.js`
- [ ] Create `lib/repository_manager.js`

### **Phase 2: Extract Methods**
- [ ] Extract recipe management methods
- [ ] Extract Windsurf integration methods
- [ ] Extract tech stack collection methods
- [ ] Extract project configuration methods
- [ ] Extract cache management methods
- [ ] Extract repository management methods

### **Phase 3: Update Main CLI**
- [ ] Import new modules in `agent_rules_cli.js`
- [ ] Replace method calls with module calls
- [ ] Remove extracted methods from main file
- [ ] Update constructor to initialize modules

### **Phase 4: Testing & Validation**
- [ ] Test all existing functionality works
- [ ] Run full test suite
- [ ] Verify CLI startup and basic operations
- [ ] Test each module independently

### **Phase 5: Documentation**
- [ ] Update README with new structure
- [ ] Document module responsibilities
- [ ] Update development guide

## 🏗️ **Implementation Strategy**

### **1. Create Module Template**
Each module should follow this pattern:
```javascript
/**
 * [Module Name] - [Description]
 * Handles [specific functionality]
 */

class [ModuleName] {
  constructor(inquirer, chalk, config) {
    this.inquirer = inquirer;
    this.chalk = chalk;
    this.config = config;
  }

  async method1() {
    // Extracted method
  }
}

module.exports = [ModuleName];
```

### **2. Update Main CLI**
```javascript
// Import modules
const RecipeManager = require('./lib/recipe_manager');
const WindsurfManager = require('./lib/windsurf_manager');
// ... other modules

class AgentRulesGenerator {
  constructor() {
    // Initialize modules
    this.recipeManager = new RecipeManager(inquirer, chalk, this.config);
    this.windsurfManager = new WindsurfManager(inquirer, chalk, this.config);
    // ... other modules
  }

  async selectRecipe() {
    return await this.recipeManager.selectRecipe();
  }
}
```

### **3. Maintain Backward Compatibility**
- Keep all existing method signatures
- Ensure all imports work correctly
- Maintain test compatibility

## 📏 **Success Criteria**

- [ ] `agent_rules_cli.js` under 200 lines
- [ ] All modules under 300 lines each
- [ ] All existing functionality preserved
- [ ] All tests passing
- [ ] CLI startup time not significantly impacted
- [ ] Code maintainability improved

## 🚨 **Current Blocker**

The main CLI file is currently **779 lines** with **20 methods**, making it difficult to maintain and extend. This refactoring is **critical** for:
- Adding new features (like Windsurf integration)
- Maintaining code quality
- Improving testability
- Enabling team collaboration

## 📅 **Priority Order**

1. **High Priority**: Recipe Manager, Windsurf Manager (needed for current features)
2. **Medium Priority**: Tech Stack Collector, Project Configurator (core functionality)
3. **Low Priority**: Cache Manager, Repository Manager (utility functions)

---

**Status**: 🔴 **In Progress** - Modules created but extraction not completed
**Next Step**: Create missing modules and begin method extraction