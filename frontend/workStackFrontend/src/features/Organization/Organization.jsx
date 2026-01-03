import NavigationBar from "../../components/navbar/Navbar";
import './Organization.css';
import { useState,useEffect } from "react";
import apiClient from "../../services/apiClient";
import MemberCard from "../../components/MemberCard/MemberCard";

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
            const response=await apiClient.get('auth/users/myOrg/');
            setMembers(response.data);
        }
        fetchMembers();
    },[])



    //handle the editing in the lhs window
    const handleEdit=()=>{

        setEdit(true);
    }
    const editable=true;
    return(
    <>
    <NavigationBar/>
    <div className="organization-window">
        <div className="detail-window">
            <h3 className="member-header">Organization</h3>
            <div className="detail">
                <div className="item">
                    <span className="label">Name</span>
                    {!(editable && edit)?
                    <span className="value">{org.name}</span>
                    :
                    <input className="value" type="text" value={org.name} />}
                </div>
                <div className="item">
                    <span className="label">Address</span>
                    {!(editable && edit)?
                    <span className="value">{org.address}</span>
                    :
                    <input className="value" type="text" value={org.address}/>}
                </div>
                <div className="item">
                    <span className="label">Email</span>
                    {!(editable && edit)?
                    <span className="value">{org.email}</span>
                    :
                    <input className="value" type="email" value={org.email}/>}
                </div>
                <div className="item">
                    <span className="label">Phone</span>
                    {!(editable && edit)?
                    <span className="value">{org.phone}</span>
                    :
                    <input className="value" type="text" value={org.phone}/>}
                </div>
            </div>
            {editable && !edit?
            <button className="edit-btn" onClick={()=>handleEdit()}>Edit</button>
            :
            <div className="footer-btns">
                <button className="primary-btn">Save</button>
                <button className="secondary-btn">Cancel</button>
            </div>}   
        </div>
        <div className="member-window">
            <h3 className="member-header">Members</h3>
            <div className="member-card-container">
                {members.map((member)=>(
                    <MemberCard member={member} key={member.id}/>)
                )}
            </div>

        </div>
    </div>
    </>);
}






export default OrganizationPage;