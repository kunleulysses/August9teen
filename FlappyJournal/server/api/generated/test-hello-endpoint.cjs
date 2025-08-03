
export const path = '/api/test/hello';
export const method = 'GET';

export function handler(req, res) {
    res.json({
        message: 'Hello from auto-generated endpoint!',
        timestamp: new Date(),
        method: req.method,
        path: req.path
    });
}

export const middleware = [];

export default { path, method, handler, middleware };
