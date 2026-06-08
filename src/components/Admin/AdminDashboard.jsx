import { supabase } from "../../lib/supabase";
import MemoryForm from "./MemoryForm";
import MemoryTable from "./MemoryTable";

export default function AdminDashboard({
  user,
}) {
  async function handleLogout() {
    await supabase.auth.signOut();
  }

  return (
    <div className="min-h-screen bg-[#f8f5ef] p-6">

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div className="border-4 border-black bg-white px-6 py-4 shadow-[6px_6px_0px_0px_#000] rotate-[-1deg]">
          <h1 className="text-3xl font-black uppercase">
            Pasha Archive CMS
          </h1>

          <p className="font-medium">
            Logged in as {user.email}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="
            border-4 border-black
            bg-red-400
            px-5 py-3
            font-black
            uppercase
            shadow-[5px_5px_0px_0px_#000]
            hover:translate-x-1
            hover:translate-y-1
            hover:shadow-none
            transition-all
          "
        >
          Logout
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">

        <div className="border-4 border-black bg-yellow-300 p-5 shadow-[6px_6px_0px_0px_#000]">
          <p className="font-bold uppercase">
            Archive Status
          </p>

          <h2 className="text-4xl font-black">
            ACTIVE
          </h2>
        </div>

        <div className="border-4 border-black bg-blue-300 p-5 shadow-[6px_6px_0px_0px_#000] rotate-[1deg]">
          <p className="font-bold uppercase">
            Administrator
          </p>

          <h2 className="text-2xl font-black truncate">
            Pasha
          </h2>
        </div>
      </div>

      {/* Form */}
      <section className="mb-8">
        <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_#000]">

          <div className="mb-5 border-b-4 border-dashed border-black pb-3">
            <h2 className="text-2xl font-black uppercase">
              Create Memory
            </h2>
          </div>

          <MemoryForm />
        </div>
      </section>

      {/* Table */}
      <section>
        <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_#000] rotate-[0.5deg]">

          <div className="mb-5 border-b-4 border-dashed border-black pb-3">
            <h2 className="text-2xl font-black uppercase">
              Memory Collection
            </h2>
          </div>

          <MemoryTable />
        </div>
      </section>

    </div>
  );
}