import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded px-2 py-0.5 text-xs font-medium transition-colors duration-150",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground border border-border",
        green: "border-transparent bg-green-500/10 text-green-700 ring-1 ring-inset ring-green-500/20 dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20",
        yellow: "border-transparent bg-yellow-500/10 text-yellow-700 ring-1 ring-inset ring-yellow-500/20 dark:bg-yellow-500/10 dark:text-yellow-400 dark:ring-yellow-500/20",
        red: "border-transparent bg-red-500/10 text-red-700 ring-1 ring-inset ring-red-500/20 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20",
        blue: "border-transparent bg-blue-500/10 text-blue-700 ring-1 ring-inset ring-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/20",
        orange: "border-transparent bg-orange-500/10 text-orange-700 ring-1 ring-inset ring-orange-500/20 dark:bg-orange-500/10 dark:text-orange-400 dark:ring-orange-500/20",
        gray: "border-transparent bg-gray-500/10 text-gray-700 ring-1 ring-inset ring-gray-500/20 dark:bg-gray-500/10 dark:text-gray-400 dark:ring-gray-500/20",
        purple: "border-transparent bg-purple-500/10 text-purple-700 ring-1 ring-inset ring-purple-500/20 dark:bg-purple-500/10 dark:text-purple-400 dark:ring-purple-500/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
