'use strict';

// Minimal bearer token middleware aligned with OpenAPI securitySchemes.bearerAuth.
// Actual JWT verification against Supabase can be added later.

function requireAuth(req, res, next) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid Authorization header' });
  }

  const token = authHeader.substring('Bearer '.length).trim();
  if (!token) {
    return res.status(401).json({ message: 'Missing bearer token' });
  }

  // TODO: Optionally verify JWT with Supabase or another verifier and attach user info to req.user.
  req.token = token;
  next();
}

module.exports = {
  requireAuth,
};
