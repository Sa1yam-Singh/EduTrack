"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden">
      <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="p-2">
        <div className="flex flex-col space-y-1">
          <div
            className={`w-5 h-0.5 bg-foreground transition-all duration-300 ${isOpen ? "rotate-45 translate-y-1.5" : ""}`}
          />
          <div className={`w-5 h-0.5 bg-foreground transition-all duration-300 ${isOpen ? "opacity-0" : ""}`} />
          <div
            className={`w-5 h-0.5 bg-foreground transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
          />
        </div>
      </Button>

      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-background border-b border-border shadow-lg">
          <div className="flex flex-col space-y-4 p-4">
            <a
              href="#features"
              className="text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Features
            </a>
            <a
              href="#impact"
              className="text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Impact
            </a>
            <a
              href="#how-it-works"
              className="text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsOpen(false)}
            >
              How It Works
            </a>
            <a
              href="#contact"
              className="text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
