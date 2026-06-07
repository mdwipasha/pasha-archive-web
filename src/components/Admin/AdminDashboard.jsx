import { supabase } from "../../lib/supabase";
import MemoryForm from "./MemoryForm";
import MemoryTable from "./MemoryTable";

export default function AdminDashboard({
    user,
  }) {
    return (
      <div>
        <h1>Dashboard Admin</h1>
  
        <p>{user.email}</p>
  
        <MemoryForm />
        <MemoryTable />
      </div>
    );
  }