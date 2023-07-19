import "./App.css";
import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import Auth from "./Auth";
import Account from "./Account";
import NewSession from "./components/NewSession";

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
    <div
    // className="container"
    >
      {!session ? (
        <Auth />
      ) : (
        // <Account key={session.user.id} session={session} />
        <NewSession key={session.user.id} session={session} />
      )}
    </div>
  );
}

export default App;
