import { use, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import apiClient from "../../services/apiClient.js";
import NavigationBar from "../../components/navbar/Navbar.jsx";
import "./accountPage.css";

function AccountPage(){
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing,setEditing]=useState(false);
    const [formData,setFormData]=useState({
        organization:""
    });

    //selecteing organization states
    const [organizations,setOrganizations]=useState([]);

    const [orgLoaded,setOrgLoaded]=useState(false);
    var org="";

    // Fetch user data on component mount
    useEffect(() => {
    const fetchUser = async () => {
        try {
        const response = await apiClient.get("auth/user/");
        setUser(response.data);
        setFormData({
            organization: response.data.organization
        });
        if(!orgLoaded){
            apiClient.get("org/organizations/").then(
                res=>setOrganizations(res.data)
            ).catch(err=>console.error(err));
            setOrgLoaded(true);
        }
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
    };
    //fetch user data and set state
    fetchUser();
    }, []);
    if (loading) {
        return <p>Loading...</p>;
    }

    if (!user) {
        return <p>Not authenticated</p>;
    }
    else{
        org=organizations.find(o=>o.id===user.organization)
        if(org){
            org=org.name;
        }else{
            org=""
        }
    }
    //editing values and setting it to form data
    const handleChange=(e)=>{
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        });
    }
    //function to handle editable toggle for the form
    const handleEditToggle=()=>{
        setEditing(!editing);
    }
    const updateAccount=async()=>{
        try{
            const response=await apiClient.post("org/org-mem-req/",formData); 
            setUser(response.data);
            setEditing(false);
        }catch(err){
            console.error(err);
        }
    }
    const cancelUpdate=()=>{
        setFormData({
            username:user.username || "",
            email:user.email || "",
            organization:user.organization || ""
        });
        setEditing(false);
    }
    
    return (
  <div className="account-container">
    <NavigationBar/>
  <div className="account-card">

    <div className="profile-header">
      <div className="avatar-wrapper">
        {editing ? (
            <>
            </>):
            (<></>)}
        
      </div>

      <h2 className="username">{user.username}</h2>
      
      <p className="email">
        (<>{user.email}</>)
      </p>
    </div>

    <div className="account-details">
      <div className="detail-row">
        <span className="label">Organization</span>
        <span className="value">{editing ?(
            <>
            <select
            name="organization"
            value={formData.organization || ""}
            onChange={handleChange}
            className="org-select"
            >
            <option value="">Select Organization</option>
            {organizations.map(org=>(
                <option key={org.id} value={org.id}>
                    {org.name}
                </option>
            ))}</select>
            </>
        
        )
            :
            (<>{org}</>)}</span>
      </div>

      <div className="detail-row">
        <span className="label">Joined</span>
        <span className="value">Jan 2025</span>
      </div>
    </div>

    <div className="account-actions">
        {editing ? (
            <>
            <button className="primary-btn" onClick={updateAccount}>Update</button>
            <button className="secondary-btn" onClick={cancelUpdate}>Cancel</button>
            </>
        ):
        (
            <>
            <button className="primary-btn" onClick={handleEditToggle}>Edit Profile</button>
            </>
        )
        }
      
    </div>

  </div>
</div>

    );

}
export default AccountPage;