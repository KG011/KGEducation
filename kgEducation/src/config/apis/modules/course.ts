import fetch from '@/config/fetch/index.ts';

//我的课程列表
export const getMyCourseApi = (data: User) => {
    return fetch.post('/course/getMyCourse', data)
}
//我的课程列表
export const getTeacherCourse = (data: User) => {
    return fetch.post('/course/getTeacherCourse', data)
}
//全部的课程列表
export const getTotalCourseApi = () => {
    return fetch.get('/course/getTotalCourseApi')
}
//新建课程列表
export const addNewCourseApi = (data:object) => {
    return fetch.post('/course/addNewCourseApi',data)
}
//修改课程目录
export const editCourseMenuApi = (data:object) => {
    return fetch.post('/course/editCourseMenuApi',data)
}
//添加到我的笔记
export const addNotebookApi = (data:object) => {
    return fetch.post('/course/addNotebookApi',data)
}
//获取我的笔记
export const getMyNotebookApi = (data:object) => {
    return fetch.post('/course/getMyNotebookApi',data)
}
//获取笔记的画布数据用于渲染
export const getNotebookJsonDataApi = (data:object) => {
    return fetch.post('/course/getNotebookJsonDataApi',data)
}
//删除笔记
export const deleteNotebookApi = (data:object) => {
    return fetch.post('/course/deleteNotebookApi',data)
}
//添加考试
export const addExamApi = (data:object) => {
    return fetch.post('/course/addExamApi',data)
}
//获取待办考试
export const getBacklogExamApi = (data:object) => {
    return fetch.post('/course/getBacklogExamApi',data)
}
//获取待办考试
export const getBacklogExamTeaApi = (data:object) => {
    return fetch.post('/course/getBacklogExamTeaApi',data)
}
//获取待办考试
export const submitExamApi = (data:object) => {
    return fetch.post('/course/submitExamApi',data)
}
//获取待修改考试信息
export const getMyExamCheckApi = (data:object) => {
    return fetch.post('/course/getMyExamCheckApi',data)
}
//获取待修改课程信息
export const getExamCheckApi = (data:object) => {
    return fetch.post('/course/getExamCheckApi',data)
}
//获取课程Table学生信息
export const getExamTableApi = (data:object) => {
    return fetch.post('/course/getExamTableApi',data)
}
//修改学员答卷
export const editExamApi = (data:object) => {
    return fetch.post('/course/editExamApi',data)
}

//提交可视化图数据
export const sumbitGradeApi = (data:object) => {
    return fetch.post('/course/sumbitGradeApi',data)
}
//获取可视化图数据列表
export const getGradeListapi = () => {
    return fetch.get('/course/getGradeListapi')
}

//获取可视化图数据
export const getExamGradeApi = (data:object) => {
    return fetch.post('/course/getExamGradeApi',data)
}

//检查是否已经答题
export const checkIsHaveExamApi = (data:object) => {
    return fetch.post('/course/checkIsHaveExamApi',data)
}
//获取课程学员名单
export const getCourseMemberApi = (data:object) => {
    return fetch.post('/course/getCourseMemberApi',data)
}

//获取课程学员名单
export const getStudentListApi = () => {
    return fetch.get('/course/getStudentListApi')
}

//邀请学员
export const onInviteStuApi = (data:object) => {
    return fetch.post('/course/onInviteStuApi',data)
}












