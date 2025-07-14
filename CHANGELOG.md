# Changelog

All notable changes to this project will be documented in this file.

## [1.3.0] - 2024-12-19

### Added
- **Gemini CLI Integration**: Full support for configuring Gemini CLI to use `.agent.md` as context file
- **Multi-Platform Support**: Now supports Cursor AI 🔵, Windsurf 🌊, and Gemini CLI 💎
- **Interactive Gemini Configuration**: Local and global configuration options with status checking
- **Editor Integration**: Built-in editor support for manual configuration file editing
- **Comprehensive Testing**: Added 9 new tests for Gemini Manager functionality
- **Enhanced CLI Commands**: New `configure-gemini` command for CLI usage
- **Platform Icons**: Added visual indicators for supported AI platforms in documentation

### Enhanced
- **README Documentation**: Updated with supported platforms table and platform-specific features
- **Help System**: Extended help text to include Gemini configuration options
- **Configuration Management**: Automatic detection and validation of existing Gemini settings
- **Error Handling**: Graceful handling of file system errors and invalid configurations

### Technical
- **New Module**: `lib/gemini_manager.js` for Gemini CLI configuration management
- **Test Coverage**: Added `test/gemini_manager.test.js` with comprehensive test suite
- **Cross-Platform**: Support for Windows, macOS, and Linux editor detection
- **File System Safety**: Robust directory creation and configuration file management

## [1.2.2] - 2024-12-07

### Fixed
- ✅ **Test Suite Improvements**: Fixed scraper integration test with correct file paths and modular architecture detection
- ✅ **Bun Test Integration**: Updated package.json to use Bun test runner instead of Jest for better performance
- ✅ **GitHub Actions Tests**: Fixed deployment workflow test assertions to match actual configuration
- ✅ **Path Resolution**: Corrected all test file path issues for proper cross-platform compatibility

### Changed
- 🔄 **Test Runner**: Migrated from Jest to Bun test for faster test execution (181 tests now passing)
- 🔄 **Test Architecture**: Updated test documentation to reflect Bun-based testing approach
- 🔄 **Integration Tests**: Improved Windsurf scraper integration test accuracy and reliability

### Technical Details
- Fixed `test/scraper_integrate_test.js` path resolution issues
- Updated `test/deployment.test.js` to match actual GitHub Actions workflow
- Corrected `test/test_windsurf_cli_complete.js` module import paths
- All 181 tests now pass with 0 failures across 9 test suites

## [1.2.1] - 2024-12-06

### Added
- 🌊 **Windsurf Integration**: Complete Windsurf recipe scraping and caching system
- 📋 **Recipe Management**: Advanced recipe download, validation, and management
- 🔧 **Modular Architecture**: Refactored CLI into specialized manager classes
- 🧪 **Comprehensive Testing**: 181 tests covering all major functionality

### Features
- Windsurf recipe scraping with intelligent caching
- Recipe validation with auto-fix capabilities
- Multi-format support (JSON/YAML) for recipes
- Enhanced project type detection and configuration
- Improved deployment pipeline with automated testing

## [1.2.0] - 2024-12-05

### Added
- 🎯 **Project Type System**: Support for 6 project types with conditional question flows
- 📦 **Recipe System**: Pre-built templates for common technology stacks
- 🔧 **Enhanced CLI**: Improved user experience with better navigation
- 📋 **Template System**: Advanced template generation with technology-specific guidelines

### Changed
- Refactored CLI architecture for better maintainability
- Improved error handling and user feedback
- Enhanced documentation and testing coverage

## [1.1.0] - 2024-12-04

### Added
- 🚀 **Multi-Platform Support**: Both Cursor AI (.agent.md) and Windsurf (.windsurfrules)
- 🎨 **Interactive CLI**: Guided setup process for configuration
- 📝 **Template Generation**: Automated file generation with best practices

### Features
- Interactive project configuration
- Technology stack detection
- Coding standards setup
- Project structure definition

## [1.0.0] - 2024-12-03

### Added
- 🎉 **Initial Release**: Basic agent rules generation
- 📄 **File Generation**: Support for .agent.md files
- 🔧 **CLI Interface**: Command-line tool for rule generation

### Features
- Basic project configuration
- Simple template system
- File output generation