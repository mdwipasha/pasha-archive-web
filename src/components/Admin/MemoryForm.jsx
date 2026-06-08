import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function MemoryForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [featured, setFeatured] = useState(false);
  const [file, setFile] = useState(null);

  function generateSlug(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!file) {
      alert("Pilih gambar dulu");
      return;
    }

    const fileName = `${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("memories")
      .upload(fileName, file);

    if (uploadError) {
      alert(uploadError.message);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("memories").getPublicUrl(fileName);

    const slug = generateSlug(title);

    const { error } = await supabase.from("memories").insert({
      title,
      slug,
      type: "Photo",

      description,

      date: date || null,

      year: date ? new Date(date).getFullYear() : null,

      location,

      src: publicUrl,
      storage_path: fileName,

      featured,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Berhasil upload");

    setTitle("");
    setDescription("");
    setLocation("");
    setDate("");
    setFeatured(false);
    setFile(null);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <input
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <label>
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
        />
        Featured
      </label>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button type="submit">Upload</button>
    </form>
  );
}
