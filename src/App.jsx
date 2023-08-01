import "./App.css";
import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import NewSession from "./components/NewSession";
import Auth from "./Auth"
import NavBar from "./components/Navbar.jsx";

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ session }) => {
      console.log(session);
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, newSession) => {
      console.log(newSession);
      setSession(newSession);
    });
  }, []);

  useEffect(() => {
    console.log(session);
  }, [session]);

  return (
    <div>
      {!session ? (
            <Auth
            />
      ) : (
        <div>
             <NavBar session={session}/>
          <NewSession key={session.user.id} session={session} />

        </div>
      )}
    </div>
  );
}

export default App;
