const jwt = require("jsonwebtoken");
const mysql = require("../mysql");

// 定义登录模块
const login = {};

// 登录方法
login.login = async (ctx) => {
    debugger;
  const data = ctx.request.body;
  if (!data.phone || !data.password) {
    return (ctx.body = {
      code: "2",
      data: null,
      msg: "手机号或密码不能为空",
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
};

module.exports = login;
