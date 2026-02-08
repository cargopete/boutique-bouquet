import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  const baseStyles =
    "font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary:
      "bg-terracotta text-white hover:bg-terracotta-dark focus:ring-terracotta shadow-warm hover:shadow-warm-md",
    secondary:
      "bg-secondary text-secondary-foreground hover:bg-cream focus:ring-ochre",
    outline:
      "border-2 border-terracotta text-terracotta hover:bg-terracotta hover:text-white focus:ring-terracotta",
    danger:
      "bg-destructive text-destructive-foreground hover:opacity-90 focus:ring-destructive",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
