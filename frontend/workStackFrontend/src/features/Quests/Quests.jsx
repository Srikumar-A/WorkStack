import NavigationBar from "../../components/navbar/Navbar";


import { useEffect, useState } from "react";
import "./Quests.css";

export default function Quests() {
  const [quests, setQuests] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedQuest, setSelectedQuest] = useState(null);
  const [editing, setEditing] = useState(false);

  /* Mock data – replace with API */
  useEffect(() => {
    setQuests([
      {
        id: 1,
        title: "Design DB schema",
        description: "Finalize ER diagram",
        status: "open",
        start_date: "2026-01-01",
        end_date: "2026-01-05",
        assignee: "Alice"
      },
      {
        id: 2,
        title: "Auth API",
        description: "JWT + refresh tokens",
        status: "in_progress",
        start_date: "2026-01-02",
        end_date: "2026-01-10",
        assignee: "Bob"
      }
    ]);
  }, []);

  const filteredQuests = quests.filter(q =>
    q.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectQuest = (quest) => {
    setSelectedQuest(quest);
    setEditing(false);
  };

  const handleAddQuest = () => {
    setSelectedQuest({
      id: null,
      title: "",
      description: "",
      status: "open",
      start_date: "",
      end_date: "",
      assignee: ""
    });
    setEditing(true);
  };

  const handleChange = (e) => {
    setSelectedQuest({
      ...selectedQuest,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    if (selectedQuest.id) {
      setQuests(
        quests.map(q =>
          q.id === selectedQuest.id ? selectedQuest : q
        )
      );
    } else {
      setQuests([
        ...quests,
        { ...selectedQuest, id: Date.now() }
      ]);
    }
    setEditing(false);
  };

  return (
    <>
    <NavigationBar/>
    <div className="quests-page">

      {/* LEFT COLUMN */}
      <div className="quests-sidebar">
        <div className="quests-header">
          <h3>Quests</h3>
          <button className="add-btn" onClick={handleAddQuest}>
            + Add Quest
          </button>
        </div>

        <input
          type="text"
          placeholder="Search quests..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <ul className="quests-list">
          {filteredQuests.map(q => (
            <li
              key={q.id}
              className={selectedQuest?.id === q.id ? "active" : ""}
              onClick={() => handleSelectQuest(q)}
            >
              <span className="quest-title">{q.title}</span>
              <span className={`status ${q.status}`}>
                {q.status.replace("_", " ")}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* RIGHT COLUMN */}
      <div className="quests-content">
        {!selectedQuest ? (
          <div className="empty-state">
            <p>Select a quest to view details</p>
          </div>
        ) : (
          <>
            <div className="quest-details-header">
              <h3>{editing ? "Edit Quest" : "Quest Details"}</h3>

              {!editing && (
                <button
                  className="edit-btn"
                  onClick={() => setEditing(true)}
                >
                  Edit
                </button>
              )}
            </div>

            <div className="quest-form">
              <label>Title</label>
              <input
                name="title"
                value={selectedQuest.title}
                onChange={handleChange}
                disabled={!editing}
              />

              <label>Description</label>
              <textarea
                name="description"
                value={selectedQuest.description}
                onChange={handleChange}
                disabled={!editing}
              />

              <div className="row">
                <div>
                  <label>Start Date</label>
                  <input
                    type="date"
                    name="start_date"
                    value={selectedQuest.start_date}
                    onChange={handleChange}
                    disabled={!editing}
                  />
                </div>

                <div>
                  <label>End Date</label>
                  <input
                    type="date"
                    name="end_date"
                    value={selectedQuest.end_date}
                    onChange={handleChange}
                    disabled={!editing}
                  />
                </div>
              </div>

              <label>Assignee</label>
              <input
                name="assignee"
                value={selectedQuest.assignee}
                onChange={handleChange}
                disabled={!editing}
              />

              <label>Status</label>
              <select
                name="status"
                value={selectedQuest.status}
                onChange={handleChange}
                disabled={!editing}
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {editing && (
              <div className="actions">
                <button className="save-btn" onClick={handleSave}>
                  Save
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div></>
  );
}
