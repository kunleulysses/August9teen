
const path = '/api/test/hello';
module.exports.path = path;
const method = 'GET';
module.exports.method = method;

function handler(req, res) {
module.exports.handler = handler;

    res.json({
        message: 'Hello from auto-generated endpoint!',
        timestamp: new Date(),
        method: req.method,
        path: req.path
    });
}

const middleware = [];
module.exports.middleware = middleware;

module.exports = { path, method, handler, middleware };
