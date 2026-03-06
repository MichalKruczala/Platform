"use client"

import { useState } from "react"
import { Mail, Lock, Phone, User } from "lucide-react"

type AuthMode = "login" | "register"

export function AuthForm() {
  const [mode, setMode] = useState<AuthMode>("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Sukces! Zalogowano: " + data.message);
        console.log("Twój Token JWT:", data.token);

      } else {
        alert("Błąd logowania: " + data.error);
      }
    } catch (error) {
      alert("Błąd połączenia z serwerem!");
      console.error(error);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Sukces! Zarejestrowano użytkownika o ID: " + data.userId);
        setMode("login"); 
      } else {
        alert("Błąd rejestracji: " + data.error);
      }
    } catch (error) {
      alert("Błąd połączenia z serwerem!");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-foreground tracking-tight">
            {mode === "login" ? "Witaj ponownie" : "Utwórz konto"}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {mode === "login"
              ? "Zaloguj się, aby kontynuować"
              : "Zarejestruj się i zarezerwuj swoją pierwszą lekcję"}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex mb-8 border-b border-border">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 pb-3 text-sm font-medium transition-colors ${
              mode === "login"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Logowanie
          </button>
          <button
            onClick={() => setMode("register")}
            className={`flex-1 pb-3 text-sm font-medium transition-colors ${
              mode === "register"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Rejestracja
          </button>
        </div>

        {/* Card */}
        <div className="bg-card rounded-xl border border-border shadow-sm p-8">
          {mode === "login" ? (
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="login-email"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="twoj@email.pl"
                    className="w-full pl-11 pr-4 py-2.5 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="login-password"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Hasło
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-2.5 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              {/* Forgot password */}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-primary hover:underline"
                >
                  Zapomniałeś hasła?
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                Zaloguj się
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-5">
              {/* Name */}
              <div>
                <label
                  htmlFor="register-name"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Imię i nazwisko
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    id="register-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jan Kowalski"
                    className="w-full pl-11 pr-4 py-2.5 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="register-email"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    id="register-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="twoj@email.pl"
                    className="w-full pl-11 pr-4 py-2.5 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="register-phone"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Numer telefonu
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    id="register-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+48 123 456 789"
                    className="w-full pl-11 pr-4 py-2.5 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="register-password"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Hasło
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    id="register-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 znaków"
                    className="w-full pl-11 pr-4 py-2.5 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                Zarejestruj się
              </button>

              {/* Terms */}
              <p className="text-xs text-center text-muted-foreground">
                Rejestrując się, akceptujesz{" "}
                <button type="button" className="text-primary hover:underline">
                  Regulamin
                </button>{" "}
                oraz{" "}
                <button type="button" className="text-primary hover:underline">
                  Politykę Prywatności
                </button>
              </p>
            </form>
          )}
        </div>

        {/* Bottom link */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {mode === "login" ? (
            <>
              Nie masz konta?{" "}
              <button
                onClick={() => setMode("register")}
                className="text-primary font-medium hover:underline"
              >
                Zarejestruj się
              </button>
            </>
          ) : (
            <>
              Masz już konto?{" "}
              <button
                onClick={() => setMode("login")}
                className="text-primary font-medium hover:underline"
              >
                Zaloguj się
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
