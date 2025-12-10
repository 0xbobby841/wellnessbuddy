'use strict';

const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');
const dotenv = require('dotenv');

const systemRoutes = require('../routes.system');
const profileRoutes = require('../routes.profiles');
const goalRoutes = require('../routes.goals');
const journalRoutes = require('../routes.journal');
const expenseRoutes = require('../routes.expenses');
const clubRoutes = require('../routes.clubs');
const membershipRoutes = require('../routes.memberships');
const contractTemplateRoutes = require('../routes.contractTemplates');
const postRoutes = require('../routes.posts');
const aiRecommendationRoutes = require('../routes.aiRecommendations');

const isOffline = process.env.IS_OFFLINE === 'true' || process.env.IS_OFFLINE === '1';

// In offline mode, load environment variables from .env and skip Secrets Manager.
if (isOffline) {
  dotenv.config();
}

// Build the Express app (no app.listen here; this is for Lambda).
const app = express();

app.use(cors());
app.use(express.json());

const apiPrefix = '/api/v1';

app.use(apiPrefix, systemRoutes);
app.use(apiPrefix, profileRoutes);
app.use(apiPrefix, goalRoutes);
app.use(apiPrefix, journalRoutes);
app.use(apiPrefix, expenseRoutes);
app.use(apiPrefix, clubRoutes);
app.use(apiPrefix, membershipRoutes);
app.use(apiPrefix, contractTemplateRoutes);
app.use(apiPrefix, postRoutes);
app.use(apiPrefix, aiRecommendationRoutes);

// Fallback for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

// Basic error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Internal server error' });
});

const serverlessHandler = serverless(app);

let secretsLoadedPromise = null;

async function loadSecretsOnce() {
  if (isOffline) {
    return;
  }

  if (secretsLoadedPromise) {
    return secretsLoadedPromise;
  }

  secretsLoadedPromise = (async () => {
    const secretId = process.env.SECRETS_ID;
    if (!secretId) {
      return;
    }

    try {
      const client = new SecretsManagerClient();
      const command = new GetSecretValueCommand({ SecretId: secretId });
      const response = await client.send(command);

      if (!response.SecretString) {
        return;
      }

      const parsed = JSON.parse(response.SecretString);
      if (parsed && typeof parsed === 'object') {
        Object.entries(parsed).forEach(([key, value]) => {
          if (typeof value === 'string' && process.env[key] == null) {
            process.env[key] = value;
          }
        });
      }
    } catch (err) {
      // Never throw on cold start; just log the error.
      // eslint-disable-next-line no-console
      console.error('Failed to load secrets from AWS Secrets Manager:', err);
    }
  })();

  return secretsLoadedPromise;
}

module.exports.handler = async (event, context) => {
  await loadSecretsOnce();
  return serverlessHandler(event, context);
};
