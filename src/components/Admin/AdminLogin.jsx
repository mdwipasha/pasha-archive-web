import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import AdminDashboard from "./AdminDashboard";

export default function AdminLogin() {
  const [user, setUser] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function checkSession() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    setUser(session?.user ?? null);
  }

  async function handleLogin() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    }
  }

  if (user) {
    return <AdminDashboard user={user} />;
  }

  return (
    <div className="h-screen flex items-center justify-center p-10 overflow-hidden">
      <div className="relative w-full max-w-md">
        {/* Decorative note */}
        <div className="absolute -top-6 -left-6 rotate-[-4deg] border-4 border-black bg-yellow-300 px-4 py-2 shadow-[6px_6px_0px_0px_#000] font-black z-10">
          ADMIN ONLY
        </div>

        <div className="bg-white border-4 border-black p-8 shadow-[10px_10px_0px_0px_#000] rotate-[1deg]">
          <div className="mb-8">
            <h1 className="text-4xl font-black uppercase">Pasha Archive</h1>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block mb-2 font-bold">Email</label>

              <input
                type="email"
                placeholder="admin@admin.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-4 border-black px-4 py-3 bg-white outline-none focus:translate-x-1 focus:translate-y-1 transition-all"
              />
            </div>

            <div>
              <label className="block mb-2 font-bold">Password</label>

              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-4 border-black px-4 py-3 bg-white outline-none focus:translate-x-1 focus:translate-y-1 transition-all"
              />
            </div>

            <button
              onClick={handleLogin}
              className="
                w-full
                border-4 border-black
                bg-black
                text-white
                py-3
                font-black
                uppercase
                shadow-[5px_5px_0px_0px_#000]
                hover:translate-x-1
                hover:translate-y-1
                hover:shadow-none
                transition-all
              "
            >
              Login
            </button>
          </div>

          <div className="mt-6 border-t-4 border-dashed border-black pt-4">
            <p className="text-sm font-medium">Private access only.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
