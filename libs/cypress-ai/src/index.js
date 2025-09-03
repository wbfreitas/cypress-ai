// libs/cypress-ai/src/index.js
const { registerSupportCommands } = require('./commands')
const { installCypressAiPlugin } = require('./agent')

module.exports = {
  registerSupportCommands,
  installCypressAiPlugin
}