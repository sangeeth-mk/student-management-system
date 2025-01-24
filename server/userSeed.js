import connectToDatabase from './config/config.js';
import User from './models/user.js';
import Course from './models/course.js'
import bcrypt from 'bcrypt';

const registerUser = async () => {

    connectToDatabase()
  try {
    const hashedPassword = await bcrypt.hash("student1", 10);

    const newUser = new User({
      name: "student1",
      email: "student1@gmail.com",
      password: hashedPassword,
      role: "student",
    });

    await newUser.save();
    console.log('User registered successfully');
    
  } catch (error) {
    console.log('Error registering user:', error);
  }
};


const createCourse = async () => {
  try {
    const bcaCourse = new Course({
        courseName: "BCA",
        subjects: ["Java", "Computer Science", "English"]
    });

    const mathsCourse = new Course({
        courseName: "BSC Maths", 
        subjects: ["Algebra", "Trignometry", "3D"]
    });

    await bcaCourse.save();
    await mathsCourse.save();

    console.log('Courses saved successfully');
} catch (error) {
    console.error('Error creating courses:', error.message);
}
};


registerUser();
createCourse()

