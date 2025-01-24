import React from 'react';
import {NavLink} from 'react-router-dom';
import { Users } from "lucide-react";


const AdminSideBar = () => {
  return (
      <div className="bg-gray-800 text-indigo-600 h-screen fixed left-0 top-0 bottom-0 space-y-2 w-64">
      <div className="bg-teal-500 h-12 flex items-center justify-center">
        <h3 className="text-2xl text-center">Student ms</h3>
      </div>

      <div className="px-4">
        <NavLink
          to="/admin-dashboard/students"
          className={({ isActive }) =>
            `${isActive ? "bg-teal-500 text-white" : "text-indigo-600"} flex items-center space-x-4 py-2.5 px-4 rounded`
          }
          end
        >
          <Users />
          <span>Students</span>
        </NavLink>
      </div>
    </div>
  )
}

export default AdminSideBar
