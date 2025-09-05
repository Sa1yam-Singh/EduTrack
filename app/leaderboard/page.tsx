"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUpIcon } from "@/components/icons/trending-up-icon"
import { ScrollAnimation } from "@/components/scroll-animation"
import Link from "next/link"
import { Trophy, Medal, Award, Star } from "lucide-react"

export default function LeaderboardPage() {
  const topStudents = [
    {
      rank: 1,
      name: "Priya Sharma",
      school: "Delhi Public School",
      attendance: 98.5,
      streak: 45,
      points: 2450,
      avatar: "/indian-student-girl-smiling.jpg",
      reward: "₹5,000 Scholarship + Certificate",
    },
    {
      rank: 2,
      name: "Arjun Patel",
      school: "Kendriya Vidyalaya",
      attendance: 97.8,
      streak: 42,
      points: 2380,
      avatar: "/indian-student-boy-smiling.jpg",
      reward: "₹3,000 Scholarship + Certificate",
    },
    {
      rank: 3,
      name: "Sneha Reddy",
      school: "DAV Public School",
      attendance: 97.2,
      streak: 38,
      points: 2320,
      avatar: "/indian-student-girl-studying.jpg",
      reward: "₹2,000 Scholarship + Certificate",
    },
  ]

  const otherStudents = [
    { rank: 4, name: "Rahul Kumar", school: "St. Xavier's School", attendance: 96.5, points: 2180 },
    { rank: 5, name: "Ananya Singh", school: "Modern School", attendance: 96.1, points: 2150 },
    { rank: 6, name: "Vikram Joshi", school: "Ryan International", attendance: 95.8, points: 2120 },
    { rank: 7, name: "Kavya Nair", school: "Bal Bharati School", attendance: 95.5, points: 2090 },
    { rank: 8, name: "Aditya Gupta", school: "DPS Gurgaon", attendance: 95.2, points: 2060 },
  ]

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-8 w-8 text-yellow-500" />
      case 2:
        return <Medal className="h-8 w-8 text-gray-400" />
      case 3:
        return <Award className="h-8 w-8 text-amber-600" />
      default:
        return <span className="text-2xl font-bold text-muted-foreground">#{rank}</span>
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center transition-transform hover:scale-110">
                <span className="text-accent-foreground font-bold text-sm">ET</span>
              </div>
              <span className="text-xl font-bold text-foreground">EduTrak</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-12 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimation>
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Trophy className="h-8 w-8 text-accent" />
                <h1 className="text-4xl lg:text-5xl font-bold">Student Leaderboard</h1>
              </div>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Celebrating excellence in attendance and rewarding students who show up consistently
              </p>
              <Badge variant="secondary" className="text-sm">
                Updated in real-time • Current Month Rankings
              </Badge>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Top 3 Students */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimation>
            <h2 className="text-3xl font-bold text-center mb-12">🏆 Top Performers</h2>
          </ScrollAnimation>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {topStudents.map((student, index) => (
              <ScrollAnimation key={student.rank} delay={index * 100}>
                <Card
                  className={`relative overflow-hidden transition-all hover:scale-105 ${
                    student.rank === 1
                      ? "border-yellow-500 bg-gradient-to-br from-yellow-50 to-amber-50"
                      : student.rank === 2
                        ? "border-gray-400 bg-gradient-to-br from-gray-50 to-slate-50"
                        : "border-amber-600 bg-gradient-to-br from-amber-50 to-orange-50"
                  }`}
                >
                  <div className="absolute top-4 right-4">{getRankIcon(student.rank)}</div>
                  <CardHeader className="text-center pb-4">
                    <div className="relative mx-auto mb-4">
                      <img
                        src={student.avatar || "/placeholder.svg"}
                        alt={student.name}
                        className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
                      />
                      <div className="absolute -bottom-2 -right-2 bg-accent text-accent-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                        #{student.rank}
                      </div>
                    </div>
                    <CardTitle className="text-xl">{student.name}</CardTitle>
                    <CardDescription>{student.school}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-accent">{student.attendance}%</div>
                        <div className="text-xs text-muted-foreground">Attendance</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-accent">{student.points}</div>
                        <div className="text-xs text-muted-foreground">Points</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{student.streak} day streak</span>
                      </div>
                    </div>
                    <div className="bg-white/50 rounded-lg p-3 text-center">
                      <div className="text-sm font-medium text-accent mb-1">🎁 Reward</div>
                      <div className="text-xs text-muted-foreground">{student.reward}</div>
                    </div>
                  </CardContent>
                </Card>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Other Rankings */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimation>
            <h2 className="text-3xl font-bold text-center mb-12">Other Top Performers</h2>
          </ScrollAnimation>

          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUpIcon className="h-5 w-5" />
                  <span>Rankings 4-8</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {otherStudents.map((student, index) => (
                    <ScrollAnimation key={student.rank} delay={index * 50}>
                      <div className="flex items-center justify-between p-4 bg-background rounded-lg border transition-all hover:shadow-md">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center font-bold text-lg">
                            #{student.rank}
                          </div>
                          <div>
                            <div className="font-semibold">{student.name}</div>
                            <div className="text-sm text-muted-foreground">{student.school}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-accent">{student.attendance}%</div>
                          <div className="text-sm text-muted-foreground">{student.points} pts</div>
                        </div>
                      </div>
                    </ScrollAnimation>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Rewards Information */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimation>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Reward System</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Students earn points for consistent attendance and can win exciting rewards every month
              </p>
            </div>
          </ScrollAnimation>

          <div className="grid md:grid-cols-3 gap-8">
            <ScrollAnimation delay={100}>
              <Card className="text-center">
                <CardHeader>
                  <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <CardTitle>1st Place</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-accent">₹5,000</div>
                    <div className="text-sm text-muted-foreground">Scholarship + Certificate</div>
                    <div className="text-xs">+ Special Recognition</div>
                  </div>
                </CardContent>
              </Card>
            </ScrollAnimation>

            <ScrollAnimation delay={200}>
              <Card className="text-center">
                <CardHeader>
                  <Medal className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <CardTitle>2nd Place</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-accent">₹3,000</div>
                    <div className="text-sm text-muted-foreground">Scholarship + Certificate</div>
                    <div className="text-xs">+ Merit Badge</div>
                  </div>
                </CardContent>
              </Card>
            </ScrollAnimation>

            <ScrollAnimation delay={300}>
              <Card className="text-center">
                <CardHeader>
                  <Award className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                  <CardTitle>3rd Place</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-accent">₹2,000</div>
                    <div className="text-sm text-muted-foreground">Scholarship + Certificate</div>
                    <div className="text-xs">+ Achievement Badge</div>
                  </div>
                </CardContent>
              </Card>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* CTA */}
      <ScrollAnimation>
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Want to Join the Leaderboard?</h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Start tracking your attendance with EduTrak and compete for exciting rewards
            </p>
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="bg-background text-foreground hover:bg-background/90">
                Get Started Today
              </Button>
            </Link>
          </div>
        </section>
      </ScrollAnimation>
    </div>
  )
}
