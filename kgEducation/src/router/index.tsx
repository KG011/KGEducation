import { Navigate, Route, Routes } from 'react-router-dom';
import Login from '@/view/login'
import Register from '@/view/register'
import Home from '@/view/home'
import Default from '@/view/default'
import UserList from '@/view/userList'
import Course from '@/view/default/course'
import CoursePortal from '@/view/default/CoursePortal';
import CourseMembers from '@/view/default/courseMembers';
import JobPosting from '@/view/JobPosting';
import Backlog from '@/view/backlog';
import Notebook from '@/view/notebook';
import AntvX6 from '@/view/antvX6';
import Check from '@/view/check';
import CheckDetail from '@/view/check/adminCheck/checkDetail';
import EditExam from '@/view/check/adminCheck/editExam';
import Grade from '@/view/grade';
import GradeDetail from '@/view/grade/gradeDetail';
import NewFriend from '@/view/userList/newFriend';
import RequestHandling from '@/view/userList/requestHandling';
import Group from '@/view/userList/group';
import Personal from '@/view/personal';
// 通用路由渲染组件
function RouterWrapper() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/antvX6" element={<AntvX6 />} />
      <Route path="editExam" element={<EditExam />} />
      <Route path="/home" element={<Home />} >
        <Route index element={<Navigate to="default" />} />
        <Route path="default" element={<Default />} ></Route>
        <Route path="userList" element={<UserList />} />
        <Route path="course" element={<Course />} />
        <Route path="courseMembers" element={<CourseMembers />} />
        <Route path="coursePortal/:courseName" element={<CoursePortal />} />
        <Route path="JobPosting" element={<JobPosting />} />
        <Route path="backlog" element={<Backlog />} />
        <Route path="check" element={<Check />}/>
        <Route path="check/detail" element={<CheckDetail />} />
        <Route path="notebook" element={<Notebook />} />
        <Route path="grade" element={<Grade />} />
        <Route path="gradeDetail" element={<GradeDetail />} />
        <Route path="newFriend" element={<NewFriend />} />
        <Route path="requestHandling" element={<RequestHandling />} />
        <Route path="group" element={<Group />} />
        <Route path="personal" element={<Personal />} />
        
      </Route>
    </Routes>
  );
}


export default RouterWrapper;