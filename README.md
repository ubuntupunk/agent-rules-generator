# Agent Rules Generator

An interactive CLI tool to generate `.agent.md` and `.windsurfrules` files for AI-assisted development with Cursor AI and Windsurf.

## 🚀 Features

- **Interactive CLI**: Guided setup process for creating AI assistant configuration files
- **Multiple AI Platforms**: Support for both Cursor AI (`.agent.md`) and Windsurf (`.windsurfrules`)
- **Recipe System**: Pre-built templates for common project types (React, TypeScript, etc.)
- **Project Structure Analysis**: Automatically detects and configures based on your project setup
- **Customizable Rules**: Define coding standards, workflow guidelines, and project-specific instructions

## 📋 Prerequisites

- **Bun** >= 1.0.0
- **Node.js** >= 14.0.0 (for compatibility)

## 🛠️ Installation

### Option 1: Install Dependencies and Run Locally

```bash
# Install dependencies using Bun
bun install

# Run the CLI tool
bun run start
```

### Option 2: Global Installation

```bash
# Install dependencies
bun install

# Link globally for system-wide access
bun link

# Now you can use it anywhere
agent-rules
# or
generate-agent
```

## 🎯 Usage

### Basic Usage

```bash
# Start the interactive CLI
bun run start
```

### Available Commands

```bash
# Start the generator
bun run start

# Run tests
bun test

# Lint code
bun run lint

# Format code
bun run format
```

### Global Usage (after linking)

```bash
# Generate agent rules file
agent-rules

# Alternative command
generate-agent
```

## 📁 Project Structure

```
agent-rules-generator/
├── agent_rules_cli.js      # Main CLI application
├── package.json            # Project configuration
├── bun.lock               # Bun lockfile
├── lib/                   # Core library files
│   ├── generator_lib.js   # File generation logic
│   └── recipes_lib.js     # Recipe management
├── recipes/               # Pre-built project templates
│   └── react_recipe.txt   # React + TypeScript + Vite template
└── templates/             # Template files (empty)
```

## 🍳 Recipes & Templates

### Recipes
Recipes are pre-configured project type definitions that provide default values for generating agent rules files. They contain metadata about technology stacks, coding standards, and project structures for specific types of projects.

The tool includes pre-built recipes for common project setups:

- **React + TypeScript + Vite**: Modern React application with TypeScript, Vite, and Tailwind CSS
- More recipes coming soon!

### Templates
Templates are customizable markdown files that serve as the base structure for generated `.agent.md` or `.windsurfrules` files. They allow you to define custom sections and formatting for your AI assistant configuration files.

### Community Contributions

We welcome community contributions for both recipes and templates! If you have a recipe or template that would be useful for others:

1. **For Recipes**: Create a YAML or text file in the `recipes/` directory following the existing format
2. **For Templates**: Add a markdown file to the `templates/` directory with your custom template structure

#### Recipe Format
Recipes should include:
- `name`: Name of the project type
- `description`: Brief description of the project type
- `category`: Category (Frontend, Backend, Full Stack, etc.)
- `tags`: Array of relevant tags
- `techStack`: Object containing technology details (language, frontend, backend, etc.)

#### Template Format
Templates are markdown files with placeholders for dynamic content. See existing templates in the `templates/` directory for examples.

#### Submitting Contributions
1. Fork the repository
2. Add your recipe or template
3. Submit a pull request with a clear description of your contribution
4. Ensure your contribution follows the project's code style and documentation standards

## 🔧 Configuration

The CLI will guide you through configuring:

### Project Overview
- Project name and description
- Main purpose and goals
- Target audience

### Technology Stack
- Programming languages
- Frameworks and libraries
- Development tools
- Testing frameworks

### Coding Standards
- Code style preferences
- Naming conventions
- Documentation requirements
- Best practices

### Project Structure
- Directory organization
- File naming patterns
- Module structure

### Workflow Guidelines
- Development process
- Code review practices
- Deployment procedures

## 📝 Generated Files

### `.agent.md` (Cursor AI)
A markdown file containing project context and rules for Cursor AI assistant.

### `.windsurfrules` (Windsurf)
A configuration file for Windsurf AI development environment.

## 🚀 Development

### Setup Development Environment

```bash
# Clone the repository
git clone <your-repo-url>
cd agent-rules-generator

# Install dependencies with Bun
bun install

# Run in development mode
bun run start
```

### Available Scripts

```bash
# Start the application
bun run start

# Run tests
bun test

# Lint code
bun run lint

# Format code with Prettier
bun run format

# Prepare husky hooks
bun run prepare
```

## 🧪 Testing

```bash
# Run all tests
bun test

# Run tests with coverage
bun test --coverage
```

## 📦 Building

The project is ready to run without a build step. For distribution:

```bash
# Create a production-ready package
bun run prepare
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the GNU General Public License (GPL) - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/agent-rules-generator/issues) page
2. Create a new issue if your problem isn't already reported
3. Provide detailed information about your environment and the issue

## 🔗 Related Tools

- [Cursor AI](https://cursor.sh/) - AI-powered code editor
- [Windsurf](https://codeium.com/windsurf) - AI development environment
- [Bun](https://bun.sh/) - Fast all-in-one JavaScript runtime

---

Made with ❤️ for the AI-assisted development community