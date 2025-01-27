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
router.post("/getBacklogExamTeaApi", controllers.getBacklogExamTeaApi);
router.post("/submitExamApi", controllers.submitExamApi);
router.post("/getMyExamCheckApi", controllers.getMyExamCheckApi);
router.post("/getExamCheckApi", controllers.getExamCheckApi);
router.post("/getExamTableApi", controllers.getExamTableApi);
router.post("/editExamApi", controllers.editExamApi);
router.post("/sumbitGradeApi", controllers.sumbitGradeApi);
router.get("/getGradeListapi", controllers.getGradeListapi);
router.post("/getExamGradeApi", controllers.getExamGradeApi);
router.post("/checkIsHaveExamApi", controllers.checkIsHaveExamApi);
router.post("/getCourseMemberApi", controllers.getCourseMemberApi);
router.get("/getStudentListApi", controllers.getStudentListApi);
router.post("/onInviteStuApi", controllers.onInviteStuApi);
router.post("/getTreeDataApi", controllers.getTreeDataApi);
router.post("/getMenuDetailApi", controllers.getMenuDetailApi);

// 导出router
module.exports = router;
