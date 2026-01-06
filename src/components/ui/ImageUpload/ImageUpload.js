"use client";

import toast from "react-hot-toast";
import { processImage } from "../../../lib/utils/imageProcessor";

export default function ImageUpload({
  images = [],
  setImages,
  multiple = false,
  label = "Upload Image",
}) {
  const handleChange = async (e) => {
    const files = Array.from(e.target.files);
    let updated = [...images];

    for (let file of files) {
      // type check
      if (!file.type.startsWith("image/")) {
        toast.error("Only image files allowed");
        return;
      }

      // process (compress)
      const processed = await processImage(file);

      updated.push(processed);
    }

    setImages(multiple ? updated : [updated[0]]);
  };

  return (
    <div>
      <label>{label}</label>
      <input
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleChange}
      />
    </div>
  );
}
