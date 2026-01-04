import { useState,useEffect } from "react";
import apiClient from "../../../services/apiClient.js";
import './MemberRequestModal.css';
function MemberRequestsModal({
    isOpen,
    onClose,
    closeOnBackdrop=true}
){
    if (!isOpen) return null;
    //modal view function
    const handleClose=(e)=>{
        if(e.target===e.currentTarget && closeOnBackdrop){
            onClose();
        }
    }
    const [requests,setRequests]=useState([]);

    useEffect(()=>{
        const fetchrequest=async()=>{
        const response=await apiClient.get('org/org-mem-req/');
        setRequests(response.data);
    }
    fetchrequest();
    },[requests,isOpen])

    //handle the request approval and rejects
    const handleSubmit=async(req_id,action)=>{
        const payload={
            access:action,
        }
        const response=await apiClient.patch(`org/org-mem-req/${req_id}/`,payload)
    }
    return(<>
    <div className="modal-backdrop" onClick={handleClose}>
        <div className="modal-container">
            <div className="modal-header">
                <h3>Membership Requests</h3>
                <button className="modal-close-btn" onClick={onClose}>
                    Back
                </button>
            </div>

            {/* Body of the modal view */}
            <div className="modal-body">
               <div className="requests-container">
                    {requests.map(req => (
                        <div className="request-card" key={req.id}>
                            <div className="request-info">
                                <div className="primary">{req.user}</div>
                                <div className="secondary">{req.requested_at}</div>
                            </div>

                                <div className="request-actions">
                                    <button className="btn-accept" onClick={()=>handleSubmit(req.id,"granted")}>✓</button>
                                    <button className="btn-reject" onClick={()=>handleSubmit(req.id,"denied")}>✕</button>
                                </div>
                        </div>
                    ))}
                </div>

            </div>

        </div>
    </div>
    
    </>);
}

export default MemberRequestsModal;