const router = require('koa-router');
const moment = require('moment');

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
    this.router.param('id', async (id, ctx, next) => {
      ctx.state.id = id;
      await next();
    });

    this.router.get('/teetimes', this.getTeeTimes.bind(this));
    this.router.put('/teetimes', this.putTeeTimes.bind(this));
    this.router.delete('/teetimes/:id', this.deleteTeeTimes.bind(this));

    this.router.get('/members/:id', this.getMember.bind(this));
    this.router.get('/members/:id/teetimes', this.getMemberTeetimes.bind(this));

    this.app.use(this.router.routes())
      .use(this.router.allowedMethods());
  }

  async getTeeTimes(ctx, next) {
    ctx.status = 200;
    ctx.body = { message: 'hi' };
  }

  async putTeeTimes(ctx, next) {
    let body = ctx.request.body;
    console.log(ctx.request.body);

    let d = moment(body.Date);

    ctx.assert([0, 7, 15, 22, 30, 37, 45, 52].includes(d.minutes()), 400, 'The date\'s minutes must be one of 0, 7, 15, 22, 30, 37, 45, or 52');

    let res = await this.client.manager.reserveTeeTime(body.MemberID, body.PlayerCount, body.CartCount, body.Date);
    ctx.assert(!res.error,
      400, res.err ? (res.err.errors
        ? `Validation Error(s): ${res.err.errors.map(e => e.message).join(', ')}`
        : res.err.message)
        : 'Invalid Request');
    ctx.status = 200;
    ctx.body = { message: 'OK' };
  }

  async deleteTeeTimes(ctx, next) {
    let res = await this.client.manager.cancelTeeTime(ctx.state.id);
    ctx.assert(res,
      400, 'Invalid request');
    ctx.status = 200;
    ctx.body = { message: 'OK' };
  }

  async getMember(ctx, next) {
    let member = await this.client.manager.getMember(ctx.state.id);
    ctx.assert(member, 404, 'Member not found');
    ctx.status = 200;
    ctx.body = member.dataValues;
  }

  async getMemberTeetimes(ctx, next) {
    let teetimes = await this.client.manager.listMemberTeeTimes(ctx.state.id);
    ctx.status = 200;
    ctx.body = teetimes.map(tt => tt.dataValues);
  }
};
