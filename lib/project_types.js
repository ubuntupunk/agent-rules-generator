/**
 * Project type specific configurations and question sets
 * Provides conditional tech stack collection based on project type
 */

/**
 * Project type definitions with their characteristics
 */
const PROJECT_TYPES = {
  'Web Application': {
    key: 'webApp',
    requiresFrontend: true,
    requiresBackend: true,
    requiresDatabase: true,
    requiresDeployment: true
  },
  'API/Backend': {
    key: 'apiBackend',
    requiresFrontend: false,
    requiresBackend: true,
    requiresDatabase: true,
    requiresDeployment: true
  },
  'CLI Tool': {
    key: 'cliTool',
    requiresFrontend: false,
    requiresBackend: false,
    requiresDatabase: false,
    requiresDeployment: false
  },
  'Library/Package': {
    key: 'library',
    requiresFrontend: false,
    requiresBackend: false,
    requiresDatabase: false,
    requiresDeployment: false
  },
  'Mobile App': {
    key: 'mobileApp',
    requiresFrontend: true,
    requiresBackend: true,
    requiresDatabase: true,
    requiresDeployment: true
  },
  'Desktop App': {
    key: 'desktopApp',
    requiresFrontend: true,
    requiresBackend: false,
    requiresDatabase: false,
    requiresDeployment: true
  }
};

/**
 * Get project type specific tech stack questions
 */
function getProjectTypeQuestions(projectTypes) {
  const questions = [];
  const typeConfig = analyzeProjectTypes(projectTypes);

  // Language (always ask)
  questions.push({
    type: 'input',
    name: 'language',
    message: 'Primary programming language(s):',
    default: getDefaultLanguage(projectTypes)
  });

  // Frontend questions
  if (typeConfig.requiresFrontend) {
    questions.push({
      type: 'input',
      name: 'frontend',
      message: getFrontendMessage(projectTypes),
      default: getDefaultFrontend(projectTypes)
    });
  }

  // Backend questions
  if (typeConfig.requiresBackend) {
    questions.push({
      type: 'input',
      name: 'backend',
      message: getBackendMessage(projectTypes),
      default: getDefaultBackend(projectTypes)
    });
  }

  // Database questions
  if (typeConfig.requiresDatabase) {
    questions.push({
      type: 'input',
      name: 'database',
      message: 'Database (e.g., PostgreSQL, MongoDB, MySQL, SQLite):'
    });
  }

  // Project type specific questions
  if (projectTypes.includes('CLI Tool')) {
    questions.push(...getCLIToolQuestions());
  }

  if (projectTypes.includes('Library/Package')) {
    questions.push(...getLibraryQuestions());
  }

  if (projectTypes.includes('Mobile App')) {
    questions.push(...getMobileAppQuestions());
  }

  if (projectTypes.includes('Desktop App')) {
    questions.push(...getDesktopAppQuestions());
  }

  // Build tools (context-aware)
  questions.push({
    type: 'input',
    name: 'tools',
    message: getBuildToolsMessage(projectTypes),
    default: getDefaultBuildTools(projectTypes)
  });

  // Testing (always ask)
  questions.push({
    type: 'input',
    name: 'testing',
    message: getTestingMessage(projectTypes),
    default: getDefaultTesting(projectTypes)
  });

  // Deployment (if applicable)
  if (typeConfig.requiresDeployment) {
    questions.push({
      type: 'input',
      name: 'deployment',
      message: getDeploymentMessage(projectTypes),
      default: getDefaultDeployment(projectTypes)
    });
  }

  return questions;
}

/**
 * CLI Tool specific questions
 */
function getCLIToolQuestions() {
  return [
    {
      type: 'input',
      name: 'cliFramework',
      message: 'CLI framework (e.g., Commander.js, Yargs, Inquirer.js):',
      default: 'Commander.js'
    },
    {
      type: 'input',
      name: 'configFormat',
      message: 'Configuration format (e.g., JSON, YAML, TOML):',
      default: 'JSON'
    },
    {
      type: 'input',
      name: 'packageManager',
      message: 'Package manager (e.g., npm, yarn, pnpm, bun):',
      default: 'npm'
    }
  ];
}

