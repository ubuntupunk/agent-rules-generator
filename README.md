☕ Support This Work

Found value in these resources?

👉 Buy me a coffee: https://www.buymeacoffee.com/ubuntupunk

If you find value in this project, please consider buying me a coffee to support my work.

That will help me maintain and improve the resources available for free

# Agent Rules Generator

An interactive CLI tool to generate `.agent.md` and `.windsurfrules` files for AI-assisted development with Cursor AI and Windsurf.

## 🤝 Contributing

We welcome contributions! Here's how you can help:

- 🐛 **Report bugs** via [GitHub Issues](https://github.com/ubuntupunk/agent-rules-generator/issues)
- 💡 **Suggest features** or improvements
- 📝 **Improve documentation** (README, guides, examples)
- 🧪 **Add tests** for new functionality
- 🔧 **Submit pull requests** with bug fixes or features
- 🍳 **Create new recipes** for different tech stacks
- 📋 **Add project types** for better inclusivity

**Quick Start for Contributors:**
```bash
git clone https://github.com/ubuntupunk/agent-rules-generator.git
cd agent-rules-generator
bun install
bun test  # Ensure all tests pass
```

See our [Testing Guide](docs/testing.md) and [Deployment Guide](docs/deployment.md) for detailed contribution guidelines.

## 🚀 Features

- **Interactive CLI**: Guided setup process for creating AI assistant configuration files
- **Multiple AI Platforms**: Support for both Cursor AI (`.agent.md`) and Windsurf (`.windsurfrules`)
- **Project Type Inclusivity**: Supports 6 project types with tailored question flows
- **Recipe System**: Pre-built templates for common project types and technology stacks
- **Conditional Tech Stack**: Only asks relevant questions based on your project type
- **Enhanced Technology Support**: 20+ technology-specific guidelines and best practices
- **Project Structure Analysis**: Automatically detects and configures based on your project setup
- **Customizable Rules**: Define coding standards, workflow guidelines, and project-specific instructions
- **Interactive Recipe Creator**: Create new recipes with guided prompts and auto-validation
- **Recipe Validation**: Comprehensive validation system with auto-fix capabilities

## 🍳 Recipe Creation & Validation

### **Interactive Recipe Creator**
Create high-quality recipes with guided assistance:

```bash
# Start the CLI and select "Create new recipe"
agent-rules-generator

# Or use validation commands
npm run validate:remote     # Validate remote recipes
npm run validate:sample     # Generate sample recipe
node scripts/validate_recipes.js --help  # See all options
```

#### **Creation Flow:**
1. **Basic Information** - Name, description, category with validation
2. **Technology Stack** - Guided setup, manual entry, or package.json import
3. **Optional Fields** - Author, version, tags with smart defaults
4. **Rules Generation** - Auto-generated templates or custom rules
5. **Validation & Review** - Real-time validation with auto-fixes
6. **Save & Integration** - Flexible saving with git integration

#### **Smart Features:**
- **Category-based suggestions** for languages and frameworks
- **Package.json detection** for existing projects
- **Template generation** based on technology stack
- **Real-time validation** with 15+ quality checks
- **Auto-fix functionality** for common issues
- **Git integration** for automatic recipe tracking

#### **Recipe Validation:**
```bash
# Validate specific recipe file (JSON or YAML)
node scripts/validate_recipes.js --file recipe.json
node scripts/validate_recipes.js --file recipe.yaml

# Validate with auto-fix
node scripts/validate_recipes.js --file recipe.json --fix
node scripts/validate_recipes.js --file recipe.yaml --fix

# Validate all recipes in directory (supports mixed formats)
node scripts/validate_recipes.js --dir ./recipes

# Generate sample recipe templates
node scripts/validate_recipes.js --sample > new_recipe.json
node scripts/validate_recipes.js --sample | yaml-convert > new_recipe.yaml
```

#### **Supported File Formats:**
- **JSON** (`.json`) - Traditional JSON format
- **YAML** (`.yaml`, `.yml`) - Human-readable YAML format
- **Mixed directories** - Validate both formats together
- **Format conversion** - Built-in conversion between formats

## 🏗️ Architecture

The Agent Rules Generator features a **modular architecture** designed for maintainability and extensibility:

### **Core Components**
```
agent-rules-generator/
├── index.js                           # Main entry point
├── agent_rules_cli.js                 # Core CLI orchestrator (424 lines)
├── lib/                               # Specialized modules (11 total)
│   ├── recipe_manager.js              # Recipe selection and application
│   ├── windsurf_manager.js            # Windsurf integration and menu handling
│   ├── tech_stack_collector.js        # Technology stack collection
│   ├── project_configurator.js        # Project configuration collection
│   ├── cache_manager.js               # Cache management operations
│   ├── repository_manager.js          # Repository settings and testing
│   ├── generator_lib.js               # Template system and file generation
│   ├── recipes_lib.js                 # Recipe system with GitHub integration
│   ├── project_types.js               # Project type logic and questions
│   ├── windsurf_scraper.js            # Windsurf recipe scraping and caching
│   └── cleanup_utils.js               # Cleanup and maintenance utilities
├── templates/                         # Template files for generation
├── test/                              # Comprehensive test suites (99 tests)
└── docs/                              # Documentation
```

### **Key Design Principles**
- **Separation of Concerns**: Each module handles a specific functionality
- **Dependency Injection**: Modules receive shared dependencies (inquirer, chalk, config)
- **Clean Interfaces**: Consistent method signatures across modules
- **Testability**: 99 tests with 100% pass rate
- **Maintainability**: No module exceeds 300 lines

### **Refactoring Achievement**
- ✅ **45% code reduction**: Main CLI reduced from 779 → 424 lines
- ✅ **11 specialized modules** with clean separation of concerns
- ✅ **100% functionality preserved** including the awesome startup screen
- ✅ **All 108 tests passing** with comprehensive coverage
- ✅ **Bug fixes completed**: Windsurf recipe customization flow fully functional

## 📋 Prerequisites

### For Normal Use
- **Node.js** >= 14.0.0

### For Development
- **Node.js** >= 14.0.0
- **Bun** >= 1.0.0 (recommended for development)
- **Git** (for contributing)

## 🛠️ Installation

### For Normal Use (Recommended)

Install globally to use the CLI commands anywhere:

```bash
# Using npm (recommended)
npm install -g agent-rules-generator

# Using Bun (fast alternative)
bun add -g agent-rules-generator

# Using Yarn
yarn global add agent-rules-generator

# Using pnpm
pnpm add -g agent-rules-generator
```

### For Development/Contributing

If you want to contribute to the project or run from source:

```bash
# Clone the repository
git clone https://github.com/ubuntupunk/agent-rules-generator.git
cd agent-rules-generator

# Install dependencies
bun install  # or npm install

# Run from source
node index.js

# Run tests
bun test  # or npm test
```

## 👨‍💻 Development Guide

### **Working with the Modular Architecture**

The codebase is organized into specialized modules for easy development and maintenance:

#### **Adding New Features**
1. **Identify the appropriate module** or create a new one if needed
2. **Follow the module pattern**:
   ```javascript
   class ModuleName {
     constructor(config) {
       this.config = config;
     }
     
     async methodName() {
       // Implementation
     }
   }
   
   module.exports = { ModuleName };
   ```
3. **Update the main CLI** to use your new module
4. **Add comprehensive tests** for your functionality

#### **Module Responsibilities**
- **recipe_manager.js**: Recipe selection, browsing, and application
- **windsurf_manager.js**: Windsurf-specific functionality and menus
- **tech_stack_collector.js**: Technology stack collection and customization
- **project_configurator.js**: Project information and configuration collection
- **cache_manager.js**: Cache operations and management
- **repository_manager.js**: Remote repository configuration and testing

#### **Testing Guidelines**
```bash
# Run all tests (140+ tests across 9 test suites)
bun test

# Run specific test suite
bun test test/template_system.test.js

# Run recipe creation tests (34 tests)
bun test test/recipe_creator.test.js

# Run recipe validation tests (15 tests)
bun test test/recipe_validation.test.js

# Run Windsurf customization flow tests (9 tests)
bun test test/windsurf_customization_flow.test.js

# Test with verbose output
bun test --verbose
```

#### **Test Coverage:**
- **Recipe Creator**: 34 tests covering suggestions, detection, templates, validation
- **Recipe Validation**: 15 tests covering validation rules, auto-fixes, edge cases
- **Windsurf Integration**: 9 tests covering customization flow and bug fixes
- **Template System**: 18 tests covering file generation and technology detection
- **Deployment**: 33 tests covering package config and CI/CD validation

#### **Recipe Management Scripts**
```bash
# Validate recipes (supports JSON and YAML)
npm run validate              # Validate local/remote recipes
npm run validate:remote       # Validate remote GitHub recipes  
npm run validate:fix          # Validate with auto-fix enabled
npm run validate:sample       # Generate sample recipe template

# Format-specific validation examples
node scripts/validate_recipes.js --file recipe.json
node scripts/validate_recipes.js --file recipe.yaml
node scripts/validate_recipes.js --dir ./recipes  # Mixed formats
```

#### **Code Quality Standards**
- **Keep modules under 300 lines** for maintainability
- **Use dependency injection** for shared resources
- **Follow consistent naming conventions** (camelCase for methods, PascalCase for classes)
- **Add JSDoc comments** for public methods
- **Include error handling** with user-friendly messages using chalk

## 🚀 Quick Start

1. **Install globally**:
   ```bash
   npm install -g agent-rules-generator
   ```

2. **Run the generator**:
   ```bash
   agent-rules-generator
   ```
   or
   ```bash
   generate-agent-rules
   ```

3. **Follow the interactive prompts** to configure your project

4. **Choose your output format**:
   - `.agent.md` for Cursor AI
   - `.windsurfrules` for Windsurf

The tool will create a comprehensive configuration file tailored to your project type and technology stack.

## 🎯 What It Does

The Agent Rules Generator creates comprehensive configuration files that help AI assistants understand your project better. These files include:

- **Project Overview**: Name, description, version, and type
- **Technology Stack**: Conditional questions based on project type (no more irrelevant questions!)
- **Coding Standards**: Style guides, linting rules, and conventions
- **Project Structure**: Directory organization and file patterns
- **Development Workflow**: Git workflow, branching strategy, and CI/CD processes
- **Project Management**: Methodology, issue tracking, and documentation practices

## 🏗️ Supported Project Types

The tool now supports **6 different project types** with tailored question flows:

### 🌐 **Web Applications**
- Frontend frameworks (React, Vue, Angular, Svelte)
- Backend frameworks (Express, FastAPI, Django, Spring Boot)
- Databases (PostgreSQL, MongoDB, MySQL, SQLite)
- Deployment platforms (Vercel, Netlify, AWS)

### ⚡ **CLI Tools**
- CLI frameworks (Commander.js, Yargs, Inquirer.js)
- Configuration formats (JSON, YAML, TOML)
- Package managers (npm, yarn, pnpm, bun)
- No irrelevant frontend/backend questions

### 📚 **Libraries/Packages**
- Target environments (Node.js, Browser, Both)
- Build systems (TypeScript, Rollup, Webpack)
- Distribution formats (CommonJS, ESM, UMD)
- Testing frameworks (Jest, Vitest, Mocha)

### 📱 **Mobile Applications**
- Platforms (iOS, Android, Cross-platform)
- Frameworks (React Native, Flutter, Native)
- State management (Redux, Zustand, Context API)
- App store distribution

### 🖥️ **Desktop Applications**
- Frameworks (Electron, Tauri, Native)
- UI libraries (React, Vue, Svelte)
- Platform targets (Windows, macOS, Linux)
- Distribution methods

### 🔌 **API/Backend Services**
- Backend frameworks (Express, FastAPI, Django)
- Databases and data storage
- API documentation tools
- Authentication methods

## 🍳 Recipes & Templates

### Recipe System
The tool includes a sophisticated recipe system that fetches pre-built configurations from a remote GitHub repository. This allows for:

- **Easy Updates**: Recipes are updated automatically
- **Community Contributions**: Anyone can contribute new recipes
- **Technology Coverage**: Recipes for all major tech stacks
- **Project Type Specific**: Recipes tailored to each project type

### Available Recipes
- React + TypeScript + Vite
- Vue 3 + TypeScript + Vite
- Node.js + Express + PostgreSQL
- CLI Tool with Commander.js
- React Native + Expo
- Electron + React
- And many more...

### Creating Custom Recipes
You can contribute new recipes by:
1. Forking the [recipe repository](https://github.com/ubuntupunk/agent-rules-recipes)
2. Adding your recipe YAML file
3. Submitting a pull request

## 🧪 Development & Testing

### For Contributors

```bash
# Clone and setup
git clone https://github.com/ubuntupunk/agent-rules-generator.git
cd agent-rules-generator
bun install

# Run tests
bun test                                    # All tests (90 tests)
bun test test/recipe_download.test.js      # Recipe system (17 tests)
bun test test/template_system.test.js      # Template system (18 tests)
bun test test/deployment.test.js           # Deployment (33 tests)
bun test test/project_types.test.js        # Project types (22 tests)

# Run from source
node index.js

# Test deployment
npm pack --dry-run
```

### Project Structure
```
agent-rules-generator/
├── index.js                 # Main CLI entry point
├── agent_rules_cli.js       # Core CLI application
├── lib/                     # Library modules
│   ├── generator_lib.js     # File generation logic
│   ├── recipes_lib.js       # Recipe management
│   └── project_types.js     # Project type logic
├── templates/               # Template files
├── test/                    # Test suites (90 tests)
├── docs/                    # Documentation
├── CHANGELOG.md             # Version history
└── README.md               # This file
```

## 📚 Documentation

- **[Testing Guide](docs/testing.md)** - Comprehensive testing information
- **[Deployment Guide](docs/deployment.md)** - Deployment and CI/CD processes
- **[CHANGELOG.md](CHANGELOG.md)** - Version history and release notes

## 🔧 Configuration

The CLI will guide you through configuring:

### Project Overview
- Project name and description
- Project type selection
- Version and metadata

### Technology Stack (Conditional)
- **Web Apps**: Frontend, backend, database
- **CLI Tools**: CLI framework, config format
- **Libraries**: Target environment, build system
- **Mobile Apps**: Platform, framework, state management
- **Desktop Apps**: Framework, UI library, platforms
- **API/Backend**: Backend framework, database

### Coding Standards
- Code style preferences
- Naming conventions
- Linting and formatting tools
- Documentation requirements

### Project Structure
- Directory organization
- File naming patterns
- Module structure

### Workflow Guidelines
- Git workflow and branching
- CI/CD processes
- Deployment procedures
- Code review practices

## 📝 Generated Files

### `.agent.md` (Cursor AI)
A comprehensive markdown file containing:
- Project context and overview
- Technology-specific guidelines
- Coding standards and conventions
- Development workflow rules
- AI assistant instructions

### `.windsurfrules` (Windsurf)
A configuration file for Windsurf AI development environment with:
- Project-specific rules
- Technology guidelines
- Code generation preferences
- Quality standards

## 🎯 Benefits

### Before v1.1.0 (React-Biased)
- ❌ Always assumed web applications
- ❌ Asked irrelevant frontend/backend questions for CLI tools
- ❌ Limited to 6 technology guidelines
- ❌ One-size-fits-all approach

### After v1.1.0 (Inclusive)
- ✅ **6 project types** supported with specific workflows
- ✅ **Conditional questions** - only relevant ones asked
- ✅ **20+ technologies** with specific guidelines
- ✅ **Context-aware** messaging and defaults
- ✅ **Backward compatible** - existing users unaffected

## 📊 Version History

See [CHANGELOG.md](CHANGELOG.md) for detailed version history and release notes.

## 📄 License

This project is licensed under the GPL-3.0 License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to all contributors who help improve this tool
- Special thanks to the AI development community for feedback and suggestions
- Built with ❤️ for developers working with AI assistants

---

**Made with ❤️ by [ubuntupunk](https://github.com/ubuntupunk)**
