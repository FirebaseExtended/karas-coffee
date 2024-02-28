import * as admin from 'firebase-admin';
import {logger} from 'firebase-functions/v1';
import * as sharp from 'sharp';

export const isFromStorage = (image: string): boolean => {
  return image.startsWith('gs://');
};

export async function getImageBase64(
  image: string,
  provider: 'google-ai' | 'vertex-ai'
): Promise<string> {
  const {buffer, imageExtension} = await getImageFromStorage(image);

  const imageSize = buffer.byteLength / 1_000_000;

  if ((imageSize > 0.999 && provider === 'google-ai') || imageSize > 3.99) {
    return await compressImage(buffer, imageExtension, imageSize);
  }

  return buffer.toString('base64');
}

export async function getImageFromStorage(image: string) {
  // e.g from gs://invertase--palm-demo.appspot.com/the-matrix.jpeg
  // we get invertase--palm-demo.appspot.com
  const bucketName = extractBucketName(image);

  const fileName = image.split(bucketName + '/')[1];

  const imageExtension = fileName.split('.')[fileName.split('.').length - 1];

  if (!['jpg', 'jpeg', 'png'].includes(imageExtension)) {
    throw new Error('Unable to extract image extension.');
  }

  return {
    buffer: (
      await admin.storage().bucket(bucketName).file(fileName).download()
    )[0],
    imageExtension,
  };
}

export function extractBucketName(url: string) {
  if (!url.startsWith('gs://')) {
    throw new Error('Invalid URL format');
  }

  // Split the URL by '://'
  const parts = url.split('gs://');

  // Check if the URL is correctly formatted
  if (parts.length !== 2) {
    throw new Error('Invalid URL format');
  }

  // Further split the second part by '/' to isolate the bucket name
  const bucketAndPath = parts[1].split('/', 1);
  const bucketName = bucketAndPath[0];

  return bucketName;
}

export const compressImageBuffer = async (
  buffer: Buffer,
  imageExtension: string
) => {
  logger.info(`Compressing image with extension ${imageExtension}`);
  switch (imageExtension) {
    case 'png':
      return await sharp(buffer)
        .png({quality: 50, compressionLevel: 6})
        .resize(200, 200, {fit: 'inside'})
        .toBuffer();
    case 'jpg':
      return await sharp(buffer)
        .jpeg({quality: 50})
        .resize(200, 200, {fit: 'inside'})
        .toBuffer();
    case 'jpeg':
      return await sharp(buffer)
        .jpeg({quality: 50})
        .resize(200, 200, {fit: 'inside'})
        .toBuffer();
    default:
      throw new Error(`Image extension ${imageExtension} not supported.`);
  }
};

const compressImage = async (
  buffer: Buffer,
  imageExtension: string,
  imageSize: number
) => {
  logger.warn(
    `Image is too large (${imageSize}MB) for the selected Gemini API, extension will attempt to compress image.`
  );
  logger.info(`Compressing image with extension ${imageExtension}`);
  performance.mark('start-compress');
  const compressedImage = await compressImageBuffer(buffer, imageExtension);
  performance.mark('end-compress');
  const measure = performance.measure(
    'compress',
    'start-compress',
    'end-compress'
  );
  logger.info(`Compression took ${measure.duration}ms`);
  logger.info(
    `Compressed image size: ${compressedImage.byteLength / 1_000_000}MB`
  );
  return compressedImage.toString('base64');
};
