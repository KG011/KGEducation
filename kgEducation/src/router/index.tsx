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
import { Suspense } from 'react';
import Loading from '@/components/loading';
/**
 * 待后期优化懒加载，把左边大Men抽离出来，目前会跟着view可视区一起刷新
 * @returns 
 */
// const Login = React.lazy(() => import('@/view/login'));
// const Register = React.lazy(() => import('@/view/register'));
// const Home = React.lazy(() => import('@/view/home'));
// const Default = React.lazy(() => import('@/view/default'));
// const UserList = React.lazy(() => import('@/view/userList'));
// const Course = React.lazy(() => import('@/view/default/course'));
// const CoursePortal = React.lazy(() => import('@/view/default/CoursePortal'));
// const CourseMembers = React.lazy(() => import('@/view/default/courseMembers'));
// const JobPosting = React.lazy(() => import('@/view/JobPosting'));
// const Backlog = React.lazy(() => import('@/view/backlog'));
// const Notebook = React.lazy(() => import('@/view/notebook'));
// const AntvX6 = React.lazy(() => import('@/view/antvX6'));
// const Check = React.lazy(() => import('@/view/check'));
// const CheckDetail = React.lazy(() => import('@/view/check/adminCheck/checkDetail'));
// const EditExam = React.lazy(() => import('@/view/check/adminCheck/editExam'));
// const Grade = React.lazy(() => import('@/view/grade'));
// const GradeDetail = React.lazy(() => import('@/view/grade/gradeDetail'));
// const NewFriend = React.lazy(() => import('@/view/userList/newFriend'));
// const RequestHandling = React.lazy(() => import('@/view/userList/requestHandling'));
// const Group = React.lazy(() => import('@/view/userList/group'));
// const Personal = React.lazy(() => import('@/view/personal'));
// 通用路由渲染组件
function RouterWrapper() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/antvX6" element={<AntvX6 />} />
        <Route path="editExam" element={<EditExam />} />
        <Route path="course" element={<Course />} />
        <Route path="/home" element={<Home />} >
          <Route index element={<Navigate to="default" />} />
          <Route path="default" element={<Default />} ></Route>
          <Route path="userList" element={<UserList />} />
          <Route path="courseMembers" element={<CourseMembers />} />
          <Route path="coursePortal/:courseName" element={<CoursePortal />} />
          <Route path="JobPosting" element={<JobPosting />} />
          <Route path="backlog" element={<Backlog />} />
          <Route path="check" element={<Check />} />
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
    </Suspense>
  );
}


export default RouterWrapper;