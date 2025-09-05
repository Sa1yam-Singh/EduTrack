import { TrendingUp } from "lucide-react"

interface TrendingUpIconProps {
  className?: string
}

export function TrendingUpIcon({ className = "h-4 w-4" }: TrendingUpIconProps) {
  return <TrendingUp className={className} />
}
