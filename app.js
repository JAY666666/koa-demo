const Koa = require("koa");
const Router = require("@koa/router");
const logger = require("koa-logger");
const mysql = require("./mysql/index");
const config = require("./config/index");

const app = new Koa();
const router = new Router();

router.get('/', async (ctx) => {
    console.log(ctx)
    let data = await mysql.getUserInfo()
    ctx.body = {
        "code": 1,
        "data": data,
        "message": "ok"
    }
})
router.get('/list', async (ctx) => {
    let data = await mysql.getList()
    ctx.body = {
        "code": 1,
        "data": data,
        "message": "ok"
    }
})

app.use(router.routes()).use(router.allowedMethods());
app.use(logger)

app.listen(config.port);
