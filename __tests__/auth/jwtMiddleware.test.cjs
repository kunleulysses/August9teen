const { authMiddleware } = require('../../server/api/auth.cjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');

// Mock the dependencies
jest.mock('fs');
jest.mock('../../server/common/logger.cjs', () => ({
  warn: jest.fn(),
}));
jest.mock('../../server/api/metrics.cjs', () => ({
  authErrors: {
    inc: jest.fn(),
  },
}));

describe('authMiddleware', () => {
  let req, res, next;
  const privateKey = 'private-key';
  const publicKey = 'public-key';

  beforeAll(() => {
    fs.readFileSync.mockReturnValue(publicKey);
  });

  beforeEach(() => {
    req = {
      headers: {},
      method: 'POST',
      path: '/api/some-protected-route',
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call next() if the token is valid', () => {
    const token = jwt.sign({ user: 'test' }, privateKey, { algorithm: 'RS256' });
    req.headers.authorization = `Bearer ${token}`;
    authMiddleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('should return 401 if the token is missing', () => {
    authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
  });

  it('should return 401 if the token is invalid', () => {
    req.headers.authorization = 'Bearer invalid-token';
    authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
  });

  it('should call next() for whitelisted routes', () => {
    req.method = 'GET';
    req.path = '/health';
    authMiddleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});