const express = require('express');
const projectsRouter = require('./Projects/projectsRouter');
const actionsRouter = require('./Actions/actionsRouter');

const server = express();

server.use(express.json());

server.use('/api/projects', projectsRouter);
server.use('/api/actions', actionsRouter);

module.exports = server;

