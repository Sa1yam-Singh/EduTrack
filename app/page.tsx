import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircleIcon } from "@/components/icons/check-circle-icon"
import { ShieldIcon } from "@/components/icons/shield-icon"
import { UsersIcon } from "@/components/icons/users-icon"
import { TrendingUpIcon } from "@/components/icons/trending-up-icon"
import { EyeIcon } from "@/components/icons/eye-icon"
import { AwardIcon } from "@/components/icons/award-icon"
import { ArrowRightIcon } from "@/components/icons/arrow-right-icon"
import { PlayIcon } from "@/components/icons/play-icon"
import { InteractiveCounter } from "@/components/interactive-counter"
import { MobileMenu } from "@/components/mobile-menu"
import { ScrollAnimation } from "@/components/scroll-animation"
import Link from "next/link"

export default function EduTrakHomepage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center transition-transform hover:scale-110">
                <span className="text-accent-foreground font-bold text-sm">ET</span>
              </div>
              <span className="text-xl font-bold text-foreground">EduTrak</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full"></span>
              </a>
              <Link
                href="/attendance"
                className="text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                Attendance
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full"></span>
              </Link>
              <Link
                href="/meals"
                className="text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                Meals
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full"></span>
              </Link>
              <Link
                href="/student-dashboard"
                className="text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                Dashboard
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full"></span>
              </Link>
              <Link
                href="/admin"
                className="text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                Admin
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full"></span>
              </Link>
              <Link
                href="/leaderboard"
                className="text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                Leaderboard
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full"></span>
              </Link>
              <a
                href="#impact"
                className="text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                Impact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full"></span>
              </a>
              <a
                href="#how-it-works"
                className="text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                How It Works
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full"></span>
              </a>
              <a
                href="#contact"
                className="text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full"></span>
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground transition-all hover:scale-105 active:scale-95"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground transition-all hover:scale-105 active:scale-95">
                  Get Started
                </Button>
              </Link>
              <MobileMenu />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <ScrollAnimation>
              <div className="space-y-8">
                <div className="space-y-4">
                  <Badge variant="secondary" className="w-fit animate-pulse">
                    Digitizing Trust in Education
                  </Badge>
                  <h1 className="text-4xl lg:text-6xl font-bold text-balance leading-tight">
                    Transparent, Tamper-Proof
                    <span className="text-accent"> Attendance</span> for India's Schools
                  </h1>
                  <p className="text-xl text-muted-foreground text-pretty leading-relaxed">
                    We're not reinventing attendance — we're making it transparent, tamper-proof, and accountable. With
                    real-time data from schools, meal kitchens, and students, our solution stops corruption before it
                    starts and rewards those who show up.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/signup">
                    <Button
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all hover:scale-105 active:scale-95 group"
                    >
                      Start Free Trial
                      <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-border bg-transparent transition-all hover:scale-105 active:scale-95 group"
                  >
                    <PlayIcon className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                    Watch Demo
                  </Button>
                </div>
                <div className="flex items-center space-x-8 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2 group">
                    <CheckCircleIcon className="h-4 w-4 text-accent transition-transform group-hover:scale-110" />
                    <span>Real-time tracking</span>
                  </div>
                  <div className="flex items-center space-x-2 group">
                    <ShieldIcon className="h-4 w-4 text-accent transition-transform group-hover:scale-110" />
                    <span>Tamper-proof records</span>
                  </div>
                  <div className="flex items-center space-x-2 group">
                    <EyeIcon className="h-4 w-4 text-accent transition-transform group-hover:scale-110" />
                    <span>Full transparency</span>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
            <ScrollAnimation delay={200}>
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-accent/20 to-primary/20 rounded-2xl p-8 flex items-center justify-center transition-transform hover:scale-105">
                  <img
                    src="/clear-indian-classroom-digital-attendance.jpg"
                    alt="Students using EduTrak digital attendance system"
                    className="rounded-lg shadow-2xl transition-transform hover:scale-105"
                  />
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimation>
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-balance">Built for Trust, Designed for Impact</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
                Every feature is designed to eliminate corruption and create accountability in India's education system.
              </p>
            </div>
          </ScrollAnimation>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: ShieldIcon,
                title: "Tamper-Proof Records",
                description: "Blockchain-secured attendance data that cannot be altered or manipulated by anyone.",
                delay: 0,
              },
              {
                icon: EyeIcon,
                title: "Real-Time Transparency",
                description:
                  "Parents, officials, and communities can view attendance data in real-time, ensuring complete visibility.",
                delay: 100,
              },
              {
                icon: UsersIcon,
                title: "Multi-Point Verification",
                description:
                  "Cross-verification from schools, meal programs, and student check-ins for maximum accuracy.",
                delay: 200,
              },
              {
                icon: TrendingUpIcon,
                title: "Performance Analytics",
                description:
                  "Detailed insights and trends to help schools improve attendance and identify at-risk students.",
                delay: 300,
              },
              {
                icon: AwardIcon,
                title: "Reward System",
                description:
                  "Automated rewards and recognition for students, teachers, and schools with excellent attendance.",
                delay: 400,
              },
              {
                icon: CheckCircleIcon,
                title: "Compliance Monitoring",
                description:
                  "Automated compliance checks ensure schools meet government attendance requirements and funding criteria.",
                delay: 500,
              },
            ].map((feature, index) => (
              <ScrollAnimation key={index} delay={feature.delay}>
                <Card className="border-border bg-card transition-all hover:shadow-lg hover:scale-105 group">
                  <CardHeader>
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4 transition-all group-hover:bg-accent/20 group-hover:scale-110">
                      <feature.icon className="h-6 w-6 text-accent" />
                    </div>
                    <CardTitle className="group-hover:text-accent transition-colors">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimation>
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-balance">Real Impact, Real Results</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
                See how EduTrak is transforming education across India with measurable outcomes.
              </p>
            </div>
          </ScrollAnimation>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <ScrollAnimation delay={100}>
              <div className="text-center space-y-2">
                <InteractiveCounter end={98} suffix="%" />
                <div className="text-sm text-muted-foreground">Attendance Accuracy</div>
              </div>
            </ScrollAnimation>
            <ScrollAnimation delay={200}>
              <div className="text-center space-y-2">
                <InteractiveCounter end={500} suffix="+" />
                <div className="text-sm text-muted-foreground">Schools Connected</div>
              </div>
            </ScrollAnimation>
            <ScrollAnimation delay={300}>
              <div className="text-center space-y-2">
                <InteractiveCounter end={25} prefix="₹" suffix="Cr" />
                <div className="text-sm text-muted-foreground">Corruption Prevented</div>
              </div>
            </ScrollAnimation>
            <ScrollAnimation delay={400}>
              <div className="text-center space-y-2">
                <InteractiveCounter end={85} suffix="%" />
                <div className="text-sm text-muted-foreground">Attendance Improvement</div>
              </div>
            </ScrollAnimation>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <ScrollAnimation>
              <div className="space-y-6">
                <h3 className="text-2xl font-bold">Stopping Corruption Before It Starts</h3>
                <div className="space-y-4">
                  {[
                    {
                      title: "Ghost Student Detection",
                      description: "Automatically identifies fake enrollments and phantom attendance records.",
                    },
                    {
                      title: "Fund Allocation Transparency",
                      description: "Ensures government funds reach schools based on actual attendance data.",
                    },
                    {
                      title: "Meal Program Integrity",
                      description: "Cross-verifies meal distribution with actual student presence.",
                    },
                  ].map((item, index) => (
                    <div key={index} className="flex items-start space-x-3 group">
                      <CheckCircleIcon className="h-5 w-5 text-accent mt-0.5 flex-shrink-0 transition-transform group-hover:scale-110" />
                      <div>
                        <p className="font-medium group-hover:text-accent transition-colors">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollAnimation>
            <ScrollAnimation delay={200}>
              <div className="bg-card rounded-2xl p-8 border border-border transition-all hover:shadow-lg hover:scale-105">
                <img
                  src="/transparent-education-dashboard.jpg"
                  alt="EduTrak transparency dashboard"
                  className="w-full rounded-lg transition-transform hover:scale-105"
                />
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimation>
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-balance">Simple Setup, Powerful Results</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
                Get started with EduTrak in three simple steps and transform your school's attendance system.
              </p>
            </div>
          </ScrollAnimation>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Connect Your School",
                description: "Simple integration with your existing systems. No complex setup required.",
                delay: 100,
              },
              {
                step: "2",
                title: "Start Tracking",
                description: "Begin real-time attendance tracking with automatic verification and validation.",
                delay: 200,
              },
              {
                step: "3",
                title: "See Results",
                description: "Watch attendance improve, corruption decrease, and trust increase in your community.",
                delay: 300,
              },
            ].map((item, index) => (
              <ScrollAnimation key={index} delay={item.delay}>
                <div className="text-center space-y-4 group">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto transition-all group-hover:bg-accent/20 group-hover:scale-110">
                    <span className="text-2xl font-bold text-accent">{item.step}</span>
                  </div>
                  <h3 className="text-xl font-semibold group-hover:text-accent transition-colors">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <ScrollAnimation>
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-3xl mx-auto space-y-8">
              <h2 className="text-3xl lg:text-4xl font-bold text-balance">
                Ready to Transform Your School's Attendance System?
              </h2>
              <p className="text-xl opacity-90 text-pretty">
                Join hundreds of schools across India that are already using EduTrak to build trust, eliminate
                corruption, and improve student outcomes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="bg-background text-foreground hover:bg-background/90 transition-all hover:scale-105 active:scale-95 group"
                  >
                    Start Free Trial
                    <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent transition-all hover:scale-105 active:scale-95"
                >
                  Schedule Demo
                </Button>
              </div>
            </div>
          </div>
        </section>
      </ScrollAnimation>

      {/* Footer */}
      <footer className="py-12 bg-muted/30 border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center transition-transform hover:scale-110">
                  <span className="text-accent-foreground font-bold text-sm">ET</span>
                </div>
                <span className="text-xl font-bold">EduTrak</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Digitizing trust in India's education system through transparent, tamper-proof attendance tracking.
              </p>
            </div>
            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "Security", "API"],
              },
              {
                title: "Company",
                links: ["About", "Blog", "Careers", "Contact"],
              },
              {
                title: "Support",
                links: ["Help Center", "Documentation", "Status", "Privacy"],
              },
            ].map((section, index) => (
              <div key={index} className="space-y-4">
                <h4 className="font-semibold">{section.title}</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  {section.links.map((link, linkIndex) => (
                    <div key={linkIndex}>
                      <a href="#" className="hover:text-foreground transition-colors hover:translate-x-1 inline-block">
                        {link}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 EduTrak. All rights reserved. Building trust in education, one school at a time.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
