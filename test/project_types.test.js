/**
 * Test suite for project type functionality
 * Tests conditional tech stack collection and project type specific features
 */

import { describe, test, expect } from 'bun:test';
import { 
  getProjectTypeQuestions, 
  analyzeProjectTypes, 
  hasProjectType,
  getProjectTypeFlags,
  PROJECT_TYPES
} from '../lib/project_types.js';

describe('Project Types System', () => {
  
  describe('analyzeProjectTypes function', () => {
    test('should identify web application requirements', () => {
      const result = analyzeProjectTypes(['Web Application']);
      
      expect(result.requiresFrontend).toBe(true);
      expect(result.requiresBackend).toBe(true);
      expect(result.requiresDatabase).toBe(true);
      expect(result.requiresDeployment).toBe(true);
    });

    test('should identify CLI tool requirements', () => {
      const result = analyzeProjectTypes(['CLI Tool']);
      
      expect(result.requiresFrontend).toBe(false);
      expect(result.requiresBackend).toBe(false);
      expect(result.requiresDatabase).toBe(false);
      expect(result.requiresDeployment).toBe(false);
    });

    test('should identify API/Backend requirements', () => {
      const result = analyzeProjectTypes(['API/Backend']);
      
      expect(result.requiresFrontend).toBe(false);
      expect(result.requiresBackend).toBe(true);
      expect(result.requiresDatabase).toBe(true);
      expect(result.requiresDeployment).toBe(true);
    });

    test('should handle multiple project types', () => {
      const result = analyzeProjectTypes(['CLI Tool', 'Web Application']);
      
      // Should require everything if any type requires it
      expect(result.requiresFrontend).toBe(true);
      expect(result.requiresBackend).toBe(true);
      expect(result.requiresDatabase).toBe(true);
      expect(result.requiresDeployment).toBe(true);
    });
  });

  describe('getProjectTypeQuestions function', () => {
    test('should include frontend questions for web applications', () => {
      const questions = getProjectTypeQuestions(['Web Application']);
      
      const frontendQuestion = questions.find(q => q.name === 'frontend');
      expect(frontendQuestion).toBeDefined();
      expect(frontendQuestion.message).toContain('Frontend framework');
    });

    test('should exclude frontend questions for CLI tools', () => {
      const questions = getProjectTypeQuestions(['CLI Tool']);
      
      const frontendQuestion = questions.find(q => q.name === 'frontend');
      expect(frontendQuestion).toBeUndefined();
    });

    test('should include CLI-specific questions for CLI tools', () => {
      const questions = getProjectTypeQuestions(['CLI Tool']);
      
      const cliFrameworkQuestion = questions.find(q => q.name === 'cliFramework');
      const configFormatQuestion = questions.find(q => q.name === 'configFormat');
      
      expect(cliFrameworkQuestion).toBeDefined();
      expect(configFormatQuestion).toBeDefined();
    });

    test('should include mobile-specific questions for mobile apps', () => {
      const questions = getProjectTypeQuestions(['Mobile App']);
      
      const mobilePlatformQuestion = questions.find(q => q.name === 'mobilePlatform');
      const mobileFrameworkQuestion = questions.find(q => q.name === 'mobileFramework');
      
      expect(mobilePlatformQuestion).toBeDefined();
      expect(mobileFrameworkQuestion).toBeDefined();
    });

    test('should include library-specific questions for libraries', () => {
      const questions = getProjectTypeQuestions(['Library/Package']);
      
      const targetEnvQuestion = questions.find(q => q.name === 'targetEnvironment');
      const buildSystemQuestion = questions.find(q => q.name === 'buildSystem');
      
      expect(targetEnvQuestion).toBeDefined();
      expect(buildSystemQuestion).toBeDefined();
    });

    test('should always include language and testing questions', () => {
      const cliQuestions = getProjectTypeQuestions(['CLI Tool']);
      const webQuestions = getProjectTypeQuestions(['Web Application']);
      
      // Both should have language and testing
      expect(cliQuestions.find(q => q.name === 'language')).toBeDefined();
      expect(cliQuestions.find(q => q.name === 'testing')).toBeDefined();
      expect(webQuestions.find(q => q.name === 'language')).toBeDefined();
      expect(webQuestions.find(q => q.name === 'testing')).toBeDefined();
    });
  });

  describe('hasProjectType function', () => {
    test('should correctly identify project types', () => {
      const projectTypes = ['Web Application', 'CLI Tool'];
      
      expect(hasProjectType(projectTypes, 'Web Application')).toBe(true);
      expect(hasProjectType(projectTypes, 'CLI Tool')).toBe(true);
      expect(hasProjectType(projectTypes, 'Mobile App')).toBe(false);
    });
  });

  describe('getProjectTypeFlags function', () => {
    test('should generate correct flags for template conditionals', () => {
      const flags = getProjectTypeFlags(['Web Application', 'CLI Tool']);
      
      expect(flags.isWebApp).toBe(true);
      expect(flags.isCliTool).toBe(true);
      expect(flags.isMobileApp).toBe(false);
      expect(flags.isDesktopApp).toBe(false);
      expect(flags.isLibrary).toBe(false);
      expect(flags.isApiBackend).toBe(false);
    });

    test('should handle single project type', () => {
      const flags = getProjectTypeFlags(['CLI Tool']);
      
      expect(flags.isCliTool).toBe(true);
      expect(flags.isWebApp).toBe(false);
    });

    test('should handle empty project types', () => {
      const flags = getProjectTypeFlags([]);
      
      Object.values(flags).forEach(flag => {
        expect(flag).toBe(false);
      });
    });
  });

  describe('Project type specific defaults', () => {
    test('should provide appropriate defaults for CLI tools', () => {
      const questions = getProjectTypeQuestions(['CLI Tool']);
      
      const languageQuestion = questions.find(q => q.name === 'language');
      const cliFrameworkQuestion = questions.find(q => q.name === 'cliFramework');
      
      expect(languageQuestion.default).toBe('JavaScript/TypeScript');
      expect(cliFrameworkQuestion.default).toBe('Commander.js');
    });

    test('should provide appropriate defaults for mobile apps', () => {
      const questions = getProjectTypeQuestions(['Mobile App']);
      
      const frontendQuestion = questions.find(q => q.name === 'frontend');
      const mobileFrameworkQuestion = questions.find(q => q.name === 'mobileFramework');
      
      expect(frontendQuestion.default).toBe('React Native');
      expect(mobileFrameworkQuestion.default).toBe('React Native');
    });

    test('should provide appropriate defaults for libraries', () => {
      const questions = getProjectTypeQuestions(['Library/Package']);
      
      const targetEnvQuestion = questions.find(q => q.name === 'targetEnvironment');
      const buildSystemQuestion = questions.find(q => q.name === 'buildSystem');
      
      expect(targetEnvQuestion.default).toEqual(['Node.js']);
      expect(buildSystemQuestion.default).toBe('TypeScript');
    });
  });

  describe('Context-aware messaging', () => {
    test('should use mobile-specific messaging for mobile apps', () => {
      const questions = getProjectTypeQuestions(['Mobile App']);
      
      const frontendQuestion = questions.find(q => q.name === 'frontend');
      expect(frontendQuestion.message).toContain('Mobile UI framework');
    });

    test('should use desktop-specific messaging for desktop apps', () => {
      const questions = getProjectTypeQuestions(['Desktop App']);
      
      const frontendQuestion = questions.find(q => q.name === 'frontend');
      expect(frontendQuestion.message).toContain('Desktop UI framework');
    });

    test('should use API-specific messaging for backend projects', () => {
      const questions = getProjectTypeQuestions(['API/Backend']);
      
      const backendQuestion = questions.find(q => q.name === 'backend');
      expect(backendQuestion.message).toContain('Backend framework');
    });
  });

  describe('PROJECT_TYPES configuration', () => {
    test('should have all expected project types defined', () => {
      const expectedTypes = [
        'Web Application',
        'API/Backend', 
        'CLI Tool',
        'Library/Package',
        'Mobile App',
        'Desktop App'
      ];
      
      expectedTypes.forEach(type => {
        expect(PROJECT_TYPES[type]).toBeDefined();
        expect(PROJECT_TYPES[type].key).toBeTruthy();
      });
    });

    test('should have consistent key naming', () => {
      Object.values(PROJECT_TYPES).forEach(config => {
        expect(config.key).toMatch(/^[a-zA-Z]+$/); // Only letters, no spaces
        expect(typeof config.requiresFrontend).toBe('boolean');
        expect(typeof config.requiresBackend).toBe('boolean');
        expect(typeof config.requiresDatabase).toBe('boolean');
        expect(typeof config.requiresDeployment).toBe('boolean');
      });
    });
  });
});

