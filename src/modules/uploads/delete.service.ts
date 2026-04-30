import { cloudinary } from "../../config/cloudinary";

export function extractPublicIdFromUrl(url: string): string {
  try {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^/.]+)?$/);
    return match ? match[1] : "";
  } catch (error) {
    console.error("Error extracting public ID:", error);
    return "";
  }
}

export function deleteImageFromCloudinary(url: string) {
  return new Promise<void>((resolve, reject) => {
    const publicId = extractPublicIdFromUrl(url);
    
    if (!publicId) {
      console.warn("Could not extract public ID from URL:", url);
      resolve();
      return;
    }

    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        console.warn("Cloudinary delete error for", publicId, ":", error);
        resolve();
        return;
      }
      resolve();
    });
  });
}
