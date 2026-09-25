import Link from "next/link";
import { Sparkles } from "lucide-react";

const NavLogo = () => {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="w-6 md:w-8 h-6 md:h-8 rounded-lg bg-amber-400 flex items-center justify-center shadow-sm">
        <Sparkles className="text-white size-3 md:size-4" strokeWidth={2.5} />
      </div>

      <span
        className="font-display text-sm md:text-xl font-semibold text-stone-800 tracking-tight"
        style={{ fontFamily: "Fraunces, Georgia, serif" }}
      >
        CardStudy
      </span>
    </Link>
  );
};

export default NavLogo;
