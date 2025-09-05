import { Shield } from "lucide-react"

interface ShieldIconProps {
  className?: string
}

export function ShieldIcon({ className = "h-4 w-4" }: ShieldIconProps) {
  return <Shield className={className} />
}
