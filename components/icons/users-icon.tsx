import { Users } from "lucide-react"

interface UsersIconProps {
  className?: string
}

export function UsersIcon({ className = "h-4 w-4" }: UsersIconProps) {
  return <Users className={className} />
}
