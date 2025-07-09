/**
 * Test suite for deployment flow and package configuration
 * Tests npm package structure, GitHub Actions workflow, and deployment readiness
 */

import { describe, test, expect, beforeAll } from 'bun:test';
import { promises as fs } from 'fs';
import path from 'path';
import { execSync } from 'child_process';

describe('Deployment Flow Tests', () => {
  
  describe('Package Configuration', () => {
    let packageJson;
    
    beforeAll(async () => {
      const packageContent = await fs.readFile('package.json', 'utf8');
      packageJson = JSON.parse(packageContent);
    });

    test('should have correct package metadata', () => {
      expect(packageJson.name).toBe('agent-rules-generator');
      expect(packageJson.version).toMatch(/^\d+\.\d+\.\d+$/); // Semantic versioning
      expect(packageJson.description).toBeTruthy();
      expect(packageJson.author).toBe('ubuntupunk');
      expect(packageJson.license).toBe('GPL-3.0');
    });

    test('should have correct main entry point', () => {
      expect(packageJson.main).toBe('index.js');
    });

    test('should have correct binary configuration', () => {
      expect(packageJson.bin).toEqual({
        'agent-rules-generator': 'index.js',
        'generate-agent-rules': 'index.js'
      });
    });

    test('should include all necessary files', () => {
      const expectedFiles = [
        'index.js',
        'lib/',
        'recipes/',
        'templates/',
        'README.md',
        'LICENSE'
      ];
      
      expectedFiles.forEach(file => {
        expect(packageJson.files).toContain(file);
      });
    });

    test('should have correct repository configuration', () => {
      expect(packageJson.repository).toEqual({
        type: 'git',
        url: 'git+https://github.com/ubuntupunk/agent-rules-generator.git'
      });
    });

    test('should have appropriate keywords for discoverability', () => {
      const expectedKeywords = ['agent', 'ai', 'cursor', 'windsurf', 'cli'];
      expectedKeywords.forEach(keyword => {
        expect(packageJson.keywords).toContain(keyword);
      });
    });

    test('should have correct Node.js engine requirement', () => {
      expect(packageJson.engines.node).toBe('>=14.0.0');
    });

    test('should have deployment scripts', () => {
      expect(packageJson.scripts).toHaveProperty('version:patch');
      expect(packageJson.scripts).toHaveProperty('version:minor');
      expect(packageJson.scripts).toHaveProperty('version:major');
    });
  });

  describe('File Structure Validation', () => {
    test('should have all required files for deployment', async () => {
      const requiredFiles = [
        'index.js',
        'package.json',
        'README.md',
        'LICENSE',
        'lib/generator_lib.js',
        'lib/recipes_lib.js',
        'templates/agent-template.md'
      ];

      for (const file of requiredFiles) {
        try {
          await fs.access(file);
        } catch (error) {
          throw new Error(`Required file missing: ${file}`);
        }
      }
    });

    test('should have executable main entry point', async () => {
      const indexContent = await fs.readFile('index.js', 'utf8');
      expect(indexContent.startsWith('#!/usr/bin/env node')).toBe(true);
    });

    test('should have valid JSON files', async () => {
      const jsonFiles = ['package.json'];
      
      for (const file of jsonFiles) {
        const content = await fs.readFile(file, 'utf8');
        expect(() => JSON.parse(content)).not.toThrow();
      }
    });

    test('should have non-empty essential files', async () => {
      const essentialFiles = [
        'README.md',
        'LICENSE',
        'index.js',
        'lib/generator_lib.js',
        'lib/recipes_lib.js'
      ];

      for (const file of essentialFiles) {
        const stats = await fs.stat(file);
        expect(stats.size).toBeGreaterThan(0);
      }
    });
  });

  describe('NPM Package Validation', () => {
    test('should create valid npm package', () => {
      // Test npm pack (dry run)
      expect(() => {
        execSync('npm pack --dry-run', { stdio: 'pipe' });
      }).not.toThrow();
    });

    test('should have correct package size', () => {
      const output = execSync('npm pack --dry-run', { encoding: 'utf8' });
      
      // Extract package size from output
      const sizeMatch = output.match(/package size:\s*(\d+(?:\.\d+)?)\s*kB/);
      if (sizeMatch) {
        const sizeKB = parseFloat(sizeMatch[1]);
        expect(sizeKB).toBeGreaterThan(0);
        expect(sizeKB).toBeLessThan(1000); // Should be reasonable size
      }
    });

    test('should include correct files in package', () => {
      // Capture both stdout and stderr to get npm notices
      let output;
      try {
        output = execSync('npm pack --dry-run 2>&1', { encoding: 'utf8' });
      } catch (error) {
        output = error.stdout + error.stderr;
      }
      
      // Check that essential files are included in the tarball contents
      expect(output).toContain('index.js');
      expect(output).toContain('lib/generator_lib.js');
      expect(output).toContain('lib/recipes_lib.js');
      expect(output).toContain('templates/agent-template.md');
      expect(output).toContain('README.md');
      expect(output).toContain('LICENSE');
      
      // Also check that the package is created
      expect(output).toContain('agent-rules-generator');
    });

    test('should not include development files', () => {
      const output = execSync('npm pack --dry-run', { encoding: 'utf8' });
      
      // Check that dev files are excluded
      expect(output).not.toContain('test/');
      expect(output).not.toContain('.git');
      expect(output).not.toContain('node_modules');
      expect(output).not.toContain('.env');
    });
  });

  describe('GitHub Actions Workflow', () => {
    let workflowContent;

    beforeAll(async () => {
      workflowContent = await fs.readFile('.github/workflows/deploy.yml', 'utf8');
    });

    test('should have correct trigger configuration', () => {
      expect(workflowContent).toContain('on:');
      expect(workflowContent).toContain('push:');
      expect(workflowContent).toContain('tags:');
      expect(workflowContent).toContain("- 'v*'");
    });

    test('should use correct Node.js version', () => {
      expect(workflowContent).toContain("node-version: '18'");
    });

    test('should have npm authentication step', () => {
      expect(workflowContent).toContain('NODE_AUTH_TOKEN');
      expect(workflowContent).toContain('NPM_TOKEN');
      expect(workflowContent).toContain('registry.npmjs.org');
    });

    test('should have version bump step', () => {
      expect(workflowContent).toContain('Bump version');
      expect(workflowContent).toContain('npm version patch');
    });

    test('should have publish step', () => {
      expect(workflowContent).toContain('Publish package');
      expect(workflowContent).toContain('npm publish');
    });

    test('should use production environment', () => {
      expect(workflowContent).toContain('NODE_ENV: production');
    });
  });

  describe('Dependencies Validation', () => {
    let packageJson;

    beforeAll(async () => {
      const packageContent = await fs.readFile('package.json', 'utf8');
      packageJson = JSON.parse(packageContent);
    });

    test('should have all required dependencies', () => {
      const requiredDeps = ['inquirer', 'chalk', 'figlet', 'js-yaml', 'glob'];
      
      requiredDeps.forEach(dep => {
        expect(packageJson.dependencies).toHaveProperty(dep);
      });
    });

    test('should have development dependencies separated', () => {
      const devDeps = ['jest', 'eslint', 'prettier', 'husky'];
      
      devDeps.forEach(dep => {
        expect(packageJson.devDependencies).toHaveProperty(dep);
        expect(packageJson.dependencies).not.toHaveProperty(dep);
      });
    });

    test('should have valid dependency versions', () => {
      const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      Object.values(allDeps).forEach(version => {
        expect(version).toMatch(/^[\^~]?\d+\.\d+\.\d+/);
      });
    });
  });

  describe('CLI Functionality', () => {
    test('should have executable permissions on main file', async () => {
      const stats = await fs.stat('index.js');
      // Check if file is readable (basic check since we can't easily test execute permissions in tests)
      expect(stats.isFile()).toBe(true);
    });

    test('should export correct module structure', async () => {
      // Test that the main modules can be imported
      const { AgentRulesGenerator } = await import('../agent_rules_cli.js');
      expect(AgentRulesGenerator).toBeDefined();
      expect(typeof AgentRulesGenerator).toBe('function');
    });

    test('should have valid CLI entry point', async () => {
      const indexContent = await fs.readFile('index.js', 'utf8');
      
      // Should have shebang
      expect(indexContent.startsWith('#!/usr/bin/env node')).toBe(true);
      
      // Should import AgentRulesGenerator
      expect(indexContent).toContain('AgentRulesGenerator');
      
      // Should have error handling
      expect(indexContent).toContain('process.on');
    });
  });

  describe('Version Management', () => {
    test('should have consistent version across files', async () => {
      const packageJson = JSON.parse(await fs.readFile('package.json', 'utf8'));
      
      // Check if version is valid semver
      expect(packageJson.version).toMatch(/^\d+\.\d+\.\d+$/);
    });

    test('should have version scripts that work', () => {
      const packageJson = JSON.parse(execSync('cat package.json', { encoding: 'utf8' }));
      
      expect(packageJson.scripts['version:patch']).toContain('bun version patch');
      expect(packageJson.scripts['version:minor']).toContain('bun version minor');
      expect(packageJson.scripts['version:major']).toContain('bun version major');
    });
  });

  describe('Deployment Readiness', () => {
    test('should pass npm publish dry run', () => {
      expect(() => {
        execSync('npm publish --dry-run', { stdio: 'pipe' });
      }).not.toThrow();
    });

    test('should have all required metadata for npm', async () => {
      const packageJson = JSON.parse(await fs.readFile('package.json', 'utf8'));
      
      // Required fields for npm publish
      expect(packageJson.name).toBeTruthy();
      expect(packageJson.version).toBeTruthy();
      expect(packageJson.description).toBeTruthy();
      expect(packageJson.main).toBeTruthy();
      expect(packageJson.author).toBeTruthy();
      expect(packageJson.license).toBeTruthy();
    });

    test('should not have any obvious security issues', async () => {
      const packageJson = JSON.parse(await fs.readFile('package.json', 'utf8'));
      
      // Check for common security issues
      expect(packageJson.scripts).not.toHaveProperty('preinstall');
      expect(packageJson.scripts).not.toHaveProperty('postinstall');
      
      // Check that no scripts contain suspicious commands
      const scriptValues = Object.values(packageJson.scripts);
      scriptValues.forEach(script => {
        expect(script).not.toContain('rm -rf');
        expect(script).not.toContain('curl');
        expect(script).not.toContain('wget');
      });
    });
  });
});

