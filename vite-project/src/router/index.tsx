import { Route, Routes } from 'react-router-dom';
import Login from '@/view/login'
import Register from '@/view/register'
import Home from '@/view/home'
import Default from '@/view/default'
import UserList from '@/view/userList'
import Course from '@/view/default/course'
import CoursePortal from '@/view/default/CoursePortal';
import CourseMembers from '@/view/default/courseMembers';
import JobPosting from '@/view/JobPosting';
import Exam from '@/view/exam';
import Notebook from '@/view/notebook';
import AntvX6 from '@/view/antvX6';
// 通用路由渲染组件
function RouterWrapper() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/antvX6" element={<AntvX6 />} />
      <Route path="/home" element={<Home />} >
        <Route index element={<Default />} />
        <Route path="default" element={<Default />} ></Route>
        <Route path="userList" element={<UserList />} />
        <Route path="course" element={<Course />} />
        <Route path="courseMembers" element={<CourseMembers/>} />
        <Route path="coursePortal/:courseName" element={<CoursePortal />} />
        <Route path="JobPosting" element={<JobPosting/>} />
        <Route path="exam" element={<Exam/>} />
        <Route path="notebook" element={<Notebook/>} />
      </Route>
    </Routes>
  );
}


export default RouterWrapper;