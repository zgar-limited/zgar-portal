import * as React from "react"
import { Minus, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface InputNumberProps {
  value?: number
  onChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  className?: string
  size?: "sm" | "default" | "lg"
}

const InputNumber = React.forwardRef<HTMLInputElement, InputNumberProps>(
  ({
    value = 1,
    onChange,
    min = 1,
    max,
    step = 1,
    disabled = false,
    className,
    size = "default",
    ...props
  }, ref) => {
    const [inputValue, setInputValue] = React.useState(value.toString())

    React.useEffect(() => {
      setInputValue(value.toString())
    }, [value])

    const handleDecrease = () => {
      const newValue = Math.max(min, value - step)
      onChange?.(newValue)
    }

    const handleIncrease = () => {
      const newValue = max ? Math.min(max, value + step) : value + step
      onChange?.(newValue)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setInputValue(newValue)

      const numValue = parseInt(newValue, 10)
      if (!isNaN(numValue)) {
        const clampedValue = Math.max(min, max ? Math.min(max, numValue) : numValue)
        onChange?.(clampedValue)
      }
    }

    const handleInputBlur = () => {
      const numValue = parseInt(inputValue, 10)
      if (isNaN(numValue) || numValue < min) {
        setInputValue(value.toString())
      } else {
        const clampedValue = max ? Math.min(max, numValue) : numValue
        setInputValue(clampedValue.toString())
        onChange?.(clampedValue)
      }
    }

    const sizeClasses = {
      sm: "h-8 w-8",
      default: "h-10 w-10",
      lg: "h-12 w-12"
    }

    const inputSizeClasses = {
      sm: "h-8 text-sm",
      default: "h-10",
      lg: "h-12 text-lg"
    }

    return (
      <div className={cn(
        "flex items-center rounded-md border border-input bg-background",
        className
      )}>
        <button
          type="button"
          onClick={handleDecrease}
          disabled={disabled || value <= min}
          className={cn(
            "flex items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-50",
            sizeClasses[size],
            "rounded-l-md border-r border-input"
          )}
        >
          <Minus className="h-4 w-4" />
        </button>

        <input
          ref={ref}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          disabled={disabled}
          className={cn(
            "w-16 text-center bg-transparent outline-none",
            inputSizeClasses[size]
          )}
          {...props}
        />

        <button
          type="button"
          onClick={handleIncrease}
          disabled={disabled || (max !== undefined && value >= max)}
          className={cn(
            "flex items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-50",
            sizeClasses[size],
            "rounded-r-md border-l border-input"
          )}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    )
  }
)

InputNumber.displayName = "InputNumber"

export { InputNumber }