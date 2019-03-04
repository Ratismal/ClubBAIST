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

    this.router.post('/login', this.login.bind(this));

    this.router.get('/teetimes', this.getTeeTimes.bind(this));
    this.router.get('/teesheet', this.getTeeSheet.bind(this));
    this.router.put('/teetimes', this.putTeeTimes.bind(this));
    this.router.delete('/teetimes/:id', this.deleteTeeTimes.bind(this));

    this.router.post('/standingteetimes/:id/approve', this.approveStandingTeeTimes.bind(this));
    this.router.put('/standingteetimes', this.putStandingTeeTimes.bind(this));
    this.router.get('/standingteetimes', this.getStandingTeeTimes.bind(this));
    this.router.delete('/standingteetimes', this.clearStandingTeeTimes.bind(this));

    this.router.get('/members', this.getMembers.bind(this));
    this.router.get('/members/:id', this.getMember.bind(this));
    this.router.get('/members/:id/teetimes', this.getMemberTeeTimes.bind(this));

    this.app.use(this.router.routes())
      .use(this.router.allowedMethods());
  }

  async login(ctx, next) {
    let body = ctx.request.body;
    let matches = (await this.client.db.Member.findAll({
      where: {
        Email: body.email
      }
    }));
    let user = matches[0];

    ctx.assert(user, 404, 'nobody here');

    ctx.assert(body.password === user.Password, 401, 'go away');

    ctx.cookies.set('user-id', user.MemberID);
    ctx.body = {
      message: 'ilu'
    };
    ctx.status = 200;
  }

  async getTeeTimes(ctx, next) {
    let teetimes = await this.client.manager.listMemberTeeTimes();
    ctx.status = 200;
    ctx.body = teetimes.map(tt => tt.dataValues);
  }

  async getTeeSheet(ctx, next) {
    let query = ctx.request.query;
    let q = query.q || '';
    let teetimes = await this.client.manager.getTeeSheet(q);
    ctx.status = 200;
    ctx.body = teetimes.map(tt => tt.dataValues);
  }

  async putTeeTimes(ctx, next) {
    let body = ctx.request.body;
    console.log(ctx.request.body);

    let d = moment(body.Timeslot);

    ctx.assert([0, 7, 15, 22, 30, 37, 45, 52].includes(d.minutes()), 400, 'The date\'s minutes must be one of 0, 7, 15, 22, 30, 37, 45, or 52');

    let res = await this.client.manager.reserveTeeTime(body);
    ctx.assert(!res.error,
      400, res.message ? res.message : res.err ? (res.err.errors
        ? `Validation Error(s): ${res.err.errors.map(e => e.message).join(', ')}`
        : res.err.message)
        : 'Invalid Request');
    ctx.status = 200;
    ctx.body = { message: 'OK' };
  }

  async putStandingTeeTimes(ctx, next) {
    let body = ctx.request.body;
    console.log(ctx.request.body);

    let m = Number(body.RequestedTeeTime.match(/\d?\d:(\d?\d) (?:AM|PM)/)[1]);

    ctx.assert([0, 7, 15, 22, 30, 37, 45, 52].includes(m), 400, 'The date\'s minutes must be one of 0, 7, 15, 22, 30, 37, 45, or 52');

    let res = await this.client.manager.reserveStandingTeeTime(body);
    ctx.assert(!res.error,
      400, res.message ? res.message : res.err ? (res.err.errors
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

  async getMembers(ctx, next) {
    let query = ctx.request.query;
    let S = this.client.db.Sequelize;
    let q = query.q || '';
    console.log(query);
    let members = await this.client.db.Member.findAll({
      where: S.where(S.fn('concat', S.col('FirstName'), ' ', S.col('LastName')), {
        like: `%${q}%`
      })
    });
    ctx.body = {message: 'ok', members: members.map(m=>m.dataValues)};
    ctx.status = 200;
  }

  async getMember(ctx, next) {
    let member = await this.client.manager.getMember(ctx.state.id);
    ctx.assert(member, 404, 'Member not found');
    ctx.status = 200;
    ctx.body = member.dataValues;
  }

  async getMemberTeeTimes(ctx, next) {
    let teetimes = await this.client.manager.listMemberTeeTimes(ctx.state.id);
    ctx.status = 200;
    ctx.body = teetimes.map(tt => tt.dataValues);
  }

  async getStandingTeeTimes(ctx, next) {
    let teetimes = await this.client.manager.getStandingTeeTimes();
    ctx.status = 200;
    ctx.body = teetimes.map(tt => tt.dataValues);
  }

  async approveStandingTeeTimes(ctx, next) {
    let teetimes = await this.client.manager.approveStandingTeeTimes(ctx.state.id, ctx.request.body);
    ctx.status = 200;
    ctx.body = {ok: true};
  }

  async clearStandingTeeTimes(ctx, next) {
    await this.client.manager.clearStandingTeeTimes();
    ctx.status = 200;
    ctx.body = {ok: true};
  }
};
