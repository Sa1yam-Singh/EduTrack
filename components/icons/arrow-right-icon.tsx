import { ArrowRight } from "lucide-react"

interface ArrowRightIconProps {
  className?: string
}

export function ArrowRightIcon({ className = "h-4 w-4" }: ArrowRightIconProps) {
  return <ArrowRight className={className} />
}