/**
 * Library/Package specific questions
 */
function getLibraryQuestions() {
  return [
    {
      type: 'checkbox',
      name: 'targetEnvironment',
      message: 'Target environment:',
      choices: ['Node.js', 'Browser', 'Both'],
      default: ['Node.js']
    },
    {
      type: 'input',
      name: 'buildSystem',
      message: 'Build system (e.g., TypeScript, Rollup, Webpack):',
      default: 'TypeScript'
    },
    {
      type: 'input',
      name: 'distributionFormat',
      message: 'Distribution format (e.g., CommonJS, ESM, UMD):',
      default: 'ESM'
    }
  ];
}

/**
 * Mobile App specific questions
 */
function getMobileAppQuestions() {
  return [
    {
      type: 'checkbox',
      name: 'mobilePlatform',
      message: 'Target platforms:',
      choices: ['iOS', 'Android', 'Cross-platform'],
      default: ['Cross-platform']
    },
    {
      type: 'input',
      name: 'mobileFramework',
      message: 'Mobile framework (e.g., React Native, Flutter, Native):',
      default: 'React Native'
    },
    {
      type: 'input',
      name: 'stateManagement',
      message: 'State management (e.g., Redux, Zustand, Context API):',
      default: 'Context API'
    }
  ];
}

/**
 * Desktop App specific questions
 */
function getDesktopAppQuestions() {
  return [
    {
      type: 'input',
      name: 'desktopFramework',
      message: 'Desktop framework (e.g., Electron, Tauri, Native):',
      default: 'Electron'
    },
    {
      type: 'input',
      name: 'uiLibrary',
      message: 'UI library (e.g., React, Vue, Svelte, Native):',
      default: 'React'
    },
    {
      type: 'checkbox',
      name: 'desktopPlatform',
      message: 'Target platforms:',
      choices: ['Windows', 'macOS', 'Linux'],
      default: ['Windows', 'macOS', 'Linux']
    }
  ];
}

/**
 * Analyze project types to determine requirements
 */
function analyzeProjectTypes(projectTypes) {
  const config = {
    requiresFrontend: false,
    requiresBackend: false,
    requiresDatabase: false,
    requiresDeployment: false
  };

  projectTypes.forEach(type => {
    const typeConfig = PROJECT_TYPES[type];
    if (typeConfig) {
      config.requiresFrontend = config.requiresFrontend || typeConfig.requiresFrontend;
      config.requiresBackend = config.requiresBackend || typeConfig.requiresBackend;
      config.requiresDatabase = config.requiresDatabase || typeConfig.requiresDatabase;
      config.requiresDeployment = config.requiresDeployment || typeConfig.requiresDeployment;
    }
  });

  return config;
}

/**
 * Get context-aware default values and messages
 */
function getDefaultLanguage(projectTypes) {
  if (projectTypes.includes('CLI Tool') || projectTypes.includes('Library/Package')) {
    return 'JavaScript/TypeScript';
  }
  if (projectTypes.includes('Mobile App')) {
    return 'JavaScript/TypeScript';
  }
  if (projectTypes.includes('Desktop App')) {
    return 'JavaScript/TypeScript';
  }
  return 'JavaScript/TypeScript';
}

function getFrontendMessage(projectTypes) {
  if (projectTypes.includes('Mobile App')) {
    return 'Mobile UI framework (e.g., React Native, Flutter):';
  }
  if (projectTypes.includes('Desktop App')) {
    return 'Desktop UI framework (e.g., React, Vue, Svelte):';
  }
  return 'Frontend framework/library (e.g., React, Vue, Angular):';
}

function getDefaultFrontend(projectTypes) {
  if (projectTypes.includes('Mobile App')) {
    return 'React Native';
  }
  if (projectTypes.includes('Desktop App')) {
    return 'React';
  }
  return 'React';
}

function getBackendMessage(projectTypes) {
  if (projectTypes.includes('API/Backend')) {
    return 'Backend framework (e.g., Express, FastAPI, Spring Boot):';
  }
  return 'Backend framework (e.g., Node.js/Express, Django, Rails):';
}

