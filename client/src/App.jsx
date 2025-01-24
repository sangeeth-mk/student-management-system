import {BrowserRouter,Routes,Route,Navigate} from 'react-router-dom'
import Login from './pages/login/Login'
import Admin from './pages/admin/Admin'
import Student from './pages/student/Student'
import PrivateRoutes from './utils/privateRoutes'
import RoleBaseRoutes from './utils/roleBaseRoutes'
import Summary from './components/dashboard/Summary'
import Students from './components/students/Students'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <>
    <ToastContainer position="top-right" 
    autoClose={3000} 
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover/>
    
     <BrowserRouter>
     <Routes>
      <Route path='/' element={<Navigate to='admin-dashboard'/>}></Route>
      <Route path='/login' element={<Login/>}/>
      <Route path='/admin-dashboard' element={
      <PrivateRoutes>
      <RoleBaseRoutes requiredRole={["admin"]}>
      <Admin/>
      </RoleBaseRoutes>
      </PrivateRoutes>
      }>
        <Route index element={<Summary/>}></Route>
        <Route path='/admin-dashboard/students' element={<Students/>}></Route>

      </Route>

      <Route path='/student-dashboard' element={
        <PrivateRoutes>
          <RoleBaseRoutes requiredRole={["admin", "student"]}>
          <Student/>
          </RoleBaseRoutes>
        </PrivateRoutes>
      }>
       
      </Route>

     </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
