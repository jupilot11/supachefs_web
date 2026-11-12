import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

// Small-text fills use orange-dark: white on #E84C1E is only 3.8:1, below AA.
// Hover and press move with transform only.
const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-[10px] font-bold tracking-[-0.01em] whitespace-nowrap transition-[transform,opacity] duration-150 ease-out select-none hover:-translate-y-px active:translate-y-px disabled:pointer-events-none disabled:opacity-60 aria-busy:opacity-80 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-orange-dark text-white hover:opacity-95",
        outline:
          "border-[1.5px] border-brand bg-transparent text-orange-dark hover:bg-orange-wash",
        inverse: "bg-white text-orange-dark hover:bg-orange-wash",
        ghost: "text-primary hover:bg-subtle",
        link: "h-auto min-h-11 rounded-none px-0 font-semibold text-orange-dark hover:translate-y-0 hover:underline",
      },
      size: {
        default: "h-11 px-4 text-sm",
        lg: "h-[50px] px-6 text-[15px] md:h-[54px] md:text-base",
        icon: "size-11",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
