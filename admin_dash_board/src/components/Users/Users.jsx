import React, { useEffect, useState } from 'react';
import axios from "axios";
import { FaEdit, FaSearch, FaTrash, FaUserPlus, FaUsers } from 'react-icons/fa';
import Delete from '../TableActions/Delete';
import PaginationButton from '../PaginationButton/PaginationButton';
import Edit from '../TableActions/Edit';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [deleteClick, setDeleteClick] = useState(false);
    const [id, setId] = useState("");
    let [currentPage, setCurrentPage] = useState(1)
    let [itemPerPage, setitemPerPage] = useState(6)
    let indexOfLastProduct = currentPage * itemPerPage
    let indexOfFirstnumber = indexOfLastProduct - itemPerPage
    const [showEditPopop, setShowEditPopup] = useState(false)
    const usersField = [
        { label: "First Name", name: "firstname", type: "text", placeholder: "Enter first name" },
        { label: "Last Name", name: "lastname", type: "text", placeholder: "Enter last name" },
        { label: "Email", name: "email", type: "email", placeholder: "Enter email" },
        { label: "Phone", name: "phone", type: "text", placeholder: "Enter phone number" },
        { label: "Role", name: "role", type: "select", options: ["admin", "instructor", "user"], placeholder: "Select role" },
    ];
    const userUpdateInput = {
        firstname:"",
        lastname:"",
        email:"",
        phone:"",
        role:""
    }
    const deleteCont = "Are you sure that you want to delete user?";





    const getAllUsers = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/v1/get_all_user?firstname=${search}`, {

                withCredentials: true
            }
            );

            setUsers(res.data.users || []);



        } catch (err) {
            console.error("Error fetching users:", err);
        }
    };

    useEffect(() => {

        getAllUsers(1);
    }, [search]);

    const take = users.filter((u)=>u._id === "6903372f021e220c903d247a")
    console.log(take)

    let showusers = users.slice(indexOfFirstnumber, indexOfLastProduct)


    const handleDelete = (id) => {
        setDeleteClick(true);
        setId(id);
    };
    const handleEdit = (id) => {
        setId(id);
    }
    console.log(id)
    const onTimeDelete = () => {
        setUsers((prev) => prev.filter((u) => u._id !== id));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
            {deleteClick && (
                <Delete
                    setDeleteClick={setDeleteClick}
                    deleteCont={deleteCont}
                    id={id}
                    api_end_point={`${import.meta.env.VITE_API_URL}/api/v1/get_user`}
                    onTimeDelete={onTimeDelete}
                />
            )}
            {showEditPopop && <Edit
                field={usersField}
                setShowEditPopup={setShowEditPopup}
                api_end_point={`${import.meta.env.VITE_API_URL}/api/v1/get_user`}
                id={id}
                updateInput={userUpdateInput}
                reRender={getAllUsers}
            />}

            <div className="w-full max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center gap-3">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl">
                        <FaUsers className="text-white text-2xl" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">User Management</h2>
                        <p className="text-gray-600">Manage and monitor all users</p>
                    </div>
                </div>

                {/* Controls */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-96">
                        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            placeholder="Search by name..."
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>

                    <div className="flex items-center gap-4 mt-4 md:mt-0">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 px-4 py-2 rounded-xl border border-blue-200">
                            <p className="text-sm text-gray-600">Total Users</p>
                            <p className="text-2xl font-bold text-blue-600">{users.length}</p>
                        </div>
                        <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg transition transform hover:scale-105 flex items-center gap-2">
                            <FaUserPlus /> Add User
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                        <h3 className="text-xl font-semibold text-white">All Users</h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">No</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Phone</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {showusers.length > 0 ? (
                                    showusers.map((u, i) => (
                                        <tr key={i} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200">
                                            <td className="px-6 py-4 whitespace-nowrap">{(currentPage - 1) * itemPerPage + (i + 1)}</td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <p className="text-sm font-semibold text-gray-900">
                                                    {u.firstname} {u.lastname}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <p className="text-sm text-gray-600">{u.email}</p>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <p className="text-sm text-gray-600">{u.phone}</p>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${u.role === 'admin'
                                                        ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                                        : u.role === 'instructor'
                                                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                                            : 'bg-green-100 text-green-700 border border-green-200'
                                                        }`}
                                                >
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button className="p-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition group"
                                                        onClick={() => {
                                                            setShowEditPopup(true)
                                                            handleEdit(u._id)
                                                        }}
                                                    >
                                                        <FaEdit className="group-hover:scale-110 transition" />
                                                    </button>
                                                    <button
                                                        className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition group"
                                                        onClick={() => handleDelete(u._id)}
                                                    >
                                                        <FaTrash className="group-hover:scale-110 transition" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                                    <FaUsers className="text-gray-400 text-2xl" />
                                                </div>
                                                <p className="text-gray-500 font-medium">No users found</p>
                                                <p className="text-gray-400 text-sm">Try adjusting your search</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <PaginationButton items={users} itemPerPage={itemPerPage} setCurrentPage={setCurrentPage} currentPage={currentPage} />

            </div>
        </div>
    );
};

export default Users;
