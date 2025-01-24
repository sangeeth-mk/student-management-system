import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import NavBar from "../../components/dashboard/NavBar";
import { Outlet } from "react-router-dom";
import StudentDashBoard from "../../components/studentDashboard/StudentDashBoard";
import Axios from "axios";
import { toast } from "react-toastify";
import {Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,Button,Dialog,DialogActions,DialogContent,DialogTitle,TextField} from "@mui/material";

const Student = () => {
  const { user } = useAuth();
  const [studentDetails, setStudentDetails] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    courses: "",
    subjects: "",
  });

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const response = await Axios.get(
          `http://localhost:3007/api/auth/details/${user._id}`
        );
        if (response.data.success) {
          setStudentDetails(response.data.student);
        } else {
          console.error("Failed to fetch student details");
        }
      } catch (error) {
        console.error("Error fetching student details:", error.message);
      }
    };

    if (user?.role === "student") {
      fetchStudentDetails();
    }
  }, [user]);

  const handleEdit = () => {
    setEditData({
      name: studentDetails.name,
      email: studentDetails.email,
      courses: studentDetails.courses
        .map((course) => course.courseName)
        .join(", "),
      subjects: studentDetails.subjects.join(", "),
    });
    setOpenModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const updatedData = {
        name: editData.name,
        email: editData.email,
        courses: editData.courses.split(",").map((course) => course.trim()),
        subjects: editData.subjects.split(",").map((subject) => subject.trim()),
      };

      const response = await Axios.put(
        `http://localhost:3007/api/auth/details/edit/${user._id}`,
        updatedData
      );
      if (response.data.success) {
        setStudentDetails(response.data.student);
        setOpenModal(false);
        toast.success(response.data.message);
      } else {
        console.error("Failed to update student details");
      }
    } catch (error) {
      console.error("Error updating student details:", error.message);
    }
  };

  return (
    <div className="flex ml-32">
      <StudentDashBoard />
      <div className="flex-1 h-screen ml-[127px] bg-gray-100">
        <NavBar />
        <div className="p-4">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">
            Student Dashboard
          </h2>
          {studentDetails ? (
            <TableContainer component={Paper} className="shadow-md rounded-md">
              <Table>
                <TableHead>
                  <TableRow style={{ backgroundColor: "#f1f5f9" }}>
                    <TableCell>
                      <strong>Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Email</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Course Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Subjects</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Actions</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{studentDetails.name}</TableCell>
                    <TableCell>{studentDetails.email}</TableCell>
                    <TableCell>
                      {studentDetails.courses && studentDetails.courses.length
                        ? studentDetails.courses
                            .map((course) => course.courseName)
                            .join(", ")
                        : "No Course Assigned"}
                    </TableCell>
                    <TableCell>
                      {studentDetails.subjects && studentDetails.subjects.length
                        ? studentDetails.subjects.join(", ")
                        : "No Subjects Assigned"}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={handleEdit}
                        style={{ textTransform: "none" }}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <p>Loading student details...</p>
          )}
        </div>

        <Dialog open={openModal} onClose={() => setOpenModal(false)}>
          <DialogTitle>Edit Student Details</DialogTitle>
          <DialogContent>
            <TextField
              label="Name"
              name="name"
              value={editData.name}
              onChange={handleChange}
              fullWidth
              margin="dense"
            />
            <TextField
              label="Email"
              name="email"
              value={editData.email}
              onChange={handleChange}
              fullWidth
              margin="dense"
            />
            <TextField
              label="Courses (comma-separated)"
              name="courses"
              value={editData.courses}
              onChange={handleChange}
              fullWidth
              margin="dense"
            />
            <TextField
              label="Subjects (comma-separated)"
              name="subjects"
              value={editData.subjects}
              onChange={handleChange}
              fullWidth
              margin="dense"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenModal(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleSave} color="primary" variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        <Outlet />
      </div>
    </div>
  );
};

export default Student;
