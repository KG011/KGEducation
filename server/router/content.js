// 导入express
const express = require("express");
// 引入路由模块
const router = express.Router();
const controllers = require("../controllers/content");

//获取编辑数据
router.post("/insertContent", controllers.insertContent);
router.post("/getContent", controllers.getContent);
router.post("/getGroupContent", controllers.getGroupContent);
router.post("/insertGroupContent", controllers.insertGroupContent);
// router.post("/addEditData", controllers.addEditData);
// router.post("/updateEditData", controllers.updateEditData);
// 导出router
module.exports = router;