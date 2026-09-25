"use client";

import { cn } from "@/lib/utils";
import {
  ChangeEvent,
  InputHTMLAttributes,
  ReactNode,
  RefObject,
  useEffect,
  useState,
} from "react";

const TextInput = ({
  Icon,
  label,
  error,
  position = "left",
  disabled,
  className,
  inputValue,
  placeholder,
  nextInputRef,
  currentInputRef,
  requiredAsterisk,
  onEnterPress,
  onChange,
  onBlur,
  type = "text",
}: {
  label?: string;
  error?: string;
  className?: string;
  disabled?: boolean;
  onBlur?: () => void;
  placeholder?: string;
  Icon?: React.ReactNode;
  onEnterPress?: () => void;
  requiredAsterisk?: boolean;
  position?: "left" | "right";
  inputValue?: string | number;
  onChange?: (value: string | number | any) => void;
  nextInputRef?: React.RefObject<HTMLInputElement | null>;
  currentInputRef?: React.RefObject<HTMLInputElement | null>;
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
}) => {
  const [value, setValue] = useState(inputValue || "");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setValue(inputValue || "");
  }, [inputValue]);

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onChange?.(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onEnterPress?.();

      if (nextInputRef?.current) {
        nextInputRef.current.focus();
      }

      e.currentTarget.blur();
    }
  };

  return (
    <div className="m-0 flex w-full flex-col gap-2 p-0">
      <label className="relative mt-1 flex w-full flex-col items-start">
        {/* =====================================================
            LABEL
        ====================================================== */}

        {label && (
          <div className="mb-2 flex items-center">
            <p className="font-display flex items-center gap-2 text-xs font-semibold tracking-wide text-surface-50">
              {label}
            </p>

            {requiredAsterisk && <span className="ml-1 text-red-400">*</span>}
          </div>
        )}

        {/* =====================================================
            INPUT
        ====================================================== */}

        <div className="relative w-full">
          <input
            type="text"
            value={value}
            disabled={disabled}
            ref={currentInputRef}
            onBlur={handleBlur}
            onFocus={handleFocus}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={cn(
              [
                // Base
                "h-12",
                "w-full",
                "rounded-xl",
                "border",
                "px-4",
                "text-sm",
                "outline-none",
                "transition-all",
                "duration-200",

                // Dark theme
                "bg-background",
                "text-foreground",
                "placeholder:text-muted",

                // Border
                "border-border",

                // Hover
                "hover:border-border-hover",

                // Disabled
                "disabled:cursor-not-allowed",
                "disabled:bg-surface-200",
                "disabled:text-muted",
                "disabled:opacity-70",

                // Focus
                "focus:border-primary-500",
                "focus:bg-card",
                "focus:ring-4",
                "focus:ring-primary-900/40",

                // Selection
                "selection:bg-primary-600/40",
                "selection:text-white",
              ].join(" "),

              error
                ? [
                    "border-t-error-500",
                    "bg-t-error-200/5",
                    "focus:border-t-error-500",
                    "focus:ring-t-error-500/15",
                  ].join(" ")
                : "",

              Icon && position === "left" ? "pl-11" : "",

              Icon && position === "right" ? "pr-11" : "",

              className,
            )}
          />

          {/* ===================================================
              ICON
          ==================================================== */}

          {Icon && (
            <div
              className={cn(
                "pointer-events-none absolute top-1/2 -translate-y-1/2 transition-colors duration-200",

                position === "left" ? "left-4" : "right-4",

                isFocused
                  ? "text-primary-400"
                  : error
                    ? "text-red-400"
                    : "text-muted",
              )}
            >
              {Icon}
            </div>
          )}
        </div>
      </label>

      {/* =====================================================
          ERROR
      ====================================================== */}

      {error && (
        <p className="flex items-center gap-1.5 text-xs text-red-400">
          <span className="h-1 w-1 shrink-0 rounded-full bg-red-400" />

          {error}
        </p>
      )}
    </div>
  );
};

export default TextInput;
