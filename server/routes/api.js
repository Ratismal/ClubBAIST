const router = require('koa-router');

module.exports = class ApiRoute {
  constructor(client, app) {
    this.client = client;
    this.app = app;
    this.router = new router({
      prefix: '/api'
    });

    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/teetimes', this.getTeeTimes.bind(this));
    this.router.put('/teetimes', this.getTeeTimes.bind(this));
    this.router.delete('/teetimes', this.getTeeTimes.bind(this));

    this.app.use(this.router.routes())
      .use(this.router.allowedMethods());
  }

  async getTeeTimes(ctx, next) {
    ctx.status = 200;
    ctx.body = { message: 'hi' };
  }

  async putTeeTimes(ctx, next) {

  }

  async deleteTeeTimes(ctx, next) {

  }


};
