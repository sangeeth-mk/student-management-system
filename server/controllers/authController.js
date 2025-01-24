import User from '../models/user.js';
import Course from '../models/course.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const login = async(req,res)=>{

    try {
        const {email,password} = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, error: "Email and password are required." });
        }

        const user = await User.findOne({email})
        console.log(user);

        if(!user){
          return res.status(404).json({success:false,error:"user not found"})
        }

        const isMatch = await bcrypt.compare(password,user.password)

        if(!isMatch){
           return res.status(404).json({success:false,error:"wrong password"})
        }

       const token = jwt.sign({_id:user._id,role:user.role},process.env.JWT_KEY,{expiresIn:"10d"})

       return res.status(200).json({success:true,token, user:{id:user._id, name:user.name, email:user.email, role:user.role}})

    } catch (error) {
        res.status(500).json({success:false,error:error.message})
    }
}



const addStudent = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, error: "All fields are required." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newStudent = new User({
            name,
            email,
            password: hashedPassword,
            role: "student",
        });

        await newStudent.save();
        return res.status(201).json({ success: true, student: newStudent, message:"student added" });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};


const verify = async (req,res)=>{

    return res.status(200).json({success:true, user:req.user})
}


const addToCourse = async (req, res) => {
    const { studentId, courseName, subjects } = req.body;
  
    try {
      if (!studentId || !courseName) {
        return res.status(400).json({ success: false, error: "Student ID and Course name are required." });
      }
  
      let course = await Course.findOne({ courseName: courseName });
      if (!course) {
        course = new Course({ courseName, subjects });
        await course.save();
      }
  
      const student = await User.findById(studentId);
      if (!student) {
        return res.status(404).json({ success: false, error: "Student not found." });
      }
  
      if (student.course && student.course.some(c => c.courseName === courseName)) {
        return res.status(400).json({ success: false, error: "Student is already enrolled in this course." });
      }
  
      student.subjects = student.subjects.concat(subjects);
  
      await student.save();
  
      res.status(200).json({
        success: true,
        message: "Course assigned successfully.",
        student,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: "Server error: " + error.message });
    }
  };
  



const editCourse = async (req, res) => {
    const { studentId } = req.params;  
    const { courseId, newSubjects } = req.body;  

    try {
        const student = await User.findById(studentId);
        if (!student) {
            return res.status(404).json({ success: false, error: "Student not found." });
        }

        if (!student.course) {
            return res.status(400).json({ success: false, error: "Student is not enrolled in any course." });
        }

        if (courseId) {
            const newCourse = await Course.findById(courseId);
            if (!newCourse) {
                return res.status(404).json({ success: false, error: "Course not found." });
            }

            student.course = newCourse._id;
            student.subjects = newCourse.subjects;
        } else if (newSubjects && Array.isArray(newSubjects)) {
            student.subjects = newSubjects;
        }

        await student.save();

        res.status(200).json({
            success: true,
            message: "Course details updated successfully.",
            student,
        });
    } catch (error) {
        res.status(500).json({ success: false, error: "Server error: " + error.message });
    }
};


const getStudents = async (req,res)=>{

    try {

        const users = await User.find({})

        return res.status(200).json({success:true, total:users.length, Users:users, message:"users fetched"})
        
    } catch (error) {
        res.status(500).json({ success: false, error: "Server error: " + error.message });
    }
}

const getAllStudentsCourses = async (req, res) => {
    try {
        const students = await User.find({ role: 'student' }).populate('course', 'courseName description');

        if (students.length === 0) {
            return res.status(404).json({ success: false, error: "No students found." });
        }

        const studentDetails = students.map(student => ({
            _id: student._id,
            name: student.name,
            email: student.email,
            role: student.role,
            courses: student.course.map(course => ({
                courseName: course.courseName,
                description: course.description,
            })),
            subjects: student.subjects,  
        }));

        res.status(200).json({
            success: true,
            students: studentDetails,
        });
    } catch (error) {
        res.status(500).json({ success: false, error: "Server error: " + error.message });
    }
};


const getSingleStudentCourses = async (req, res) => {
    try {
        const { studentId } = req.params;

        const student = await User.findById(studentId).populate('course', 'courseName description');

        if (!student) {
            return res.status(404).json({ success: false, error: "Student not found." });
        }

        const studentDetails = {
            _id: student._id,
            name: student.name,
            email: student.email,
            role: student.role,
            courses: student.course.map(course => ({
                courseName: course.courseName,
                description: course.description,
            })),
            subjects: student.subjects,  
        };

        res.status(200).json({
            success: true,
            student: studentDetails,
        });
    } catch (error) {
        res.status(500).json({ success: false, error: "Server error: " + error.message });
    }
};


const updateStudentDetails = async (req, res) => {
    const { id } = req.params;
    const { name, email, courses, subjects } = req.body;

    try {

      const courseObjectIds = await Promise.all(
        courses.map(async (courseName) => {
          const course = await Course.findOne({ courseName });
          return course ? course._id : null;
        })
      );

      const validCourses = courseObjectIds.filter(id => id !== null);

      const updatedStudent = await User.findByIdAndUpdate(
        id,
        {
          name,
          email,
          course: validCourses, 
          subjects,
        },
        { new: true }
      );

      if (!updatedStudent) {
        return res.status(404).json({ success: false, message: 'Student not found' });
      }

      res.status(200).json({ success: true, student: updatedStudent, message: "Update successful" });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Server error: ' + error.message });
    }
};

  
const authControllers = { login,addStudent,verify,addToCourse,editCourse,getStudents,getAllStudentsCourses,getSingleStudentCourses,updateStudentDetails }

export default authControllers;
