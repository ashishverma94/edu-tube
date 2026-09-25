import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "group/button",
    "cursor-pointer",
    "inline-flex",
    "shrink-0",
    "items-center",
    "justify-center",
    "rounded-xl",
    "border",
    "border-transparent",
    "bg-clip-padding",
    "text-sm",
    "font-semibold",
    "whitespace-nowrap",
    "transition-all",
    "duration-200",
    "outline-none",
    "select-none",

    // Focus
    "focus-visible:border-primary-500",
    "focus-visible:ring-4",
    "focus-visible:ring-primary-900/40",

    // Active
    "active:not-aria-[haspopup]:translate-y-px",

    // Disabled
    "disabled:pointer-events-none",
    "disabled:opacity-50",

    // SVG
    "[&_svg]:pointer-events-none",
    "[&_svg]:shrink-0",
    "[&_svg:not([class*='size-'])]:size-4",

    // Invalid
    "aria-invalid:border-t-error-500",
    "aria-invalid:ring-4",
    "aria-invalid:ring-t-error-200/20",
  ].join(" "),
  {
    variants: {
      variant: {
        /* =====================================================
           PRIMARY
        ====================================================== */

        default:
          [
            "bg-primary-600",
            "text-white",
            "shadow-maroon-sm",
            "hover:bg-primary-500",
            "hover:shadow-maroon-md",
            "hover:-translate-y-0.5",
            "active:bg-primary-700",
          ].join(" "),

        primary:
          [
            "bg-primary-600",
            "text-white",
            "shadow-maroon-sm",
            "hover:bg-primary-500",
            "hover:shadow-maroon-md",
            "hover:-translate-y-0.5",
            "active:bg-primary-700",
          ].join(" "),

        /* =====================================================
           SECONDARY
        ====================================================== */

        secondary:
          [
            "border-border",
            "bg-surface-300",
            "text-foreground",
            "hover:bg-surface-400",
            "hover:border-border-hover",
            "active:bg-surface-500",
            "aria-expanded:bg-surface-400",
          ].join(" "),

        /* =====================================================
           OUTLINE
        ====================================================== */

        outline:
          [
            "border-border",
            "bg-transparent",
            "text-foreground",
            "hover:bg-surface-300",
            "hover:border-border-hover",
            "active:bg-surface-400",
          ].join(" "),

        /* =====================================================
           GHOST
        ====================================================== */

        ghost:
          [
            "border-transparent",
            "bg-transparent",
            "text-muted",
            "hover:bg-surface-300",
            "hover:text-foreground",
            "active:bg-surface-400",
            "aria-expanded:bg-surface-300",
          ].join(" "),

        /* =====================================================
           MAROON OUTLINE
        ====================================================== */

        "amber-outline":
          [
            "border-primary-800",
            "bg-primary-900/20",
            "text-primary-300",
            "hover:bg-primary-900/40",
            "hover:border-primary-700",
            "hover:text-primary-200",
          ].join(" "),

        /*
         * Keeping the old variant name so existing imports/usages
         * don't break. It now uses the EduTube maroon theme.
         */
        amber:
          [
            "bg-primary-500",
            "text-white",
            "shadow-maroon-sm",
            "hover:bg-primary-400",
            "hover:shadow-maroon-md",
            "hover:-translate-y-0.5",
            "active:bg-primary-600",
          ].join(" "),

        /* =====================================================
           DESTRUCTIVE
        ====================================================== */

        destructive:
          [
            "border-t-error-500/20",
            "bg-t-error-200/10",
            "text-red-400",
            "hover:bg-t-error-500/15",
            "hover:border-t-error-500/40",
            "hover:text-red-300",
            "focus-visible:border-t-error-500",
            "focus-visible:ring-t-error-500/20",
          ].join(" "),

        /* =====================================================
           LINK
        ====================================================== */

        link:
          [
            "h-auto",
            "border-transparent",
            "bg-transparent",
            "p-0",
            "text-primary-400",
            "underline-offset-4",
            "hover:text-primary-300",
            "hover:underline",
          ].join(" "),
      },

      size: {
        default:
          "h-10 gap-1.5 px-4 py-2.5 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5",

        xs:
          "h-7 gap-1 rounded-lg px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",

        sm:
          "h-8 gap-1.5 rounded-lg px-3 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3.5",

        lg:
          "h-11 gap-2 rounded-xl px-5 text-sm has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",

        icon:
          "size-10",

        "icon-xs":
          "size-7 rounded-lg in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",

        "icon-sm":
          "size-8 rounded-lg in-data-[slot=button-group]:rounded-lg",

        "icon-lg":
          "size-11 rounded-xl",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(
        buttonVariants({
          variant,
          size,
          className,
        }),
      )}
      {...props}
    />
  );
}

export { Button, buttonVariants };
