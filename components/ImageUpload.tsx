import React, { useState, useEffect } from 'react';
import { Upload, X, Fingerprint } from 'lucide-react';

interface ImageUploadProps {
  label: string;
  imageFile: File | null;
  onImageChange: (file: File | null) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ label, imageFile, onImageChange }) => {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (imageFile) {
      const objectUrl = URL.createObjectURL(imageFile);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview(null);
    }
  }, [imageFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageChange(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    onImageChange(null);
  };

  return (
    <div className="flex flex-col w-full">
      <label className="text-slate-700 font-bold mb-2 block text-sm">{label}</label>
      
      {preview ? (
        <div className="relative w-full h-64 bg-slate-100 rounded-xl border-2 border-slate-200 overflow-hidden group shadow-sm">
          <img 
            src={preview} 
            alt="Fingerprint preview" 
            className="w-full h-full object-contain p-2 opacity-90 grayscale contrast-125" 
          />
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
            title="إزالة الصورة"
          >
            <X size={20} />
          </button>
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
            {imageFile?.name}
          </div>
        </div>
      ) : (
        <div className="relative w-full h-64 bg-white rounded-xl border-2 border-dashed border-slate-300 hover:border-indigo-500 hover:bg-indigo-50 transition-colors cursor-pointer flex flex-col items-center justify-center group">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="bg-indigo-100 p-4 rounded-full mb-3 group-hover:scale-110 transition-transform duration-300">
            <Fingerprint className="text-indigo-600 w-8 h-8" />
          </div>
          <p className="text-slate-600 font-medium text-sm group-hover:text-indigo-700">اضغط لرفع صورة البصمة</p>
          <p className="text-slate-400 text-xs mt-1">JPG, PNG, WEBP</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
