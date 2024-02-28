import * as fs from 'fs';
import * as path from 'path';
import {compressImageBuffer, extractBucketName} from './image_utils';
describe('compressImageBuffer', () => {
  test('should compress large image', async () => {
    // get image fixture

    const imagePath = path.posix.join(
      __dirname,
      '../../__tests__/fixtures/large-image.jpg'
    );

    const imageBuffer = fs.readFileSync(imagePath);

    const compressed = await compressImageBuffer(imageBuffer, 'jpg');

    expect(compressed).toBeDefined();
    expect(compressed.length).toBeLessThan(imageBuffer.length);
    expect(compressed.length).toBeLessThan(900000);
  });
});

describe('extractBucketName', () => {
  test('extracts the bucket name from a valid URL', () => {
    const url = 'gs://my-bucket/path/to/object';
    expect(extractBucketName(url)).toBe('my-bucket');
  });

  test('throws an error for URLs not containing gs://', () => {
    const url = 'http://my-bucket/path/to/object';
    expect(() => extractBucketName(url)).toThrow('Invalid URL format');
  });

  test('throws an error for URLs with gs:// not at the start', () => {
    const url = 'http://my-bucket/gs://path/to/object';
    expect(() => extractBucketName(url)).toThrow('Invalid URL format');
  });

  test('handles URLs with only the bucket name after gs://', () => {
    const url = 'gs://my-bucket';
    expect(extractBucketName(url)).toBe('my-bucket');
  });

  test('throws an error for empty strings', () => {
    const url = '';
    expect(() => extractBucketName(url)).toThrow('Invalid URL format');
  });
});
