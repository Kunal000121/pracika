import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Upload file to S3 (your existing function - unchanged)
 * @param {Buffer} buffer - File buffer
 * @param {string} fileName - File name
 * @param {string} contentType - MIME type
 * @returns {Promise<string>} - S3 object URL
 */
export async function uploadToS3(buffer, fileName, contentType) {
  const bucketName = process.env.AWS_S3_BUCKET_NAME;
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: `blog-images/${fileName}`,
    Body: buffer,
    ContentType: contentType,
    // ACL: "public-read",
  });

  try {
    await s3Client.send(command);
    return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/blog-images/${fileName}`;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw new Error("Failed to upload image to S3");
  }
}

/**
 * Delete file from S3
 * @param {string} key - S3 object key (e.g., "blog-images/filename.jpg")
 * @returns {Promise<boolean>} - Success status
 */
export async function deleteFromS3(key) {
  try {
    if (!key) {
      throw new Error("S3 key is required for deletion");
    }

    const bucketName = process.env.AWS_S3_BUCKET_NAME;

    // Check if object exists first
    try {
      const headCommand = new HeadObjectCommand({
        Bucket: bucketName,
        Key: key,
      });
      await s3Client.send(headCommand);
    } catch (headError) {
      if (
        headError.name === "NotFound" ||
        headError.$metadata?.httpStatusCode === 404
      ) {
        console.log(`Object not found in S3: ${key}`);
        return false; // Object doesn't exist, consider it "deleted"
      }
      throw headError;
    }

    // Delete the object
    const deleteCommand = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    await s3Client.send(deleteCommand);

    return true;
  } catch (error) {
    console.error("S3 delete error:", error);
    throw new Error(`Failed to delete from S3: ${error.message}`);
  }
}

/**
 * Delete multiple files from S3
 * @param {string[]} keys - Array of S3 object keys
 * @returns {Promise<{success: string[], failed: string[]}>} - Results
 */
export async function deleteMultipleFromS3(keys) {
  if (!Array.isArray(keys) || keys.length === 0) {
    return { success: [], failed: [] };
  }

  try {
    const bucketName = process.env.AWS_S3_BUCKET_NAME;

    const command = new DeleteObjectsCommand({
      Bucket: bucketName,
      Delete: {
        Objects: keys.map((key) => ({ Key: key })),
        Quiet: false,
      },
    });

    const result = await s3Client.send(command);

    const success = result.Deleted?.map((item) => item.Key) || [];
    const failed = result.Errors?.map((error) => error.Key) || [];

    console.log(
      `S3 bulk delete - Success: ${success.length}, Failed: ${failed.length}`
    );

    return { success, failed };
  } catch (error) {
    console.error("S3 bulk delete error:", error);
    throw new Error(`Failed to delete multiple from S3: ${error.message}`);
  }
}

/**
 * Check if file exists in S3
 * @param {string} key - S3 object key
 * @returns {Promise<boolean>} - Existence status
 */
export async function checkS3ObjectExists(key) {
  try {
    const bucketName = process.env.AWS_S3_BUCKET_NAME;

    const command = new HeadObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    await s3Client.send(command);
    return true;
  } catch (error) {
    if (error.name === "NotFound" || error.$metadata?.httpStatusCode === 404) {
      return false;
    }
    throw error;
  }
}

/**
 * Get S3 object metadata
 * @param {string} key - S3 object key
 * @returns {Promise<object>} - Object metadata
 */
export async function getS3ObjectMetadata(key) {
  try {
    const bucketName = process.env.AWS_S3_BUCKET_NAME;

    const command = new HeadObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    const result = await s3Client.send(command);

    return {
      size: result.ContentLength,
      lastModified: result.LastModified,
      contentType: result.ContentType,
      etag: result.ETag,
    };
  } catch (error) {
    console.error("Error getting S3 object metadata:", error);
    throw new Error(`Failed to get metadata: ${error.message}`);
  }
}

// Default export for convenience
export default {
  uploadToS3,
  deleteFromS3,
  deleteMultipleFromS3,
  checkS3ObjectExists,
  getS3ObjectMetadata,
};
