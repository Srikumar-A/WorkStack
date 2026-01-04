import NavigationBar from "../../components/navbar/Navbar";
import './Organization.css';
import { useState,useEffect } from "react";
import apiClient from "../../services/apiClient";
import MemberCard from "../../components/MemberCard/MemberCard";
import MemberRequestsModal from "./MemberRequestsModal/MemberRequestsModal";

function OrganizationPage(){
    const [members,setMembers]=useState([]);
    const [edit,setEdit]=useState(false);
    const [org,setOrg]=useState({
        name:"",
        address:"",
        email:"",
        phone:"",
        created_at:""
    });
    const [checkRequests,setCheckRequests]=useState(false);
    const [editable,setEditable]=useState(false);
    const [permissions,setPermissions]=useState({});


    // get the organization details the user belongs to.
    useEffect(()=>{
        const fetchOrganization=async()=>{
            const response=await apiClient.get('/org/');
            setOrg(response.data);
        }
        fetchOrganization();
    },[])
    //get members of the organization based on user's organization

    useEffect(()=>{
        const fetchMembers=async()=>{
            const response=await apiClient.get('org/org-memberships/');
            setMembers(response.data);
        }
        fetchMembers();
    },[])

    useState(()=>{
        const fetchUserPermission=async()=>{
            const response=await apiClient.get('org/user-permission/');
            setPermissions(response.data);
            setEditable(response.data.role==="admin")
        }
        fetchUserPermission();
    },[permissions])
    const handleSave=async()=>{
        const response=await apiClient.patch(`org/organizations/${permissions.organization}/`,org);
        setEdit(false);
    }



    //handle the editing in the lhs window
    const handleEdit=()=>{
        setEdit(true);
    }
    const handleChange = (e) => {
    const { name, value } = e.target;  // get field name and value
    setOrg((prevData) => ({
      ...prevData,
      [name]: value, // dynamically update the right field
    }));
  };
   
    return(
    <>
    <NavigationBar/>
    <MemberRequestsModal
    isOpen={checkRequests}
    onClose={()=>setCheckRequests(false)}
    />
    <div className="organization-window">
        <div className="detail-window">
            <h3 className="org-header">Organization</h3>
            <div className="detail">
                <div className="item">
                    <span className="label">Name</span>
                    {!(editable && edit)?
                    <span className="value">{org.name}</span>
                    :
                    <input className="value" type="text" value={org.name} name="name" onChange={handleChange} />}
                </div>
                <div className="item">
                    <span className="label">Address</span>
                    {!(editable && edit)?
                    <span className="value">{org.address}</span>
                    :
                    <input className="value" type="text" value={org.address} name="address" onChange={handleChange}/>}
                </div>
                <div className="item">
                    <span className="label">Email</span>
                    {!(editable && edit)?
                    <span className="value">{org.email}</span>
                    :
                    <input className="value" type="email" value={org.email} name="email" onChange={handleChange}/>}
                </div>
                <div className="item">
                    <span className="label">Phone</span>
                    {!(editable && edit)?
                    <span className="value">{org.phone}</span>
                    :
                    <input className="value" type="text" value={org.phone} name="phone" onChange={handleChange}/>}
                </div>
            </div>
            {editable && !edit?
            <button className="edit-btn" onClick={()=>handleEdit()}>Edit</button>
            :
            <div className="footer-btns">
                <button className="primary-btn" onClick={handleSave}>Save</button>
                <button className="secondary-btn" onClick={()=>{setEdit(false)}}>Cancel</button>
            </div>}   
        </div>
        <div className="member-window">
            <div className="member-header">
                <h3>Members</h3>
                <button className="requests-btn" onClick={()=>setCheckRequests(true)}>requests</button>
            </div>
            {editable?<>
            
            </>:<></>}
            <div className="member-card-container">
                {members.map((member)=>(
                    <MemberCard username={member.user} role={member.role} key={member.id}/>)
                )}
            </div>

        </div>
    </div>
    </>);
}






export default OrganizationPage;