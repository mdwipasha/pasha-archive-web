import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function MemoryTable() {
  const [memories, setMemories] = useState([]);

  async function loadMemories() {
    const { data, error } = await supabase
      .from("memories")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setMemories(data);
  }

  async function deleteMemory(id) {
    const confirmed = confirm(
      "Yakin ingin menghapus memory ini?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("memories")
      .delete()
      .eq("id", id);

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
    <div>
      {memories.map((memory) => (
        <div key={memory.id}>
          <img
            src={memory.image_url}
            alt={memory.title}
            width="200"
          />

          <h3>{memory.title}</h3>

          <button
            onClick={() =>
              deleteMemory(memory.id)
            }
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}