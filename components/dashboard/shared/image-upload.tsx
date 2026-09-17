"use client";

import { CldUploadWidget } from "next-cloudinary";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
}

const ImageUpload = ({
  value,
  onChange,
  onRemove,
}: ImageUploadProps) => {
  
  const onUpload = (result: any) => {
  onChange(result.info.secure_url);
  };

return (
  <div>
    <CldUploadWidget
      onSuccess={onUpload}
      uploadPreset="multivendedor_upload"
    >
      {({ open }) => {
        return (
          <button
            type="button"
            onClick={() => open()}
          >
            Upload an Image
          </button>
        );
      }}
    </CldUploadWidget>
  </div>
);
};

export default ImageUpload;