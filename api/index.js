'use strict';

const express = require('express');
const cors = require('cors');

require('dotenv').config();

const systemRoutes = require('./routes.system');
const profileRoutes = require('./routes.profiles');
const goalRoutes = require('./routes.goals');
const journalRoutes = require('./routes.journal');
const expenseRoutes = require('./routes.expenses');
const clubRoutes = require('./routes.clubs');
const membershipRoutes = require('./routes.memberships');
const contractTemplateRoutes = require('./routes.contractTemplates');
const postRoutes = require('./routes.posts');
const aiRecommendationRoutes = require('./routes.aiRecommendations');

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

const port = process.env.PORT || 3000;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Wellness Buddy API listening on port ${port}`);
});
