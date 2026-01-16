// Polyfill for deprecated util.isNullOrUndefined (removed in Node.js 17+)
// Must be CommonJS (.cjs) to be loaded via --require before ESM modules
const util = require('util');
if (!util.isNullOrUndefined) {
  util.isNullOrUndefined = (value) => value === null || value === undefined;
}
console.log('✅ util.isNullOrUndefined polyfill applied');
