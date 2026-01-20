"use client";
import { useRef, useState } from "react";
import "./BannerImageModal.css";

export default function BannerImageModal({
  images = [],
  onClose,
  onSave,
}) {
  const fileRef = useRef(null);
  const [previewImages, setPreviewImages] = useState(images);

  const handleFiles = (files) => {
    const list = Array.from(files)
      .slice(0, 4 - previewImages.length)
      .map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));

    setPreviewImages((prev) => [...prev, ...list]);
  };

  const removeImage = (index) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave(previewImages);
  };

  const handleReset = () => {
    setPreviewImages([]);
  };

  return (
    <div className="banner-modal-overlay">
      <div className="banner-modal">

        {/* HEADER */}
        <div className="modal-header">
          <h3>Banner Image</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {/* UPLOAD BOX */}
        <div
          className="upload-box"
          onClick={() => fileRef.current.click()}
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => handleFiles(e.target.files)}
          />

          <p>
            <b>Choose the file</b> or drag it here Up to 1–4 images
            <span>*</span>
          </p>
          <small>
            JPEG/JPG/PNG must be 1200×480 px or 1:1 ratio, and under 500 kb
          </small>

          {/* IMAGE PREVIEW – INSIDE BOX */}
          {previewImages.length > 0 && (
            <div className="preview-row">
              {previewImages.map((img, index) => (
                <div key={index} className="preview-img">
                  <img src={img.url || img} alt="preview" />
                  <span onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}>×</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="modal-footer">
          <button className="btn-reset" onClick={handleReset}>
            Reset
          </button>
          <button className="btn-save" onClick={handleSave}>
            Save
          </button>
        </div>

      </div>
    </div>
  );
}
