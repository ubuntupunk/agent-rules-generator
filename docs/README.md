# Documentation

This directory contains comprehensive documentation for the Agent Rules Generator project.

## Available Documentation

### 📚 Core Documentation

- **[Deployment Guide](deployment.md)** - Complete deployment process, CI/CD workflows, and troubleshooting
- **[Testing Guide](testing.md)** - Testing strategy, test suites, and testing procedures

### 🚀 Quick Links

#### For Developers
- [Testing Guide](testing.md) - How to run and write tests
- [Deployment Guide](deployment.md#manual-deployment) - Manual deployment process

#### For DevOps/CI
- [GitHub Actions Workflow](deployment.md#automated-deployment) - Automated deployment setup
- [Troubleshooting](deployment.md#troubleshooting) - Common deployment issues

#### For Contributors
- [Testing Guide](testing.md#writing-tests) - How to write new tests
- [Security Guidelines](deployment.md#security) - Security best practices

## Documentation Overview

### Deployment Documentation
The deployment guide covers:
- **Tag-triggered deployment strategy** with GitHub Actions
- **NPM package publishing** process and configuration
- **Version management** and semantic versioning
- **Security best practices** for tokens and workflows
- **Comprehensive troubleshooting** for common issues

### Testing Documentation  
The testing guide covers:
- **Three test suites**: Recipe system, template system, and deployment
- **68 total tests** with 100% pass rate
- **Test architecture** using Bun test runner
- **Writing guidelines** for new tests
- **CI/CD integration** and automated testing

## Project Architecture

### Core Components
```
agent-rules-generator/
├── lib/                    # Core library modules
│   ├── generator_lib.js    # Template system and file generation
│   └── recipes_lib.js      # Recipe management and GitHub integration
├── templates/              # Template files for generation
├── test/                   # Comprehensive test suites
├── docs/                   # Documentation (this directory)
└── .github/workflows/      # CI/CD automation
```

### Key Features Documented
- **Recipe System**: Remote recipe management with GitHub integration
- **Template System**: Dual generation strategy (template + programmatic)
- **Deployment Pipeline**: Automated NPM publishing with comprehensive testing
- **CLI Interface**: Interactive prompts and command-line tools

## Getting Started

### For New Developers
1. Read the [Testing Guide](testing.md) to understand the test architecture
2. Review [Deployment Guide](deployment.md#prerequisites) for setup requirements
3. Run `bun test` to verify everything works
4. Check `bun test test/deployment.test.js` for deployment readiness

### For DevOps Engineers
1. Review [GitHub Actions Workflow](deployment.md#github-actions-workflow)
2. Set up required [secrets](deployment.md#required-secrets)
3. Understand the [troubleshooting guide](deployment.md#troubleshooting)
4. Monitor [deployment indicators](deployment.md#monitoring)

### For Contributors
1. Follow [test writing guidelines](testing.md#writing-tests)
2. Ensure all tests pass before submitting PRs
3. Add tests for new features
4. Update documentation for significant changes

## Quality Assurance

### Test Coverage
- **Recipe System**: 17 tests covering GitHub API, caching, error handling
- **Template System**: 18 tests covering file generation, placeholders, technology detection
- **Deployment**: 33 tests covering package config, CI/CD, security validation

### Deployment Validation
- **Automated Testing**: All tests run on PR and deployment
- **Package Validation**: NPM package structure and metadata verification
- **Security Checks**: Token management and vulnerability scanning
- **Performance Monitoring**: Test execution time tracking

## Support and Maintenance

### Regular Tasks
- **Dependency Updates**: Keep dependencies current and secure
- **Test Maintenance**: Ensure tests remain reliable and comprehensive
- **Documentation Updates**: Keep docs synchronized with code changes
- **Security Reviews**: Regular security audits and token rotation

### Getting Help
1. **Check Documentation**: Start with relevant guide above
2. **Run Tests**: Use test suites to diagnose issues
3. **Review Logs**: Check GitHub Actions logs for CI/CD issues
4. **GitHub Issues**: Create issues for bugs or feature requests

## Contributing to Documentation

### Documentation Standards
- **Clear Structure**: Use consistent headings and organization
- **Code Examples**: Include practical, working examples
- **Troubleshooting**: Document common issues and solutions
- **Regular Updates**: Keep documentation current with code changes

### Adding New Documentation
1. **Create Markdown Files**: Use `.md` extension
2. **Update This README**: Add links to new documentation
3. **Follow Existing Patterns**: Maintain consistent style
4. **Include Examples**: Provide practical, working examples

---

*This documentation is maintained alongside the codebase to ensure accuracy and completeness.*