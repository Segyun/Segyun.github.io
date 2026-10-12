import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "rounded-xl border bg-card text-card-foreground shadow-sm",
  {
    variants: {
      variant: {
        default: "",
        interactive: "transition-all hover:border-primary/50 hover:shadow-md",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, className }))}
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const cardTitleVariants = cva("font-semibold leading-none tracking-tight", {
  variants: {
    size: {
      default: "text-lg",
      lg: "text-xl",
      xl: "text-2xl",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export interface CardTitleProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardTitleVariants> {}

const CardTitle = React.forwardRef<HTMLDivElement, CardTitleProps>(
  ({ className, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardTitleVariants({ size, className }))}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

const cardDescriptionVariants = cva("text-sm text-muted-foreground", {
  variants: {
    clamp: {
      none: "",
      2: "line-clamp-2 leading-relaxed",
      3: "line-clamp-3 leading-relaxed",
    },
  },
  defaultVariants: {
    clamp: "none",
  },
});

export interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardDescriptionVariants> {}

const CardDescription = React.forwardRef<HTMLDivElement, CardDescriptionProps>(
  ({ className, clamp, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardDescriptionVariants({ clamp, className }))}
      {...props}
    />
  )
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const cardFooterVariants = cva("flex items-center p-6 pt-0", {
  variants: {
    bordered: {
      true: "border-t border-border pt-4 text-sm text-muted-foreground",
      false: "",
    },
  },
  defaultVariants: {
    bordered: false,
  },
});

export interface CardFooterProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardFooterVariants> {}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, bordered, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardFooterVariants({ bordered, className }))}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  cardVariants,
  cardTitleVariants,
  cardDescriptionVariants,
  cardFooterVariants,
};
