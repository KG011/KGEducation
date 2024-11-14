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
    console.log(data);
    console.log(data.menu_detail);

    const selectCourseIdSql = "select id from all_course where course_name=?;";
    db.query(selectCourseIdSql, data.course_name, (err, CourseId) => {
        // 执行 selectSql 语句失败
        if (err) {
            return res.send({ status: 500, msg: err.message });
        }
        const courseIdValue = CourseId[0].id
        const existingMenuSql = "SELECT * FROM course_menu WHERE course_id =?";
        db.query(existingMenuSql, courseIdValue, (err, existingMenus) => {
            if (err) {
                return res.send({ status: 500, msg: err.message });
            }
            if (existingMenus.length > 0) {
                // 如果存在已有记录，执行更新操作
                const updateSql = 'UPDATE course_menu SET course_menu =?, menu_detail =? WHERE course_id =?';
                db.query(updateSql, [data.data, data.menu_detail, courseIdValue], (err, result) => {
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
                const insertTeacherCourseSql = `INSERT INTO course_menu (course_id, course_menu, menu_detail) VALUES (?,?,?)`;
                db.query(insertTeacherCourseSql, [courseIdValue, data.data, data.menu_detail], (err, result) => {
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
//添加或更新我的新笔记
exports.addNotebookApi = (req, res) => {
    const data = req.body;
    const JsonData = JSON.stringify(data.JsonData);
    const imgUrl = data.imgUrl
    // 先查询是否存在该user_id的记录
    const checkSql = `SELECT * FROM my_notebook WHERE notebook_id =?`;
    db.query(checkSql, [data.notebook_id], (checkErr, checkResults) => {
        if (checkErr) {
            return res.send({ status: 500, msg: checkErr.message });
        }
        if (checkResults.length === 0) {
            //插入到我的笔记
            const insertMyNotebookSql = `INSERT INTO my_notebook (user_id, notebook_data,imgUrl) VALUES (?,?,?)`;
            db.query(insertMyNotebookSql, [data.userId, JsonData, imgUrl], (err, results) => {
                if (err) {
                    return res.send({ status: 500, msg: err.message });
                }
                res.send({
                    status: 200,
                    msg: "添加成功",
                });
            });
        } else {
            // 如果存在，则更新该记录的notebook_data字段
            const updateSql = `UPDATE my_notebook SET notebook_data =?, imgUrl =? WHERE notebook_id =?`;
            db.query(updateSql, [JsonData, imgUrl, data.notebook_id], (updateErr, updateResults) => {
                if (updateErr) {
                    return res.send({ status: 500, msg: updateErr.message });
                }
                res.send({
                    status: 200,
                    msg: "更新成功"
                });
            });
        }
    });

}
// 获取我的笔记
exports.getMyNotebookApi = (req, res) => {
    const selectUserSql = "SELECT real_name FROM users WHERE id=?;";
    db.query(selectUserSql, req.body.userId, (err, results) => {
        if (err) {
            return res.send({ status: 501, msg: err.message });
        }
        const user_name = results[0].real_name
        const selectNotebookSql = "SELECT * FROM my_notebook WHERE user_id=?;";
        db.query(selectNotebookSql, req.body.userId, (err, results) => {
            if (err) {
                return res.send({ status: 500, msg: err.message });
            }
            if (!results.length) {
                return res.send({ status: 200, msg: "未找到相关课程", results: [] });
            }
            res.send({
                status: 200,
                msg: "获取成功",
                notebookData: { user_name, notebookList: results },
            });
        });
    });

};
// 获取我的笔记的JSON数据
exports.getNotebookJsonDataApi = (req, res) => {
    const selectJsonDataSql = "SELECT notebook_data FROM my_notebook WHERE notebook_id=?;";
    db.query(selectJsonDataSql, req.body.notebook_id, (err, results) => {
        if (err) {
            return res.send({ status: 501, msg: err.message });
        }
        res.send({
            status: 200,
            msg: "获取成功",
            JsonData: results,
        });
    });

};
//删除我的新笔记
exports.deleteNotebookApi = (req, res) => {
    const data = req.body;
    //删除我的笔记
    const deleteMyNotebookSql = `DELETE FROM my_notebook WHERE notebook_id =?`;
    db.query(deleteMyNotebookSql, [data.notebook_id], (err, results) => {
        if (err) {
            return res.send({ status: 500, msg: err.message });
        }
        res.send({
            status: 200,
            msg: "删除成功",
        });
    });
}
//添加新的考试
exports.addExamApi = (req, res) => {
    const data = req.body;
    const exam_data = JSON.stringify(data.exam_data)
    const tags = JSON.stringify(data.tags)
    //根据课程名拿到课程对应id
    const selectCourseIdSql = "SELECT id FROM all_course WHERE course_name=?;";
    db.query(selectCourseIdSql, data.course_name, (err, results) => {
        if (err) {
            return res.send({ status: 501, msg: err.message });
        }
        const course_id = results[0].id
        // 插入到我的exam
        const insertExamSql = `INSERT INTO exam (course_id, course_name,teacher_name,exam_data,Date) VALUES (?,?,?,?,?)`;
        db.query(insertExamSql, [course_id, data.course_name, data.teacher_name, exam_data, data.Date], (err, Examresults) => {
            if (err) {
                return res.send({ status: 500, msg: err.message });
            }
            const exam_id = Examresults.insertId; // 获取插入后的自增长id值
            const selectStuSql = "SELECT * FROM student_course WHERE course_id=?;";
            db.query(selectStuSql, course_id, (err, StuResults) => {
                if (err) {
                    return res.send({ status: 501, msg: err.message });
                }
                const selectStuNameSql = "SELECT real_name FROM users WHERE id=?;";
                const insertExamTableSql = `INSERT INTO exam_table (course_id, course_name,student_name,grade,tags,Date,exam_id) VALUES (?,?,?,?,?,?,?)`;

                StuResults.forEach((item) => {
                    db.query(selectStuNameSql, item.student_id, (err, stu) => {
                        if (err) {
                            return res.send({ status: 501, msg: err.message });
                        }
                        const student_name = stu[0].real_name
                        db.query(insertExamTableSql, [course_id, data.course_name, student_name, data.grade, tags, data.Date,exam_id], (err, results) => {
                            if (err) {
                                return res.send({ status: 500, msg: err.message });
                            }
                        });
                    })
                })

            })
            res.send({
                status: 200,
                msg: "添加考试到Exam表成功",
            });
        });


    })

}
//获取考试待办
exports.getBacklogExamApi = (req, res) => {
    // 根据 student_id 在 student_menu 表中查询 course_id 数组
    const selectCourseIdsSql = "SELECT course_id FROM student_course WHERE student_id =?;";
    db.query(selectCourseIdsSql, req.body.student_id, (err, courseResults) => {
        if (err) {
            return res.send({ status: 501, msg: err.message });
        }
        if (!courseResults.length) {
            return res.send({ status: 200, msg: "未找到相关课程", results: [] });
        }
        const courseIds = courseResults.map(result => result.course_id);
        const examDataPromises = [];
        // 遍历每个 course_id，在 exam 表中查询数据
        courseIds.forEach(courseId => {
            const selectExamSql = "SELECT * FROM exam WHERE course_id =?;";
            const examPromise = new Promise((resolve, reject) => {
                db.query(selectExamSql, courseId, (err, examResults) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(examResults);
                    }
                });
            });
            examDataPromises.push(examPromise);
        });
        // 等待所有 exam 查询完成
        Promise.all(examDataPromises)
            .then(examResultsArray => {
                const flattenedExamResults = [].concat(...examResultsArray);
                res.send({
                    status: 200,
                    msg: "获取成功",
                    examData: flattenedExamResults
                });
            })
            .catch(err => {
                return res.send({ status: 500, msg: err.message });
                console.log(req.body);
                const exam_data = JSON.stringify(req.body.exam_data)
                console.log(exam_data);
            });
    });
};
//学员提交考试答卷
exports.submitExamApi = (req, res) => {
    const data = req.body;
    const answer_data = JSON.stringify(data.answer_data)
    const tags = JSON.stringify(data.tags)
    const updateTagsSql = 'UPDATE exam_table SET tags =? WHERE course_name =? AND student_name =?;';
    db.query(updateTagsSql, [tags, data.course_name, data.student_name], (err, results) => {
        if (err) {
            return res.send({ status: 501, msg: err.message });
        }
    });
    //插入到exam_check表
    const insertExamCheckSql = `INSERT INTO exam_check (student_id, course_name,teacher_name,answer_data,student_name,exam_id,totalGrade) VALUES (?,?,?,?,?,?,?)`;
    db.query(insertExamCheckSql, [data.student_id, data.course_name, data.teacher_name, answer_data, data.student_name, data.exam_id,data.totalGrade], (err, results) => {
        if (err) {
            return res.send({ status: 500, msg: err.message });
        }
        res.send({
            status: 200,
            msg: "添加考试到Exam_check表成功",
        });
    });

}
//获取考试待办
exports.getBacklogExamTeaApi = (req, res) => {
    const selectExamSql = "SELECT * FROM exam WHERE exam_id=?;";
    db.query(selectExamSql, req.body.exam_id, (err, results) => {
        if (err) {
            return res.send({ status: 501, msg: err.message });
        }
        res.send({
            status: 200,
            msg: "获取成功",
            examList: results,
        });
    });

};
// 获取我的待修改课程
exports.getMyExamCheckApi = (req, res) => {
    const selectExamSql = "SELECT * FROM exam WHERE teacher_name=?;";
    db.query(selectExamSql, req.body.teacher_name, (err, results) => {
        if (err) {
            return res.send({ status: 501, msg: err.message });
        }
        res.send({
            status: 200,
            msg: "获取成功",
            examList: results,
        });
    });

};
// 获取是否已经答题
exports.checkIsHaveExamApi = (req, res) => {
    const { examId_list,student_id } = req.body;
    const resultMap = {};
    const checkExistenceForEachId = (examId) => {
        const selectExamSql = "SELECT * FROM exam_check WHERE exam_id=? AND student_id=?;";
        db.query(selectExamSql, [examId,student_id], (err, results) => {
            if (err) {
                return res.send({ status: 501, msg: err.message });; 
            }
            resultMap[examId] = results.length > 0;
            // 检查是否所有的exam_id都已经查询完成，如果都完成了则返回结果
            if (Object.keys(resultMap).length === examId_list.length) {
                res.send({
                    status: 200,
                    msg: "获取成功",
                    examList: resultMap
                });
            }
        });
    };
    examId_list.forEach(checkExistenceForEachId);

};

// 获取课程详细信息
exports.getExamCheckApi = (req, res) => {
    const data = req.body
    const selectExamSql = "SELECT * FROM exam_check WHERE student_name=? AND exam_id =?;";
    db.query(selectExamSql, [data.student_name, data.exam_id], (err, result) => {
        if (err) {
            return res.send({ status: 501, msg: err.message });
        }
        res.send({
            status: 200,
            msg: "获取成功",
            exam_data: result,
        });
    });

};
// 获取课程Table学生信息
exports.getExamTableApi = (req, res) => {
    const data = req.body
    const selectExamTableSql = "SELECT * FROM exam_table WHERE course_name=? AND exam_id=?;";
    db.query(selectExamTableSql, [data.course_name, data.exam_id], (err, results) => {
        if (err) {
            return res.send({ status: 501, msg: err.message });
        }
        res.send({
            status: 200,
            msg: "获取成功",
            tableData: results,
        });
    });

};
//修改答卷
exports.editExamApi = (req, res) => {
    const { student_name, exam_id, newGrade, newTags } = req.body;
    const tags = JSON.stringify(newTags)
    const updateSql = 'UPDATE exam_table SET grade =?, tags =? WHERE student_name =? AND exam_id =?';
    db.query(updateSql, [newGrade, tags, student_name, exam_id], (err, results) => {
        if (err) {
            return res.send({ status: 501, msg: err.message });
        }
        res.send({
            status: 200,
            msg: "更新成功",
        });
    });
};

//插入到exam_grade表,生成可视化图表
exports.sumbitGradeApi = (req, res) => {
    const data = req.body
    const student_list = JSON.stringify(data.student_list)
    const grade_list = JSON.stringify(data.grade_list)
    // 首先查询是否已存在相同exam_id的记录
    const checkExistSql = `SELECT * FROM exam_grade WHERE exam_id =?`;
    db.query(checkExistSql, [data.exam_id], (checkErr, checkResults) => {
        if (checkErr) {
            return res.send({ status: 500, msg: checkErr.message });
        }
        if (checkResults.length > 0) {
            // 如果存在，执行更新操作
            const updateExamGradeSql = `UPDATE exam_grade SET student_list =?, grade_list =?, totalGrade=? WHERE exam_id =?`;
            db.query(updateExamGradeSql, [student_list, grade_list,data.totalGrade, data.exam_id], (updateErr, updateResults) => {
                if (updateErr) {
                    return res.send({ status: 500, msg: updateErr.message });
                }
                res.send({
                    status: 200,
                    msg: "更新Exam_grade表中对应考试信息成功",
                });
            });
        } else {
            // 如果不存在，执行插入操作
            const insertExamGradeSql = `INSERT INTO exam_grade (student_list, grade_list, exam_id,totalGrade) VALUES (?,?,?,?)`;
            db.query(insertExamGradeSql, [student_list, grade_list, data.exam_id,data.totalGrade], (insertErr, insertResults) => {
                if (insertErr) {
                    return res.send({ status: 500, msg: insertErr.message });
                }
                const insertExamGradeListSql = `INSERT INTO exam_grade_list (exam_id,course_name,Date) VALUES (?,?,?)`;
                db.query(insertExamGradeListSql, [data.exam_id, data.course_name, data.Date], (insertListErr, insertResults) => {
                    if (insertListErr) {
                        return res.send({ status: 500, msg: insertErr.message });
                    }
                    res.send({
                        status: 200,
                        msg: "添加考试到Exam_grade表成功",
                    });
                });

            });
        }
    });
}


// 获取可视化图数据信息
exports.getGradeListapi = (req, res) => {
    const selectSql = "select * from exam_grade_list;";
    db.query(selectSql, (err, results) => {
        // 执行 selectSql 语句失败
        if (err) {
            return res.send({ status: 500, msg: err.message });
        }
        res.send({
            status: 200,
            msg: "获取成功",
            gradeList: results,
        });
    });
}
// 获取可视化图数据信息
exports.getExamGradeApi = (req, res) => {
    const data = req.body
    const selectExamGradeSql = "SELECT * FROM exam_grade WHERE exam_id=?;";
    db.query(selectExamGradeSql, [data.exam_id], (err, results) => {
        if (err) {
            return res.send({ status: 501, msg: err.message });
        }
        res.send({
            status: 200,
            msg: "获取成功",
            exam_grade: results,
        });
    });

}

