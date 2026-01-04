
import { useState,useEffect } from "react";
import './MemberModal.css'
import apiClient from "../../../services/apiClient";
function MemberModal({ 
  isOpen, 
  onClose, 
  mode, 
  teamId, 
  member 
}) {
  const [formData, setFormData] = useState({
    id:"",
    user_id: "",
    role: "member",
  });
  const [membersInFirm,setMembersInFirm]=useState([]);

  // Prefill when editing
  useEffect(() => {
    if (mode === "edit" && member) {
      setFormData({
        id:teamId.id,
        user_id: member.user.id,
        role: member.role,
      });
    }
  }, [mode, member]);
  useEffect(()=>{
    const fetchUsersInFirm=async()=>{
        const response=await apiClient.get(`org/org-memberships/`);
        setMembersInFirm(response.data);
        console.log(response.data)
    }
    fetchUsersInFirm();
  },[teamId])

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (mode === "add") {
        const payload={
            user:formData.user_id,
            role:formData.role
        }
        console.log(payload);
        await apiClient.post(`teams/${teamId.id}/`, payload);

      } else {
        console.log(formData.user_id);
        await apiClient.patch(
          `teams/${teamId.id}/${member.id}/`,
          { role: formData.role }
        );
      }
      onClose(); // trigger refresh
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h3 className="modal-header">{mode === "add" ? "Add Member" : "Edit Member"}</h3>
        <div className='fields'>
        {mode === "add" && (
          <select
            name="user_id"
            value={formData.user_id}
            onChange={handleChange}
          >
            <option value="">Select User</option>
            {membersInFirm.map(member=>(
                <option key={member.id}  value={member.id}>{member.user}</option>
            ))}
          </select>
        )}

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="member">Member</option>
          <option value="lead">Lead</option>
          <option value="admin">Admin</option>
        </select></div>

        <div className="modal-actions">
          <button className='btn-primary'onClick={handleSubmit}>Save</button>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default MemberModal;