// Manual test function for debugging
async function runManualProjectTypeTests() {
  console.log('🧪 Running manual project type tests...\n');
  
  try {
    // Test 1: Web Application questions
    console.log('🌐 Test 1: Web Application questions');
    const webQuestions = getProjectTypeQuestions(['Web Application']);
    console.log(`✅ Generated ${webQuestions.length} questions for Web Application`);
    console.log(`📄 Includes frontend: ${webQuestions.some(q => q.name === 'frontend')}`);
    console.log(`📄 Includes backend: ${webQuestions.some(q => q.name === 'backend')}`);
    console.log(`📄 Includes database: ${webQuestions.some(q => q.name === 'database')}`);
    
    // Test 2: CLI Tool questions
    console.log('\n🖥️ Test 2: CLI Tool questions');
    const cliQuestions = getProjectTypeQuestions(['CLI Tool']);
    console.log(`✅ Generated ${cliQuestions.length} questions for CLI Tool`);
    console.log(`📄 Excludes frontend: ${!cliQuestions.some(q => q.name === 'frontend')}`);
    console.log(`📄 Includes CLI framework: ${cliQuestions.some(q => q.name === 'cliFramework')}`);
    console.log(`📄 Includes config format: ${cliQuestions.some(q => q.name === 'configFormat')}`);
    
    // Test 3: Project type flags
    console.log('\n🏷️ Test 3: Project type flags');
    const flags = getProjectTypeFlags(['Web Application', 'CLI Tool']);
    console.log(`✅ Generated flags:`, Object.keys(flags).filter(key => flags[key]));
    
    // Test 4: Requirements analysis
    console.log('\n📋 Test 4: Requirements analysis');
    const webReqs = analyzeProjectTypes(['Web Application']);
    const cliReqs = analyzeProjectTypes(['CLI Tool']);
    console.log(`✅ Web app requirements: Frontend=${webReqs.requiresFrontend}, Backend=${webReqs.requiresBackend}`);
    console.log(`✅ CLI tool requirements: Frontend=${cliReqs.requiresFrontend}, Backend=${cliReqs.requiresBackend}`);
    
    console.log('\n🎉 All manual project type tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Manual project type tests failed:', error.message);
  }
}

// Export for manual testing
export { runManualProjectTypeTests };

// Run manual tests if called directly
if (import.meta.main) {
  runManualProjectTypeTests().catch(console.error);
}