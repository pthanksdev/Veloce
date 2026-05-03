import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-500",
        destructive: "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white shadow-lg shadow-red-500/5",
        outline: "border border-zinc-800 bg-transparent hover:bg-zinc-900 hover:text-white",
        secondary: "bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700",
        ghost: "hover:bg-zinc-900 hover:text-white text-zinc-400",
        link: "text-indigo-400 underline-offset-4 hover:underline",
        white: "bg-white text-zinc-950 hover:bg-zinc-200",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-xl px-3",
        lg: "h-14 rounded-3xl px-10 text-base",
        icon: "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        ...props
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
