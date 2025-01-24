import React, { useEffect, useState } from "react";
import Axios from "axios";
import { toast } from "react-toastify";
import {Table,TableBody,TableCell,TableContainer,TableHead,TableRow,TablePagination,Button,Dialog,DialogActions,DialogContent,DialogTitle,TextField} from "@mui/material";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [openAddStudentDialog, setOpenAddStudentDialog] = useState(false);
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentEmail, setNewStudentEmail] = useState("");
  const [newStudentPassword, setNewStudentPassword] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openAddCoursesDialog, setOpenAddCoursesDialog] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState("");

  const getStudents = async () => {
    try {
      const response = await Axios.get("http://localhost:3007/api/auth/details");
      if (response.data.success) {
        const filteredStudents = response.data.students.filter(
          (user) => user.role === "student"
        );
        setStudents(filteredStudents);
      }
    } catch (error) {
      toast.error("Failed to fetch students");
    }
  };

  const handleAddSubjectsAndCourses = (studentId) => {
    setSelectedStudentId(studentId);
    setOpenAddCoursesDialog(true);
  };

  const handleSaveCoursesAndSubjects = async () => {
    try {
      const response = await Axios.post("http://localhost:3007/api/auth/add", {
        studentId: selectedStudentId,
        courseName: selectedCourse, // Send courseName
        subjects: selectedSubjects.split(",").map((subject) => subject.trim()).filter(Boolean), // Send subjects array
      });
  
      if (response.data.success) {
        toast.success("Courses and subjects added successfully");
        setOpenAddCoursesDialog(false);
        getStudents();
      } else {
        toast.error("Failed to add courses and subjects");
      }
    } catch (error) {
      toast.error("Failed to add courses and subjects");
    }
  };
  

  const addStudent = async () => {
    if (!newStudentName || !newStudentEmail || !newStudentPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const response = await Axios.post("http://localhost:3007/api/auth/register", {
        name: newStudentName,
        email: newStudentEmail,
        password: newStudentPassword,
        role: "student",
      });

      if (response.data.success) {
        toast.success("Student added successfully");
        setOpenAddStudentDialog(false);
        getStudents();
      } else {
        toast.error("Failed to add student");
      }
    } catch (error) {
      toast.error("Failed to add student");
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    getStudents();
  }, []);

  return (
    <div>
      <div className="flex justify-between p-4">
        <h2>Students List</h2>
        <Button variant="contained" onClick={() => setOpenAddStudentDialog(true)}>
          Add Student
        </Button>
      </div>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Subjects</TableCell>
              <TableCell>Enrolled Courses</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((student) => (
                <TableRow key={student._id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>
                    {student.subjects.join(", ") || "No subjects"}
                  </TableCell>
                  <TableCell>
                    {student.courses.length ? (
                      student.courses.map((course) => course.courseName).join(", ")
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleAddSubjectsAndCourses(student._id)}
                      >
                        Add Course
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={students.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Dialog open={openAddStudentDialog} onClose={() => setOpenAddStudentDialog(false)}>
        <DialogTitle>Add New Student</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            fullWidth
            label="Name"
            name="name"
            value={newStudentName}
            onChange={(e) => setNewStudentName(e.target.value)}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={newStudentEmail}
            onChange={(e) => setNewStudentEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={newStudentPassword}
            onChange={(e) => setNewStudentPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddStudentDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={addStudent} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openAddCoursesDialog} onClose={() => setOpenAddCoursesDialog(false)}>
        <DialogTitle>Add Courses and Subjects</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            fullWidth
            label="Course Name"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Subjects (comma separated)"
            value={selectedSubjects}
            onChange={(e) => setSelectedSubjects(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddCoursesDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveCoursesAndSubjects} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Students;
