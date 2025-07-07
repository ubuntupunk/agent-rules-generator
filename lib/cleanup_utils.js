/**
 * Cleanup utilities for temporary files and cache management
 */

const fs = require('fs').promises;
const path = require('path');
const os = require('os');

/**
 * Clean up temporary files created during scraping or processing
 */
async function cleanupTempFiles() {
  const tempPatterns = [
    'windsurf_directory.html',
    'tmp_*.html',
    'debug_*.html',
    'temp_*.html',
    '*_temp.html'
  ];
  
  const cleanedFiles = [];
  
  for (const pattern of tempPatterns) {
    try {
      // Simple pattern matching for common temp files
      if (pattern.includes('*')) {
        // For now, just handle specific known files
        continue;
      }
      
      try {
        await fs.access(pattern);
        await fs.unlink(pattern);
        cleanedFiles.push(pattern);
      } catch (error) {
        // File doesn't exist, which is fine
      }
    } catch (error) {
      console.warn(`Warning: Could not clean up ${pattern}: ${error.message}`);
    }
  }
  
  return cleanedFiles;
}

/**
 * Clean up old cache files beyond retention period
 */
async function cleanupOldCaches(retentionDays = 30) {
  const cacheBaseDir = path.join(os.homedir(), '.agent-rules-cache');
  const cutoffTime = Date.now() - (retentionDays * 24 * 60 * 60 * 1000);
  
  try {
    const entries = await fs.readdir(cacheBaseDir, { withFileTypes: true });
    const cleanedDirs = [];
    
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const dirPath = path.join(cacheBaseDir, entry.name);
        const metadataPath = path.join(dirPath, 'metadata.json');
        
        try {
          const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf8'));
          const lastUpdated = new Date(metadata.lastUpdated).getTime();
          
          if (lastUpdated < cutoffTime) {
            await fs.rm(dirPath, { recursive: true, force: true });
            cleanedDirs.push(entry.name);
          }
        } catch (error) {
          // If we can't read metadata, leave the directory alone
        }
      }
    }
    
    return cleanedDirs;
  } catch (error) {
    // Cache directory doesn't exist or other error
    return [];
  }
}

/**
 * Get disk usage of cache directories
 */
async function getCacheUsage() {
  const cacheBaseDir = path.join(os.homedir(), '.agent-rules-cache');
  
  try {
    const usage = {
      totalSize: 0,
      directories: {}
    };
    
    const entries = await fs.readdir(cacheBaseDir, { withFileTypes: true });
    
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const dirPath = path.join(cacheBaseDir, entry.name);
        const dirSize = await getDirectorySize(dirPath);
        usage.directories[entry.name] = dirSize;
        usage.totalSize += dirSize;
      }
    }
    
    return usage;
  } catch (error) {
    return { totalSize: 0, directories: {} };
  }
}

/**
 * Get size of a directory recursively
 */
async function getDirectorySize(dirPath) {
  let totalSize = 0;
  
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        totalSize += await getDirectorySize(fullPath);
      } else {
        const stats = await fs.stat(fullPath);
        totalSize += stats.size;
      }
    }
  } catch (error) {
    // Directory doesn't exist or permission error
  }
  
  return totalSize;
}

/**
 * Format bytes to human readable string
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

module.exports = {
  cleanupTempFiles,
  cleanupOldCaches,
  getCacheUsage,
  formatBytes
};