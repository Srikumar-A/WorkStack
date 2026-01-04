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
            console.log(members);
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