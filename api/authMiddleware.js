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

  req.token = token;

  // Best-effort decode of JWT payload so routes can derive the current user id.
  // This does NOT verify the signature and should not be used for high-security checks,
  // but is sufficient for this class project.
  try {
    const parts = token.split('.');
    if (parts.length === 3) {
      const payloadJson = Buffer.from(parts[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
      const payload = JSON.parse(payloadJson);
      if (payload && (payload.sub || payload.user_id)) {
        req.user = { id: payload.sub || payload.user_id };
      }
    }
  } catch (e) {
    // Ignore decode errors; req.user will simply be undefined.
  }

  next();
}

module.exports = {
  requireAuth,
};
