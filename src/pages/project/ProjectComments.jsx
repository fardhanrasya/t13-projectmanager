import { useState } from "react";
import { timestamp } from "../../firebase/config";
import { useAuthContext } from "../../hooks/UseAuthContext";
import { useFirestore } from "../../hooks/UseFirestore";
import Avatar from "../../components/Avatar";
import deleteIcon from "../../assets/delete-icon.svg"
import { arrayRemove } from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";

export default function ProjectComments({ project }) {
  const { user } = useAuthContext();
  const { response, updateDocument } = useFirestore("projects");
  const [newComment, setNewComment] = useState("");
  const [commentError, setCommentError] = useState("")
  const [charCount, setCharCount] = useState(0); // State to track character count
  const maxChars = 200; // Max character limit

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newComment.trim() === "") {
      setCommentError("Comment cannot empty")
      return; // Cancel submit if comment is empty or only whitespace
    }
    if (charCount >= maxChars) {
      setCommentError("Comment exceeds maximun character")
      return;
    }

    const commentToAdd = {
      by: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL,
      content: newComment,
      createdAt: timestamp.fromDate(new Date()),
      id: Math.random(),
    };
    await updateDocument(project.id, {
      comments: [...project.comments, commentToAdd],
    });
    if (!response.error) {
      setCommentError("")
      setNewComment("");
      setCharCount(0)
    }
  };

  const handleCommentChange = (e) => {
    const comment = e.target.value;
    // Set the new comment value and update the character count
    if (comment.length <= maxChars) {
      setNewComment(comment);
      setCharCount(comment.length); // Update character count
    }
  };

  const handleDeleteComment = (by, id) => {
    const commentToRemove = project.comments.find(comment => comment.id === id);
    if (by === user.uid) {
      updateDocument(project.id, {
        comments: arrayRemove(commentToRemove)
      });
    }
  }

  return (
    <div className="project-comments">
      <h4>Project Comments</h4>
      <form className="add-comment" onSubmit={handleSubmit}>
        <label>
          <span>Add new comment:</span>
          <textarea
            required
            onChange={handleCommentChange}
            value={newComment}
          />
        </label>
        <div className="char-count">
          {charCount}/{maxChars} characters
        </div>
        <button className="btn">Add comment</button>
        {commentError && <div className="error">{commentError}</div>}
      </form>
      <ul>
        {project.comments.length > 0 &&
          project.comments.map((comment) => (
            <li key={comment.id}>
              <div className="comment-author">
                <Avatar src={comment.photoURL} />
                <p>{comment.displayName}</p>
              </div>
              <div className="comment-date">{formatDistanceToNow(comment.createdAt.toDate(), {addSuffix: true})}</div>
              <div className="comment-content">
                <p>{comment.content}</p>
              </div>
              {comment.by === user.uid && (
                <img 
                  src={deleteIcon} 
                  alt="delete icon"
                  className="delete-icon"
                  onClick={() => {
                    handleDeleteComment(comment.by, comment.id)
                  }}
                />
              )}
            </li>
          ))}
      </ul>
    </div>
  );
}
