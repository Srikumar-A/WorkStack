import { useState } from "react";
import apiClient from "../../../services/apiClient";
import './CreateProjectModal.css'

function CreateProjectModal({ open, onClose, onCreated }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
  });

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
  };

  const handleSubmit = async () => {
    await apiClient.post("/projects/list/", formData);
    onCreated();       
    onClose();         
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Create Project</h2>

        <input
          name="name"
          placeholder="Project name"
          value={formData.name}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />

        <input
          type="date"
          name="start_date"
          value={formData.start_date}
          onChange={handleChange}
        />

        <input
          type="date"
          name="end_date"
          value={formData.end_date}
          onChange={handleChange}
        />

        <div className="modal-actions">
          <button className="primary-btn" onClick={handleSubmit}>Create</button>
          <button className="secondary-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
export default CreateProjectModal;