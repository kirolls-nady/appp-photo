import React from 'react';
import { FaHeart, FaRegHeart, FaEdit, FaTrash } from 'react-icons/fa';

const ImageCard = ({ image, onLike, onOpen, onEdit, onDelete, isOwner, user }) => {
  const isLiked = user && image.likes.some(like => like._id === user._id || like === user._id);

  return (
    <div className="card h-100">
      <img 
        src={`http://localhost:5000${image.imageUrl}`} 
        alt={image.title} 
        className="card-img-top"
        style={{ height: '200px', objectFit: 'cover', cursor: 'pointer' }}
        onClick={() => onOpen && onOpen(image)}
      />
      <div className="card-body">
        <h5 className="card-title">{image.title}</h5>
        <p className="card-text">{image.description}</p>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            {onLike && (
              <button 
                className="btn btn-link text-danger p-0"
                onClick={() => onLike(image._id)}
                disabled={!user}
                title={user ? 'أعجبني' : 'يجب تسجيل الدخول للإعجاب'}
              >
                {isLiked ? <FaHeart /> : <FaRegHeart />}
                <span className="ms-1">{image.likes.length}</span>
              </button>
            )}
          </div>
          {isOwner && (
            <div>
              <button 
                className="btn btn-link text-primary p-0 me-2"
                onClick={() => onEdit(image)}
                title="تعديل"
              >
                <FaEdit />
              </button>
              <button 
                className="btn btn-link text-danger p-0"
                onClick={() => onDelete(image._id)}
                title="حذف"
              >
                <FaTrash />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="card-footer text-muted small">
        رفع بواسطة: {image.user?.name || 'مستخدم مجهول'}
      </div>
    </div>
  );
};

export default ImageCard;