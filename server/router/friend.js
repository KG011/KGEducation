// 导入express
const express = require("express");
// 引入路由模块
const router = express.Router();
const controllers = require("../controllers/friend");

router.post("/friendList", controllers.getFriendList);
router.post("/getMessageListApi", controllers.getMessageListApi);
router.post("/appendMessageApi", controllers.appendMessageApi);


// 导出router
module.exports = router;
