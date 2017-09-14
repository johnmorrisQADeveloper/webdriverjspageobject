exports.testEnv = function() {
    var node_env = process.env.browser || 'chrome';
    return node_env;
};