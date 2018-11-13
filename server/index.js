
const Koa = require('koa');
const bodyparser = require('koa-bodyparser');
const CatLoggr = require('cat-loggr');

const loggr = new CatLoggr({
  level: 'debug',
  levels: [
    { name: 'fatal', color: CatLoggr._chalk.red.bgBlack, err: true },
    { name: 'error', color: CatLoggr._chalk.black.bgRed, err: true },
    { name: 'warn', color: CatLoggr._chalk.black.bgYellow, err: true },
    { name: 'trace', color: CatLoggr._chalk.green.bgBlack, trace: true },
    { name: 'info', color: CatLoggr._chalk.black.bgGreen },
    { name: 'verbose', color: CatLoggr._chalk.black.bgCyan },
    { name: 'debug', color: CatLoggr._chalk.magenta.bgBlack, aliases: ['log', 'dir'] },
    { name: 'database', color: CatLoggr._chalk.green.bgBlack }
  ]
}).setGlobal();

const { Nuxt, Builder } = require('nuxt');

const client = new (require('./Client'))();
const ApiRoute = require('./routes/api.js');

const app = new Koa();
const host = process.env.HOST || '127.0.0.1';
const port = process.env.PORT || 3000;

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js');
config.dev = !(app.env === 'production');

async function start() {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config);

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  }

  app.use(bodyparser());

  app.use(async (ctx, next) => {
    console.log(ctx.method, ctx.path);
    await next();
  });

  new ApiRoute(client, app);

  app.use(ctx => {
    ctx.status = 200; // koa defaults to 404 when it sees that status is unset

    return new Promise((resolve, reject) => {
      ctx.res.on('close', resolve);
      ctx.res.on('finish', resolve);
      nuxt.render(ctx.req, ctx.res, promise => {
        // nuxt.render passes a rejected promise into callback on error.
        promise.then(resolve).catch(reject);
      });
    });
  });

  app.listen(port, host);
  console.log({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  });
}

start();
