import { v2 as cloudinary } from "cloudinary";
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
} from "../config/configURLs";

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export class CloudinaryService {
  /**
   * Delete multiple files from Cloudinary by public IDs
   */
  static async deleteFiles(publicIds: string[]): Promise<void> {
    if (!publicIds || publicIds.length === 0) return;

    await cloudinary.api.delete_resources(publicIds, {
      invalidate: true,
    });
  }
}
export default CloudinaryService;
