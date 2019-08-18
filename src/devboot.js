require('./index.css');

const main = require('./main');
const { Test } = require('./test/main');

module.exports = main.app;
module.exports.Test = Test;

Test();
