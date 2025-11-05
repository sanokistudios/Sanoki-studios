import { useEffect, useState } from 'react';
import { lookbookAPI } from '../utils/api';
import { X } from 'lucide-react';

const Lookbook = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const response = await lookbookAPI.getAll();
      setImages(response.data.images || []);
    } catch (error) {
      console.error('Erreur lors du chargement du lookbook:', error);
    } finally {
      setLoading(false);
    }
  };

  const openLightbox = (image, index) => {
    setSelectedImage(image);
    setSelectedIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const goToNext = () => {
    const nextIndex = (selectedIndex + 1) % images.length;
    setSelectedIndex(nextIndex);
    setSelectedImage(images[nextIndex]);
  };

  const goToPrev = () => {
    const prevIndex = (selectedIndex - 1 + images.length) % images.length;
    setSelectedIndex(prevIndex);
    setSelectedImage(images[prevIndex]);
  };

  // Navigation clavier
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedImage) return;
      
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        goToPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, selectedIndex]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Lookbook</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Découvrez notre collection à travers notre galerie d'images
          </p>
        </div>
      </div>

      {/* Gallery */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {images.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Aucune image dans le lookbook pour le moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div
                key={image._id}
                className="group relative overflow-hidden cursor-pointer rounded-lg aspect-square bg-gray-100"
                onClick={() => openLightbox(image, index)}
              >
                <img
                  src={image.imageUrl}
                  alt={image.title || `Lookbook ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                
                {/* Overlay avec info */}
                {(image.title || image.description) && (
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-end p-6">
                    <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {image.title && (
                        <h3 className="text-xl font-bold mb-1">{image.title}</h3>
                      )}
                      {image.description && (
                        <p className="text-sm">{image.description}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4">
          {/* Bouton fermer */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
            aria-label="Fermer"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Navigation précédent */}
          {images.length > 1 && (
            <button
              onClick={goToPrev}
              className="absolute left-4 text-white hover:text-gray-300 transition-colors z-10"
              aria-label="Précédent"
            >
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Image */}
          <div className="max-w-5xl max-h-[90vh] w-full h-full flex flex-col items-center justify-center">
            <img
              src={selectedImage.imageUrl}
              alt={selectedImage.title || 'Lookbook'}
              className="max-w-full max-h-[80vh] object-contain"
            />
            
            {/* Info image */}
            {(selectedImage.title || selectedImage.description) && (
              <div className="text-white text-center mt-6 max-w-2xl">
                {selectedImage.title && (
                  <h3 className="text-2xl font-bold mb-2">{selectedImage.title}</h3>
                )}
                {selectedImage.description && (
                  <p className="text-gray-300">{selectedImage.description}</p>
                )}
              </div>
            )}

            {/* Compteur */}
            <div className="text-white text-sm mt-4">
              {selectedIndex + 1} / {images.length}
            </div>
          </div>

          {/* Navigation suivant */}
          {images.length > 1 && (
            <button
              onClick={goToNext}
              className="absolute right-4 text-white hover:text-gray-300 transition-colors z-10"
              aria-label="Suivant"
            >
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Lookbook;

