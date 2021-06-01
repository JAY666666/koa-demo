const Koa = require("koa");
const Router = require("@koa/router");
const logger = require("koa-logger");
const cors = require("koa2-cors");
const mysql = require("./mysql/index");
const config = require("./config/index");

const app = new Koa();
const router = new Router();

// 此中间件一定要在最前面，不然会产生跨域问题
app.use(
    cors({
      origin: (ctx) => {
        if (ctx.url === "/test") {
          return false;
        }
        return "*";
      },
      exposeHeaders: ["WWW-Authenticate", "Server-Authorization"],
      maxAge: 5,
      credentials: true,
      allowMethods: ["GET", "POST", "DELETE"],
      allowHeaders: ["Content-Type", "Authorization", "Accept"],
    })
  );

router.get("/getUserInfo", async (ctx) => {
  let data = await mysql.getUserInfo();
  ctx.body = {
    code: 1,
    data: data,
    message: "ok",
  };
});
router.get("/list", async (ctx) => {
  let data = await mysql.getList();
  ctx.body = {
    code: 1,
    data: data,
    message: "ok",
  };
});

app.use(router.routes()).use(router.allowedMethods());
app.use(logger);

app.listen(config.port);
