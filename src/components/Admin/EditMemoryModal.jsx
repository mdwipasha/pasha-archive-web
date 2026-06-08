import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function EditMemoryModal({ memory, onClose, onSaved }) {
  const [title, setTitle] = useState(memory.title);

  const [description, setDescription] = useState(memory.description || "");

  const [location, setLocation] = useState(memory.location || "");

  const [featured, setFeatured] = useState(memory.featured);

  function slugify(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");
  }

  async function handleSave() {
    const { error } = await supabase
      .from("memories")
      .update({
        title,
        slug: slugify(title),
        description,
        location,
        featured,
      })
      .eq("id", memory.id);

    if (error) {
      alert(error.message);
      return;
    }

    onSaved();
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white border-4 border-black p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Edit Memory</h2>

        <input
          className="w-full border p-2 mb-3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full border p-2 mb-3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          className="w-full border p-2 mb-3"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <label className="flex gap-2 mb-4">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
          />
          Featured
        </label>

        <div className="flex gap-2">
          <button onClick={handleSave}>Save</button>

          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
