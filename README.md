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