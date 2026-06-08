import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import EditMemoryModal from "./EditMemoryModal";

export default function MemoryTable() {
  const [memories, setMemories] = useState([]);
  const [editingMemory, setEditingMemory] = useState(null);

  async function loadMemories() {
    const { data, error } = await supabase
      .from("memories")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(error);
      return;
    }

    setMemories(data);
  }

  async function deleteMemory(memory) {
    const confirmed = confirm(`Delete "${memory.title}"?`);

    if (!confirmed) return;

    if (memory.storage_path) {
      await supabase.storage.from("memories").remove([memory.storage_path]);
    }

    const { error } = await supabase
      .from("memories")
      .delete()
      .eq("id", memory.id);

    if (error) {
      console.error(error);
      return;
    }

    loadMemories();
  }

  useEffect(() => {
    loadMemories();
  }, []);

  return (
    <div className="mt-8">
      <h2 className="mb-4 text-2xl font-bold">Memories ({memories.length})</h2>

      <div className="overflow-x-auto">
        <table className="w-full border border-black">
          <thead>
            <tr className="border-b border-black">
              <th className="p-2">Preview</th>
              <th className="p-2">Title</th>
              <th className="p-2">Year</th>
              <th className="p-2">Location</th>
              <th className="p-2">Type</th>
              <th className="p-2">Featured</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {memories.map((memory) => (
              <tr key={memory.id} className="border-b border-black">
                <td className="p-2">
                  {memory.type === "Photo" ? (
                    <img
                      src={memory.src}
                      alt={memory.title}
                      className="h-20 w-20 object-cover border border-black"
                    />
                  ) : (
                    <span>🎥 Video</span>
                  )}
                </td>

                <td className="p-2">
                  <div>
                    <p className="font-bold">{memory.title}</p>

                    <p className="text-sm opacity-60">{memory.slug}</p>
                  </div>
                </td>

                <td className="p-2">{memory.year}</td>

                <td className="p-2">{memory.location}</td>

                <td className="p-2">{memory.type}</td>

                <td className="p-2">{memory.featured ? "⭐" : "-"}</td>

                <td className="p-2">
                  <div className="flex gap-2">
                    <button onClick={() => setEditingMemory(memory)}>
                      Edit
                    </button>

                    <button onClick={() => deleteMemory(memory)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {editingMemory && (
          <EditMemoryModal
            memory={editingMemory}
            onClose={() => setEditingMemory(null)}
            onSaved={loadMemories}
          />
        )}
      </div>
    </div>
  );
}
