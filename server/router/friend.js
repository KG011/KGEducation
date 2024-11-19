// 导入express
const express = require("express");
// 引入路由模块
const router = express.Router();
const controllers = require("../controllers/friend");

router.post("/friendList", controllers.getFriendList);
router.post("/getGroupListApi", controllers.getGroupListApi);
router.post("/getMessageListApi", controllers.getMessageListApi);
router.post("/getGroupMessageApi", controllers.getGroupMessageApi);
router.post("/appendMessageApi", controllers.appendMessageApi);
router.post("/appendGroupMessageApi", controllers.appendGroupMessageApi);
router.get("/getAllUserApi", controllers.getAllUserApi);
router.post("/sendRequsetApi", controllers.sendRequsetApi);
router.post("/getRequestApi", controllers.getRequestApi);



// 导出router
module.exports = router;
