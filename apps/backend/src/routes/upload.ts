// src/routes/upload.ts
import { Hono } from 'hono';
import { uploadFile, deleteFile, getDownloadUrl } from '../lib/minio.js';

const app = new Hono();

// Test route to verify upload routes are working
app.get('/test', (c) => {
  return c.json({ 
    message: 'Upload routes working! ✅',
    timestamp: new Date().toISOString()
  });
});

// Upload employee document
app.post('/upload', async (c) => {
  try {
    console.log('📁 Upload request received');
    
    const body = await c.req.parseBody();
    const file = body['file'] as File;
    const employeeId = body['employeeId'] as string;
    const documentType = body['documentType'] as string;

    console.log('📋 Request details:', { 
      fileName: file?.name, 
      fileSize: file?.size,
      fileType: file?.type,
      employeeId, 
      documentType 
    });

    if (!file || !employeeId || !documentType) {
      console.log('❌ Missing required fields');
      return c.json({ 
        success: false, 
        error: 'File, employeeId, and documentType are required' 
      }, 400);
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      console.log('❌ File too large:', file.size);
      return c.json({ 
        success: false, 
        error: 'File size must be less than 5MB' 
      }, 400);
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf', 
      'image/jpeg', 
      'image/png', 
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      console.log('❌ Invalid file type:', file.type);
      return c.json({ 
        success: false, 
        error: 'Invalid file type. Only PDF, JPG, PNG, DOC, DOCX allowed' 
      }, 400);
    }

    // Create organized filename
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const folder = `${employeeId}/${documentType}`;

    console.log('📤 Uploading file:', { fileName, folder });

    // Upload to MinIO
    const url = await uploadFile(file, fileName, folder);

    console.log('✅ Upload completed successfully');

    return c.json({
      success: true,
      message: 'File uploaded successfully ✅',
      file: {
        originalName: file.name,
        fileName: fileName,
        folder: folder,
        url: url,
        size: file.size,
        type: file.type,
        uploadDate: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Upload error:', error);
    return c.json({ 
      success: false, 
      error: 'Upload failed: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, 500);
  }
});

// Delete employee document
app.delete('/delete/:employeeId/:documentType/:fileName', async (c) => {
  try {
    const { employeeId, documentType, fileName } = c.req.param();
    const fullPath = `${employeeId}/${documentType}/${fileName}`;

    console.log('🗑️ Delete request for:', fullPath);

    await deleteFile(fullPath);

    console.log('✅ File deleted successfully');

    return c.json({
      success: true,
      message: 'File deleted successfully ✅'
    });

  } catch (error) {
    console.error('❌ Delete error:', error);
    return c.json({ 
      success: false, 
      error: 'Delete failed: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, 500);
  }
});

// Get download URL
app.get('/download/:employeeId/:documentType/:fileName', async (c) => {
  try {
    const { employeeId, documentType, fileName } = c.req.param();
    const fullPath = `${employeeId}/${documentType}/${fileName}`;

    console.log('🔗 Download URL request for:', fullPath);

    const downloadUrl = await getDownloadUrl(fullPath);

    return c.json({
      success: true,
      downloadUrl: downloadUrl
    });

  } catch (error) {
    console.error('❌ Download URL error:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to generate download URL: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, 500);
  }
});

export default app;