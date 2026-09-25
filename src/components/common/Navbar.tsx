"use client";

import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import Logo from "@/assets/logo.png";
import { Button } from "../ui/button";
import { authApi } from "@/lib/authApi";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { usePathname, useRouter } from "next/navigation";
import { Home, LogOut, BookOpen, ArrowRight, ChevronDown } from "lucide-react";

function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const logoutStore = useAuthStore((state) => state.logout);

  const [profileOpen, setProfileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setProfileOpen(false);
  }, [pathname]);

  async function handleLogout() {
    if (loggingOut) return;

    try {
      setLoggingOut(true);

      await authApi.logout();

      logoutStore();

      toast.success("Logged out successfully");

      router.push("/auth");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to logout. Please try again.",
      );
    } finally {
      setLoggingOut(false);
      setProfileOpen(false);
    }
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-8xl items-center justify-between px-5 sm:px-8">
        <div className="lg:w-44">
          <Link href={"/"} className="group flex items-center gap-2.5 ">
            <Image priority width={36} height={36} src={Logo} className="w-14" alt="edutube-logo" />

            <div>
              <p className="font-display tracking-wider text-sm font-extrabold text-white">
                Edu
                <span className="text-primary-400">Tube</span>
              </p>

              <p className="text-[10px] text-muted">Study smarter</p>
            </div>
          </Link>
        </div>

        {isLoading && (
          <div className="flex items-center gap-2">
            <div className="hidden h-8 w-20 animate-pulse rounded-lg bg-surface-300 sm:block" />

            <div className="h-9 w-9 animate-pulse rounded-xl bg-surface-300" />
          </div>
        )}
        {!isLoading && !isAuthenticated && (
          <div className="hidden items-center gap-7 md:flex">
            <Link
              href="/"
              className="text-xs font-medium text-muted transition hover:text-white"
            >
              Home
            </Link>
            <Link
              href="#features"
              className="text-xs font-medium text-muted transition hover:text-white"
            >
              Features
            </Link>

            <Link
              href="#how-it-works"
              className="text-xs font-medium text-muted transition hover:text-white"
            >
              How It Works
            </Link>
          </div>
        )}

        {!isLoading && isAuthenticated && user && (
          <div className="hidden items-center gap-2 md:flex">
            <NavLink
              href="/"
              active={pathname === "/"}
              icon={<Home size={14} />}
            >
              Home
            </NavLink>

            <NavLink
              href="/library"
              active={
                pathname === "/library" || pathname.startsWith("/library/")
              }
              icon={<BookOpen size={14} />}
            >
              Library
            </NavLink>
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* Logged out */}
          {!isAuthenticated && (
            <>
              <Link href="/auth">
                <Button
                  size="lg"
                  className="group relative overflow-hidden border-0 bg-linear-to-r from-primary-700 via-primary-600 to-primary-900 px-6 text-white shadow-[0_8px_30px_rgba(220,38,38,0.22)] transition-all duration-300 hover:from-primary-600 hover:via-primary-500 hover:to-primary-400 hover:shadow-[0_10px_35px_rgba(220,38,38,0.35)]"
                >
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                  <span className="relative">Get started</span>

                  <span className="relative max-md:hidden flex h-6 w-6 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:bg-white/20">
                    <ArrowRight
                      size={13}
                      className="transition-transform duration-300 group-hover:translate-x-0.5"
                    />
                  </span>
                </Button>
              </Link>
            </>
          )}

          {/* Logged in */}
          {isAuthenticated && user && (
            <div ref={profileRef} className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((value) => !value)}
                className="group flex cursor-pointer! items-center gap-2 rounded-xl border border-border bg-card px-2 py-1.5 transition hover:border-border-hover hover:bg-card-hover"
                aria-expanded={profileOpen}
                aria-haspopup="menu"
              >
                {/* Avatar */}
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-900/50 text-xs font-bold text-primary-300">
                  {getInitials(user.name, user.email)}
                </div>

                {/* User information */}
                <div className="hidden text-left sm:block">
                  <p className="max-w-32 truncate text-[10px] font-bold text-white">
                    {user.name || "Student"}
                  </p>

                  <p className="max-w-32 truncate text-[9px] text-muted">
                    {user.email}
                  </p>
                </div>

                <ChevronDown
                  size={14}
                  className={`text-muted transition-transform ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {profileOpen && (
                <div
                  className="absolute right-0 top-[calc(100%+13px)] w-44 overflow-hidden rounded-2xl border border-border bg-card shadow-card-hover"
                  role="menu"
                >
                  {/* Menu */}
                  <div className="p-1.5">
                    <Link
                      href="/library"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium text-muted transition hover:bg-surface-300 hover:text-white"
                      role="menuitem"
                    >
                      <BookOpen size={15} />
                      My Library
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium text-muted transition hover:bg-error-950/30 disabled:cursor-not-allowed disabled:opacity-50"
                      role="menuitem"
                    >
                      {loggingOut ? (
                        <span className="h-3.75 w-3.75 animate-spin rounded-full border-2 border-error-400/30 border-t-error-400" />
                      ) : (
                        <LogOut size={15} />
                      )}

                      {loggingOut ? "Signing out..." : "Logout"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavLink({
  href,
  active,
  icon,
  children,
}: {
  href: string;
  active: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition ${
        active
          ? "bg-primary-900/30 text-primary-300"
          : "text-muted hover:bg-card hover:text-white"
      }`}
    >
      {icon}
      {children}
    </Link>
  );
}

function getInitials(name?: string | null, email?: string | null) {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/);

    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }

    return parts[0].slice(0, 2).toUpperCase();
  }

  return email?.slice(0, 2).toUpperCase() || "U";
}

export default Navbar;
