"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircleIcon } from "@/components/icons/check-circle-icon"
import {
  Users,
  Utensils,
  AlertTriangle,
  Download,
  RefreshCw,
  BarChart3,
  Clock,
  Award,
  Shield,
  User,
  LogOut,
} from "lucide-react"

interface AttendanceRecord {
  studentId: string
  studentName: string
  date: string
  time: string
  status: "present" | "absent"
}

interface MealRecord {
  studentId: string
  studentName: string
  date: string
  time: string
  mealType: "breakfast" | "lunch" | "snack"
  distributedBy: string
}

interface DailyStats {
  totalStudents: number
  presentToday: number
  absentToday: number
  attendanceRate: number
  mealsDistributed: {
    breakfast: number
    lunch: number
    snack: number
    total: number
  }
  lateArrivals: number
  perfectAttendanceStreak: number
}

interface WeeklyTrend {
  date: string
  present: number
  absent: number
  attendanceRate: number
}

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [adminPassword, setAdminPassword] = useState("")
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [mealRecords, setMealRecords] = useState<MealRecord[]>([])
  const [dailyStats, setDailyStats] = useState<DailyStats>({
    totalStudents: 150,
    presentToday: 0,
    absentToday: 0,
    attendanceRate: 0,
    mealsDistributed: { breakfast: 0, lunch: 0, snack: 0, total: 0 },
    lateArrivals: 0,
    perfectAttendanceStreak: 0,
  })
  const [weeklyTrends, setWeeklyTrends] = useState<WeeklyTrend[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])

  const today = new Date().toISOString().split("T")[0]

  // Load data on component mount
  useEffect(() => {
    if (isLoggedIn) {
      const savedAttendance = localStorage.getItem("attendanceRecords")
      const savedMeals = localStorage.getItem("mealRecords")

      if (savedAttendance) {
        setAttendanceRecords(JSON.parse(savedAttendance))
      }

      if (savedMeals) {
        setMealRecords(JSON.parse(savedMeals))
      }
    }
  }, [isLoggedIn])

  // Calculate daily statistics
  useEffect(() => {
    if (attendanceRecords.length > 0 || mealRecords.length > 0) {
      const todayAttendance = attendanceRecords.filter(
        (record) => record.date === selectedDate && record.status === "present",
      )

      const todayMeals = mealRecords.filter((record) => record.date === selectedDate)

      const mealsByType = {
        breakfast: todayMeals.filter((m) => m.mealType === "breakfast").length,
        lunch: todayMeals.filter((m) => m.mealType === "lunch").length,
        snack: todayMeals.filter((m) => m.mealType === "snack").length,
        total: todayMeals.length,
      }

      // Calculate late arrivals (after 9:00 AM)
      const lateArrivals = todayAttendance.filter((record) => {
        const [hours, minutes] = record.time.split(":").map(Number)
        return hours > 9 || (hours === 9 && minutes > 0)
      }).length

      const presentToday = todayAttendance.length
      const absentToday = dailyStats.totalStudents - presentToday
      const attendanceRate = Math.round((presentToday / dailyStats.totalStudents) * 100)

      setDailyStats((prev) => ({
        ...prev,
        presentToday,
        absentToday,
        attendanceRate,
        mealsDistributed: mealsByType,
        lateArrivals,
      }))

      // Calculate weekly trends
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - i)
        return date.toISOString().split("T")[0]
      }).reverse()

      const trends = last7Days.map((date) => {
        const dayAttendance = attendanceRecords.filter((record) => record.date === date && record.status === "present")
        const present = dayAttendance.length
        const absent = dailyStats.totalStudents - present
        const rate = present > 0 ? Math.round((present / dailyStats.totalStudents) * 100) : 0

        return {
          date,
          present,
          absent,
          attendanceRate: rate,
        }
      })

      setWeeklyTrends(trends)
    }
  }, [attendanceRecords, mealRecords, selectedDate, dailyStats.totalStudents])

  const handleLogin = () => {
    // Simple password check (in real app, this would be secure authentication)
    if (adminPassword === "admin123") {
      setIsLoggedIn(true)
    } else {
      alert("Invalid password. Use 'admin123' for demo.")
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setAdminPassword("")
  }

  const exportData = () => {
    const data = {
      date: selectedDate,
      attendance: attendanceRecords.filter((r) => r.date === selectedDate),
      meals: mealRecords.filter((r) => r.date === selectedDate),
      stats: dailyStats,
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `edutrak-report-${selectedDate}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const refreshData = () => {
    // Simulate data refresh
    window.location.reload()
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-accent" />
            </div>
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <CardDescription>Enter admin password to access the dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Admin Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter admin password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
              />
              <p className="text-xs text-muted-foreground">Demo password: admin123</p>
            </div>
            <Button onClick={handleLogin} className="w-full">
              <Shield className="mr-2 h-4 w-4" />
              Login to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const todayAttendanceList = attendanceRecords.filter(
    (record) => record.date === selectedDate && record.status === "present",
  )

  const absentStudentsList = Array.from({ length: dailyStats.absentToday }, (_, i) => ({
    studentId: `STU${String(i + dailyStats.presentToday + 1).padStart(3, "0")}`,
    studentName: `Student ${i + dailyStats.presentToday + 1}`,
  }))

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">School Management & Analytics</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="dateSelect">Date:</Label>
              <Input
                id="dateSelect"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-40"
              />
            </div>
            <Button variant="outline" onClick={refreshData}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button variant="outline" onClick={exportData}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-accent" />
                <span className="text-2xl font-bold">{dailyStats.totalStudents}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Enrolled</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Present Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                <span className="text-2xl font-bold text-green-600">{dailyStats.presentToday}</span>
              </div>
              <Progress value={dailyStats.attendanceRate} className="h-2 mt-2" />
              <p className="text-xs text-muted-foreground mt-1">{dailyStats.attendanceRate}% attendance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Meals Served</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Utensils className="h-5 w-5 text-blue-500" />
                <span className="text-2xl font-bold text-blue-600">{dailyStats.mealsDistributed.total}</span>
              </div>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  B: {dailyStats.mealsDistributed.breakfast}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  L: {dailyStats.mealsDistributed.lunch}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  S: {dailyStats.mealsDistributed.snack}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Late Arrivals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-500" />
                <span className="text-2xl font-bold text-orange-600">{dailyStats.lateArrivals}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">After 9:00 AM</p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Overview */}
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Weekly Attendance Trend
              </CardTitle>
              <CardDescription>Last 7 days attendance overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyTrends.map((trend, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-20 text-sm font-medium">
                        {new Date(trend.date).toLocaleDateString("en-IN", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                      <Progress value={trend.attendanceRate} className="w-32 h-2" />
                      <span className="text-sm font-medium w-12">{trend.attendanceRate}%</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {trend.present} present, {trend.absent} absent
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Alerts & Issues
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {dailyStats.attendanceRate < 75 && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-red-800">Low Attendance</span>
                  </div>
                  <p className="text-xs text-red-600 mt-1">Attendance below 75% threshold</p>
                </div>
              )}

              {dailyStats.lateArrivals > 10 && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">High Late Arrivals</span>
                  </div>
                  <p className="text-xs text-yellow-600 mt-1">{dailyStats.lateArrivals} students arrived late</p>
                </div>
              )}

              {dailyStats.mealsDistributed.total < dailyStats.presentToday && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Utensils className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Pending Meals</span>
                  </div>
                  <p className="text-xs text-blue-600 mt-1">
                    {dailyStats.presentToday - dailyStats.mealsDistributed.total} students haven't received meals
                  </p>
                </div>
              )}

              {dailyStats.attendanceRate >= 90 && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Excellent Attendance</span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">Great job! Attendance above 90%</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Detailed Data Tabs */}
        <Tabs defaultValue="present" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="present">Present Students</TabsTrigger>
            <TabsTrigger value="absent">Absent Students</TabsTrigger>
            <TabsTrigger value="meals">Meal Distribution</TabsTrigger>
          </TabsList>

          <TabsContent value="present">
            <Card>
              <CardHeader>
                <CardTitle>Students Present Today</CardTitle>
                <CardDescription>
                  {dailyStats.presentToday} students marked attendance for {selectedDate}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {todayAttendanceList.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No students marked attendance for this date.</p>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                    {todayAttendanceList.map((student, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <User className="h-4 w-4 text-green-600" />
                          <div>
                            <p className="font-medium text-green-800">{student.studentName}</p>
                            <p className="text-sm text-green-600">ID: {student.studentId}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-green-600">{student.time}</p>
                          {student.time > "09:00" && (
                            <Badge variant="outline" className="text-orange-600 border-orange-600 text-xs">
                              Late
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="absent">
            <Card>
              <CardHeader>
                <CardTitle>Absent Students</CardTitle>
                <CardDescription>
                  {dailyStats.absentToday} students did not mark attendance for {selectedDate}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {dailyStats.absentToday === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Perfect attendance! All students are present.
                  </p>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                    {absentStudentsList.map((student, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <User className="h-4 w-4 text-red-600" />
                          <div>
                            <p className="font-medium text-red-800">{student.studentName}</p>
                            <p className="text-sm text-red-600">ID: {student.studentId}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-red-600 border-red-600">
                          Absent
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="meals">
            <Card>
              <CardHeader>
                <CardTitle>Meal Distribution Log</CardTitle>
                <CardDescription>Meals distributed on {selectedDate}</CardDescription>
              </CardHeader>
              <CardContent>
                {mealRecords.filter((m) => m.date === selectedDate).length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No meals distributed for this date.</p>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {mealRecords
                      .filter((meal) => meal.date === selectedDate)
                      .sort(
                        (a, b) => new Date(`${a.date} ${a.time}`).getTime() - new Date(`${b.date} ${b.time}`).getTime(),
                      )
                      .map((meal, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <Utensils className="h-4 w-4 text-blue-600" />
                            <div>
                              <p className="font-medium text-blue-800">{meal.studentName}</p>
                              <p className="text-sm text-blue-600">ID: {meal.studentId}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className="text-blue-600 border-blue-600 capitalize">
                              {meal.mealType}
                            </Badge>
                            <p className="text-xs text-blue-600 mt-1">{meal.time}</p>
                            <p className="text-xs text-blue-500">By: {meal.distributedBy}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
