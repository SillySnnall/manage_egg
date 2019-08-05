'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  app.router.redirect('/', '/index.html', 302);
  router.post('/index', controller.indexC.index);
  router.get('/test', controller.testC.index);
};
