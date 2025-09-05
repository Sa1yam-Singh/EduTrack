import { Award } from "lucide-react"

interface AwardIconProps {
  className?: string
}

export function AwardIcon({ className = "h-4 w-4" }: AwardIconProps) {
  return <Award className={className} />
}
