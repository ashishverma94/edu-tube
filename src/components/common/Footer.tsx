import React from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/assets/logo.png";
import GithubIcon from "@/assets/github.svg";
import LinkedinIcon from "@/assets/linkedin.svg";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/30">
      <div className="mx-auto max-w-8xl px-5 py-8 sm:px-8 lg:pt-14">
        <div className="grid gap-10 text-center sm:grid-cols-2 sm:text-left lg:grid-cols-[1.5fr_1fr_1fr_1fr_1.3fr]">
          <div className="flex flex-col lg:min-w-150 items-center sm:items-start">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <Image src={Logo} className="w-14" alt="EduTube logo" />

              <div className="text-left">
                <p className="text-sm font-bold text-white">EduTube</p>

                <p className="text-[10px] text-muted">
                  Learn smarter. Remember longer.
                </p>
              </div>
            </Link>

            <p className="mt-3 max-w-xs text-xs leading-6 text-muted">
              A focused learning workspace for people who learn through
              educational videos.
            </p>

            <h3 className="text-xs text-primary-300 mt-1">
              Name : Ashish Verma
            </h3>

            {/* SOCIALS */}
            <div className="mt-5 flex items-center justify-center gap-2 sm:justify-start">
              <SocialLink
                href="https://github.com/ashishverma94"
                label="GitHub"
                icon={<GithubIcon size={15} />}
              />

              <SocialLink
                href="https://www.linkedin.com/in/hariashish1/"
                label="LinkedIn"
                icon={<LinkedinIcon size={15} />}
              />
            </div>
          </div>
          <FooterColumn title="Product">
            <FooterLink href="/library">Library</FooterLink>

            <FooterLink href="/#how-it-works">How It Works</FooterLink>

            <FooterLink href="/#features">Features</FooterLink>

            <FooterLink href="/#faq">FAQ</FooterLink>
          </FooterColumn>
          <FooterColumn title="Company">
            <FooterLink href="/">About</FooterLink>

            <FooterLink href="/">Contact us</FooterLink>
          </FooterColumn>
          <FooterColumn title="Legal">
            <FooterLink href="/">Privacy policy</FooterLink>

            <FooterLink href="/">Terms of service</FooterLink>
          </FooterColumn>
          <FooterColumn title="Contact">
            <div className="flex flex-col items-center gap-3 sm:items-start">
              <a
                href="mailto:hariashish1@gmail.com"
                className="text-xs text-muted transition hover:text-primary-300"
              >
                hariashish1@gmail.com
              </a>

              <p className="max-w-45 text-xs leading-5 text-muted">
                Biswan, Sitapur,
                <br />
                Uttar Pradesh, 261201
              </p>
            </div>
          </FooterColumn>
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 border-t border-border pt-6 text-center text-[10px] text-muted sm:flex-row sm:justify-between sm:text-left">
          <p>© {new Date().getFullYear()} EduTube. All rights reserved.</p>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <Link href="/" className="transition hover:text-white">
              Privacy
            </Link>

            <Link href="/" className="transition hover:text-white">
              Terms
            </Link>

            <a
              href="mailto:hariashish1@gmail.com"
              className="transition hover:text-white"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

function SocialLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background p-1 text-muted transition hover:border-primary-800 hover:bg-primary-900/20 hover:text-primary-300"
    >
      {icon}
    </a>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
      <h3 className="text-xs font-bold text-white">{title}</h3>

      <div className="mt-4 flex flex-col items-center gap-3 sm:items-start">
        {children}
      </div>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-xs text-muted transition hover:text-white"
    >
      {children}
    </Link>
  );
}

export default Footer;
