# CLI Refactoring Task Tracker

## 🎯 **Objective**
Break down `agent_rules_cli.js` (779 lines) into manageable modules under 500 lines each.

## 📊 **Current Status**

### **✅ Completed Modules**
- `lib/recipes_lib.js` - Recipe system (GitHub integration, caching)
- `lib/project_types.js` - Project type logic and conditional questions
- `lib/windsurf_manager.js` - Windsurf CLI integration and menu handling
- `lib/windsurf_scraper.js` - Windsurf integration (scraping, caching)
- `lib/generator_lib.js` - File generation and template processing
- `lib/cleanup_utils.js` - Cleanup and maintenance utilities
- `lib/tech_stack_collector.js` - Technology stack collection and customization
- `lib/project_configurator.js` - Project configuration collection
- `lib/recipe_manager.js` - Recipe selection and application logic
- `lib/cache_manager.js` - Cache management operations
- `lib/repository_manager.js` - Repository settings and connection testing

 
### **🔄 Refactored**
- `agent_rules_cli.js` - Main CLI class (779 lines → target: <200 lines)

## 📋 **Method Distribution Analysis**

### **Current agent_rules_cli.js Methods (20 total)**

#### **Recipe Management** → `lib/recipe_manager.js`
- `selectRecipe()` - 45 lines
- `searchRecipesCommand()` - 25 lines  
- `refreshRecipesCommand()` - 12 lines
- `applyRecipe()` - 35 lines
- **Total: ~117 lines**

#### **Windsurf Integration** → `lib/windsurf_manager.js`
- `handleWindsurfRecipes()` - 30 lines
- `browseWindsurfRecipes()` - 55 lines
- `applyWindsurfRecipe()` - 40 lines
- `refreshWindsurfRecipes()` - 15 lines
- `showWindsurfCacheInfo()` - 25 lines
- `clearWindsurfCache()` - 20 lines
- `searchWindsurfRecipes()` - 30 lines
- **Total: ~215 lines**

#### **Tech Stack Collection** → `lib/tech_stack_collector.js`
- `collectTechStack()` - 25 lines
- `manualTechStackSetup()` - 15 lines
- `customizeTechStack()` - 20 lines
- **Total: ~60 lines**

#### **Project Configuration** → `lib/project_configurator.js`
- `collectProjectInfo()` - 35 lines
- `collectCodingStandards()` - 40 lines
- `collectProjectStructure()` - 35 lines
- `collectWorkflowGuidelines()` - 40 lines
- `collectProjectManagement()` - 35 lines
- **Total: ~185 lines**

#### **Cache Management** → `lib/cache_manager.js`
- `cacheManagement()` - 25 lines
- `showCacheInfo()` - 30 lines
- `clearCacheCommand()` - 15 lines
- **Total: ~70 lines**

#### **Repository Management** → `lib/repository_manager.js`
- `repositorySettings()` - 20 lines
- `testConnection()` - 35 lines
- **Total: ~55 lines**

#### **Core Flow** (Keep in `agent_rules_cli.js`)
- `run()` - 15 lines
- `init()` - 10 lines
- `displayWelcome()` - 8 lines
- `generateFiles()` - 25 lines
- **Total: ~58 lines**

## 🚀 **Refactoring Plan**

### **Phase 1: Create Missing Modules** ⏳
- [x] Create `lib/recipe_manager.js`
- [x] Create `lib/windsurf_manager.js` 
- [x] Create `lib/tech_stack_collector.js`
- [x] Create `lib/project_configurator.js`
- [x] Create `lib/cache_manager.js`
- [x] Create `lib/repository_manager.js`

### **Phase 2: Extract Methods** ⏳
- [x] Move recipe methods to `recipe_manager.js`
- [x] Move Windsurf methods to `windsurf_manager.js`
- [x] Move tech stack methods to `tech_stack_collector.js`
- [x] Move project config methods to `project_configurator.js`
- [x] Move cache methods to `cache_manager.js`
- [x ] Move repository methods to `repository_manager.js`

### **Phase 3: Update Main CLI** ⏳
- [ ] Import new modules in `agent_rules_cli.js`
- [ ] Replace method calls with module calls
- [ ] Keep only core flow methods in main class
- [ ] Update constructor to initialize managers

### **Phase 4: Testing & Validation** ⏳
- [ ] Update existing tests for new module structure
- [ ] Create tests for new modules
- [ ] Verify CLI functionality works unchanged
- [ ] Test all menu flows and integrations

### **Phase 5: Documentation** ⏳
- [ ] Update README with new architecture
- [ ] Document module responsibilities
- [ ] Update contribution guidelines

## 🎯 **Target Architecture**

```
agent_rules_cli.js (~150 lines)
├── Core flow methods only
├── Manager initialization
└── Menu routing

lib/
├── recipe_manager.js (~120 lines)
├── windsurf_manager.js (~220 lines)
├── tech_stack_collector.js (~70 lines)
├── project_configurator.js (~190 lines)
├── cache_manager.js (~80 lines)
├── repository_manager.js (~60 lines)
├── recipes_lib.js (existing)
├── project_types.js (existing)
├── windsurf_scraper.js (existing)
├── generator_lib.js (existing)
└── cleanup_utils.js (existing)
```

## ✅ **Success Criteria**

- [ ] Main CLI file under 200 lines
- [ ] All modules under 300 lines
- [ ] No functionality lost
- [ ] All tests passing
- [ ] Clean separation of concerns
- [ ] Easy to maintain and extend

## 📝 **Notes**

- Maintain backward compatibility
- Keep existing API interfaces
- Preserve all current functionality
- Ensure proper error handling in modules
- Use consistent coding patterns across modules

---

**Status**: 🔄 In Progress  
**Priority**: High  
**Estimated Effort**: 4-6 hours  
**Dependencies**: None
