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
router.post("/addNotebookApi", controllers.addNotebookApi);
router.post("/getMyNotebookApi", controllers.getMyNotebookApi);
router.post("/getNotebookJsonDataApi", controllers.getNotebookJsonDataApi);
router.post("/deleteNotebookApi", controllers.deleteNotebookApi);
router.post("/addExamApi", controllers.addExamApi);
router.post("/getBacklogExamApi", controllers.getBacklogExamApi);
router.post("/submitExamApi", controllers.submitExamApi);
router.post("/getMyExamCheckApi", controllers.getMyExamCheckApi);
router.post("/getExamCheckApi", controllers.getExamCheckApi);
router.post("/getExamTableApi", controllers.getExamTableApi);
// 导出router
module.exports = router;
