import { Eye } from "lucide-react"

interface EyeIconProps {
  className?: string
}

export function EyeIcon({ className = "h-4 w-4" }: EyeIconProps) {
  return <Eye className={className} />
}
