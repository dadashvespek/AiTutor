import "./App.css";
import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
// import Auth from "./Auth";
import Account from "./Account";
import NewSession from "./components/NewSession";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log(data)
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      console.log(_event)
      setSession(session);
    });
    console.log(session)
  }, []);

  useEffect(() => { 
    console.log(session)
  }, [session]);

  return (
    <div>
      {!session ? (
        <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div>
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={["google", "facebook", "github"]}
          />
        </div>

      </div>
    ) : (
        // <Account key={session.user.id} session={session} />
        <div>
          <NewSession key={session.user.id} session={session} />       
          <button onClick={() => supabase.auth.signOut()}>Sign out</button>
        </div>
      )}
    </div>
  );
}

export default App;
