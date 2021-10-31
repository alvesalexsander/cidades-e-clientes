const controllers = require('../controllers/index');
const controllerRouter = require('express').Router();

controllerRouter.use(...[Object.values(controllers)]);

module.exports = controllerRouter;