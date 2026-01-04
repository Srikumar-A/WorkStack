import { use, useState} from "react";
import {useNavigate} from "react-router-dom";
import apiClient from "../../services/apiClient.js"
import './Login.css';

function Login(){
    const navigate=useNavigate();
    const [form,setForm]=useState({
        username:"",
        password:""
    });
    const handleChange=(e)=>{
        setForm({...form,[e.target.name]:e.target.value})
    }

    const handleSubmit=async(e)=>{
        e.preventDefault()
        try{
            const res=await apiClient.post('auth/login/',form);
            localStorage.setItem('token',res.data.token);
            navigate('/Dashboard');
        }catch(err){
            console.log(err);
        }finally{
            //loading animation
        }
    }

    return(
        <div className="login-container">
            <form className="form-card">
                <div className="form-title">
                <h1 className="login-title">Work Stack</h1>
                Sign in to your workspace
                </div>
                <div className="input-field">Username</div>
                <input
                type="username"
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                />
                <div className="input-field">Password</div>
                <input 
                type="password"
                name="password"
                placeholder="password"
                required
                value={form.password}
                onChange={handleChange}
                />
                <button type="submit" onClick={handleSubmit}>Login</button>
            </form>
        </div>
    );
}
export default Login;