"use client";

import React, { useState } from 'react';
import { Upload, FileText, Download, Trash2, Loader2 } from 'lucide-react';
import { Button } from './button';

interface FileInfo {
  originalName: string;
  fileName: string;
  folder: string;
  url: string;
  size: number;
  type: string;
  uploadDate: string;
}

interface SimpleFileUploadProps {
  label: string;
  documentType: string;
  employeeId: string;
  required?: boolean;
  onUploadSuccess?: (file: FileInfo) => void;
  onError?: (error: string) => void;
}

const SimpleFileUpload: React.FC<SimpleFileUploadProps> = ({
  label,
  documentType,
  employeeId,
  required = false,
  onUploadSuccess,
  onError
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<FileInfo[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // ✅ DEBUG: Log API URL on component mount
  React.useEffect(() => {
    console.log('🌐 SimpleFileUpload mounted with API_BASE_URL:', API_BASE_URL);
    console.log('📋 Document type:', documentType);
    console.log('👤 Employee ID:', employeeId);
  }, [API_BASE_URL, documentType, employeeId]);

  const handleFileUpload = async (file: File) => {
    console.log('🚀 handleFileUpload called');
    console.log('📁 File details:', {
      name: file.name,
      size: file.size,
      type: file.type
    });
    console.log('👤 Employee ID:', employeeId);
    console.log('📋 Document type:', documentType);

    if (!file || !employeeId) {
      console.log('❌ Missing file or employeeId');
      onError?.('Employee ID is required for file upload');
      return;
    }

    // Validate file size and type
    if (file.size > 5 * 1024 * 1024) {
      console.log('❌ File too large:', file.size);
      onError?.('File size must be less than 5MB');
      return;
    }

    const allowedTypes = [
      'application/pdf', 
      'image/jpeg', 
      'image/png', 
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      console.log('❌ Invalid file type:', file.type);
      onError?.('Invalid file type. Only PDF, JPG, PNG, DOC, DOCX allowed');
      return;
    }

    console.log('✅ File validation passed');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('employeeId', employeeId);
      formData.append('documentType', documentType);

      console.log('📦 FormData created');
      console.log('🎯 Making request to:', `${API_BASE_URL}/api/upload`);

      // ✅ Add timeout to prevent infinite loading
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log('⏰ Request timeout after 30 seconds');
        controller.abort();
      }, 30000); // 30 second timeout

      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
        // ✅ Don't set Content-Type header, let browser set it for FormData
      });

      clearTimeout(timeoutId);

      console.log('📨 Response received');
      console.log('📊 Status:', response.status);
      console.log('📊 Status text:', response.statusText);
      console.log('📊 OK:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('❌ Error response body:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('📨 Response data:', result);

      if (result.success) {
        console.log('✅ Upload successful');
        setUploadedFiles(prev => [...prev, result.file]);
        onUploadSuccess?.(result.file);
      } else {
        console.log('❌ Upload failed:', result.error);
        throw new Error(result.error || 'Upload failed');
      }

    } catch (error) {
      console.error('❌ Upload error:', error);
      
      if (error.name === 'AbortError') {
        onError?.('Upload timeout - please try again');
      } else {
        onError?.(error instanceof Error ? error.message : 'Upload failed');
      }
    } finally {
      setUploading(false);
      console.log('🏁 Upload process finished');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('📂 File selected from input');
    const file = e.target.files?.[0];
    if (file) {
      console.log('📁 Selected file:', file.name);
      handleFileUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    console.log('📂 File dropped');
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      console.log('📁 Dropped file:', file.name);
      handleFileUpload(file);
    }
  };

  const handleDelete = async (fileInfo: FileInfo) => {
    console.log('🗑️ Delete file:', fileInfo.fileName);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/delete/${employeeId}/${documentType}/${fileInfo.fileName}`,
        { method: 'DELETE' }
      );

      const result = await response.json();

      if (result.success) {
        setUploadedFiles(prev => prev.filter(f => f.fileName !== fileInfo.fileName));
        console.log('✅ File deleted successfully');
      } else {
        onError?.(result.error || 'Delete failed');
      }
    } catch (error) {
      console.error('❌ Delete error:', error);
      onError?.('Delete failed');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* ✅ DEBUG: Show current state */}
      <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
        <strong>Debug Info:</strong><br/>
        API URL: {API_BASE_URL}<br/>
        Employee ID: {employeeId || 'Not set'}<br/>
        Document Type: {documentType}<br/>
        Uploading: {uploading ? 'Yes' : 'No'}
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
          dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        } ${!employeeId ? 'opacity-50 cursor-not-allowed' : ''}`}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
        onClick={() => {
          console.log('📂 Upload area clicked');
          if (employeeId) {
            document.getElementById(`file-${documentType}`)?.click();
          }
        }}
      >
        <input
          id={`file-${documentType}`}
          type="file"
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          onChange={handleFileSelect}
          disabled={uploading || !employeeId}
        />

        {!employeeId ? (
          <div className="text-gray-500">
            <Upload className="mx-auto h-8 w-8 text-gray-300 mb-2" />
            <p className="text-sm">Please enter Employee ID first</p>
          </div>
        ) : uploading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600">Uploading...</span>
          </div>
        ) : (
          <>
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-500">PDF, DOC, DOCX, JPG, PNG (max 5MB)</p>
          </>
        )}
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">{file.originalName}</p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)} • {new Date(file.uploadDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(file.url, '_blank')}
                  title="View file"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(file)}
                  className="text-red-600 hover:text-red-700"
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