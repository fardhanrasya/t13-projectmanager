import "./Create.css";
import { useEffect, useState } from "react";
import Select from "react-select";
import { useCollection } from "../../hooks/UseCollection";
import { timestamp } from "../../firebase/config";
import { useAuthContext } from "../../hooks/UseAuthContext";
import { useFirestore } from "../../hooks/UseFirestore";
import { useHistory } from "react-router-dom";

export default function Create() {
  const history = useHistory();
  const { addDocument, response } = useFirestore("projects");
  const { user } = useAuthContext();
  const { documents } = useCollection("users");
  const [users, setUsers] = useState([]);

  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("");
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [formError, setFormError] = useState(null);

  const categories = [
    { value: "development", label: "Development" },
    { value: "design", label: "Design" },
    { value: "sales", label: "Sales" },
    { value: "marketing", label: "Marketing" },
    { value: "other", label: "Other" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentDate = new Date();
    const selectedDueDate = new Date(dueDate);

    if (selectedDueDate < currentDate.setHours(0, 0, 0, 0)) {
      setFormError("Due date cannot be in the past");
      return;
    }
    if (!category) {
      setFormError("Please select a project category");
      return;
    }
    if (assignedUsers.length < 1) {
      setFormError("Please assign the project to at least 1 user");
      return;
    }

    const assignedUsersList = assignedUsers.map((u) => {
      return {
        displayName: u.value.displayName,
        photoURL: u.value.photoURL,
        id: u.value.id,
      };
    });

    const createdBy = {
      displayName: user.displayName,
      photoURL: user.photoURL,
      id: user.uid,
    };

    const project = {
      name,
      details,
      category: category.value,
      dueDate: timestamp.fromDate(new Date(dueDate)),
      assignedUsersList,
      createdBy,
      comments: [],
    };

    await addDocument(project);
    if (!response.error) {
      history.push("/");
    }
  };

  useEffect(() => {
    if (documents) {
      setUsers(
        documents.map((user) => {
          return { value: { ...user, id: user.id }, label: user.displayName };
        })
      );
    }
  }, [documents]);

  return (
    <div className="create-form">
      <h2 className="page-title">Create a New Project</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Project name:</span>
          <input
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
          />
        </label>
        <label>
          <span>Project details:</span>
          <textarea
            onChange={(e) => setDetails(e.target.value)}
            value={details}
            required
          />
        </label>
        <label>
          <span>Set due date:</span>
          <input
            type="date"
            onChange={(e) => setDueDate(e.target.value)}
            value={dueDate}
            required
          />
        </label>
        <label>
          <span>Project category: </span>
          <Select
            options={categories}
            onChange={(option) => setCategory(option)}
          />
        </label>
        <label>
          <span>Assign to:</span>
          <Select
            options={users}
            onChange={(option) => setAssignedUsers(option)}
            isMulti
          />
        </label>

        {response.isPending && (
          <button className="btn" disabled>
            loading...
          </button>
        )}
        {!response.isPending && <button className="btn">Add project</button>}

        {formError && <p className="error">{formError}</p>}
      </form>
    </div>
  );
}
