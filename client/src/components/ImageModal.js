import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const ImageModal = ({ image, show, onHide, onLike, user }) => {
  const isLiked = user && image.likes.some(like => like._id === user._id || like === user._id);

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{image.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center mb-3">
          <img 
            src={`http://localhost:5000${image.imageUrl}`} 
            alt={image.title} 
            className="img-fluid"
          />
        </div>
        <p>{image.description}</p>
      </Modal.Body>
      <Modal.Footer>
        <div className="d-flex justify-content-between w-100">
          <div>
            <button 
              className="btn btn-link text-danger p-0"
              onClick={() => onLike(image._id)}
              disabled={!user}
              title={user ? 'أعجبني' : 'يجب تسجيل الدخول للإعجاب'}
            >
              {isLiked ? <FaHeart /> : <FaRegHeart />}
              <span className="ms-1">{image.likes.length}</span>
            </button>
          </div>
          <div>
            رفع بواسطة: {image.user?.name || 'مستخدم مجهول'}
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ImageModal;