import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import authServices from "../services/authService";
import { toast } from "react-toastify";

export default function Profile(){
    const [user, setUser] = useState({});
    const [editMode, setEditMode] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if(!token){
            navigate("/login");
            return;
        }
   const id = localStorage.getItem("userId"); 
  
        authServices.getProfile()
        .then(res => setUser(res.data))
        .catch((err) => {
            console.error("Error fetching profile:", err);
            alert("Session expired. Please log in again.");
            localStorage.removeItem("token");
            navigate("/login");
        });
        
    }, [navigate, token]);

    const updateProfile = async () =>{
        try { 
            await authServices.updateProfile( user)
            setEditMode(false);
           toast.success("Profile updated successfully");
        }catch (err) {
            console.error("Update failed:", err);
            toast.error("profile Update failed");
        }
    };

    const onChange =(e) => setUser({ ...user, [e.target.name]: e.target.value});

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-6 border rounded shadow bg-white">
                <h2 className="text-xl font-semibold mb-4 text-blue-500 text-center">Profile</h2>
                <label className="font-semibold  text-gray-700 mb-2">Name</label>
              
                    <input 
                   
                    name="name"
                    type="text"
                    value={user.name || ''}
                    onChange={onChange}
                    disabled={!editMode}
                    className={`w-full mb-3 border p-2 mt-1 mb-3 rounded }`}
                    />

 <label className="font-semibold  text-gray-800">Email</label>
                     <input 
                   
                    name="email"
                    type="text"
                    value={user.email || ''}
                    onChange={onChange}
                    disabled
                    className={`w-full mb-3 border p-2 mt-1  mb-3  rounded }`}
                    />

                    <label className="font-semibold  text-gray-800">Age</label>
                     <input 
                   
                    name="age"
                    type="number"
                    value={user.age || ''}
                    onChange={onChange}
                    disabled={!editMode}
                    className={`w-full mb-3 border p-2 mt-1 mb-3  rounded }`}
                    />
                    <label className="font-semibold  text-gray-800">Date of Birth</label>
                     <input 
                   
                    name="dob"
                    type="date"
                    value={user.dob ? user.dob .slice(0,10) : ''}
                    onChange={onChange}
                    disabled={!editMode}
                    className={`w-full mb-3 border p-2 mt-1  mb-3 rounded }`}
                    />
                    <label className="font-semibold  text-gray-800">Contact No</label>
                     <input 
                   
                    name="contact"
                    type="text"
                    value={user.contact || ''}
                    onChange={onChange}
                    disabled={!editMode}
                    className={`w-full mb-3 border mb-3 mt-1  p-2 rounded }`}
                    />
               
                <button onClick={editMode ? updateProfile : () => setEditMode(true)}
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-700">
                    {editMode ? 'Save' : 'Update'}
                </button>
            </div>    
        </div>
    );
}