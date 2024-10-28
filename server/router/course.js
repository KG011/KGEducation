// 导入express
const express = require("express");
// 引入路由模块
const router = express.Router();
const controllers = require("../controllers/course");

router.post("/getMyCourse", controllers.getMyCourse);
router.post("/getTeacherCourse", controllers.getTeacherCourse);
router.get("/getTotalCourseApi", controllers.getTotalCourseApi);
router.post("/addNewCourseApi", controllers.addNewCourseApi);
router.post("/editCourseMenuApi", controllers.editCourseMenuApi);

// 导出router
module.exports = router;
