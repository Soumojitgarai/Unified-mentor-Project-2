import type { ButtonHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface CalculatorButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "operator" | "function" | "equals"
}

export function CalculatorButton({ children, variant = "default", className, ...props }: CalculatorButtonProps) {
  return (
    <button
      className={cn(
        "h-14 rounded-lg font-medium text-lg flex items-center justify-center transition-colors",
        variant === "default" &&
          "bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100",
        variant === "operator" &&
          "bg-blue-100 hover:bg-blue-200 text-blue-600 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 dark:text-blue-400",
        variant === "function" &&
          "bg-red-100 hover:bg-red-200 text-red-600 dark:bg-red-900/30 dark:hover:bg-red-800/50 dark:text-red-400",
        variant === "equals" && "bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-700",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

