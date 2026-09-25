import Image from "next/image";
import Logo from "@/assets/logo.png";
import AuthForms from "@/components/auth/AuthForms";
import HeroSection from "@/components/auth/HeroSection";

export default function AuthPage() {
  return (
    <main className="min-h-screen lg:h-screen md:overflow-hidden bg-background text-foreground">
      <div className="grid h-full grid-cols-1 lg:grid-cols-2">
        <section className="relative flex h-full items-center justify-center overflow-y-auto bg-background px-5 py-4 md:py-6 sm:px-8 lg:overflow-hidden lg:px-10 xl:px-16">
          {/* Decorative */}

          <div
            aria-hidden="true"
            className="hidden lg:block pointer-events-none absolute -left-40 top-1/4 h-20 lg:h-80 w-80 rounded-full bg-primary-900/20 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="hidden lg:block pointer-events-none absolute -bottom-40 right-0 h-20 lg:h-80 w-80 rounded-full bg-secondary-900/10 blur-3xl"
          />

          <div className="relative z-10 flex w-full max-w-md flex-col justify-center">
            <div className="mb-3 flex shrink-0 items-center gap-3">
              <Image src={Logo} className="w-16" alt="edutube-logo" />

              <div>
                <p className="font-display text-lg font-extrabold tracking-tight text-white">
                  EduTube
                </p>

                <p className="text-[10px] text-muted">
                  Learn smarter. Remember longer.
                </p>
              </div>
            </div>

            <AuthForms />

            <p className="mt-4 text-center text-[10px] text-muted sm:mt-5">
              © {new Date().getFullYear()} EduTube
            </p>
          </div>
        </section>

        <HeroSection />
      </div>
    </main>
  );
}


