/**
 * File Format Handler Module
 * Provides unified support for JSON and YAML formats across the application
 * 
 * This module ensures consistent handling of both JSON and YAML files
 * for recipes, configurations, and other data files.
 */

const fs = require('fs').promises;
const path = require('path');
const yaml = require('js-yaml');

class FileFormatHandler {
  constructor() {
    this.supportedExtensions = ['.json', '.yaml', '.yml'];
    this.jsonExtensions = ['.json'];
    this.yamlExtensions = ['.yaml', '.yml'];
  }

  /**
   * Check if a file extension is supported
   * @param {string} filePath - File path to check
   * @returns {boolean} True if supported
   */
  isSupportedFormat(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return this.supportedExtensions.includes(ext);
  }

  /**
   * Check if a file is JSON format
   * @param {string} filePath - File path to check
   * @returns {boolean} True if JSON
   */
  isJsonFormat(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return this.jsonExtensions.includes(ext);
  }

  /**
   * Check if a file is YAML format
   * @param {string} filePath - File path to check
   * @returns {boolean} True if YAML
   */
  isYamlFormat(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return this.yamlExtensions.includes(ext);
  }

  /**
   * Parse file content based on extension
   * @param {string} content - File content to parse
   * @param {string} filePath - File path for extension detection
   * @returns {Object} Parsed object
   * @throws {Error} If parsing fails
   */
  parseContent(content, filePath) {
    const ext = path.extname(filePath).toLowerCase();
    
    try {
      if (this.jsonExtensions.includes(ext)) {
        return JSON.parse(content);
      } else if (this.yamlExtensions.includes(ext)) {
        return yaml.load(content);
      } else {
        throw new Error(`Unsupported file format: ${ext}`);
      }
    } catch (error) {
      const format = this.jsonExtensions.includes(ext) ? 'JSON' : 'YAML';
      throw new Error(`Invalid ${format}: ${error.message}`);
    }
  }

  /**
   * Stringify object to format based on extension
   * @param {Object} data - Data to stringify
   * @param {string} filePath - File path for extension detection
   * @param {Object} options - Formatting options
   * @returns {string} Stringified content
   */
  stringifyContent(data, filePath, options = {}) {
    const ext = path.extname(filePath).toLowerCase();
    const { indent = 2, yamlOptions = {} } = options;
    
    if (this.jsonExtensions.includes(ext)) {
      return JSON.stringify(data, null, indent);
    } else if (this.yamlExtensions.includes(ext)) {
      const defaultYamlOptions = {
        indent: indent,
        lineWidth: 120,
        noRefs: true,
        sortKeys: false,
        ...yamlOptions
      };
      return yaml.dump(data, defaultYamlOptions);
    } else {
      throw new Error(`Unsupported file format: ${ext}`);
    }
  }

