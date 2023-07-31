import "./App.css";
import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import Account from "./Account";
import NewSession from "./components/NewSession";
import Auth from "./Auth"
import { ThemeSupa } from "@supabase/auth-ui-shared";

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
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              providers={["google", "facebook", "github"]}
            />
      ) : (
        <div>
          <NewSession key={session.user.id} session={session} />
          <button onClick={() => supabase.auth.signOut()}>Sign out</button>
        </div>
      )}
    </div>
  );
}

export default App;
