// src/lib/minio.ts
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const s3 = new S3Client({
  region: 'us-east-1',
  endpoint: 'http://localhost:9000',
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY || 'minio',
    secretAccessKey: process.env.MINIO_SECRET_KEY || 'minio123',
  },
});

export const BUCKET_NAME = 'employee-documents';

// Helper function to get public URL
export const getPublicUrl = (fileName: string) => {
  return `http://localhost:9000/${BUCKET_NAME}/${fileName}`;
};

// Helper function to upload file
export const uploadFile = async (file: File, fileName: string, folder: string = '') => {
  try {
    const buffer = await file.arrayBuffer();
    const bytes = Buffer.from(buffer);
    
    const key = folder ? `${folder}/${fileName}` : fileName;
    
    console.log('📤 Uploading to MinIO:', { bucket: BUCKET_NAME, key });
    
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: bytes,
      ContentType: file.type,
    });

    await s3.send(command);
    
    const url = getPublicUrl(key);
    console.log('✅ File uploaded successfully:', url);
    
    return url;
  } catch (error) {
    console.error('❌ MinIO upload error:', error);
    throw new Error(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Helper function to delete file
export const deleteFile = async (fileName: string) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
    });

    await s3.send(command);
    console.log('🗑️ File deleted:', fileName);
  } catch (error) {
    console.error('❌ MinIO delete error:', error);
    throw new Error(`Delete failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Helper function to get presigned download URL
export const getDownloadUrl = async (fileName: string, expiresIn: number = 3600) => {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
    });

    const url = await getSignedUrl(s3, command, { expiresIn });
    console.log('🔗 Generated download URL for:', fileName);
    return url;
  } catch (error) {
    console.error('❌ MinIO presigned URL error:', error);
    throw new Error(`Failed to generate download URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};