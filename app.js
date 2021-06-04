const Koa = require("koa");
const Router = require("@koa/router");
const logger = require("koa-logger");
const cors = require("koa2-cors");
const bodyParser = require("koa-bodyparser");
const koaJwt = require("koa-jwt");
const jwt = require("jsonwebtoken");
const mysql = require("./mysql/index");
const config = require("./config/index");

const app = new Koa();
const router = new Router();

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

//登录
router.post("/login", async (ctx) => {
  const data = ctx.request.body;
  if (!data.phone || !data.password) {
    return (ctx.body = {
      code: "2",
      data: null,
      msg: "参数不合法",
    });
  }
  const result = await mysql.login({
    phone: data.phone,
    password: data.password,
  });
  if (result !== null && result.length > 0) {
    const token = jwt.sign(
      {
        name: result.name,
        _id: result._id,
      },
      "my_token",
      { expiresIn: "2h" }
    );
    return (ctx.body = {
      code: "1",
      data: {
        token: token,
      },
      msg: "登录成功",
    });
  } else {
    return (ctx.body = {
      code: "2",
      data: null,
      msg: "用户名或密码错误",
    });
  }
});

router.get("/getUserInfo", async (ctx) => {
  let data = await mysql.getUserInfo();
  ctx.body = {
    code: 1,
    data: data,
    message: "ok",
  };
});

router.get("/getList", async (ctx) => {
  let data = await mysql.getList();
  ctx.body = {
    code: 1,
    data: data,
    message: "ok",
  };
});

app.use(router.routes()).use(router.allowedMethods());
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
