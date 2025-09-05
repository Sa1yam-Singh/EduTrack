import { CheckCircle } from "lucide-react"

interface CheckCircleIconProps {
  className?: string
}

export function CheckCircleIcon({ className = "h-4 w-4" }: CheckCircleIconProps) {
  return <CheckCircle className={className} />
}
