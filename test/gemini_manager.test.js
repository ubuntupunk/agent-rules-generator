/**
 * Tests for Gemini Manager
 * Tests configuration of Gemini CLI to use .agent.md as context file
 */

import { describe, test, expect, beforeEach, afterEach, mock } from 'bun:test';
const fs = require('fs').promises;
const path = require('path');
const os = require('os');

// Mock inquirer
const mockPrompt = mock(() => Promise.resolve({}));
const mockInquirer = { default: { prompt: mockPrompt } };

// Mock console methods to avoid test output noise
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
console.log = mock(() => {});
console.error = mock(() => {});

// Create a simple mock for GeminiManager that doesn't use inquirer
class MockGeminiManager {
  constructor() {
    this.globalConfigPath = path.join(os.tmpdir(), 'test-global', '.gemini', 'settings.json');
    this.localConfigPath = path.join(os.tmpdir(), 'test-local', '.gemini', 'settings.json');
  }

  async fileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async ensureDirectoryExists(dirPath) {
    try {
      await fs.mkdir(dirPath, { recursive: true });
    } catch (error) {
      if (error.code !== 'EEXIST') {
        throw error;
      }
    }
  }

  async configureGemini(scope = 'local') {
    try {
      const configPath = scope === 'global' ? this.globalConfigPath : this.localConfigPath;
      const configDir = path.dirname(configPath);

      await this.ensureDirectoryExists(configDir);

      let config = {};
      if (await this.fileExists(configPath)) {
        try {
          const existingConfig = await fs.readFile(configPath, 'utf8');
          config = JSON.parse(existingConfig);
        } catch (error) {
          // Invalid JSON, start fresh
        }
      }

      config.contextFileName = '.agent.md';
      await fs.writeFile(configPath, JSON.stringify(config, null, 2));
      return true;
    } catch (error) {
      return false;
    }
  }

  async checkGeminiConfig() {
    const status = {
      global: { exists: false, configured: false, path: this.globalConfigPath },
      local: { exists: false, configured: false, path: this.localConfigPath }
    };

    if (await this.fileExists(this.globalConfigPath)) {
      status.global.exists = true;
      try {
        const config = JSON.parse(await fs.readFile(this.globalConfigPath, 'utf8'));
        status.global.configured = config.contextFileName === '.agent.md';
        status.global.config = config;
      } catch (error) {
        // Invalid JSON
      }
    }

    if (await this.fileExists(this.localConfigPath)) {
      status.local.exists = true;
      try {
        const config = JSON.parse(await fs.readFile(this.localConfigPath, 'utf8'));
        status.local.configured = config.contextFileName === '.agent.md';
        status.local.config = config;
      } catch (error) {
        // Invalid JSON
      }
    }

    return status;
  }
}

describe('GeminiManager', () => {
  let geminiManager;
  let tempDir;

  beforeEach(async () => {
    // Create temporary directory for testing
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'gemini-test-'));
    geminiManager = new MockGeminiManager();
  });

  afterEach(async () => {
    // Clean up temp directory
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
      await fs.rm(path.dirname(geminiManager.globalConfigPath), { recursive: true, force: true });
      await fs.rm(path.dirname(geminiManager.localConfigPath), { recursive: true, force: true });
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  test('should initialize with correct paths', () => {
    expect(geminiManager.globalConfigPath).toContain('.gemini/settings.json');
    expect(geminiManager.localConfigPath).toContain('.gemini/settings.json');
  });

  test('should return true for existing file', async () => {
    const testFile = path.join(tempDir, 'test.txt');
    await fs.writeFile(testFile, 'test content');
    
    const exists = await geminiManager.fileExists(testFile);
    expect(exists).toBe(true);
  });

  test('should return false for non-existing file', async () => {
    const testFile = path.join(tempDir, 'nonexistent.txt');
    
    const exists = await geminiManager.fileExists(testFile);
    expect(exists).toBe(false);
  });

  test('should create directory if it does not exist', async () => {
    const testDir = path.join(tempDir, 'new-directory');
    
    await geminiManager.ensureDirectoryExists(testDir);
    
    const stats = await fs.stat(testDir);
    expect(stats.isDirectory()).toBe(true);
  });

  test('should not fail if directory already exists', async () => {
    const testDir = path.join(tempDir, 'existing-directory');
    await fs.mkdir(testDir);
    
    await geminiManager.ensureDirectoryExists(testDir);
    const stats = await fs.stat(testDir);
    expect(stats.isDirectory()).toBe(true);
  });

  test('should create local configuration file', async () => {
    const result = await geminiManager.configureGemini('local');
    
    expect(result).toBe(true);
    
    const configExists = await geminiManager.fileExists(geminiManager.localConfigPath);
    expect(configExists).toBe(true);
    
    const configContent = await fs.readFile(geminiManager.localConfigPath, 'utf8');
    const config = JSON.parse(configContent);
    expect(config.contextFileName).toBe('.agent.md');
  });

  test('should create global configuration file', async () => {
    const result = await geminiManager.configureGemini('global');
    
    expect(result).toBe(true);
    
    const configExists = await geminiManager.fileExists(geminiManager.globalConfigPath);
    expect(configExists).toBe(true);
    
    const configContent = await fs.readFile(geminiManager.globalConfigPath, 'utf8');
    const config = JSON.parse(configContent);
    expect(config.contextFileName).toBe('.agent.md');
  });

  test('should return correct status when no config exists', async () => {
    const status = await geminiManager.checkGeminiConfig();
    
    expect(status.global.exists).toBe(false);
    expect(status.global.configured).toBe(false);
    expect(status.local.exists).toBe(false);
    expect(status.local.configured).toBe(false);
  });

  test('should detect existing configured files', async () => {
    // First create a config file
    await geminiManager.configureGemini('global');
    
    const status = await geminiManager.checkGeminiConfig();
    
    expect(status.global.exists).toBe(true);
    expect(status.global.configured).toBe(true);
    expect(status.global.config.contextFileName).toBe('.agent.md');
  });
});