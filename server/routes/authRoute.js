import express from 'express';
import authControllers from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const authRouter = express.Router()
authRouter.post('/login',authControllers.login)
authRouter.post('/register',authControllers.addStudent)
authRouter.get('/register',authControllers.getStudents)
authRouter.get('/verify',authMiddleware,authControllers.verify)
authRouter.post('/add',authControllers.addToCourse);
authRouter.put('/edit/:studentId',authMiddleware,authControllers.editCourse);
authRouter.get('/details',authControllers.getAllStudentsCourses);
authRouter.get('/details/:studentId',authControllers.getSingleStudentCourses);
authRouter.put('/details/edit/:id',authControllers.updateStudentDetails);





export default authRouter;