import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const EditImageModal = ({ image, show, onHide, onUpdate }) => {
  const [title, setTitle] = useState(image.title);
  const [description, setDescription] = useState(image.description);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    await onUpdate({ title, description });
    setLoading(false);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>تعديل الصورة</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">العنوان</label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">الوصف</label>
          <textarea
            className="form-control"
            id="description"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>إلغاء</Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'جارٍ التحديث...' : 'حفظ التغييرات'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditImageModal;