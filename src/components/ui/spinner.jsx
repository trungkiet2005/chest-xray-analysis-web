import * as React from "react"
import { cn } from "../../lib/utils"

const Spinner = React.forwardRef(({ className, size = "default", ...props }, ref) => {
  const sizeClasses = {
    small: "h-4 w-4",
    default: "h-6 w-6",
    large: "h-8 w-8",
  }

  return (
    <div
      ref={ref}
      className={cn(
        "animate-spin rounded-full border-2 border-current border-t-transparent",
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
})
Spinner.displayName = "Spinner"

export { Spinner }
