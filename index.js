#!/usr/bin/env node

/**
 * Entry point for the Agent Rules Generator CLI
 * This file serves as the main executable for the npm package
 */

// const { AgentRulesGenerator } = require('./agent_rules_cli.js');
const { AgentRulesGenerator } = require('./enhanced_cli.js');
// Create and initialize the generator
const generator = new AgentRulesGenerator();

// Handle uncaught exceptions gracefully
process.on('uncaughtException', (error) => {
  console.error('An unexpected error occurred:', error.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the application
generator.init().catch((error) => {
  console.error('Failed to start the application:', error.message);
  process.exit(1);
});