// 导入express
const express = require("express");
// 引入路由模块
const router = express.Router();
// 导入用户路由的处理函数
const userHandler = require("../controllers/user");
// 导入验证数据的中间件
const expressJoi = require("@escook/express-joi");
const verifyToken = require("../middlewares/verifyToken");
// const { login_schema, username_schema } = require("../tools/schema/user");

// 导入验证规则对象
const { reg_login_schema } = require("../schema/user");

// 注册新用户
router.post("/register", expressJoi(reg_login_schema), userHandler.register);

// 登录
router.post("/login",  userHandler.login);

router.post("/userInfo",userHandler.userInfo);

// 搜锁用户
router.post("/searchFriend",userHandler.searchFriend);

router.post("/register",userHandler.register);

router.post("/getPersonlApi",userHandler.getPersonlApi);


// 导出router
module.exports = router;
