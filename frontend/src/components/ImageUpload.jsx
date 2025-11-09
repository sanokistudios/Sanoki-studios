import { useState } from 'react';
import { Upload, X, Loader, FileText } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const ImageUpload = ({ onUploadSuccess, multiple = false }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [isPDFPreview, setIsPDFPreview] = useState(false);

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Vérifier la taille totale avant l'upload (pour uploads multiples)
    if (multiple && files.length > 1) {
      const totalSize = Array.from(files).reduce((sum, file) => sum + file.size, 0);
      const totalSizeMB = totalSize / 1024 / 1024;
      
      console.log(`📊 ${files.length} fichiers sélectionnés, taille totale: ${totalSizeMB.toFixed(2)} MB`);
      
      if (totalSize > 30 * 1024 * 1024) {
        toast.error(`Taille totale trop importante (${totalSizeMB.toFixed(2)} MB). Maximum: 30 MB pour tous les fichiers combinés.`);
        e.target.value = ''; // Reset l'input
        return;
      }
      
      if (totalSizeMB > 20) {
        toast(`⚠️ Taille importante (${totalSizeMB.toFixed(2)} MB). L'upload peut prendre du temps...`, {
          icon: '⏳',
          duration: 4000
        });
      }
    }

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
        toast.success(`${urls.length} fichier(s) uploadé(s) !`);
      } else {
        // Upload single
        formData.append('image', files[0]);

        // Preview
        const file = files[0];
        const isPDF = file.type === 'application/pdf';
        setIsPDFPreview(isPDF);

        if (!isPDF) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreview(reader.result);
          };
          reader.readAsDataURL(file);
        } else {
          setPreview(file.name);
        }

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
        toast.success('Fichier uploadé !');
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
    setIsPDFPreview(false);
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
                  {multiple ? 'Choisir des fichiers' : 'Choisir un fichier'}
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
          {isPDFPreview ? (
            <div className="w-32 h-32 bg-gray-100 border-2 border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2">
              <FileText className="w-12 h-12 text-red-600" />
              <span className="text-xs text-gray-600 font-medium text-center px-2">
                {preview}
              </span>
            </div>
          ) : (
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
            />
          )}
          <button
            onClick={clearPreview}
            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <p className="text-xs text-gray-500">
        {multiple 
          ? 'Formats acceptés : JPG, PNG, WEBP, PDF. Max 10MB par fichier, 30MB au total (5 fichiers max)'
          : 'Formats acceptés : JPG, PNG, WEBP, PDF (max 10MB)'
        }
      </p>
    </div>
  );
};

export default ImageUpload;

