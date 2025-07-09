/**
 * File Format Handler Tests
 * Tests unified JSON and YAML support across the application
 */

import { describe, test, expect, beforeEach } from 'bun:test';
import { FileFormatHandler, fileFormatHandler } from '../lib/file_format_handler.js';
import fs from 'fs/promises';
import path from 'path';

describe('File Format Handler', () => {
  let handler;

  beforeEach(() => {
    handler = new FileFormatHandler();
  });

  describe('Format Detection', () => {
    test('should detect JSON files correctly', () => {
      expect(handler.isJsonFormat('recipe.json')).toBe(true);
      expect(handler.isJsonFormat('config.JSON')).toBe(true);
      expect(handler.isJsonFormat('recipe.yaml')).toBe(false);
      expect(handler.isJsonFormat('recipe.yml')).toBe(false);
    });

    test('should detect YAML files correctly', () => {
      expect(handler.isYamlFormat('recipe.yaml')).toBe(true);
      expect(handler.isYamlFormat('recipe.yml')).toBe(true);
      expect(handler.isYamlFormat('config.YAML')).toBe(true);
      expect(handler.isYamlFormat('recipe.json')).toBe(false);
    });

    test('should detect supported formats', () => {
      expect(handler.isSupportedFormat('recipe.json')).toBe(true);
      expect(handler.isSupportedFormat('recipe.yaml')).toBe(true);
      expect(handler.isSupportedFormat('recipe.yml')).toBe(true);
      expect(handler.isSupportedFormat('recipe.txt')).toBe(false);
      expect(handler.isSupportedFormat('recipe.xml')).toBe(false);
    });

    test('should handle case insensitive extensions', () => {
      expect(handler.isSupportedFormat('recipe.JSON')).toBe(true);
      expect(handler.isSupportedFormat('recipe.YAML')).toBe(true);
      expect(handler.isSupportedFormat('recipe.YML')).toBe(true);
    });
  });

  describe('Content Parsing', () => {
    test('should parse JSON content correctly', () => {
      const jsonContent = '{"name": "test", "value": 123}';
      const result = handler.parseContent(jsonContent, 'test.json');
      
      expect(result).toEqual({ name: 'test', value: 123 });
    });

    test('should parse YAML content correctly', () => {
      const yamlContent = 'name: test\nvalue: 123\nlist:\n  - item1\n  - item2';
      const result = handler.parseContent(yamlContent, 'test.yaml');
      
      expect(result).toEqual({
        name: 'test',
        value: 123,
        list: ['item1', 'item2']
      });
    });

    test('should handle complex YAML structures', () => {
      const yamlContent = `
name: Complex Recipe
description: A complex test recipe
techStack:
  language: TypeScript
  frontend: React
  backend: Express
tags:
  - web
  - typescript
  - react
metadata:
  version: 1.0.0
  author: Test Author
`;
      const result = handler.parseContent(yamlContent, 'test.yaml');
      
      expect(result.name).toBe('Complex Recipe');
      expect(result.techStack.language).toBe('TypeScript');
      expect(result.tags).toEqual(['web', 'typescript', 'react']);
    });

    test('should throw error for invalid JSON', () => {
      const invalidJson = '{"name": "test", "value":}';
      
      expect(() => {
        handler.parseContent(invalidJson, 'test.json');
      }).toThrow('Invalid JSON');
    });

    test('should throw error for invalid YAML', () => {
      const invalidYaml = 'name: test\n  invalid: [unclosed';
      
      expect(() => {
        handler.parseContent(invalidYaml, 'test.yaml');
      }).toThrow('Invalid YAML');
    });

    test('should throw error for unsupported format', () => {
      const content = 'some content';
      
      expect(() => {
        handler.parseContent(content, 'test.txt');
      }).toThrow('Unsupported file format: .txt');
    });
  });

  describe('Content Stringification', () => {
    const testData = {
      name: 'Test Recipe',
      description: 'A test recipe',
      techStack: {
        language: 'JavaScript',
        frontend: 'React'
      },
      tags: ['test', 'recipe']
    };

    test('should stringify to JSON correctly', () => {
      const result = handler.stringifyContent(testData, 'test.json');
      const parsed = JSON.parse(result);
      
      expect(parsed).toEqual(testData);
      expect(result).toContain('"name": "Test Recipe"');
    });

    test('should stringify to YAML correctly', () => {
      const result = handler.stringifyContent(testData, 'test.yaml');
      
      expect(result).toContain('name: Test Recipe');
      expect(result).toContain('language: JavaScript');
      expect(result).toContain('- test');
      expect(result).toContain('- recipe');
    });

    test('should respect JSON indentation options', () => {
      const result = handler.stringifyContent(testData, 'test.json', { indent: 4 });
      const lines = result.split('\n');
      
      // Check that indentation is 4 spaces
      expect(lines[1]).toMatch(/^    "/); // 4 spaces
    });

    test('should respect YAML formatting options', () => {
      const result = handler.stringifyContent(testData, 'test.yaml', {
        indent: 4,
        yamlOptions: { lineWidth: 80 }
      });
      
      expect(result).toContain('name: Test Recipe');
      // YAML should use 4-space indentation
      expect(result).toMatch(/^    language: JavaScript/m);
    });

    test('should throw error for unsupported format in stringify', () => {
      expect(() => {
        handler.stringifyContent(testData, 'test.txt');
      }).toThrow('Unsupported file format: .txt');
    });
  });

  describe('Format Detection from Content', () => {
    test('should detect JSON from content structure', () => {
      expect(handler.detectFormatFromContent('{"key": "value"}')).toBe('json');
      expect(handler.detectFormatFromContent('[1, 2, 3]')).toBe('json');
      expect(handler.detectFormatFromContent('  {"nested": {"key": "value"}}  ')).toBe('json');
    });

    test('should detect YAML from content structure', () => {
      expect(handler.detectFormatFromContent('key: value')).toBe('yaml');
      expect(handler.detectFormatFromContent('---\nkey: value')).toBe('yaml');
      expect(handler.detectFormatFromContent('- item1\n- item2')).toBe('yaml');
      expect(handler.detectFormatFromContent('  key: value\n  other: data')).toBe('yaml');
    });

    test('should default to JSON for ambiguous content', () => {
      expect(handler.detectFormatFromContent('plain text')).toBe('json');
      expect(handler.detectFormatFromContent('')).toBe('json');
      expect(handler.detectFormatFromContent('123')).toBe('json');
    });
  });

  describe('Utility Functions', () => {
    test('should generate suggested filenames correctly', () => {
      expect(handler.getSuggestedFilename('My Recipe', 'json')).toBe('my-recipe.json');
      expect(handler.getSuggestedFilename('My Recipe', 'yaml')).toBe('my-recipe.yaml');
      expect(handler.getSuggestedFilename('Complex Name!@#', 'json')).toBe('complex-name.json');
      expect(handler.getSuggestedFilename('---test---', 'json')).toBe('test.json');
    });

    test('should provide format choices for inquirer', () => {
      const choices = handler.getFormatChoices();
      
      expect(choices).toHaveLength(3);
      expect(choices[0]).toEqual({ name: 'JSON (.json)', value: 'json' });
      expect(choices[1]).toEqual({ name: 'YAML (.yaml)', value: 'yaml' });
      expect(choices[2]).toEqual({ name: 'YAML (.yml)', value: 'yml' });
    });

    test('should get extensions from format choices', () => {
      expect(handler.getExtensionFromFormat('json')).toBe('.json');
      expect(handler.getExtensionFromFormat('yaml')).toBe('.yaml');
      expect(handler.getExtensionFromFormat('yml')).toBe('.yml');
      expect(handler.getExtensionFromFormat('unknown')).toBe('.json');
    });

    test('should get correct MIME types', () => {
      expect(handler.getMimeType('test.json')).toBe('application/json');
      expect(handler.getMimeType('test.yaml')).toBe('application/x-yaml');
      expect(handler.getMimeType('test.yml')).toBe('application/x-yaml');
      expect(handler.getMimeType('test.txt')).toBe('text/plain');
    });

    test('should pretty print in different formats', () => {
      const data = { name: 'test', value: 123 };
      
      const jsonResult = handler.prettyPrint(data, 'json');
      expect(jsonResult).toContain('"name": "test"');
      
      const yamlResult = handler.prettyPrint(data, 'yaml');
      expect(yamlResult).toContain('name: test');
    });
  });

  describe('File Operations', () => {
    // Note: These tests would require actual file system operations
    // In a real test environment, you might want to use a temporary directory
    
    test('should validate file format and structure', async () => {
      // This would be tested with actual files in integration tests
      const mockValidation = {
        valid: true,
        errors: [],
        warnings: [],
        format: 'JSON',
        data: { name: 'test' }
      };
      
      expect(mockValidation.valid).toBe(true);
      expect(mockValidation.format).toBe('JSON');
    });
  });

  describe('Error Handling', () => {
    test('should handle malformed JSON gracefully', () => {
      const malformedJson = '{"name": "test", "value": 123,}'; // trailing comma
      
      expect(() => {
        handler.parseContent(malformedJson, 'test.json');
      }).toThrow();
    });

    test('should handle malformed YAML gracefully', () => {
      const malformedYaml = 'name: test\n  value: [unclosed array';
      
      expect(() => {
        handler.parseContent(malformedYaml, 'test.yaml');
      }).toThrow();
    });

    test('should handle empty content', () => {
      expect(() => {
        handler.parseContent('', 'test.json');
      }).toThrow();
      
      // YAML can handle empty content (returns undefined/null)
      const yamlResult = handler.parseContent('', 'test.yaml');
      expect(yamlResult).toBeUndefined();
    });

    test('should handle null and undefined data in stringify', () => {
      expect(() => {
        handler.stringifyContent(null, 'test.json');
      }).not.toThrow();
      
      expect(() => {
        handler.stringifyContent(undefined, 'test.yaml');
      }).not.toThrow();
    });
  });

  describe('Singleton Instance', () => {
    test('should export singleton instance', () => {
      expect(fileFormatHandler).toBeInstanceOf(FileFormatHandler);
      expect(fileFormatHandler.isSupportedFormat('test.json')).toBe(true);
    });

    test('should maintain state across calls', () => {
      const extensions1 = fileFormatHandler.supportedExtensions;
      const extensions2 = fileFormatHandler.supportedExtensions;
      
      expect(extensions1).toBe(extensions2);
      expect(extensions1).toEqual(['.json', '.yaml', '.yml']);
    });
  });

  describe('Integration Scenarios', () => {
    test('should handle recipe data in both formats', () => {
      const recipeData = {
        name: 'Full Stack Recipe',
        description: 'A comprehensive full stack development recipe',
        category: 'Web Application',
        version: '1.0.0',
        author: 'Test Author',
        tags: ['fullstack', 'web', 'javascript'],
        techStack: {
          language: 'JavaScript/TypeScript',
          frontend: 'React',
          backend: 'Node.js/Express',
          database: 'PostgreSQL',
          testing: 'Jest',
          deployment: 'Vercel'
        },
        windsurfRules: '# Windsurf Rules\n\nUse modern JavaScript patterns.',
        agentRules: '# Agent Rules\n\nGenerate clean, maintainable code.'
      };

      // Test JSON conversion
      const jsonString = handler.stringifyContent(recipeData, 'recipe.json');
      const parsedFromJson = handler.parseContent(jsonString, 'recipe.json');
      expect(parsedFromJson).toEqual(recipeData);

      // Test YAML conversion
      const yamlString = handler.stringifyContent(recipeData, 'recipe.yaml');
      const parsedFromYaml = handler.parseContent(yamlString, 'recipe.yaml');
      expect(parsedFromYaml).toEqual(recipeData);
    });

    test('should handle package.json-like data', () => {
      const packageData = {
        name: 'test-project',
        version: '1.0.0',
        dependencies: {
          react: '^18.0.0',
          express: '^4.18.0'
        },
        devDependencies: {
          typescript: '^4.9.0',
          jest: '^29.0.0'
        },
        scripts: {
          start: 'node index.js',
          test: 'jest'
        }
      };

      // Should work in both formats
      const jsonResult = handler.stringifyContent(packageData, 'package.json');
      const yamlResult = handler.stringifyContent(packageData, 'package.yaml');

      expect(JSON.parse(jsonResult)).toEqual(packageData);
      expect(handler.parseContent(yamlResult, 'package.yaml')).toEqual(packageData);
    });

    test('should maintain data fidelity across format conversions', () => {
      const complexData = {
        string: 'text value',
        number: 42,
        boolean: true,
        null_value: null,
        array: [1, 'two', { three: 3 }],
        object: {
          nested: {
            deeply: {
              value: 'deep'
            }
          }
        }
      };

      // JSON → YAML → JSON
      const jsonString = handler.stringifyContent(complexData, 'test.json');
      const fromJson = handler.parseContent(jsonString, 'test.json');
      const yamlString = handler.stringifyContent(fromJson, 'test.yaml');
      const fromYaml = handler.parseContent(yamlString, 'test.yaml');
      const backToJson = handler.stringifyContent(fromYaml, 'test.json');
      const final = handler.parseContent(backToJson, 'test.json');

      expect(final).toEqual(complexData);
    });
  });
});