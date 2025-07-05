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

### Recipe Repository

The tool can fetch recipes from a remote GitHub repository, allowing for easy updates and sharing of project templates. By default, it uses the official recipe repository at [ubuntupunk/agent-rules-recipes](https://github.com/ubuntupunk/agent-rules-recipes).

#### Repository Structure
```
agent-rules-recipes/
├── recipes/           # Recipe files (.yaml)
└── templates/         # Template files referenced by recipes
```

#### Using a Custom Recipe Repository
You can configure a custom repository by running:
```bash
bun run start
```
Then select "Configure remote repository" and enter your GitHub repository in the format `owner/repo`.

### API Integration

The tool uses the GitHub API to fetch recipes and templates. For optimal performance and to avoid rate limiting, it's recommended to set up a GitHub Personal Access Token.

#### Setting Up GitHub Authentication
1. Create a Personal Access Token:
   - Go to GitHub → Settings → Developer Settings → Personal Access Tokens → Generate new token
   - Select the `public_repo` scope (or `repo` for private repositories)
   - Copy the generated token

2. Configure the token:
   ```bash
   # Temporary (current session only)
   export GITHUB_TOKEN=your_token_here
   
   # Or add to your shell profile (~/.bashrc, ~/.zshrc, etc.)
   echo 'export GITHUB_TOKEN=your_token_here' >> ~/.bashrc
   source ~/.bashrc
   ```

#### Rate Limits
- **Unauthenticated**: 60 requests per hour
- **Authenticated**: 5,000 requests per hour

The tool will show your current rate limit status during operations.

### Recipes
Recipes are pre-configured project type definitions that provide default values for generating agent rules files. They contain metadata about technology stacks, coding standards, and project structures for specific types of projects.

#### Creating Custom Recipes
1. Create a new YAML file in the `recipes` directory of your repository
2. Follow this structure:
   ```yaml
   name: "Project Type Name"
   description: "Description of the project type"
   technologies:
     - "Technology 1"
     - "Technology 2"
   rules:
     - "Rule 1"
     - "Rule 2"
   templates:
     - source: "templates/filename.template"
       target: "{{project_name}}/path/to/output"
   ```
3. Commit and push to your repository
4. The tool will automatically detect new recipes on the next sync

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

## 📡 Deployment

The project is set up with a GitHub Action that automatically deploys and publishes the package to the default npm registry when a new tag is pushed. To trigger deployment:

1. Create a new tag (e.g., `v1.0.0`)
2. Push the tag to the remote repository: `git push origin v1.0.0`

Ensure you have set up the `NPM_TOKEN` secret in your GitHub repository settings with the necessary npm publish permissions. The GitHub Action will use this token to authenticate with the npm registry.

## 🤝 Contributing

We welcome contributions to both the main application and the recipe repository. Please follow these guidelines:

### For Code Contributions (Main Repository)
- Submit all code improvements, bug fixes, and new features to the main repository: [ubuntupunk/agent-rules-generator](https://github.com/ubuntupunk/agent-rules-generator)
- Follow the existing code style and include tests for new features
- Create a descriptive pull request explaining your changes

### For Recipe Contributions
- Submit all recipe additions and modifications to the recipe repository: [ubuntupunk/agent-rules-recipes](https://github.com/ubuntupunk/agent-rules-recipes)
- Follow the recipe format and structure
- Include clear descriptions and relevant metadata for your recipes

### Development Setup
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Issues
- For bugs and feature requests, please use the [GitHub Issues](https://github.com/ubuntupunk/agent-rules-generator/issues) in the appropriate repository
- Clearly describe the issue or feature request
- Include steps to reproduce for bugs

## 📄 License

This project is licensed under the GNU General Public License (GPL) - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to all contributors who help improve this tool
- Inspired by the need for better AI-assisted development workflows

---

Built with ❤️ by [Your Name]
