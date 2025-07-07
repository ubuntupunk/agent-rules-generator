# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2024-01-15

### 📚 Documentation
- **Complete README restructure**: Contributing section moved to top, clear installation methods
- **CHANGELOG.md added**: Comprehensive version history following Keep a Changelog format
- **Installation clarity**: npm positioned as preferred method, development vs normal use distinction
- **Professional structure**: Following open source best practices

### 🧪 Testing & Organization
- **Test file organization**: All tests moved to test/ directory with proper naming
- **Cleanup**: Removed temporary and debug test files from root
- **Import path fixes**: Corrected relative imports in moved test files
- **Maintained coverage**: 90 tests passing across 5 test suites

### 🔧 Technical Improvements
- **Enhanced deployment workflow**: Documentation updates included in CI/CD
- **Package structure**: CHANGELOG included in npm package files
- **Better project organization**: Clean root directory, professional structure
- **Syntax fixes**: Resolved package.json trailing comma issue

### 🎯 Benefits
- **Better developer experience**: Clear paths for users vs contributors
- **Professional appearance**: Follows OSS standards and best practices
- **Improved maintainability**: Organized test structure and clean codebase
- **Enhanced documentation**: Comprehensive guides and clear instructions

## [1.1.0] - 2024-01-15

### 🚀 Added
- **Project Type Inclusivity System**: Support for 6 different project types with tailored workflows
- **Conditional Tech Stack Collection**: Only asks relevant questions based on project type
- **Enhanced Technology Guidelines**: Expanded from 6 to 20+ technology-specific guidelines
- **Context-Aware Messaging**: Project type specific question prompts and defaults
- **Project Type Flags**: Template conditional support for project-specific sections
- **New Project Types Support**:
  - Web Applications (frontend, backend, database)
  - CLI Tools (CLI frameworks, config formats, package managers)
  - Libraries/Packages (target environments, build systems, distribution)
  - Mobile Apps (platforms, frameworks, state management)
  - Desktop Apps (frameworks, UI libraries, platform targets)
  - API/Backend Services (backend-focused without frontend assumptions)

### 🧪 Testing
- Added comprehensive project type test suite (22 tests)
- CLI behavior testing for all project types
- Manual integration testing
- Maintained 100% test coverage (90 total tests)

### 📚 Documentation
- Updated README with project type information
- Added comprehensive deployment and testing documentation
- Created project type analysis and implementation guide

### 🔧 Technical Improvements
- New `lib/project_types.js` module for project type logic
- Enhanced `generateTechSpecificGuidelines()` function
- Improved template system with conditional sections
- Better error handling and validation

### 🎯 Benefits
- **No More React Bias**: Removed assumptions about web applications
- **Better User Experience**: Shorter, more relevant questionnaires
- **Comprehensive Coverage**: All major project types supported
- **Extensible Architecture**: Easy to add new project types
- **Backward Compatibility**: Existing functionality preserved

## [1.0.2] - 2024-01-XX

### 🔧 Fixed
- Fixed deployment pipeline issues
- Updated binary names for npm compatibility
- Resolved version conflict in npm publishing
- Enhanced deployment test suite

### 📦 Deployment
- Fixed GitHub Actions workflow for automated deployment
- Improved npm package configuration
- Added comprehensive deployment testing

## [1.0.1] - 2024-01-XX

### 🚀 Added
- Initial release of Agent Rules Generator
- Interactive CLI for creating `.agent.md` and `.windsurfrules` files
- Recipe system with GitHub integration
- Template-based file generation
- Technology-specific guidelines (initial set)

### 🧪 Testing
- Recipe download system tests
- Template system tests
- Basic deployment validation

### 📚 Documentation
- Initial README and documentation
- Basic usage instructions
- Installation guide

---

## Legend

- 🚀 **Added**: New features
- 🔧 **Fixed**: Bug fixes
- 📦 **Changed**: Changes in existing functionality
- 🗑️ **Removed**: Removed features
- 🧪 **Testing**: Test-related changes
- 📚 **Documentation**: Documentation changes
- 🎯 **Benefits**: User-facing improvements