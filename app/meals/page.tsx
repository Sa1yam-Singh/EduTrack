"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { UsersIcon } from "@/components/icons/users-icon"
import { Utensils, Search, AlertTriangle, Clock, User, CheckCircle, XCircle } from "lucide-react"
import { AttendanceMealValidator } from "@/lib/attendance-meal-validation"

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

interface MealStats {
  totalEligible: number
  mealsDistributed: number
  remainingMeals: number
  distributionRate: number
}

export default function MealDistributionPage() {
  const [searchId, setSearchId] = useState("")
  const [selectedStudent, setSelectedStudent] = useState<AttendanceRecord | null>(null)
  const [mealType, setMealType] = useState<"breakfast" | "lunch" | "snack">("lunch")
  const [staffName, setStaffName] = useState("Kitchen Staff")
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [mealRecords, setMealRecords] = useState<MealRecord[]>([])
  const [mealStats, setMealStats] = useState<MealStats>({
    totalEligible: 0,
    mealsDistributed: 0,
    remainingMeals: 0,
    distributionRate: 0,
  })
  const [searchResult, setSearchResult] = useState<
    "eligible" | "not-eligible" | "already-received" | "not-found" | null
  >(null)

  const today = new Date().toISOString().split("T")[0]
  const currentTime = new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  })

  useEffect(() => {
    const savedAttendance = localStorage.getItem("attendanceRecords")
    const savedMeals = localStorage.getItem("mealRecords")

    if (savedAttendance) {
      const attendance = JSON.parse(savedAttendance)
      setAttendanceRecords(attendance)
    }

    if (savedMeals) {
      const meals = JSON.parse(savedMeals)
      setMealRecords(meals)
    }
  }, [])

  useEffect(() => {
    const todayAttendance = attendanceRecords.filter((record) => record.date === today && record.status === "present")

    const todayMeals = mealRecords.filter((record) => record.date === today && record.mealType === mealType)

    const totalEligible = todayAttendance.length
    const mealsDistributed = todayMeals.length
    const remainingMeals = totalEligible - mealsDistributed
    const distributionRate = totalEligible > 0 ? Math.round((mealsDistributed / totalEligible) * 100) : 0

    setMealStats({
      totalEligible,
      mealsDistributed,
      remainingMeals,
      distributionRate,
    })
  }, [attendanceRecords, mealRecords, mealType, today])

  const searchStudent = () => {
    if (!searchId.trim()) {
      setSearchResult(null)
      setSelectedStudent(null)
      return
    }

    const validation = AttendanceMealValidator.validateMealEligibility(
      searchId,
      mealType,
      attendanceRecords,
      mealRecords,
      today,
    )

    if (validation.validationCode === "ELIGIBLE") {
      setSearchResult("eligible")
      setSelectedStudent(validation.studentInfo!)
    } else if (validation.validationCode === "NO_ATTENDANCE") {
      setSearchResult("not-eligible")
      setSelectedStudent(null)
    } else if (validation.validationCode === "ALREADY_RECEIVED") {
      setSearchResult("already-received")
      setSelectedStudent(validation.studentInfo!)
    } else if (validation.validationCode === "TIME_RESTRICTION" || validation.validationCode === "LATE_ATTENDANCE") {
      setSearchResult("not-eligible")
      setSelectedStudent(validation.studentInfo || null)
      alert(validation.reason)
    } else {
      setSearchResult("not-found")
      setSelectedStudent(null)
    }
  }

  const distributeMeal = () => {
    if (!selectedStudent || searchResult !== "eligible") {
      return
    }

    const validation = AttendanceMealValidator.validateMealEligibility(
      selectedStudent.studentId,
      mealType,
      attendanceRecords,
      mealRecords,
      today,
    )

    if (!validation.isEligible) {
      alert(`Cannot distribute meal: ${validation.reason}`)
      return
    }

    const newMealRecord = {
      studentId: selectedStudent.studentId,
      studentName: selectedStudent.studentName,
      date: today,
      time: currentTime,
      mealType,
      distributedBy: staffName,
    }

    const updatedMealRecords = [...mealRecords, newMealRecord]
    setMealRecords(updatedMealRecords)
    localStorage.setItem("mealRecords", JSON.stringify(updatedMealRecords))

    AttendanceMealValidator.createMealDistributionLog(selectedStudent.studentId, mealType, staffName, validation)

    setSearchId("")
    setSelectedStudent(null)
    setSearchResult(null)

    alert(
      `${mealType.charAt(0).toUpperCase() + mealType.slice(1)} distributed successfully to ${selectedStudent.studentName}!`,
    )
  }

  const getEligibleStudents = () => {
    return AttendanceMealValidator.getEligibleStudents(mealType, attendanceRecords, mealRecords, today)
  }

  const getTodayMealDistribution = () => {
    return mealRecords
      .filter((record) => record.date === today && record.mealType === mealType)
      .sort((a, b) => new Date(`${a.date} ${a.time}`).getTime() - new Date(`${b.date} ${b.time}`).getTime())
  }

  const eligibleStudents = getEligibleStudents()
  const todayDistribution = getTodayMealDistribution()

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-6xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Meal Distribution System</h1>
          <p className="text-muted-foreground">Distribute meals only to students with verified attendance</p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Utensils className="h-4 w-4" />
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

        <Card>
          <CardHeader>
            <CardTitle>Select Meal Type</CardTitle>
            <CardDescription>Choose the type of meal being distributed (time restrictions apply)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                {(["breakfast", "lunch", "snack"] as const).map((type) => (
                  <Button
                    key={type}
                    variant={mealType === type ? "default" : "outline"}
                    onClick={() => setMealType(type)}
                    className="capitalize"
                  >
                    {type}
                  </Button>
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                <p>
                  <strong>Distribution Hours:</strong>
                </p>
                <p>• Breakfast: 7:00 AM - 10:00 AM (students must arrive by 9:30 AM)</p>
                <p>• Lunch: 11:30 AM - 2:30 PM</p>
                <p>• Snack: 3:00 PM - 5:00 PM</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Eligible Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <UsersIcon className="h-5 w-5 text-accent" />
                <span className="text-2xl font-bold">{mealStats.totalEligible}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Present today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Meals Distributed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-2xl font-bold text-green-600">{mealStats.mealsDistributed}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{mealType} served</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Remaining</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-500" />
                <span className="text-2xl font-bold text-orange-600">{mealStats.remainingMeals}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Still to serve</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Distribution Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mealStats.distributionRate}%</div>
              <Badge variant={mealStats.distributionRate >= 80 ? "default" : "secondary"}>
                {mealStats.distributionRate >= 80 ? "On Track" : "Behind Schedule"}
              </Badge>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Distribute Meal</CardTitle>
            <CardDescription>Search for a student by ID to verify attendance and distribute meal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="searchId">Student ID</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="searchId"
                    placeholder="Enter student ID"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && searchStudent()}
                  />
                  <Button onClick={searchStudent}>
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="w-48">
                <Label htmlFor="staffName">Staff Name</Label>
                <Input
                  id="staffName"
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            {searchResult && (
              <div className="space-y-4">
                {searchResult === "eligible" && selectedStudent && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      <div className="flex justify-between items-center">
                        <div>
                          <strong>{selectedStudent.studentName}</strong> (ID: {selectedStudent.studentId}) is eligible
                          for {mealType}.
                          <br />
                          <span className="text-sm">Attendance marked at {selectedStudent.time}</span>
                        </div>
                        <Button onClick={distributeMeal} className="bg-green-600 hover:bg-green-700">
                          <Utensils className="mr-2 h-4 w-4" />
                          Distribute {mealType}
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                {searchResult === "not-eligible" && (
                  <Alert className="border-red-200 bg-red-50">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      Student ID <strong>{searchId}</strong> is not eligible for meals.
                      <br />
                      <span className="text-sm">
                        {selectedStudent
                          ? "Check time restrictions or attendance timing"
                          : "Reason: No attendance marked for today"}
                      </span>
                    </AlertDescription>
                  </Alert>
                )}

                {searchResult === "already-received" && selectedStudent && (
                  <Alert className="border-yellow-200 bg-yellow-50">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-800">
                      <strong>{selectedStudent.studentName}</strong> (ID: {selectedStudent.studentId}) has already
                      received {mealType} today.
                    </AlertDescription>
                  </Alert>
                )}

                {searchResult === "not-found" && (
                  <Alert className="border-gray-200 bg-gray-50">
                    <AlertTriangle className="h-4 w-4 text-gray-600" />
                    <AlertDescription className="text-gray-800">
                      Student ID <strong>{searchId}</strong> not found in records.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Students Eligible for {mealType}</CardTitle>
              <CardDescription>
                Students who marked attendance today and haven't received {mealType} yet
              </CardDescription>
            </CardHeader>
            <CardContent>
              {eligibleStudents.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  {mealStats.totalEligible === 0
                    ? "No students marked attendance today."
                    : `All eligible students have received their ${mealType}.`}
                </p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {eligibleStudents.map((student, index) => (
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
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Eligible
                        </Badge>
                        <p className="text-xs text-green-600 mt-1">Attended: {student.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Today's {mealType} Distribution</CardTitle>
              <CardDescription>Students who have already received {mealType} today</CardDescription>
            </CardHeader>
            <CardContent>
              {todayDistribution.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No {mealType} distributed yet today.</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {todayDistribution.map((meal, index) => (
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
                        <Badge variant="outline" className="text-blue-600 border-blue-600">
                          Served
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
        </div>
      </div>
    </div>
  )
}