function getDefaultBackend(projectTypes) {
  if (projectTypes.includes('API/Backend')) {
    return 'Express';
  }
  return 'Node.js/Express';
}

function getBuildToolsMessage(projectTypes) {
  if (projectTypes.includes('CLI Tool')) {
    return 'Build tools (e.g., TypeScript, ESBuild, Rollup):';
  }
  if (projectTypes.includes('Library/Package')) {
    return 'Build tools (e.g., TypeScript, Rollup, Webpack, Vite):';
  }
  if (projectTypes.includes('Mobile App')) {
    return 'Build tools (e.g., Metro, Expo CLI, React Native CLI):';
  }
  if (projectTypes.includes('Desktop App')) {
    return 'Build tools (e.g., Electron Builder, Vite, Webpack):';
  }
  return 'Build tools/bundlers (e.g., Webpack, Vite, Parcel):';
}

function getDefaultBuildTools(projectTypes) {
  if (projectTypes.includes('CLI Tool')) {
    return 'TypeScript, ESBuild';
  }
  if (projectTypes.includes('Library/Package')) {
    return 'TypeScript, Rollup';
  }
  if (projectTypes.includes('Mobile App')) {
    return 'Metro, React Native CLI';
  }
  if (projectTypes.includes('Desktop App')) {
    return 'Electron Builder, Vite';
  }
  return 'Vite, ESLint';
}

function getTestingMessage(projectTypes) {
  if (projectTypes.includes('CLI Tool')) {
    return 'Testing framework (e.g., Jest, Vitest, Bun Test):';
  }
  if (projectTypes.includes('Library/Package')) {
    return 'Testing framework (e.g., Jest, Vitest, Mocha):';
  }
  if (projectTypes.includes('Mobile App')) {
    return 'Testing framework (e.g., Jest, Detox, Appium):';
  }
  return 'Testing framework (e.g., Jest, Vitest, Cypress):';
}

function getDefaultTesting(projectTypes) {
  if (projectTypes.includes('CLI Tool')) {
    return 'Jest';
  }
  if (projectTypes.includes('Library/Package')) {
    return 'Jest';
  }
  if (projectTypes.includes('Mobile App')) {
    return 'Jest, Detox';
  }
  return 'Jest, Cypress';
}

function getDeploymentMessage(projectTypes) {
  if (projectTypes.includes('API/Backend')) {
    return 'Deployment platform (e.g., AWS, Google Cloud, Heroku):';
  }
  if (projectTypes.includes('Mobile App')) {
    return 'Distribution (e.g., App Store, Google Play, TestFlight):';
  }
  if (projectTypes.includes('Desktop App')) {
    return 'Distribution (e.g., GitHub Releases, Microsoft Store, Mac App Store):';
  }
  return 'Deployment platform (e.g., Vercel, Netlify, AWS):';
}

function getDefaultDeployment(projectTypes) {
  if (projectTypes.includes('API/Backend')) {
    return 'AWS';
  }
  if (projectTypes.includes('Mobile App')) {
    return 'App Store, Google Play';
  }
  if (projectTypes.includes('Desktop App')) {
    return 'GitHub Releases';
  }
  return 'Vercel';
}

/**
 * Check if project types include specific type
 */
function hasProjectType(projectTypes, type) {
  return projectTypes.includes(type);
}

/**
 * Get project type keys for template conditionals
 */
function getProjectTypeFlags(projectTypes) {
  const flags = {};
  
  Object.entries(PROJECT_TYPES).forEach(([typeName, config]) => {
    flags[`is${config.key.charAt(0).toUpperCase() + config.key.slice(1)}`] = projectTypes.includes(typeName);
  });
  
  return flags;
}

module.exports = {
  PROJECT_TYPES,
  getProjectTypeQuestions,
  analyzeProjectTypes,
  hasProjectType,
  getProjectTypeFlags,
  getCLIToolQuestions,
  getLibraryQuestions,
  getMobileAppQuestions,
  getDesktopAppQuestions
};