import React, { useState, useEffect } from 'react';
import { useAuth } from "../../../components/providers/supabase-auth-provider";
import StarRatings from "react-star-ratings";

type CommentItemProps = {
  comment: {
    comment_id: string;
    comment_text: string;
    user_display_name: string;
    user_id: string;
  };
  trainer_id: string;
  handleDelete: (comment_id: string) => void;
  handleUpdate: (comment_id: string, newComment: string) => void;
};

const CommentItem: React.FC<CommentItemProps> = ({ trainer_id, comment, handleDelete, handleUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.comment_text);
  const [prevText, setPrevText] = useState(comment.comment_text);
  const [rating, setRating] = useState(0);
  const { user } = useAuth();
  const fetchRatings = async () => {
    const response = await fetch(`/api/comments?trainer_id=${trainer_id}&user_id=${comment.user_id}`);
    if (response.status === 200) {
      const data = await response.json();
      setRating(data.rating);
    } else if(response.status != 400) {
      console.log("Error getting rating: ")
    }
  };
  useEffect(() => {
    fetchRatings();
  }, []);
  const onEdit = (e) => {
    e.stopPropagation();
    setIsEditing(true);
    setPrevText(editText);
    clearSelection();
  }
  
  const clearSelection = () => {
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
    } else if (document.selection) {
      document.selection.empty();
    }
  };

  const onSave = () => {
    handleUpdate(comment.comment_id, editText);
    setIsEditing(false);
  }

  const onCancelEdit = () => {
    setIsEditing(false);
    setEditText(prevText);
  }

  const onDelete = () => {
    handleDelete(comment.comment_id);
  }
return (
  <div className="relative group bg-gray-800 text-white p-4 rounded-lg shadow-md mb-4">
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-2">
      <h3 className="font-bold">{comment.user_display_name}</h3>
      <StarRatings
        rating={rating}
        starRatedColor="yellow"
        numberOfStars={5}
        name="rating"
        starDimension="20px"
        starHoverColor="yellow"
        starEmptyColor="gray"
      />
    </div>
    {user && user.id === comment.user_id && (
    <button
      onClick={onDelete}
      onMouseDown={e => e.preventDefault()}
      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center"
    >
      X
    </button>
    )}
  </div>

  {user && user.id == comment.user_id && isEditing ? (
        <div className="mt-2">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="bg-gray-200 text-black rounded-lg w-full"
            onClick={(e) => e.currentTarget.select()}
          />
          <div className="flex justify-end space-x-2 mt-2">
            <button 
              onClick={onCancelEdit}
              onMouseDown={e => e.preventDefault()}
              className="bg-red-500 text-white rounded-lg px-2 py-1"
            >
              Cancel
            </button>
            <button 
              onClick={onSave} 
              onMouseDown={e => e.preventDefault()}
              className="bg-green-500 text-white rounded-lg px-2 py-1"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <p className="mt-2" onDoubleClick={onEdit}>{comment.comment_text}</p>
      )}
    </div>
  );
};

export default CommentItem;
