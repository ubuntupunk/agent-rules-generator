# Project Type Analysis - Current Issues

## Current State Investigation

### Project Type Options (Currently Available)
From `agent_rules_cli.js` line 416-427:
```javascript
{
  type: 'checkbox',
  name: 'projectType',
  message: 'Project type(s):',
  choices: [
    'Web Application',
    'API/Backend', 
    'Mobile App',
    'Desktop App',
    'Library/Package',
    'CLI Tool',
    'Other'
  ]
}
```

### Tech Stack Collection (The Problem)
From `manualTechStackSetup()` function:
```javascript
const techStack = await inquirer.prompt([
  {
    type: 'input',
    name: 'frontend',
    message: 'Frontend framework/library (e.g., React, Vue, Angular):'
  },
  {
    type: 'input', 
    name: 'backend',
    message: 'Backend framework (e.g., Node.js/Express, Django, Rails):'
  },
  {
    type: 'input',
    name: 'database', 
    message: 'Database (e.g., PostgreSQL, MongoDB, MySQL):'
  },
  // ... more fields
]);
```

## Issues Identified

### 1. **Always Asks for Frontend** 
- Even for CLI tools, APIs, libraries that don't need frontend
- Assumes all projects have a frontend component

### 2. **Always Asks for Backend**
- Frontend-only projects don't need backend
- Static sites, client-side apps, etc.

### 3. **Always Asks for Database**
- Many projects don't use databases
- CLI tools, libraries, static sites

### 4. **React Bias in Examples**
- Frontend examples: "React, Vue, Angular" (React first)
- Test data uses React extensively
- Documentation examples are React-focused

### 5. **No Conditional Logic**
- Same questions regardless of project type
- No adaptation based on selected project types

## Proposed Solutions

### 1. **Conditional Tech Stack Collection**
Based on project type, ask relevant questions only:

**Web Application:**
- Frontend framework
- Backend framework  
- Database
- Deployment platform

**API/Backend:**
- Backend framework
- Database
- API style (REST, GraphQL, etc.)
- Authentication method

**CLI Tool:**
- Programming language
- Build tools
- Package manager
- Distribution method

**Library/Package:**
- Programming language
- Target platforms
- Build tools
- Package registry

### 2. **Technology-Neutral Examples**
Instead of "React, Vue, Angular", use:
- "Framework/library name"
- Dynamic examples based on project type
- Alphabetical ordering when listing options

### 3. **Smart Defaults**
- Skip irrelevant questions
- Provide project-type-specific defaults
- Allow "None" or "N/A" options

### 4. **Enhanced Recipe System**
- Recipes should be project-type specific
- Better categorization in recipe selection
- Project type should influence recipe filtering