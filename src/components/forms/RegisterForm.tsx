import React, { useState } from "react";
import Link from "next/link";

export default function RegisterForm() {
  
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      // TODO: Replace with your actual registration API call
      // Example:
      // await register({ email, username, password1, password2 });
      setSuccess("Registration successful! Please log in.");
      setEmail("");
      setUsername("");
      setPassword1("");
      setPassword2("");
    } catch (err: any) {
      setError("Registration failed. Please check your details and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      role="region"
      aria-label="Register"
      className="ins-tile ins-tile--cta ins-tile--story-right ins-tile--has-image ins-tile--same-prev-background mt-auto"
      id="tile-call-to-action-NrWbGx"
    >
      <div className="ins-tile__wrap ins-tile__animated">
        <div className="ins-tile__body">
          <div className="ins-tile__body-inner">
            <h2 className="ins-tile__title">Register</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="block mb-1 font-medium">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  className="w-full border rounded px-3 py-2"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-1 font-medium">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full border rounded px-3 py-2"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="password1" className="block mb-1 font-medium">
                  Password
                </label>
                <input
                  id="password1"
                  name="password1"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="w-full border rounded px-3 py-2"
                  value={password1}
                  onChange={e => setPassword1(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="password2" className="block mb-1 font-medium">
                  Confirm Password
                </label>
                <input
                  id="password2"
                  name="password2"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="w-full border rounded px-3 py-2"
                  value={password2}
                  onChange={e => setPassword2(e.target.value)}
                  disabled={loading}
                />
              </div>
              {error && <div className="text-red-600">{error}</div>}
              {success && <div className="text-green-600">{success}</div>}
              <button
                type="submit"
                className="ins-button-wrap ins-tile__button ins-control__button ins-control__wrap ins-control__text"
                disabled={loading}
                aria-label="Register"
                
              >
                {loading ? "Registering..." : "Register"}
              </button>
              <div className="flex flex-col gap-2 mt-4">
                <span>
                  Already have an account?{" "}
                  <Link href="/auth/login" className="text-blue-600 underline">
                    Log in here
                  </Link>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
      <style jsx>{`
        #tile-call-to-action-NrWbGx {
          --background-gradient-color-from-a: 0;
          --background-gradient-color-to-a: 0;
          --background-solid-color-a: 1;
          --background-solid-color-b: 1;
          --background-solid-color-h: 21.99999999999999;
          --background-solid-color-l: 100%;
          --background-solid-color-s: 0%;
          --button-color: black;
          --description-font-size: 18px;
          --description-font-style: normal;
          --description-font-weight: 400;
          --description-text-color-a: 1;
          --description-text-color-b: 0.09803921569;
          --description-text-color-h: 0;
          --description-text-color-l: 9.803921569%;
          --description-text-color-s: 0%;
          --image-aspect-ratio: 100%;
          --title-font-size: 64px;
          --title-font-style: normal;
          --title-font-weight: 700;
          --title-text-color-a: 1;
          --title-text-color-b: 0.09803921569;
          --title-text-color-h: 0;
          --title-text-color-l: 9.803921569%;
          --title-text-color-s: 0%;
        }
      `}</style>
    </section>
  );
}