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


