// components/ui/SimpleFileUpload.tsx
"use client";

import React, { useState } from 'react';
import { Upload, FileText, Download, Trash2, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileInfo {
  originalName: string;
  fileName: string;
  fullPath: string;
  folderPath: string;
  url: string;
  size: number;
  type: string;
  uploadDate: string;
  employeeId: string;
  documentType: string;
}

interface SimpleFileUploadProps {
  label: string;
  documentType: string;
  employeeId: string;
  required?: boolean;
  onUploadSuccess?: (file: FileInfo) => void;
  onError?: (error: string) => void;
  accept?: string;
  maxSize?: number; // in bytes
  className?: string;
  multiple?: boolean;
}

export const SimpleFileUpload: React.FC<SimpleFileUploadProps> = ({
  label,
  documentType,
  employeeId,
  required = false,
  onUploadSuccess,
  onError,
  accept = ".pdf,.jpg,.jpeg,.png,.doc,.docx",
  maxSize = 5 * 1024 * 1024, // 5MB default
  className = "",
  multiple = false
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<FileInfo[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // ✅ Use production API URL
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.sbrosenterpriseerp.com';

  const validateFile = (file: File): string | null => {
    // File size validation
    if (file.size > maxSize) {
      return `File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`;
    }

    // File type validation
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      return 'Invalid file type. Only PDF, JPG, PNG, DOC, DOCX allowed';
    }

    // File name validation
    const invalidChars = /[<>:"/\\|?*]/g;
    if (invalidChars.test(file.name)) {
      return 'File name contains invalid characters';
    }

    return null;
  };

  const handleFileUpload = async (file: File) => {
    if (!file || !employeeId) {
      onError?.('Employee ID is required for file upload');
      return;
    }

    const validationError = validateFile(file);
    if (validationError) {
      onError?.(validationError);
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('employeeId', employeeId);
      formData.append('documentType', documentType);

      console.log('📤 Uploading file:', { 
        fileName: file.name, 
        employeeId, 
        documentType, 
        size: file.size,
        type: file.type,
        apiUrl: `${API_BASE_URL}/api/upload`
      });

      // Create XMLHttpRequest for progress tracking
      const xhr = new XMLHttpRequest();
      
      return new Promise<void>((resolve, reject) => {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100);
            setUploadProgress(progress);
          }
        });

        xhr.addEventListener('load', async () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const result = JSON.parse(xhr.responseText);
              
              if (result.success) {
                console.log('✅ Upload successful:', result.file);
                setUploadedFiles(prev => [...prev, result.file]);
                onUploadSuccess?.(result.file);
                
                // Show success message
                onError?.(`✅ ${file.name} uploaded successfully!`);
                setTimeout(() => onError?.(''), 3000);
                resolve();
              } else {
                reject(new Error(result.error || 'Upload failed'));
              }
            } catch (e) {
              reject(new Error('Invalid server response'));
            }
          } else {
            reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Network error during upload'));
        });

        xhr.addEventListener('timeout', () => {
          reject(new Error('Upload timeout'));
        });

        xhr.open('POST', `${API_BASE_URL}/api/upload`);
        xhr.timeout = 60000; // 60 second timeout
        xhr.send(formData);
      });

    } catch (error) {
      console.error('❌ Upload error:', error);
      let errorMessage = 'Upload failed';
      
      if (error instanceof Error) {
        if (error.message.includes('Network error')) {
          errorMessage = 'Network error. Please check your internet connection.';
        } else if (error.message.includes('timeout')) {
          errorMessage = 'Upload timeout. Please try again with a smaller file.';
        } else if (error.message.includes('500')) {
          errorMessage = 'Server error. Please try again later.';
        } else if (error.message.includes('413')) {
          errorMessage = 'File too large. Please select a smaller file.';
        } else {
          errorMessage = error.message;
        }
      }
      
      onError?.(errorMessage);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      if (multiple) {
        Array.from(files).forEach(file => handleFileUpload(file));
      } else {
        handleFileUpload(files[0]);
      }
    }
    // Reset input value to allow re-uploading the same file
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      if (multiple) {
        Array.from(files).forEach(file => handleFileUpload(file));
      } else {
        handleFileUpload(files[0]);
      }
    }
  };

  const handleDelete = async (fileInfo: FileInfo) => {
    if (!confirm(`Are you sure you want to delete ${fileInfo.originalName}?`)) {
      return;
    }

    try {
      console.log('🗑️ Deleting file:', fileInfo.fullPath);
      
      const response = await fetch(
        `${API_BASE_URL}/api/delete/${employeeId}/${documentType}/${fileInfo.fileName}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error(`Delete failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        setUploadedFiles(prev => prev.filter(f => f.fileName !== fileInfo.fileName));
        console.log('✅ File deleted successfully');
        onError?.(`🗑️ ${fileInfo.originalName} deleted successfully`);
        setTimeout(() => onError?.(''), 3000);
      } else {
        throw new Error(result.error || 'Delete failed');
      }
    } catch (error) {
      console.error('❌ Delete error:', error);
      onError?.(error instanceof Error ? error.message : 'Delete failed');
    }
  };

  const handleView = (fileInfo: FileInfo) => {
    console.log('👁️ Opening file:', fileInfo.url);
    window.open(fileInfo.url, '_blank', 'noopener,noreferrer');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return '🖼️';
    } else if (fileType === 'application/pdf') {
      return '📄';
    } else if (fileType.includes('word')) {
      return '📝';
    }
    return '📎';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Label */}
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer ${
          dragOver 
            ? 'border-blue-400 bg-blue-50 scale-105' 
            : uploading 
            ? 'border-yellow-400 bg-yellow-50' 
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        } ${!employeeId ? 'opacity-50 cursor-not-allowed' : ''}`}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
        onClick={() => employeeId && !uploading && document.getElementById(`file-${documentType}`)?.click()}
      >
        <input
          id={`file-${documentType}`}
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleFileSelect}
          disabled={uploading || !employeeId}
          multiple={multiple}
        />

        {!employeeId ? (
          <div className="text-gray-500">
            <AlertCircle className="mx-auto h-8 w-8 text-gray-300 mb-2" />
            <p className="text-sm">Please enter Employee ID first</p>
          </div>
        ) : uploading ? (
          <div className="space-y-3">
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <span className="ml-2 text-gray-600">Uploading...</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">{uploadProgress}% complete</p>
          </div>
        ) : (
          <>
            <Upload className={`mx-auto h-12 w-12 transition-colors ${dragOver ? 'text-blue-500' : 'text-gray-400'}`} />
            <p className="mt-2 text-sm text-gray-600">
              {dragOver ? 'Drop files here' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-gray-500">
              PDF, DOC, DOCX, JPG, PNG (max {Math.round(maxSize / (1024 * 1024))}MB)
            </p>
            {employeeId && (
              <p className="text-xs text-blue-500 mt-1">
                📁 Files will be stored in: {employeeId}/{documentType}/
              </p>
            )}
          </>
        )}
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 flex items-center">
            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
            Uploaded Files ({uploadedFiles.length})
          </h4>
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{getFileIcon(file.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-green-800 truncate">{file.originalName}</p>
                  <p className="text-xs text-green-600">
                    {formatFileSize(file.size)} • {new Date(file.uploadDate).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    📁 {file.folderPath}/{file.fileName}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2 ml-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleView(file)}
                  title="View file"
                  className="text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(file)}
                  className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                  title="Delete file"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};