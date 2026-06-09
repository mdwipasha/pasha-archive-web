export async function uploadToCloudinary(file, folder, year) {
  const formData = new FormData();

  formData.append("file", file);

  formData.append(
    "upload_preset",
    import.meta.env.PUBLIC_CLOUDINARY_UPLOAD_PRESET,
  );

  if (folder) {
    formData.append("folder", folder);
  }

  const cloudName = import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME;

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "Upload failed");
  }

  return data;
}
