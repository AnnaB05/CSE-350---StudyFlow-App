//this sets up the jest testing environment to run in node.js and not in a browser-like environment
export default {
  testEnvironment: 'node',
  transform: {}, //tells Jest to run native JavaScript without extra heavy compiling layers
  testMatch: ['**/?(*.)+(spec|test).js'] //scans for files ending in test.js
};