import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload image to Cloudinary with automatic optimization
 * @param {Buffer} buffer - Image buffer
 * @param {string} fileName - Original filename
 * @param {string} contentType - MIME type
 * @returns {Promise<{url: string, publicId: string}>} - Cloudinary response
 */
export async function uploadToCloudinary(buffer, fileName, contentType) {
  try {
    // Create a sanitized filename without extension
    const sanitizedName = fileName
      .toLowerCase()
      .replace(/\.[^/.]+$/, "") // Remove extension
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Generate unique filename with timestamp
    const uniqueFileName = `${sanitizedName}-${Date.now()}`;

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "pracika-blog", // Organize in folder
          public_id: uniqueFileName,
          resource_type: "auto",
          // Automatic optimizations
          quality: "auto:best", // Auto quality based on content
          fetch_format: "auto", // Auto format (WebP when supported)
          // Image transformations
          transformation: [
            {
              width: 1200,
              height: 630,
              crop: "limit", // Don't upscale, only downscale if needed
              quality: "auto:good",
            },
          ],
          // Additional optimizations
          flags: "lossy", // Enable lossy compression
          // Metadata
          context: {
            alt: sanitizedName,
            caption: fileName,
          },
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(
              new Error(`Failed to upload to Cloudinary: ${error.message}`)
            );
          } else {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
              format: result.format,
              width: result.width,
              height: result.height,
              bytes: result.bytes,
            });
          }
        }
      );

      // Write buffer to stream
      uploadStream.end(buffer);
    });
  } catch (error) {
    console.error("Error in uploadToCloudinary:", error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
}

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Cloudinary public_id
 * @returns {Promise<boolean>} - Success status
 */
export async function deleteFromCloudinary(publicId) {
  try {
    if (!publicId) {
      throw new Error("Public ID is required for deletion");
    }

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
      invalidate: true, // Invalidate CDN cache
    });

    if (result.result === "ok") {
      console.log(`Successfully deleted from Cloudinary: ${publicId}`);
      return true;
    } else if (result.result === "not found") {
      console.log(`Image not found in Cloudinary: ${publicId}`);
      return false;
    } else {
      console.warn(`Unexpected result from Cloudinary: ${result.result}`);
      return false;
    }
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw new Error(`Failed to delete from Cloudinary: ${error.message}`);
  }
}

/**
 * Delete multiple images from Cloudinary
 * @param {string[]} publicIds - Array of Cloudinary public_ids
 * @returns {Promise<{success: string[], failed: string[]}>} - Results
 */
export async function deleteMultipleFromCloudinary(publicIds) {
  if (!Array.isArray(publicIds) || publicIds.length === 0) {
    return { success: [], failed: [] };
  }

  const results = {
    success: [],
    failed: [],
  };

  try {
    // Cloudinary allows bulk delete
    const result = await cloudinary.api.delete_resources(publicIds, {
      resource_type: "image",
      invalidate: true,
    });

    // Process results
    for (const publicId of publicIds) {
      if (result.deleted[publicId] === "deleted") {
        results.success.push(publicId);
      } else {
        results.failed.push(publicId);
      }
    }

    console.log(
      `Cloudinary bulk delete - Success: ${results.success.length}, Failed: ${results.failed.length}`
    );

    return results;
  } catch (error) {
    console.error("Cloudinary bulk delete error:", error);
    // If bulk delete fails, mark all as failed
    results.failed = [...publicIds];
    return results;
  }
}

/**
 * Check if image exists in Cloudinary
 * @param {string} publicId - Cloudinary public_id
 * @returns {Promise<boolean>} - Existence status
 */
export async function checkCloudinaryImageExists(publicId) {
  try {
    await cloudinary.api.resource(publicId, {
      resource_type: "image",
    });
    return true;
  } catch (error) {
    if (error.error?.http_code === 404) {
      return false;
    }
    throw error;
  }
}

/**
 * Get image metadata from Cloudinary
 * @param {string} publicId - Cloudinary public_id
 * @returns {Promise<object>} - Image metadata
 */
export async function getCloudinaryImageMetadata(publicId) {
  try {
    const result = await cloudinary.api.resource(publicId, {
      resource_type: "image",
    });

    return {
      publicId: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
      url: result.secure_url,
      createdAt: result.created_at,
      uploadedAt: result.uploaded_at,
    };
  } catch (error) {
    console.error("Error getting Cloudinary metadata:", error);
    throw new Error(`Failed to get metadata: ${error.message}`);
  }
}

/**
 * Extract Cloudinary public_id from URL
 * @param {string} url - Cloudinary URL
 * @returns {string|null} - Public ID or null
 */
export function extractPublicIdFromUrl(url) {
  try {
    if (!url || typeof url !== "string") return null;

    // Cloudinary URL pattern: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{public_id}.{format}
    const regex = /\/upload\/(?:v\d+\/)?(.+)\.\w+$/;
    const match = url.match(regex);

    if (match && match[1]) {
      return match[1];
    }

    return null;
  } catch (error) {
    console.error("Error extracting public ID from URL:", error);
    return null;
  }
}

/**
 * Generate optimized image URL with transformations
 * @param {string} publicId - Cloudinary public_id
 * @param {object} options - Transformation options
 * @returns {string} - Transformed image URL
 */
export function getOptimizedImageUrl(publicId, options = {}) {
  const {
    width = 1200,
    height = 630,
    crop = "limit",
    quality = "auto:good",
    format = "auto",
  } = options;

  return cloudinary.url(publicId, {
    transformation: [
      {
        width,
        height,
        crop,
        quality,
        fetch_format: format,
      },
    ],
    secure: true,
  });
}

// Default export for convenience
export default {
  uploadToCloudinary,
  deleteFromCloudinary,
  deleteMultipleFromCloudinary,
  checkCloudinaryImageExists,
  getCloudinaryImageMetadata,
  extractPublicIdFromUrl,
  getOptimizedImageUrl,
};
