
import React, { useState, useEffect } from 'react';
import { Fingerprint } from 'lucide-react';
import ImageEnhancer from './ImageEnhancer';

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
      <label className="text-slate-700 font-bold mb-2 block text-sm flex justify-between items-center">
        {label}
        {imageFile && <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{imageFile.name}</span>}
      </label>
      
      {preview && imageFile ? (
        <ImageEnhancer 
          src={preview} 
          fileName={imageFile.name} 
          onRemove={handleRemove} 
        />
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
