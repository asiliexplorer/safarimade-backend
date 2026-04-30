import { cloudinary } from "../../config/cloudinary";

export type UploadedImage = {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
};

export function uploadBufferToCloudinary(file: Express.Multer.File, folder = "packages") {
  return new Promise<UploadedImage>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Upload failed"));
          return;
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
        });
      }
    );

    stream.end(file.buffer);
  });
}
