// 导入express
const express = require("express");
// 引入路由模块
const router = express.Router();
const controllers = require("../controllers/friend");

router.post("/friendList", controllers.getFriendList);
router.post("/groupList", controllers.getGroupList);
router.post("/insertGroup", controllers.insertGroup);
router.post("/addFriend", controllers.addFriend);
router.post("/getSearchRequest", controllers.getSearchRequest);
router.post("/agreeFriend", controllers.agreeFriend);
router.post("/deleteRequest", controllers.deleteRequest);

// 导出router
module.exports = router;
