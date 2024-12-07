import { Storage } from "@google-cloud/storage";
import mime from 'mime-types';

const storage = new Storage();
const bucketName = 'tap-up-bucket';
const bucket = storage.bucket(bucketName);

function getContentType(fileName) {
    return mime.lookup(fileName) || 'application/octet-stream';
}

export async function generateUploadUrl(req, res) {
    const { fileName } = req.body;
    const file = bucket.file(`${req.userId}/${fileName}`);

    const contentType = getContentType(fileName);
    const options = {
        version: 'v4',
        action: 'write',
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
        contentType,
    };

    try {
        // Generate the signed URL
        const [url] = await file.getSignedUrl(options);
        return res.status(200).json({ url, contentType });
      } catch (error) {
        return res.status(500).json({ message: 'Failed to generate upload URL', error });
      }
}