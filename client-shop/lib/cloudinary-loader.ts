interface CloudinaryLoaderParams {
  src: string;
  width: number;
  quality?: number;
}

export default function cloudinaryLoader({ src, width, quality }: CloudinaryLoaderParams): string {
  if (!src.includes("res.cloudinary.com")) {
    return src;
  }

  const q = quality ?? 75;
  const transformation = `f_auto,w_${width},q_${q},fl_preserve_transparency`;
  
  if (src.includes(`/image/upload/f_auto`) || src.includes(`/image/upload/w_`)) {
    return src;
  }

  return src.replace("/image/upload/", `/image/upload/${transformation}/`);
}