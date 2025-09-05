import { Play } from "lucide-react"

interface PlayIconProps {
  className?: string
}

export function PlayIcon({ className = "h-4 w-4" }: PlayIconProps) {
  return <Play className={className} />
}
