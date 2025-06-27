import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ImageCard from '../components/ImageCard';
import ImageModal from '../components/ImageModal';

const HomePage = ({ user }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get('/images');
        setImages(res.data);
        setLoading(false);
      } catch (err) {
        console.error('فشل في جلب الصور:', err);
        setLoading(false);
      }
    };
    
    fetchImages();
  }, []);

  const handleLike = async (imageId) => {
    if (!user) return;
    
    try {
      const res = await axios.post(`/images/${imageId}/like`);
      setImages(images.map(img => 
        img._id === imageId ? { ...img, likes: res.data.likes } : img
      ));
    } catch (err) {
      console.error('فشل في الإعجاب بالصورة:', err);
    }
  };

  const openImage = (image) => {
    setSelectedImage(image);
    setShowModal(true);
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
      <h1 className="text-center mb-4">آخر الصور المضافة</h1>
      
      {images.length === 0 ? (
        <div className="alert alert-info text-center">لا توجد صور متاحة</div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {images.map(image => (
            <div className="col" key={image._id}>
              <ImageCard 
                image={image} 
                onLike={handleLike} 
                onOpen={openImage}
                user={user}
              />
            </div>
          ))}
        </div>
      )}
      
      {selectedImage && (
        <ImageModal 
          image={selectedImage} 
          show={showModal} 
          onHide={() => setShowModal(false)}
          onLike={handleLike}
          user={user}
        />
      )}
    </div>
  );
};

export default HomePage;