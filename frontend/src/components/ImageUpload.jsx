import { useState } from 'react';
import { Upload, X, Loader } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const ImageUpload = ({ onUploadSuccess, multiple = false }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const formData = new FormData();
      
      if (multiple) {
        // Upload multiple
        Array.from(files).forEach(file => {
          formData.append('images', file);
        });

        const response = await api.post(
          '/upload/multiple',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        const urls = response.data.images.map(img => img.url);
        onUploadSuccess(urls);
        toast.success(`${urls.length} image(s) uploadée(s) !`);
      } else {
        // Upload single
        formData.append('image', files[0]);

        // Preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(files[0]);

        const response = await api.post(
          '/upload',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        onUploadSuccess(response.data.url);
        toast.success('Image uploadée !');
      }
    } catch (error) {
      console.error('Erreur upload:', error);
      toast.error('Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  };

  const clearPreview = () => {
    setPreview(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <label className="flex-1">
          <div className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-accent hover:bg-gray-50 transition-all">
            {uploading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span className="text-sm">Upload en cours...</span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {multiple ? 'Choisir des images' : 'Choisir une image'}
                </span>
              </>
            )}
          </div>
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*,.pdf"
            multiple={multiple}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      {preview && !multiple && (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
          />
          <button
            onClick={clearPreview}
            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <p className="text-xs text-gray-500">
        Formats acceptés : JPG, PNG, WEBP, PDF (max 10MB)
      </p>
    </div>
  );
};

export default ImageUpload;

