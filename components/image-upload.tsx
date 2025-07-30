
'use client';

import { useState, useCallback } from 'react';
import { Upload, X, Loader2, Camera, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  onAnalysisResult?: (result: any) => void;
  isAnalyzing?: boolean;
  className?: string;
}

export function ImageUpload({ 
  onImageUpload, 
  onAnalysisResult, 
  isAnalyzing = false,
  className = '' 
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, []);

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
    setFileName(file.name);
    onImageUpload(file);
  };

  const clearImage = () => {
    setPreviewUrl(null);
    setFileName('');
  };

  const isImage = previewUrl !== null;

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        } ${isAnalyzing ? 'pointer-events-none opacity-50' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/*,.pdf,.doc,.docx"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isAnalyzing}
        />
        
        {isAnalyzing ? (
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
            <div>
              <p className="text-lg font-medium text-gray-900">Analyzing image...</p>
              <p className="text-sm text-gray-600">AI is extracting equipment details</p>
            </div>
          </div>
        ) : previewUrl ? (
          <div className="space-y-4">
            <div className="relative mx-auto w-48 h-48 rounded-lg overflow-hidden">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={clearImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-600">{fileName}</p>
          </div>
        ) : fileName ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                <FileText className="h-12 w-12 text-gray-400" />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="ml-4"
                onClick={clearImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-600">{fileName}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center space-x-4">
              <Camera className="h-12 w-12 text-gray-400" />
              <FileText className="h-12 w-12 text-gray-400" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900">
                Upload equipment photo or document
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Drag and drop files here, or click to select
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Supports images (JPG, PNG) and documents (PDF, DOC)
              </p>
            </div>
            <Button type="button" variant="outline" className="mt-4">
              <Upload className="h-4 w-4 mr-2" />
              Choose Files
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
