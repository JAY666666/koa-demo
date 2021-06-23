const Koa = require("koa");
const logger = require("koa-logger");
const cors = require("koa2-cors");
const bodyParser = require("koa-bodyparser");
const koaJwt = require("koa-jwt");
const config = require("./config/index");
const router = require("./router");

const app = new Koa();

// 此中间件一定要在最前面，不然会产生跨域问题
app.use(
  cors({
    origin: "*",
    exposeHeaders: ["WWW-Authenticate", "Server-Authorization"],
    maxAge: 5,
    credentials: true,
    allowMethods: ["GET", "POST", "DELETE"],
    allowHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);

app.use(bodyParser());

app.use(router.routes(), router.allowedMethods());
// 某些路由不需token验证
app.use(
  koaJwt({
    secret: "my_app_secret",
  }).unless({
    path: [/^\/login/],
  })
);
app.use(logger);

app.listen(config.port);