  /**
   * Read and parse a file (JSON or YAML)
   * @param {string} filePath - Path to the file
   * @returns {Promise<Object>} Parsed content
   */
  async readFile(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      return this.parseContent(content, filePath);
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new Error(`File not found: ${filePath}`);
      }
      throw error;
    }
  }

  /**
   * Write object to file in appropriate format
   * @param {string} filePath - Path to write to
   * @param {Object} data - Data to write
   * @param {Object} options - Write options
   * @returns {Promise<void>}
   */
  async writeFile(filePath, data, options = {}) {
    const content = this.stringifyContent(data, filePath, options);
    await fs.writeFile(filePath, content, 'utf8');
  }

  /**
   * Get all supported files in a directory
   * @param {string} dirPath - Directory path
   * @returns {Promise<Array>} Array of supported file paths
   */
  async getSupportedFiles(dirPath) {
    try {
      const files = await fs.readdir(dirPath);
      return files.filter(file => this.isSupportedFormat(file));
    } catch (error) {
      throw new Error(`Failed to read directory: ${error.message}`);
    }
  }

  /**
   * Convert between formats
   * @param {string} inputPath - Input file path
   * @param {string} outputPath - Output file path
   * @param {Object} options - Conversion options
   * @returns {Promise<void>}
   */
  async convertFormat(inputPath, outputPath, options = {}) {
    const data = await this.readFile(inputPath);
    await this.writeFile(outputPath, data, options);
  }

  /**
   * Validate file format and content
   * @param {string} filePath - File path to validate
   * @returns {Promise<Object>} Validation result
   */
  async validateFile(filePath) {
    const result = {
      valid: true,
      errors: [],
      warnings: [],
      format: null,
      data: null
    };

    try {
      // Check if format is supported
      if (!this.isSupportedFormat(filePath)) {
        const ext = path.extname(filePath);
        result.valid = false;
        result.errors.push(`Unsupported file format: ${ext}. Supported formats: ${this.supportedExtensions.join(', ')}`);
        return result;
      }

      // Determine format
      result.format = this.isJsonFormat(filePath) ? 'JSON' : 'YAML';

      // Try to parse the file
      result.data = await this.readFile(filePath);

      // Additional validation for specific data types
      if (typeof result.data !== 'object' || result.data === null) {
        result.warnings.push('File content should be an object for recipe data');
      }

    } catch (error) {
      result.valid = false;
      result.errors.push(error.message);
    }

    return result;
  }

  /**
   * Get suggested filename with appropriate extension
   * @param {string} baseName - Base name without extension
   * @param {string} preferredFormat - 'json' or 'yaml'
   * @returns {string} Filename with extension
   */
  getSuggestedFilename(baseName, preferredFormat = 'json') {
    const cleanName = baseName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    const extension = preferredFormat === 'yaml' ? '.yaml' : '.json';
    return `${cleanName}${extension}`;
  }

  /**
   * Get format-specific file extension choices for inquirer
   * @returns {Array} Array of choices for inquirer prompts
   */
  getFormatChoices() {
    return [
      { name: 'JSON (.json)', value: 'json' },
      { name: 'YAML (.yaml)', value: 'yaml' },
      { name: 'YAML (.yml)', value: 'yml' }
    ];
  }

  /**
   * Get file extension from format choice
   * @param {string} format - Format choice ('json', 'yaml', 'yml')
   * @returns {string} File extension
   */
  getExtensionFromFormat(format) {
    switch (format) {
      case 'json': return '.json';
      case 'yaml': return '.yaml';
      case 'yml': return '.yml';
      default: return '.json';
    }
  }

  /**
   * Detect format from file content (when extension is ambiguous)
   * @param {string} content - File content
   * @returns {string} Detected format ('json' or 'yaml')
   */
  detectFormatFromContent(content) {
    const trimmed = content.trim();
    
    // Check for JSON indicators
    if ((trimmed.startsWith('{') && trimmed.endsWith('}')) ||
        (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
      return 'json';
    }
    
    // Check for YAML indicators
    if (trimmed.includes('---') || 
        /^[a-zA-Z_][a-zA-Z0-9_]*:\s/.test(trimmed) ||
        /^\s*-\s/.test(trimmed)) {
      return 'yaml';
    }
    
    // Default to JSON if unclear
    return 'json';
  }

  /**
   * Pretty print data in specified format
   * @param {Object} data - Data to print
   * @param {string} format - Format ('json' or 'yaml')
   * @param {Object} options - Formatting options
   * @returns {string} Formatted string
   */
  prettyPrint(data, format = 'json', options = {}) {
    const tempPath = `temp.${format}`;
    return this.stringifyContent(data, tempPath, options);
  }

  /**
   * Get MIME type for format
   * @param {string} filePath - File path
   * @returns {string} MIME type
   */
  getMimeType(filePath) {
    if (this.isJsonFormat(filePath)) {
      return 'application/json';
    } else if (this.isYamlFormat(filePath)) {
      return 'application/x-yaml';
    }
    return 'text/plain';
  }
}

// Export singleton instance
const fileFormatHandler = new FileFormatHandler();

module.exports = {
  FileFormatHandler,
  fileFormatHandler
};