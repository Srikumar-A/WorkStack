import {use,useState} from "react";
import {useNavigate} from "react-router-dom";
import apiClient from "../../services/apiClient";
import './Register.css';

function Register(){
    const navigate=useNavigate();
    const [form,setForm]=useState({
        username:"",
        email:"",
        password:"",
        password2:"",
    });
    const handleChange=(e)=>{
        setForm({...form,[e.target.name]:e.target.value})
    }
    const handleSubmit=async(e)=>{
        e.preventDefault()
        try{
            //api call
            await apiClient.post('auth/register/',form);
            navigate('/login');
        }catch(err){
            console.log(err);
        }finally{
            //loading animation
        }
    }

    return(<div className="login-container">
        <form className="form-card">
            <div className="form-title">
            <h2>Register to WorkStack Now</h2></div>
            <div className="input-field">
            Username
            </div>
            <input
            type="text"
            name="username"
            placeholder='username'
            value={form.username}
            onChange={handleChange}
            />
            
            <div className="input-field">
            Email
            </div>
            <input
            type="email"
            name="email"
            placeholder="email@gmail.com"
            value={form.email}
            onChange={handleChange}
            />
            <div className="input-field">
            Password
            </div>
            <input
            type="password"
            name="password"
            placeholder="password"
            value={form.password}
            onChange={handleChange}
            />
            <div className="input-field">
            Re-enter Password
            </div>
            <input
            type="password"
            name="password2"
            placeholder="re-enter password"
            value={form.password2}
            onChange={handleChange}
            />
            <button className="submit-btn" type="submit" onClick={handleSubmit}>Register</button>

        </form>

    </div>);
}

export default Register;