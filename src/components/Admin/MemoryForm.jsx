import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function MemoryForm() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!file) return;

    const fileName =
      `${Date.now()}-${file.name}`;

    const { error: uploadError } =
      await supabase.storage
        .from("memories")
        .upload(fileName, file);
        console.log(uploadError);

    if (uploadError) {
      alert(uploadError.message);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("memories")
      .getPublicUrl(fileName);

    const { error } =
      await supabase
        .from("memories")
        .insert({
          title,
          image_url: publicUrl,
        });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Berhasil upload");

    setTitle("");
    setFile(null);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Title"
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          setFile(e.target.files[0])
        }
      />

      <button type="submit">
        Upload
      </button>
    </form>
  );
}