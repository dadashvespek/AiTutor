import { useState } from "react";
import { supabase } from "./supabaseClient";
import styled, { keyframes } from "styled-components";
import { useSpring, animated } from "react-spring";
import { Auth as Auth1 } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #1f2937; /* changed to a dark navy blue */
  color: #f9fafb; /* changed to the previous background color for contrast */
`;

const Form = styled.form`
  background-color: #f9fafb;
  padding: 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 15px;
  width: 100%;
  max-width: 450px;
  display: grid;
  grid-gap: 2rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
`;

const Title = styled.h1`
  text-align: center;
  color: #1f2937;
  font-weight: 600;
  font-size: 2rem;
  letter-spacing: -1px;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  text-align: center;
  color: #4b5563;
  margin-bottom: 2rem;
  font-size: 1.1rem;
  line-height: 1.5;
`;

const Input = styled.input`
  border: none;
  border-bottom: 1px solid #d1d5db;
  padding: 0.75rem;
  width: 100%;
  box-sizing: border-box;
  transition: border-bottom-color 0.3s ease-in-out;
  &:focus {
    border-bottom-color: #3b82f6;
    outline-color: #3b82f6;
  }
  &::placeholder {
    color: #9ca3af;
  }
  background-color: #f9fafb;
  color: #111827;
`;

const Button = styled.button`
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 15px;
  color: #f9fafb;
  background-color: #3b82f6;
  cursor: pointer;
  width: 100%;
  font-size: 1.2rem;
  transition: background-color 0.3s;
  &:hover {
    background-color: #2563eb;
    animation: 2s ${pulse} infinite;
  }
  &:disabled {
    background-color: #d1d5db;
  }
`;

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const animation = useSpring({
    from: { opacity: 0, transform: "translate3d(0,40px,0)" },
    to: { opacity: 1, transform: "translate3d(0,0px,0)" },
    delay: 300,
    config: { mass: 1, tension: 280, friction: 60 },
  });

  const handleLogin = async (event) => {
    event.preventDefault();

    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
      alert(error.error_description || error.message);
    } else {
      alert("Check your email for the login link!");
    }
    setLoading(false);
  };

  return (
    <Wrapper>
      <animated.div style={animation}>
        <Form onSubmit={handleLogin}>
          <Title>Welcome Back</Title>
          <Description>Enter your email to receive the magic link</Description>
          <div>
            <Input
              type="email"
              placeholder="Your email"
              value={email}
              required={true}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Button disabled={loading}>
              {loading ? <span>Loading...</span> : <span>Send Magic Link</span>}
            </Button>
            <Button
              onClick={() =>
                supabase.auth.signInWithOAuth({
                  provider: "google",
                })
              }
            >
              Sign in with Google
            </Button>
          </div>
        </Form>
      </animated.div>
    </Wrapper>
  );
}
