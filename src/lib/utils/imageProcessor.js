import imageCompression from "browser-image-compression";

// 5MB limit
const MAX_SIZE_MB = 5;

export const processImage = async (file) => {
  // size check
  if (file.size / (1024 * 1024) <= MAX_SIZE_MB) {
    return file;
  }

  // compress like mobile code
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1080,
    useWebWorker: true,
    initialQuality: 1,
  };

  const compressedFile = await imageCompression(file, options);
  return compressedFile;
};