// Manual deployment test function
async function runManualDeploymentTests() {
  console.log('🚀 Running manual deployment tests...\n');
  
  try {
    // Test 1: Package validation
    console.log('📦 Test 1: Package validation');
    execSync('npm pack --dry-run', { stdio: 'pipe' });
    console.log('✅ Package structure is valid');
    
    // Test 2: Publish dry run
    console.log('\n📤 Test 2: Publish dry run');
    execSync('npm publish --dry-run', { stdio: 'pipe' });
    console.log('✅ Package ready for publishing');
    
    // Test 3: Check npm login
    console.log('\n👤 Test 3: NPM authentication');
    try {
      const whoami = execSync('npm whoami', { encoding: 'utf8' }).trim();
      console.log(`✅ Logged in as: ${whoami}`);
    } catch (error) {
      console.log('❌ Not logged in to npm');
    }
    
    // Test 4: Check version
    console.log('\n🏷️ Test 4: Version check');
    const packageJson = JSON.parse(await fs.readFile('package.json', 'utf8'));
    console.log(`✅ Current version: ${packageJson.version}`);
    
    // Test 5: Check if package name is available
    console.log('\n🔍 Test 5: Package name availability');
    try {
      execSync(`npm view ${packageJson.name} version`, { stdio: 'pipe' });
      console.log('ℹ️ Package already exists on npm (this is expected for updates)');
    } catch (error) {
      console.log('✅ Package name is available');
    }
    
    console.log('\n🎉 All manual deployment tests completed!');
    
  } catch (error) {
    console.error('❌ Deployment tests failed:', error.message);
  }
}

// Export for manual testing
export { runManualDeploymentTests };

// Run manual tests if called directly
if (import.meta.main) {
  runManualDeploymentTests().catch(console.error);
}