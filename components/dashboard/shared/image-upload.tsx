"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

import { CldUploadWidget } from "next-cloudinary";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
  type?: "standard" | "profile" | "cover";
  noPreview?: boolean;
}

const ImageUpload = ({
  disabled,
  onChange,
  onRemove,
  value,
  type,
  noPreview,
}: ImageUploadProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };



return (
  <div className="relative min-h-12">

  {value.map((url) => (
  <div
    key={url}
    className="relative mb-4 h-40 w-40 overflow-hidden rounded-md border"
  >
    <Image
      src={url}
      alt="Imagen subida"
      fill
      sizes="160px"
      className="object-cover"
/>

    <button
      type="button"
      onClick={() => onRemove(url)}
      className="absolute right-2 top-2 rounded-md bg-red-500 px-2 py-1 text-xs text-white"
    >
      Eliminar
    </button>
  </div>
))}

  <CldUploadWidget
  onSuccess={onUpload}
  uploadPreset="multivendedor_upload"
>
 {({ open }) => {
  const onClick = () => {
    open();
  };

  return (
    <>
<button
  type="button"
  className="flex h-12 w-full items-center justify-center rounded-md border bg-background text-foreground"
  disabled={disabled}
  onClick={onClick}
>
  <svg
    viewBox="0 0 640 512"
    fill="currentColor"
    height="1em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9C96.1 197.4 96 194.7 96 192C96 103.6 167.6 32 256 32c59.3 0 111 32.2 138.7 80.2C409.9 102.1 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217l-72 72c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l31-31V432c0 13.3 10.7 24 24 24s24-10.7 24-24V337.9l31 31c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-72-72c-9.4-9.4-24.6-9.4-33.9 0z" />
  </svg>
</button>
    </>
  );
}}
</CldUploadWidget>
  </div>
);
};

export default ImageUpload;