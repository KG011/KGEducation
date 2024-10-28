const db = require("../config/db/index"); // 导入数据库操作模块
// 获取学生的课程表
exports.getMyCourse = (req, res) => {
    const selectStudentSql = "SELECT course_id FROM student_course WHERE student_id=?;";
    db.query(selectStudentSql, req.body.userId, (err, stuCourseResults) => {
        if (err) {
            return res.send({ status: 500, msg: err.message });
        }
        if (!stuCourseResults.length) {
            return res.send({ status: 200, msg: "未找到相关课程", courseList: [] });
        }
        const courseIdArray = stuCourseResults.map(result => result.course_id);

        // 2. 根据课程 ID 数组在 all_course 表中查找课程信息

        const selectAllCoursesSql = `SELECT * FROM all_course WHERE id IN (${courseIdArray.map(id => '?').join(',')});`;
        db.query(selectAllCoursesSql, courseIdArray, (err, allCourseResults) => {
            if (err) {
                return res.send({ status: 500, msg: err.message });
            }
            res.send({
                status: 200,
                msg: "获取成功",
                courseList: allCourseResults,
            });
        });
    });
};
// 获取老师的课程表
exports.getTeacherCourse = (req, res) => {
    const selectTeacherSql = "SELECT * FROM teacher_course WHERE teacher_id=?;";
    db.query(selectTeacherSql, req.body.userId, (err, teaCourseResults) => {
        if (err) {
            return res.send({ status: 500, msg: err.message });
        }
        if (!teaCourseResults.length) {
            return res.send({ status: 200, msg: "未找到相关课程", courseList: [] });
        }
        res.send({
            status: 200,
            msg: "获取成功",
            courseList: teaCourseResults,
        });
    });
};
//获取总的课程表
exports.getTotalCourseApi = (req, res) => {
    const selectSql = "select * from all_course;";
    db.query(selectSql, (err, results) => {
        // 执行 selectSql 语句失败
        if (err) {
            return res.send({ status: 500, msg: err.message });
        }
        res.send({
            status: 200,
            msg: "获取成功",
            courseList: results,
        });
    });
};
//添加新课程表
exports.addNewCourseApi = async (req, res) => {
    const data = req.body;
    const teacher_id = data.teacher_id
    const teacher_name = data.teacher_name
    const courses = data.data.课程 || [];
    for (const course of courses) {
        const courseName = course.课程名;
        //插入老师课程表
        const insertTeacherCourseSql = `INSERT INTO teacher_course (course_name, teacher_id,teacher_name) VALUES (?,?,?)`;
        try {
            db.query(insertTeacherCourseSql, [courseName, teacher_id, teacher_name], (err, teacherRes) => {
                if (err) {
                    return res.send({ status: 500, msg: err.message });
                }
                // 插入总课程表
                const insertAllCourseSql = `INSERT INTO all_course (course_name, teacher_id,teacher_name) VALUES (?,?,?)`;
                db.query(insertAllCourseSql, [courseName, teacher_id, teacher_name], (err, allCourseRes) => {
                    if (err) {
                        console.log(1);

                        return res.send({ status: 500, msg: err.message });
                    }
                    const insertedId = allCourseRes.insertId;
                    for (const member of course.成员) {
                        const studentName = member.学生名;
                        // 查询用户表获取学生 id
                        const selectUserSql = `SELECT id FROM users WHERE real_name =?`;
                        db.query(selectUserSql, [studentName], (err, userRes) => {
                            if (err) {
                                return res.send({ status: 500, msg: err.message });
                            }
                            if (userRes.length === 0) {
                                return res.send({ status: 501, msg: `找不到学生名为 ${studentName} 的用户` });
                            }
                            const studentId = userRes[0].id;

                            // 插入 student_course 表
                            const insertStudentCourseSql = `INSERT INTO student_course (student_id,course_id) VALUES (?,?)`;
                            db.query(insertStudentCourseSql, [studentId, insertedId], (err, studentRes) => {
                                if (err) {
                                    return res.send({ status: 500, msg: err.message });
                                }

                            });
                        });
                    }
                });
            });
        } catch (error) {
            res.send({ status: 500, msg: error.message });
        }

    }
}
//修改课程目录
exports.editCourseMenuApi = (req, res) => {
    const data = req.body
    const selectCourseIdSql = "select id from all_course where course_name=?;";
    db.query(selectCourseIdSql, data.course_name, (err, CourseId) => {
        // 执行 selectSql 语句失败
        if (err) {
            return res.send({ status: 500, msg: err.message });
        }
        const courseIdValue=CourseId[0].id
        const existingMenuSql = "SELECT * FROM course_menu WHERE course_id =?";
        db.query(existingMenuSql, courseIdValue, (err, existingMenus) => {
            if (err) {
                return res.send({ status: 500, msg: err.message });
            }
            if (existingMenus.length > 0) {
                // 如果存在已有记录，执行更新操作
                const updateSql = `UPDATE course_menu SET course_menu =? WHERE course_id =?`;
                db.query(updateSql, [data.data, courseIdValue], (err, result) => {
                    if (err) {
                        return res.send({ status: 500, msg: err.message });
                    }
                    res.send({
                        status: 200,
                        msg: "修改成功",
                    });
                });
            } else {
                // 如果不存在已有记录，执行插入操作
                const insertTeacherCourseSql = `INSERT INTO course_menu (course_id, course_menu) VALUES (?,?)`;
                db.query(insertTeacherCourseSql, [courseIdValue, data.data], (err, result) => {
                    // 执行 selectSql 语句失败
                    if (err) {
                        return res.send({ status: 500, msg: err.message });
                    }
                    res.send({
                        status: 200,
                        msg: "修改成功",
                    });
                });
            }
        });

    });
};
exports.agreeFriend = (req, res) => {
    const insertSql = `INSERT INTO user_friend (userId, friendId, friendName) VALUES (?,?,?)`;
    db.query(insertSql, [req.body.userId, req.body.friendId, req.body.friendName], (err, results) => {
        // 执行 selectSql 语句失败
        if (err) {
            return res.send({ status: 500, msg: err.message });
        }
        res.send({
            status: 200,
            msg: "成功",
        });
    });
};
exports.deleteRequest = (req, res) => {
    const values = [req.body.username, req.body.friendname];
    const deleteSql = 'DELETE FROM friend_request WHERE username = ? AND friendname = ?'
    db.query(deleteSql, values, (err, results) => {
        // 执行 selectSql 语句失败
        if (err) {
            return res.send({ status: 500, msg: err.message });
        }
        res.send({
            status: 200,
            msg: "成功",
        });
    });
};

