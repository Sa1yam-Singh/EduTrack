"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircleIcon } from "@/components/icons/check-circle-icon"
import { Calendar, TrendingUp, Award, User, LogOut, Utensils } from "lucide-react"
import { AttendanceMealValidator } from "@/lib/attendance-meal-validation"

interface AttendanceRecord {
  studentId: string
  studentName: string
  date: string
  time: string
  status: "present" | "absent"
}

interface MonthlyStats {
  totalDays: number
  presentDays: number
  absentDays: number
  attendancePercentage: number
  mealsEligible: number
  currentStreak: number
}

export default function StudentDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [studentId, setStudentId] = useState("")
  const [studentName, setStudentName] = useState("")
  const [loginId, setLoginId] = useState("")
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats>({
    totalDays: 0,
    presentDays: 0,
    absentDays: 0,
    attendancePercentage: 0,
    mealsEligible: 0,
    currentStreak: 0,
  })
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([])
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [mealStatus, setMealStatus] = useState<any[]>([])

  // Generate calendar days for current month
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getMonthName = (month: number) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]
    return months[month]
  }

  // Calculate monthly statistics
  const calculateMonthlyStats = (records: AttendanceRecord[]) => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear)
    const monthStart = new Date(currentYear, currentMonth, 1)
    const monthEnd = new Date(currentYear, currentMonth + 1, 0)

    const monthRecords = records.filter((record) => {
      const recordDate = new Date(record.date)
      return recordDate >= monthStart && recordDate <= monthEnd
    })

    const presentDays = monthRecords.filter((record) => record.status === "present").length
    const totalDays = Math.min(daysInMonth, new Date().getDate()) // Only count days up to today
    const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0

    // Calculate current streak
    let streak = 0
    const sortedRecords = monthRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    for (const record of sortedRecords) {
      if (record.status === "present") {
        streak++
      } else {
        break
      }
    }

    return {
      totalDays,
      presentDays,
      absentDays: totalDays - presentDays,
      attendancePercentage,
      mealsEligible: presentDays,
      currentStreak: streak,
    }
  }

  // Load student data on login
  useEffect(() => {
    if (isLoggedIn && studentId) {
      const savedRecords = localStorage.getItem("attendanceRecords")
      const savedMeals = localStorage.getItem("mealRecords")

      if (savedRecords) {
        const allRecords = JSON.parse(savedRecords)
        const studentRecords = allRecords.filter((record: any) => record.studentId === studentId)
        setAttendanceHistory(studentRecords)

        if (studentRecords.length > 0) {
          setStudentName(studentRecords[0].studentName)
        }

        const stats = calculateMonthlyStats(studentRecords)
        setMonthlyStats(stats)

        if (savedMeals) {
          const allMeals = JSON.parse(savedMeals)
          const todayMealStatus = AttendanceMealValidator.getStudentMealStatus(
            studentId,
            allRecords,
            allMeals,
            new Date().toISOString().split("T")[0],
          )
          setMealStatus(todayMealStatus)
        }
      }
    }
  }, [isLoggedIn, studentId, currentMonth, currentYear])

  const handleLogin = () => {
    if (!loginId) {
      alert("Please enter your Student ID")
      return
    }

    setStudentId(loginId)
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setStudentId("")
    setStudentName("")
    setLoginId("")
    setAttendanceHistory([])
    setMonthlyStats({
      totalDays: 0,
      presentDays: 0,
      absentDays: 0,
      attendancePercentage: 0,
      mealsEligible: 0,
      currentStreak: 0,
    })
    setMealStatus([])
  }

  // Generate calendar view
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear)
    const firstDay = new Date(currentYear, currentMonth, 1).getDay()
    const days = []

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
      const record = attendanceHistory.find((r) => r.date === dateStr)
      const isToday = new Date().toDateString() === new Date(currentYear, currentMonth, day).toDateString()
      const isFuture = new Date(currentYear, currentMonth, day) > new Date()

      days.push({
        day,
        date: dateStr,
        status: record?.status || (isFuture ? "future" : "absent"),
        isToday,
      })
    }

    return days
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Student Login</CardTitle>
            <CardDescription>Enter your Student ID to view your attendance dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="loginId">Student ID</Label>
              <Input
                id="loginId"
                placeholder="Enter your student ID"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
            <Button onClick={handleLogin} className="w-full">
              <User className="mr-2 h-4 w-4" />
              Login to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const calendarDays = generateCalendarDays()

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Student Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {studentName || studentId}!</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Monthly Overview Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Attendance Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-green-600">{monthlyStats.attendancePercentage}%</div>
                <Progress value={monthlyStats.attendancePercentage} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {monthlyStats.presentDays} of {monthlyStats.totalDays} days
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Days Present</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                <span className="text-2xl font-bold">{monthlyStats.presentDays}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Meals Eligible</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Utensils className="h-5 w-5 text-accent" />
                <span className="text-2xl font-bold">{monthlyStats.mealsEligible}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Based on attendance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Current Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-500" />
                <span className="text-2xl font-bold">{monthlyStats.currentStreak}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Consecutive days</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Utensils className="h-5 w-5" />
              Today's Meal Status
            </CardTitle>
            <CardDescription>Your meal eligibility and distribution status for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {mealStatus.map((meal, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium capitalize">{meal.mealType}</h4>
                    <Badge variant={meal.received ? "default" : meal.isEligible ? "secondary" : "destructive"}>
                      {meal.received ? "Received" : meal.isEligible ? "Eligible" : "Not Eligible"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {meal.received ? `Received at ${meal.receivedAt}` : meal.reason}
                  </p>
                  {meal.status === "TIME_RESTRICTION" && (
                    <p className="text-xs text-orange-600 mt-1">Check distribution hours</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Badge */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold">Performance Status</h3>
                  <p className="text-sm text-muted-foreground">
                    {monthlyStats.attendancePercentage >= 90
                      ? "Excellent attendance! Keep it up!"
                      : monthlyStats.attendancePercentage >= 75
                        ? "Good attendance. Try to improve further."
                        : "Attendance needs improvement. Aim for 75% or higher."}
                  </p>
                </div>
              </div>
              <Badge
                variant={
                  monthlyStats.attendancePercentage >= 90
                    ? "default"
                    : monthlyStats.attendancePercentage >= 75
                      ? "secondary"
                      : "destructive"
                }
              >
                {monthlyStats.attendancePercentage >= 90
                  ? "Excellent"
                  : monthlyStats.attendancePercentage >= 75
                    ? "Good"
                    : "Needs Improvement"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Calendar */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {getMonthName(currentMonth)} {currentYear} Attendance
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (currentMonth === 0) {
                      setCurrentMonth(11)
                      setCurrentYear(currentYear - 1)
                    } else {
                      setCurrentMonth(currentMonth - 1)
                    }
                  }}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (currentMonth === 11) {
                      setCurrentMonth(0)
                      setCurrentYear(currentYear + 1)
                    } else {
                      setCurrentMonth(currentMonth + 1)
                    }
                  }}
                >
                  Next
                </Button>
              </div>
            </div>
            <CardDescription>Green: Present, Red: Absent, Gray: Future/No data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2 mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  className={`
                    aspect-square flex items-center justify-center text-sm rounded-lg border
                    ${
                      day === null
                        ? ""
                        : day.status === "present"
                          ? "bg-green-100 border-green-300 text-green-800"
                          : day.status === "absent"
                            ? "bg-red-100 border-red-300 text-red-800"
                            : "bg-gray-100 border-gray-300 text-gray-500"
                    }
                    ${day?.isToday ? "ring-2 ring-accent" : ""}
                  `}
                >
                  {day?.day}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Attendance History */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Attendance History</CardTitle>
            <CardDescription>Your last 10 attendance records</CardDescription>
          </CardHeader>
          <CardContent>
            {attendanceHistory.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No attendance records found. Start marking your attendance!
              </p>
            ) : (
              <div className="space-y-2">
                {attendanceHistory
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 10)
                  .map((record, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            record.status === "present" ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                        <div>
                          <p className="font-medium">
                            {new Date(record.date).toLocaleDateString("en-IN", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                          <p className="text-sm text-muted-foreground">Time: {record.time}</p>
                        </div>
                      </div>
                      <Badge variant={record.status === "present" ? "default" : "destructive"}>
                        {record.status === "present" ? "Present" : "Absent"}
                      </Badge>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
