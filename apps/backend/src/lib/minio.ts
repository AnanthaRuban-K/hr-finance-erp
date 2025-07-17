// src/lib/minio.ts
import { 
  S3Client, 
  PutObjectCommand, 
  GetObjectCommand, 
  DeleteObjectCommand,
  CreateBucketCommand,
  PutBucketPolicyCommand,
  HeadBucketCommand,
  GetBucketPolicyCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const s3 = new S3Client({
  region: 'us-east-1',
  endpoint: process.env.MINIO_ENDPOINT || 'https://minio-api.sbrosenterpriseerp.com',
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY || 'admin',
    secretAccessKey: process.env.MINIO_SECRET_KEY || 'SBrosTech@2025',
  },
});

export const BUCKET_NAME = process.env.MINIO_BUCKET_NAME || 'employee-documents';

// Function to check if bucket exists
export const bucketExists = async (bucketName: string): Promise<boolean> => {
  try {
    await s3.send(new HeadBucketCommand({ Bucket: bucketName }));
    return true;
  } catch (error) {
    return false;
  }
};

// Function to set public read policy on bucket
export const setBucketPublicPolicy = async () => {
  try {
    const bucketPolicy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: '*',
          Action: 's3:GetObject',
          Resource: `arn:aws:s3:::${BUCKET_NAME}/*`
        }
      ]
    };

    const command = new PutBucketPolicyCommand({
      Bucket: BUCKET_NAME,
      Policy: JSON.stringify(bucketPolicy)
    });

    await s3.send(command);
    console.log(`✅ Public read policy set for bucket: ${BUCKET_NAME}`);
    return true;
  } catch (error) {
    console.error('❌ Error setting bucket policy:', error);
    // Don't throw error, just log it - bucket will still work for uploads
    return false;
  }
};

// Function to create bucket if it doesn't exist
export const createBucketIfNotExists = async () => {
  try {
    const exists = await bucketExists(BUCKET_NAME);
    
    if (!exists) {
      console.log(`📦 Creating bucket: ${BUCKET_NAME}`);
      
      // Create the bucket
      await s3.send(new CreateBucketCommand({ Bucket: BUCKET_NAME }));
      console.log(`✅ Bucket ${BUCKET_NAME} created successfully!`);
      
      // Wait a moment for bucket to be ready
      await new Promise(resolve => setTimeout(resolve, 2000));
    } else {
      console.log(`✅ Bucket ${BUCKET_NAME} already exists`);
    }

    // Try to set public policy
    const policySet = await setBucketPublicPolicy();
    
    return {
      bucketExists: true,
      policySet: policySet
    };
    
  } catch (error: any) {
    console.error('❌ Bucket creation error:', error.message);
    throw error;
  }
};

// Helper function to get public URL
export const getPublicUrl = (fileName: string) => {
  const endpoint = process.env.MINIO_ENDPOINT || 'https://minio-api.sbrosenterpriseerp.com';
  return `${endpoint}/${BUCKET_NAME}/${fileName}`;
};

// Helper function to upload file with automatic folder creation
export const uploadFile = async (file: File, fileName: string, folder: string = '') => {
  try {
    const buffer = await file.arrayBuffer();
    const bytes = Buffer.from(buffer);
    
    // Create the full path - folders are automatically created
    const key = folder ? `${folder}/${fileName}` : fileName;
    
    console.log('📤 Uploading to MinIO:', { 
      bucket: BUCKET_NAME, 
      key, 
      size: file.size,
      type: file.type 
    });
    
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: bytes,
      ContentType: file.type,
      // Add metadata for better file management
      Metadata: {
        'original-name': file.name,
        'uploaded-by': 'hr-erp-system',
        'upload-date': new Date().toISOString(),
        'file-size': file.size.toString()
      }
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

// Helper function to get presigned download URL (for private access)
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

// Function to check current bucket policy
export const checkBucketPolicy = async () => {
  try {
    const command = new GetBucketPolicyCommand({ Bucket: BUCKET_NAME });
    const response = await s3.send(command);
    return JSON.parse(response.Policy || '{}');
  } catch (error) {
    console.log('No bucket policy set');
    return null;
  }
};

// Test function to verify MinIO connection
export const testMinIOConnection = async () => {
  try {
    const exists = await bucketExists(BUCKET_NAME);
    const policy = await checkBucketPolicy();
    
    return {
      connected: true,
      bucketExists: exists,
      bucketName: BUCKET_NAME,
      hasPolicy: !!policy,
      endpoint: process.env.MINIO_ENDPOINT || 'https://minio-api.sbrosenterpriseerp.com'
    };
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : 'Connection failed'
    };
  }
};

// Generate organized file path for employee documents
export const generateEmployeeFilePath = (employeeId: string, documentType: string, fileName: string) => {
  // This automatically creates the folder structure:
  // employee-documents/EMP001/nric/timestamp_filename.pdf
  const timestamp = Date.now();
  const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const finalFileName = `${timestamp}_${cleanFileName}`;
  const folderPath = `${employeeId}/${documentType}`;
  
  return {
    fullPath: `${folderPath}/${finalFileName}`,
    folderPath: folderPath,
    fileName: finalFileName,
    originalName: fileName
  };
};