import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import authService from "../services/authService";
import { toast } from "react-toastify";

export default function Login(){
    const [input, setInput] = useState({email: '', password: ''});
    const navigate = useNavigate();
    const handleChange = (e) => setInput({ ...input, [e.target.name]: e.target.value});
    const handleLogin = async (e)=>{
        e.preventDefault();
        const NewInput = {
    email: input.email.trim().toLowerCase(),     
    password: input.password.trim(),            
  };
        try{ 
            const res = await authService.login(NewInput);
            localStorage.setItem('token', res.data.token);
            toast.success('Login successfull')
            
            navigate('/profile');
        }catch (err){
            console.error("Login failed:", err);
          toast.error(err.response?.data?.message || "Invalid credentials.");
        }
    };

    return (
        <div className="max-w-sm mx-auto mt-16 px-6 py-8 border rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Login</h2>
            <form onSubmit={handleLogin} className="space-y-3">
                {['email', 'password'].map((field) =>(
                    <input 
                    key={field}
                    name={field}
                    type={field === 'password'? 'password': 'text'}
                    value={input[field]}
                    onChange={handleChange}
                    placeholder={field}
                    className="w-full border p-2 rounded"
                    required
                    />
                ))}
                <button  type="submit" className="bg-blue-500 text-white py-2 w-full rounded hover:bg-blue-700">Login</button>
            </form>
            <p className="text-center text-base mt-4">
                Dont't have an account?{" "}
                <Link to="/register" className="text-blue-600  font-semibold hover:underline">
                Register here</Link>
            </p>
        </div>
    );
}
//


