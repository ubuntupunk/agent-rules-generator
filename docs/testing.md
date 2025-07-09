# Testing Guide

This document provides comprehensive information about the testing strategy, test suites, and testing procedures for the Agent Rules Generator project.

## Overview

The Agent Rules Generator uses a comprehensive testing strategy covering:
- **Recipe Download System**: Network operations and caching
- **Template System**: File generation and placeholder replacement  
- **Deployment Pipeline**: Package configuration and CI/CD workflows

## Table of Contents

- [Test Architecture](#test-architecture)
- [Test Suites](#test-suites)
- [Running Tests](#running-tests)
- [Test Coverage](#test-coverage)
- [Writing Tests](#writing-tests)
- [Continuous Integration](#continuous-integration)

## Test Architecture

### Testing Framework
- **Test Runner**: Bun Test (built-in test runner) 
- **Package Manager**: Bun (replaces npm for faster operations)
- **Assertion Library**: Bun's built-in expect API
- **Test Structure**: Describe/test blocks with ES6 imports
- **Mocking**: Custom mock implementations for external dependencies
- **Total Coverage**: 181 tests across 9 test suites

### Test Organization
```
test/
├── recipe_download.test.js         # Recipe system tests (17 tests)
├── template_system.test.js         # Template system tests (18 tests)
├── deployment.test.js              # Deployment tests (33 tests)
├── windsurf_customization_flow.test.js  # Windsurf flow tests (9 tests)
├── recipe_validation.test.js       # Recipe validation tests (15 tests)
├── recipe_creator.test.js          # Recipe creator tests (33 tests)
├── project_types.test.js           # Project types tests (21 tests)
├── file_format_handler.test.js     # File format tests (35 tests)
└── scraper_integrate_test.js       # Integration test (non-Jest format)
```

### Test Naming Convention
- **Files**: `*.test.js` (automatically discovered by Bun)
- **Test Groups**: Descriptive `describe()` blocks
- **Individual Tests**: Clear, action-oriented `test()` names

## Test Suites

### 1. Recipe Download System Tests

**File**: `test/recipe_download.test.js`  
**Tests**: 17 tests  
**Coverage**: Recipe downloading, caching, GitHub API integration

#### Test Categories

**HTTPS Request Function (4 tests)**
- ✅ Download content from GitHub raw URL
- ✅ Handle GitHub API requests  
- ✅ Handle request errors gracefully
- ✅ Include proper headers

**Download Recipe File Function (3 tests)**
- ✅ Download specific recipe file
- ✅ Handle non-existent files
- ✅ Construct correct URLs

**Fetch Recipe File List Function (2 tests)**
- ✅ Fetch list from GitHub API
- ✅ Filter only YAML files

**Repository Connection Testing (3 tests)**
- ✅ Test repository connectivity
- ✅ Include rate limit information
- ✅ Test download functionality

**Integration Tests (2 tests)**
- ✅ Download and parse complete recipe
- ✅ Handle network timeouts gracefully

**Error Handling (3 tests)**
- ✅ Provide meaningful error messages
- ✅ Handle malformed URLs
- ✅ Handle empty responses

#### Key Features Tested
- GitHub API integration with authentication
- Recipe file downloading and validation
- Caching mechanisms and expiration
- Network error handling and timeouts
- YAML parsing and validation

### 2. Template System Tests

**File**: `test/template_system.test.js`  
**Tests**: 18 tests  
**Coverage**: Template loading, placeholder replacement, file generation

#### Test Categories

**Template Loading (3 tests)**
- ✅ Load existing agent template
- ✅ Return null for non-existent template
- ✅ Handle windsurf template (currently missing)

**File Generation (3 tests)**
- ✅ Generate content using template when available
- ✅ Use programmatic generation when template declined
- ✅ Handle windsurf file type (no template available)

**Agent.md Generation (3 tests)**
- ✅ Generate complete agent.md content
- ✅ Handle empty technology stack
- ✅ Format arrays correctly

**Windsurf Rules Generation (3 tests)**
- ✅ Generate complete windsurf rules content
- ✅ Include technology-specific guidelines
- ✅ Handle case-insensitive technology detection

**Template vs Programmatic (1 test)**
- ✅ Produce different but valid output for both approaches

**Error Handling (2 tests)**
- ✅ Handle minimal configuration
- ✅ Handle empty arrays gracefully

**Technology Detection (3 tests)**
- ✅ Detect Vue.js and generate appropriate guidelines
- ✅ Detect FastAPI and generate appropriate guidelines
- ✅ Not generate guidelines for unknown technologies

#### Key Features Tested
- Template loading and fallback mechanisms
- Handlebars-style placeholder replacement
- Technology-specific guideline generation
- Dual generation strategy (template vs programmatic)
- Error resilience and graceful degradation

### 3. Deployment System Tests

**File**: `test/deployment.test.js`  
**Tests**: 33 tests  
**Coverage**: Package configuration, CI/CD workflows, deployment readiness

#### Test Categories

**Package Configuration (8 tests)**
- ✅ Correct package metadata
- ✅ Correct main entry point
- ✅ Correct binary configuration
- ✅ Include all necessary files
- ✅ Correct repository configuration
- ✅ Appropriate keywords for discoverability
- ✅ Correct Node.js engine requirement
- ✅ Deployment scripts

**File Structure Validation (4 tests)**
- ✅ All required files for deployment
- ✅ Executable main entry point
- ✅ Valid JSON files
- ✅ Non-empty essential files

**NPM Package Validation (3 tests)**
- ✅ Create valid npm package
- ✅ Correct package size
- ✅ Include correct files in package
- ✅ Not include development files

**GitHub Actions Workflow (5 tests)**
- ✅ Correct trigger configuration
- ✅ Use correct Node.js version
- ✅ NPM authentication step
- ✅ Version bump step
- ✅ Publish step
- ✅ Use production environment

**Dependencies Validation (3 tests)**
- ✅ All required dependencies
- ✅ Development dependencies separated
- ✅ Valid dependency versions

**CLI Functionality (3 tests)**
- ✅ Executable permissions on main file
- ✅ Export correct module structure
- ✅ Valid CLI entry point

**Version Management (2 tests)**
- ✅ Consistent version across files
- ✅ Version scripts that work

**Deployment Readiness (3 tests)**
- ✅ Pass npm publish dry run
- ✅ All required metadata for npm
- ✅ No obvious security issues

#### Key Features Tested
- NPM package structure and metadata
- GitHub Actions workflow configuration
- Binary command setup and permissions
- Dependency management and security
- Version management and publishing readiness

## Running Tests

### All Tests
```bash
# Run complete test suite
bun test

# Expected output:
# 68 pass, 0 fail across 3 files
```

### Individual Test Suites
```bash
# Recipe download tests
bun test test/recipe_download.test.js

# Template system tests  
bun test test/template_system.test.js

# Deployment tests
bun test test/deployment.test.js
```

### Manual Test Runners
```bash
# Manual recipe tests
node test/recipe_download.test.js

# Manual template tests
node test/template_system.test.js

# Manual deployment tests
node test/deployment.test.js
```

### Test Options
```bash
# Run with timeout (useful for network tests)
bun test --timeout 20000

# Run specific test pattern
bun test --grep "should download"

# Run tests in watch mode
bun test --watch
```

## Test Coverage

### Overall Coverage
- **Total Tests**: 68 tests across 3 suites
- **Success Rate**: 100% (68 pass, 0 fail)
- **Execution Time**: ~45 seconds (includes network operations)

### Coverage by Component

| Component | Tests | Coverage |
|-----------|-------|----------|
| Recipe System | 17 | Network ops, caching, GitHub API |
| Template System | 18 | File generation, placeholders |
| Deployment | 33 | Package config, CI/CD, publishing |

### Network Dependencies
- **Recipe Tests**: Require internet connection for GitHub API
- **Template Tests**: Local file system operations only
- **Deployment Tests**: Local validation with some network checks

### Performance Characteristics
- **Recipe Tests**: ~18 seconds (network operations)
- **Template Tests**: ~1 second (local operations)
- **Deployment Tests**: ~13 seconds (package validation)

## Writing Tests

### Test Structure Template
```javascript
import { describe, test, expect } from 'bun:test';
import { functionToTest } from '../lib/module.js';

describe('Component Name', () => {
  describe('Function Group', () => {
    test('should perform specific action', async () => {
      // Arrange
      const input = 'test data';
      
      // Act
      const result = await functionToTest(input);
      
      // Assert
      expect(result).toBeTruthy();
      expect(result).toContain('expected content');
    });
  });
});
```

### Best Practices

#### Test Organization
- Group related tests in `describe()` blocks
- Use clear, descriptive test names
- Follow Arrange-Act-Assert pattern
- Test both success and failure cases

#### Async Testing
```javascript
test('should handle async operations', async () => {
  const result = await asyncFunction();
  expect(result).toBeDefined();
});
```

#### Error Testing
```javascript
test('should handle errors gracefully', async () => {
  await expect(functionThatShouldFail()).rejects.toThrow();
});
```

#### Mock Implementation
```javascript
const mockInquirer = {
  prompt: async (questions) => {
    if (questions[0]?.name === 'useTemplate') {
      return { useTemplate: true };
    }
    return {};
  }
};
```

### Testing Guidelines

#### Do's
- ✅ Test both happy path and error cases
- ✅ Use descriptive test names
- ✅ Mock external dependencies
- ✅ Test edge cases and boundary conditions
- ✅ Keep tests independent and isolated
- ✅ Use appropriate timeouts for network tests

#### Don'ts
- ❌ Don't test implementation details
- ❌ Don't make tests dependent on each other
- ❌ Don't hardcode sensitive data
- ❌ Don't skip error case testing
- ❌ Don't make tests too complex

## Continuous Integration

### GitHub Actions Integration
Tests run automatically on:
- **Pull Requests**: All tests must pass
- **Push to Main**: Full test suite execution
- **Release Tags**: Deployment tests validation

### CI Configuration
```yaml
# Example CI step
- name: Run Tests
  run: bun test
  timeout-minutes: 5
```

### Test Requirements
- All tests must pass for deployment
- Network tests require stable internet connection
- Tests must complete within timeout limits

### Failure Handling
- **Test Failures**: Block deployment
- **Network Issues**: Retry mechanism for recipe tests
- **Timeout**: Configurable timeout per test suite

## Debugging Tests

### Common Issues

#### Network Test Failures
```bash
# Check internet connection
curl -I https://api.github.com

# Run with increased timeout
bun test --timeout 30000 test/recipe_download.test.js
```

#### Template Test Issues
```bash
# Check template files exist
ls -la templates/

# Verify file permissions
ls -la index.js
```

#### Deployment Test Problems
```bash
# Validate package.json
npm pkg fix

# Check npm authentication
npm whoami
```

### Debug Commands
```bash
# Run single test with verbose output
bun test --verbose test/specific.test.js

# Check test file syntax
bun check test/deployment.test.js

# Run manual test for debugging
node test/deployment.test.js
```

## Test Maintenance

### Regular Tasks
- **Update Dependencies**: Keep test dependencies current
- **Review Coverage**: Ensure new features have tests
- **Performance Monitoring**: Track test execution times
- **Network Reliability**: Monitor external API dependencies

### Adding New Tests
1. **Identify Component**: Determine which test suite
2. **Write Test**: Follow established patterns
3. **Verify Coverage**: Ensure adequate test coverage
4. **Update Documentation**: Document new test scenarios

### Test Data Management
- **Mock Data**: Use realistic but not sensitive data
- **Test Fixtures**: Store reusable test data
- **Environment Variables**: Use for configuration
- **Cleanup**: Ensure tests clean up after themselves

---

*Testing is a critical part of maintaining code quality and deployment reliability. All new features should include appropriate test coverage.*