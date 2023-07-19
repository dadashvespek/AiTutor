import "./App.css";
import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import Auth from "./Auth";
import Account from "./Account";
import Landing from "./components/Landing";
import Chat from "./components/Chat";

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <div className="container">
      {!session ? (
        <Auth />
      ) : (
        // <Account key={session.user.id} session={session} />
        <div className="flex">
          <Chat session={session.user} />
          <Landing />
        </div>
      )}
    </div>
  );
}

export default App;
