// apps/backend/src/routes/upload.ts
import { Hono } from 'hono';
import { 
  uploadFile, 
  deleteFile, 
  getDownloadUrl, 
  generateEmployeeFilePath,
  createBucketIfNotExists 
} from '../lib/minio';

const uploadRoute = new Hono();

// Upload employee document with automatic folder creation
uploadRoute.post('/upload', async (c) => {
  try {
    // Ensure bucket exists
    await createBucketIfNotExists();
    
    const body = await c.req.parseBody();
    const file = body['file'] as File;
    const employeeId = body['employeeId'] as string;
    const documentType = body['documentType'] as string;

    if (!file || !employeeId || !documentType) {
      return c.json({
        success: false,
        error: 'File, employeeId, and documentType are required'
      }, 400);
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return c.json({
        success: false,
        error: 'File size must be less than 5MB'
      }, 400);
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      return c.json({
        success: false,
        error: 'Invalid file type. Only PDF, JPG, PNG, DOC, DOCX allowed'
      }, 400);
    }

    // Generate organized file path (automatically creates folders)
    const filePath = generateEmployeeFilePath(employeeId, documentType, file.name);
    
    console.log('📁 Auto-creating folder structure:', filePath.folderPath);
    
    // Upload to MinIO (folders created automatically)
    const url = await uploadFile(file, filePath.fileName, filePath.folderPath);

    return c.json({
      success: true,
      message: 'File uploaded successfully ✅',
      file: {
        originalName: file.name,
        fileName: filePath.fileName,
        fullPath: filePath.fullPath,
        folderPath: filePath.folderPath,
        url: url,
        size: file.size,
        type: file.type,
        uploadDate: new Date().toISOString(),
        employeeId: employeeId,
        documentType: documentType
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    }, 500);
  }
});

// Delete employee document
uploadRoute.delete('/delete/:employeeId/:documentType/:fileName', async (c) => {
  try {
    const { employeeId, documentType, fileName } = c.req.param();
    const fullPath = `${employeeId}/${documentType}/${fileName}`;

    await deleteFile(fullPath);

    return c.json({
      success: true,
      message: 'File deleted successfully ✅',
      deletedPath: fullPath
    });

  } catch (error) {
    console.error('Delete error:', error);
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Delete failed'
    }, 500);
  }
});

// Get download URL (for private access)
uploadRoute.get('/download/:employeeId/:documentType/:fileName', async (c) => {
  try {
    const { employeeId, documentType, fileName } = c.req.param();
    const fullPath = `${employeeId}/${documentType}/${fileName}`;

    const downloadUrl = await getDownloadUrl(fullPath);

    return c.json({
      success: true,
      downloadUrl: downloadUrl,
      path: fullPath
    });

  } catch (error) {
    console.error('Download error:', error);
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate download URL'
    }, 500);
  }
});

// List files for an employee (optional - for viewing uploaded documents)
uploadRoute.get('/files/:employeeId', async (c) => {
  try {
    const { employeeId } = c.req.param();
    
    // Note: This would require additional S3 ListObjects functionality
    // For now, return a placeholder response
    return c.json({
      success: true,
      employeeId: employeeId,
      message: 'File listing feature coming soon',
      // In future: list all files for this employee
    });

  } catch (error) {
    console.error('List files error:', error);
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to list files'
    }, 500);
  }
});

export default uploadRoute;