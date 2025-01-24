import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String,
        required: true,
        unique: true, 
    },
    subjects: [
        {
            type: String,
            required: true,
        },
    ],
});

const Course = mongoose.model("Course", courseSchema);

export default Course;
