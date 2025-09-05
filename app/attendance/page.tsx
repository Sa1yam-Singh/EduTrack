"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { CheckCircleIcon } from "@/components/icons/check-circle-icon"
import { UsersIcon } from "@/components/icons/users-icon"
import { Calendar, Clock, User } from "lucide-react"

// Mock data structure for attendance
interface AttendanceRecord {
  studentId: string
  studentName: string
  date: string
  time: string
  status: "present" | "absent"
}

interface DailyStats {
  totalStudents: number
  presentToday: number
  attendanceRate: number
}

export default function AttendancePage() {
  const [studentId, setStudentId] = useState("")
  const [studentName, setStudentName] = useState("")
  const [isMarked, setIsMarked] = useState(false)
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [dailyStats, setDailyStats] = useState<DailyStats>({
    totalStudents: 150,
    presentToday: 0,
    attendanceRate: 0,
  })

  const today = new Date().toISOString().split("T")[0]
  const currentTime = new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  })

  // Load attendance data from localStorage on component mount
  useEffect(() => {
    const savedRecords = localStorage.getItem("attendanceRecords")
    if (savedRecords) {
      const records = JSON.parse(savedRecords)
      setAttendanceRecords(records)

      // Calculate today's stats
      const todayRecords = records.filter(
        (record: AttendanceRecord) => record.date === today && record.status === "present",
      )

      setDailyStats((prev) => ({
        ...prev,
        presentToday: todayRecords.length,
        attendanceRate: Math.round((todayRecords.length / prev.totalStudents) * 100),
      }))
    }
  }, [today])

  // Check if student already marked attendance today
  useEffect(() => {
    if (studentId) {
      const alreadyMarked = attendanceRecords.some((record) => record.studentId === studentId && record.date === today)
      setIsMarked(alreadyMarked)
    }
  }, [studentId, attendanceRecords, today])

  const markAttendance = () => {
    if (!studentId || !studentName) {
      alert("Please enter both Student ID and Name")
      return
    }

    if (isMarked) {
      alert("Attendance already marked for today!")
      return
    }

    const newRecord: AttendanceRecord = {
      studentId,
      studentName,
      date: today,
      time: currentTime,
      status: "present",
    }

    const updatedRecords = [...attendanceRecords, newRecord]
    setAttendanceRecords(updatedRecords)
    localStorage.setItem("attendanceRecords", JSON.stringify(updatedRecords))

    // Update daily stats
    setDailyStats((prev) => ({
      ...prev,
      presentToday: prev.presentToday + 1,
      attendanceRate: Math.round(((prev.presentToday + 1) / prev.totalStudents) * 100),
    }))

    setIsMarked(true)
    alert("Attendance marked successfully! You are now eligible for meals.")
  }

  const todaysPresentStudents = attendanceRecords.filter(
    (record) => record.date === today && record.status === "present",
  )

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Daily Attendance</h1>
          <p className="text-muted-foreground">Mark your attendance to be eligible for meals</p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Daily Statistics */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <UsersIcon className="h-5 w-5 text-accent" />
                <span className="text-2xl font-bold">{dailyStats.totalStudents}</span>
              </div>
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Attendance Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold">{dailyStats.attendanceRate}%</div>
                <Badge variant={dailyStats.attendanceRate >= 80 ? "default" : "secondary"}>
                  {dailyStats.attendanceRate >= 80 ? "Good" : "Needs Improvement"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Marking Form */}
        <Card>
          <CardHeader>
            <CardTitle>Mark Your Attendance</CardTitle>
            <CardDescription>Enter your details to mark attendance and become eligible for meals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID</Label>
                <Input
                  id="studentId"
                  placeholder="Enter your student ID"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  disabled={isMarked}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentName">Full Name</Label>
                <Input
                  id="studentName"
                  placeholder="Enter your full name"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  disabled={isMarked}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Current Time: {currentTime}</span>
            </div>

            {isMarked ? (
              <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
                <span className="text-green-800 font-medium">
                  Attendance already marked for today! You are eligible for meals.
                </span>
              </div>
            ) : (
              <Button onClick={markAttendance} className="w-full" size="lg">
                <CheckCircleIcon className="mr-2 h-4 w-4" />
                Mark Attendance
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Today's Present Students */}
        <Card>
          <CardHeader>
            <CardTitle>Students Present Today</CardTitle>
            <CardDescription>List of students who have marked their attendance today</CardDescription>
          </CardHeader>
          <CardContent>
            {todaysPresentStudents.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No students have marked attendance yet today.</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {todaysPresentStudents.map((record, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{record.studentName}</p>
                        <p className="text-sm text-muted-foreground">ID: {record.studentId}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Present
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">{record.time}</p>
                    </div>
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
