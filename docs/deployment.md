# Deployment Guide

This document describes the deployment process for the Agent Rules Generator package, including automated CI/CD workflows, testing procedures, and troubleshooting.

## Overview

The Agent Rules Generator uses a **tag-triggered deployment strategy** with GitHub Actions for automated NPM package publishing. The system is designed for simplicity, reliability, and security.

## Table of Contents

- [Deployment Architecture](#deployment-architecture)
- [Prerequisites](#prerequisites)
- [Manual Deployment](#manual-deployment)
- [Automated Deployment](#automated-deployment)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Security](#security)

## Deployment Architecture

### Trigger Strategy
- **Tag-Based Deployment**: Deployments are triggered by git tag pushes
- **Semantic Versioning**: Uses semver format (e.g., `v1.0.2`)
- **Automated Process**: Complete automation from tag creation to NPM publishing

### Pipeline Flow
```
Git Tag Push → GitHub Actions → Version Bump → NPM Publish → Git Update
```

### Components
- **GitHub Actions**: CI/CD automation
- **NPM Registry**: Package distribution
- **Git Tags**: Version control and deployment triggers
- **Bun + NPM**: Hybrid package management

## Prerequisites

### Required Secrets
Configure these secrets in your GitHub repository settings:

1. **NPM_TOKEN**: NPM authentication token with publish permissions
   ```bash
   # Generate token at https://www.npmjs.com/settings/tokens
   # Add to GitHub repository secrets
   ```

### Local Development Setup
```bash
# Install dependencies
bun install

# Login to NPM (for manual deployment)
npm login

# Verify authentication
npm whoami
```

### Required Tools
- **Node.js**: >= 14.0.0
- **Bun**: >= 1.0.0 (for development)
- **NPM**: For publishing
- **Git**: For version control

## Manual Deployment

### Step 1: Prepare Release
```bash
# Ensure all changes are committed
git status
git add .
git commit -m "feat: prepare release"

# Run tests
bun test

# Verify package structure
npm pack --dry-run
```

### Step 2: Version Management
```bash
# Bump version (choose one)
npm run version:patch  # 1.0.1 → 1.0.2
npm run version:minor  # 1.0.1 → 1.1.0
npm run version:major  # 1.0.1 → 2.0.0

# Or manually update package.json and create tag
npm version patch
git push origin main --follow-tags
```

### Step 3: Manual Publish (if needed)
```bash
# Test publish
npm publish --dry-run

# Actual publish
npm publish
```

## Automated Deployment

### GitHub Actions Workflow

The deployment workflow (`.github/workflows/deploy.yml`) handles:

1. **Environment Setup**
   - Node.js 18 installation
   - Dependency installation with Bun
   - NPM authentication

2. **Version Management**
   - Automatic version bumping
   - Git tag creation
   - Commit generation

3. **Package Publishing**
   - NPM package publication
   - Git updates push

### Triggering Deployment

#### Method 1: Create Tag Locally
```bash
# Create and push tag
git tag v1.0.3
git push origin v1.0.3
```

#### Method 2: GitHub Release
1. Go to GitHub repository
2. Click "Releases" → "Create a new release"
3. Create new tag (e.g., `v1.0.3`)
4. Publish release

#### Method 3: Version Script
```bash
# This will bump version and push tags
npm run version:patch
```

### Workflow Steps

```yaml
# Simplified workflow overview
name: Publish Node Package
on:
  push:
    tags: ['*']

jobs:
  publish:
    steps:
      - Checkout code
      - Setup Node.js 18
      - Install dependencies (Bun)
      - Authenticate with NPM
      - Bump version
      - Publish package
      - Push changes and tags
```

## Testing

### Deployment Test Suite

The deployment system includes comprehensive tests in `test/deployment.test.js`:

#### Test Categories

1. **Package Configuration (8 tests)**
   - Metadata validation
   - Binary configuration
   - File inclusion rules
   - Repository settings

2. **File Structure (4 tests)**
   - Required files presence
   - Executable permissions
   - JSON validity

3. **NPM Package (3 tests)**
   - Package creation
   - File inclusion verification
   - Development file exclusion

4. **GitHub Actions (5 tests)**
   - Workflow configuration
   - Environment setup
   - Authentication
   - Version management

5. **Dependencies (3 tests)**
   - Required dependencies
   - Development dependencies
   - Version formats

6. **CLI Functionality (3 tests)**
   - Executable permissions
   - Module exports
   - Entry point validation

7. **Deployment Readiness (3 tests)**
   - NPM publish validation
   - Metadata completeness
   - Security checks

### Running Tests

```bash
# Run all tests
bun test

# Run deployment tests only
bun test test/deployment.test.js

# Run manual deployment validation
node test/deployment.test.js
```

### Test Output Example
```
✅ 33 pass, 0 fail - All deployment tests successful!

📦 Package Configuration: ✅ All 8 tests passed
🏗️ File Structure: ✅ All 4 tests passed  
📤 NPM Package: ✅ All 3 tests passed
⚙️ GitHub Actions: ✅ All 5 tests passed
📚 Dependencies: ✅ All 3 tests passed
🖥️ CLI Functionality: ✅ All 3 tests passed
🚀 Deployment Readiness: ✅ All 3 tests passed
```

## Troubleshooting

### Common Issues

#### 1. Version Already Exists
```
403 Forbidden: You cannot publish over previously published versions
```
**Solution**: Bump the version number
```bash
npm version patch
npm publish
```

#### 2. Authentication Failed
```
npm ERR! code E401
npm ERR! 401 Unauthorized
```
**Solution**: Check NPM token
```bash
npm whoami  # Verify login
# Update NPM_TOKEN secret in GitHub
```

#### 3. Binary Name Warnings
```
npm warn publish "bin[agent-rules]" script name was cleaned
```
**Solution**: Use npm-friendly binary names (already fixed)
```json
{
  "bin": {
    "agent-rules-generator": "./index.js",
    "generate-agent-rules": "./index.js"
  }
}
```

#### 4. Workflow Fails
**Check GitHub Actions logs**:
1. Go to repository → Actions tab
2. Click failed workflow
3. Examine step logs
4. Common fixes:
   - Update NPM_TOKEN secret
   - Check package.json syntax
   - Verify git permissions

#### 5. Package Size Issues
```
npm notice package size: 25.0 kB
npm notice unpacked size: 80.0 kB
```
**Check included files**:
```bash
npm pack --dry-run  # See what's included
# Update "files" array in package.json if needed
```

### Debug Commands

```bash
# Check package structure
npm pack --dry-run

# Validate package.json
npm pkg fix

# Test authentication
npm whoami

# Check current version
npm run version:show

# Verify package exists on NPM
npm view agent-rules-generator

# Test installation
npm install -g agent-rules-generator
agent-rules-generator --help
```

## Security

### Best Practices

1. **Token Management**
   - Use NPM tokens with minimal required permissions
   - Rotate tokens regularly
   - Store tokens only in GitHub secrets

2. **Package Security**
   - No hardcoded secrets in code
   - Validate all dependencies
   - Use `npm audit` for vulnerability scanning

3. **Workflow Security**
   - Use specific action versions (not `@latest`)
   - Limit workflow permissions
   - Validate all inputs

### Security Checklist

- [ ] NPM_TOKEN has publish-only permissions
- [ ] No sensitive data in package files
- [ ] Dependencies are up to date
- [ ] Workflow uses pinned action versions
- [ ] Package.json has no suspicious scripts

## Package Information

### Current Status
- **Package Name**: `agent-rules-generator`
- **Current Version**: `1.0.2`
- **NPM Registry**: https://www.npmjs.com/package/agent-rules-generator
- **Binary Commands**: 
  - `agent-rules-generator`
  - `generate-agent-rules`

### Installation
```bash
# Global installation
npm install -g agent-rules-generator

# Usage
agent-rules-generator
generate-agent-rules
```

### Package Contents
- `index.js` - Main CLI entry point
- `lib/` - Core library modules
- `templates/` - Template files
- `README.md` - Documentation
- `LICENSE` - GPL-3.0 license

## Monitoring

### Success Indicators
- ✅ GitHub Actions workflow completes successfully
- ✅ Package appears on NPM registry
- ✅ Version number incremented correctly
- ✅ Git tags created and pushed
- ✅ Binary commands work after installation

### Failure Indicators
- ❌ GitHub Actions workflow fails
- ❌ NPM publish returns error
- ❌ Version conflicts
- ❌ Authentication issues
- ❌ Package installation fails

## Support

### Getting Help
1. **Check GitHub Actions logs** for workflow issues
2. **Run deployment tests** to validate configuration
3. **Review NPM documentation** for publishing issues
4. **Check GitHub repository issues** for known problems

### Useful Links
- [NPM Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Semantic Versioning](https://semver.org/)
- [Package.json Reference](https://docs.npmjs.com/cli/v8/configuring-npm/package-json)

---

*Last updated: Current deployment system version*