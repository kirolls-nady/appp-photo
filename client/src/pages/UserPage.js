import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ImageCard from '../components/ImageCard';
import EditImageModal from '../components/EditImageModal';

const UserPage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [editingImage, setEditingImage] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // جلب صور المستخدم
  useEffect(() => {
    const fetchUserImages = async () => {
      try {
        const res = await axios.get('/images/user');
        setImages(res.data);
      } catch (err) {
        console.error('فشل في جلب الصور:', err);
        setError('فشل في جلب الصور');
      } finally {
        setLoading(false);
      }
    };

    fetchUserImages();
  }, []);

  // تنظيف رابط المعاينة بعد التغيير
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUploadImage = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      setError('يرجى اختيار صورة');
      return;
    }

    if (!title) {
      setError('يرجى إضافة عنوان للصورة');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('title', title);
      formData.append('description', description);

      const res = await axios.post('/images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setImages([res.data, ...images]);
      setTitle('');
      setDescription('');
      setImageFile(null);
      setPreview(null);
      setError('');
    } catch (err) {
      console.error('فشل في رفع الصورة:', err);
      setError(err.response?.data?.message || 'فشل في رفع الصورة');
    }
  };

  const handleUpdate = async (updatedData) => {
    try {
      const res = await axios.put(`/images/${editingImage._id}`, updatedData);

      setImages(images.map(img =>
        img._id === editingImage._id ? { ...img, ...res.data } : img
      ));

      setEditingImage(null);
      setShowEditModal(false);
    } catch (err) {
      console.error('فشل في تحديث الصورة:', err);
    }
  };

  const handleDelete = async (imageId) => {
    try {
      await axios.delete(`/images/${imageId}`);
      setImages(images.filter(img => img._id !== imageId));
    } catch (err) {
      console.error('فشل في حذف الصورة:', err);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">جار التحميل...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-center mb-4">صوري</h1>

      <div className="card mb-4">
        <div className="card-body">
          <h2 className="card-title mb-3">رفع صورة جديدة</h2>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleUploadImage}>
            <div className="mb-3">
              <label htmlFor="imageFile" className="form-label">اختر صورة (JPEG, PNG)</label>
              <input
                type="file"
                className="form-control"
                id="imageFile"
                accept="image/jpeg,image/png"
                onChange={handleFileChange}
                required
              />
            </div>

            {preview && (
              <div className="mb-3">
                <img
                  src={preview}
                  alt="معاينة الصورة"
                  className="img-thumbnail"
                  style={{ maxHeight: '200px' }}
                />
              </div>
            )}

            <div className="mb-3">
              <label htmlFor="title" className="form-label">عنوان الصورة</label>
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
              <label htmlFor="description" className="form-label">وصف الصورة</label>
              <textarea
                className="form-control"
                id="description"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary">رفع الصورة</button>
          </form>
        </div>
      </div>

      <h2 className="mb-3">الصور المرفوعة</h2>

      {images.length === 0 ? (
        <div className="alert alert-info">لم تقم برفع أي صور بعد</div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {images.map(image => (
            <div className="col" key={image._id}>
              <ImageCard
                image={image}
                onEdit={() => {
                  setEditingImage(image);
                  setShowEditModal(true);
                }}
                onDelete={() => handleDelete(image._id)}
                isOwner={true}
              />
            </div>
          ))}
        </div>
      )}

      {editingImage && (
        <EditImageModal
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          image={editingImage}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default UserPage;
