"use client";

import { toast } from "sonner";
import { authApi } from "@/lib/authApi";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import TextInput from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { ArrowRight, Eye, EyeOff, Sparkles, Loader2 } from "lucide-react";

type AuthMode = "login" | "signup";

const AuthForms = () => {
  const router = useRouter();

  const [mode, setMode] = useState<AuthMode>("login");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  function updateField(field: keyof typeof form, value: string | number) {
    setForm((current) => ({
      ...current,
      [field]: String(value),
    }));
  }

  async function handleLogin() {
    const email = form.email.trim().toLowerCase();
    const password = form.password;

    if (!email) {
      toast.error("Email is required");
      return;
    }

    if (!password) {
      toast.error("Password is required");
      return;
    }

    try {
      setLoading(true);

      const response = await authApi.login({
        email,
        password,
      });

      useAuthStore.getState().setAuth(response.data.user);

      toast.success("Welcome back!", {
        description: "You have successfully signed in to EduTube.",
      });

      router.push("/library");
      router.refresh();
    } catch (error) {
      console.error("LOGIN_ERROR:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to sign in. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister() {
    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const password = form.password;
    const confirmPassword = form.confirmPassword;

    if (!name) {
      toast.error("Please enter your full name");
      return;
    }

    if (name.length < 2) {
      toast.error("Name must be at least 2 characters");
      return;
    }

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    if (!password) {
      toast.error("Please enter a password");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await authApi.register({
        name,
        email,
        password,
      });

      toast.success("Account created successfully!", {
        description: "You can now sign in to EduTube.",
      });

      setForm({
        name: "",
        email,
        password: "",
        confirmPassword: "",
      });

      setShowPassword(false);
      setShowConfirmPassword(false);

      setMode("login");
    } catch (error) {
      console.error("REGISTER_ERROR:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to create your account.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    if (mode === "signup") {
      await handleRegister();
      return;
    }

    await handleLogin();
  }

  function switchMode(nextMode: AuthMode) {
    if (loading) return;

    setMode(nextMode);

    setForm({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    setShowPassword(false);
    setShowConfirmPassword(false);
  }
  return (
    <>
      <div className="mb-3 shrink-0">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary-800/60 bg-primary-900/20 px-3 py-1.5 text-[10px] font-semibold text-primary-300">
          <Sparkles size={12} />

          {mode === "login" ? "Welcome back" : "Start your learning journey"}
        </div>

        <h1
          className={`font-display text-lg font-extrabold tracking-normal text-white sm:text-2xl `}
        >
          {mode === "login"
            ? "Continue where you left off."
            : "Turn videos into knowledge."}
        </h1>

        <p className="max-w-sm text-[10px] md:text-xs leading-5 text-muted-foreground">
          {mode === "login"
            ? "Access your saved videos, timestamped notes, and learning progress."
            : "Save educational videos, create notes, and track your progress."}
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card/90 p-4 shadow-card backdrop-blur-xl sm:rounded-3xl sm:p-6">
        <div className="mb-5 grid grid-cols-2 rounded-xl border border-border bg-background/70 p-1">
          <button
            type="button"
            disabled={loading}
            onClick={() => switchMode("login")}
            className={[
              "h-9 rounded-lg text-xs font-semibold transition-all",
              mode === "login"
                ? "bg-surface-400 text-white shadow-card"
                : "text-muted hover:text-white",
            ].join(" ")}
          >
            Sign in
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => switchMode("signup")}
            className={[
              "h-9 rounded-lg text-xs font-semibold transition-all",
              mode === "signup"
                ? "bg-surface-400 text-white shadow-card"
                : "text-muted hover:text-white",
            ].join(" ")}
          >
            Create account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Name */}

          {mode === "signup" && (
            <div className="animate-fade-up">
              <TextInput
                label="Full name"
                inputValue={form.name}
                onChange={(value) => updateField("name", value)}
                placeholder="John Doe"
                requiredAsterisk
                disabled={loading}
              />
            </div>
          )}

          {/* Email */}

          <TextInput
            label="Email address"
            inputValue={form.email}
            onChange={(value) => updateField("email", value)}
            placeholder="you@example.com"
            requiredAsterisk
            disabled={loading}
            type="email"
          />

          {/* Password fields */}

          <div className="mt-1 flex flex-col md:flex-row gap-3">
            {/* Password */}

            <div
              className={`relative ${
                mode === "signup" ? "w-full md:w-1/2" : "w-full"
              }`}
            >
              <TextInput
                label="Password"
                inputValue={form.password}
                onChange={(value) => updateField("password", value)}
                placeholder="Enter your password"
                requiredAsterisk
                disabled={loading}
                type={showPassword ? "text" : "password"}
                className="pr-11"
              />

              <button
                type="button"
                disabled={loading}
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((current) => !current)}
                className="absolute bottom-2.5 right-3 z-10 rounded-lg p-2 text-muted transition hover:bg-surface-300 hover:text-white disabled:pointer-events-none disabled:opacity-50"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Confirm password */}

            {mode === "signup" && (
              <div className="animate-fade-up w-full md:w-1/2">
                <div className="relative">
                  <TextInput
                    label="Confirm password"
                    inputValue={form.confirmPassword}
                    onChange={(value) => updateField("confirmPassword", value)}
                    placeholder="Confirm password"
                    requiredAsterisk
                    disabled={loading}
                    type={showConfirmPassword ? "text" : "password"}
                    className="pr-11"
                  />

                  <button
                    type="button"
                    disabled={loading}
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                    onClick={() =>
                      setShowConfirmPassword((current) => !current)
                    }
                    className="absolute bottom-2.5 right-3 z-10 rounded-lg p-2 text-muted transition hover:bg-surface-300 hover:text-white disabled:pointer-events-none disabled:opacity-50"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Submit */}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading}
            className="mt-1 w-full"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />

                {mode === "login" ? "Signing in..." : "Creating account..."}
              </>
            ) : (
              <>
                {mode === "login" ? "Sign in to EduTube" : "Create my account"}

                <ArrowRight size={16} />
              </>
            )}
          </Button>
        </form>

        {mode === "signup" && (
          <p className="mt-4 text-center text-[10px] leading-4 text-muted">
            By creating an account, you agree to our{" "}
            <button
              type="button"
              className="font-medium text-primary-400 hover:text-primary-300 hover:underline"
            >
              Terms
            </button>{" "}
            and{" "}
            <button
              type="button"
              className="font-medium text-primary-400 hover:text-primary-300 hover:underline"
            >
              Privacy Policy
            </button>
            .
          </p>
        )}
      </div>
    </>
  );
};

export default AuthForms;
