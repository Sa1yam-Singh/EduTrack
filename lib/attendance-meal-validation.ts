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

interface ValidationResult {
  isEligible: boolean
  reason: string
  studentInfo?: AttendanceRecord
  mealInfo?: MealRecord
  validationCode:
    | "ELIGIBLE"
    | "NO_ATTENDANCE"
    | "ALREADY_RECEIVED"
    | "NOT_FOUND"
    | "TIME_RESTRICTION"
    | "LATE_ATTENDANCE"
}

interface MealTimeRestrictions {
  breakfast: { start: string; end: string }
  lunch: { start: string; end: string }
  snack: { start: string; end: string }
}

export class AttendanceMealValidator {
  private static mealTimeRestrictions: MealTimeRestrictions = {
    breakfast: { start: "07:00", end: "10:00" },
    lunch: { start: "11:30", end: "14:30" },
    snack: { start: "15:00", end: "17:00" },
  }

  static validateMealEligibility(
    studentId: string,
    mealType: "breakfast" | "lunch" | "snack",
    attendanceRecords: AttendanceRecord[],
    mealRecords: MealRecord[],
    targetDate: string = new Date().toISOString().split("T")[0],
  ): ValidationResult {
    // Check if student marked attendance for the target date
    const attendanceRecord = attendanceRecords.find(
      (record) => record.studentId === studentId && record.date === targetDate && record.status === "present",
    )

    if (!attendanceRecord) {
      return {
        isEligible: false,
        reason: "Student has not marked attendance for today",
        validationCode: "NO_ATTENDANCE",
      }
    }

    // Check if student already received this meal type today
    const existingMeal = mealRecords.find(
      (record) => record.studentId === studentId && record.date === targetDate && record.mealType === mealType,
    )

    if (existingMeal) {
      return {
        isEligible: false,
        reason: `Student has already received ${mealType} today`,
        studentInfo: attendanceRecord,
        mealInfo: existingMeal,
        validationCode: "ALREADY_RECEIVED",
      }
    }

    // Check meal time restrictions
    const currentTime = new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Kolkata",
    })

    const timeRestriction = this.mealTimeRestrictions[mealType]
    if (!this.isWithinTimeRange(currentTime, timeRestriction.start, timeRestriction.end)) {
      return {
        isEligible: false,
        reason: `${mealType} distribution is only allowed between ${timeRestriction.start} and ${timeRestriction.end}`,
        studentInfo: attendanceRecord,
        validationCode: "TIME_RESTRICTION",
      }
    }

    // Check if student arrived too late for certain meals
    if (mealType === "breakfast" && this.isLateForMeal(attendanceRecord.time, "09:30")) {
      return {
        isEligible: false,
        reason: "Student arrived too late for breakfast (after 9:30 AM)",
        studentInfo: attendanceRecord,
        validationCode: "LATE_ATTENDANCE",
      }
    }

    // Student is eligible
    return {
      isEligible: true,
      reason: "Student is eligible for meal distribution",
      studentInfo: attendanceRecord,
      validationCode: "ELIGIBLE",
    }
  }

  private static isWithinTimeRange(currentTime: string, startTime: string, endTime: string): boolean {
    const current = this.timeToMinutes(currentTime)
    const start = this.timeToMinutes(startTime)
    const end = this.timeToMinutes(endTime)

    return current >= start && current <= end
  }

  private static isLateForMeal(arrivalTime: string, cutoffTime: string): boolean {
    const arrival = this.timeToMinutes(arrivalTime)
    const cutoff = this.timeToMinutes(cutoffTime)

    return arrival > cutoff
  }

  private static timeToMinutes(timeStr: string): number {
    const [hours, minutes] = timeStr.split(":").map(Number)
    return hours * 60 + minutes
  }

  static getEligibleStudents(
    mealType: "breakfast" | "lunch" | "snack",
    attendanceRecords: AttendanceRecord[],
    mealRecords: MealRecord[],
    targetDate: string = new Date().toISOString().split("T")[0],
  ): AttendanceRecord[] {
    const todayAttendance = attendanceRecords.filter(
      (record) => record.date === targetDate && record.status === "present",
    )

    return todayAttendance.filter((student) => {
      const validation = this.validateMealEligibility(
        student.studentId,
        mealType,
        attendanceRecords,
        mealRecords,
        targetDate,
      )
      return validation.isEligible
    })
  }

  static getMealDistributionStats(
    attendanceRecords: AttendanceRecord[],
    mealRecords: MealRecord[],
    targetDate: string = new Date().toISOString().split("T")[0],
  ) {
    const todayAttendance = attendanceRecords.filter(
      (record) => record.date === targetDate && record.status === "present",
    )

    const todayMeals = mealRecords.filter((record) => record.date === targetDate)

    const mealsByType = {
      breakfast: todayMeals.filter((m) => m.mealType === "breakfast").length,
      lunch: todayMeals.filter((m) => m.mealType === "lunch").length,
      snack: todayMeals.filter((m) => m.mealType === "snack").length,
    }

    const eligibleByType = {
      breakfast: this.getEligibleStudents("breakfast", attendanceRecords, mealRecords, targetDate).length,
      lunch: this.getEligibleStudents("lunch", attendanceRecords, mealRecords, targetDate).length,
      snack: this.getEligibleStudents("snack", attendanceRecords, mealRecords, targetDate).length,
    }

    return {
      totalPresent: todayAttendance.length,
      totalMealsDistributed: todayMeals.length,
      mealsByType,
      eligibleByType,
      distributionRates: {
        breakfast:
          eligibleByType.breakfast > 0 ? Math.round((mealsByType.breakfast / eligibleByType.breakfast) * 100) : 0,
        lunch: eligibleByType.lunch > 0 ? Math.round((mealsByType.lunch / eligibleByType.lunch) * 100) : 0,
        snack: eligibleByType.snack > 0 ? Math.round((mealsByType.snack / eligibleByType.snack) * 100) : 0,
      },
    }
  }

  static createMealDistributionLog(
    studentId: string,
    mealType: "breakfast" | "lunch" | "snack",
    distributedBy: string,
    validationResult: ValidationResult,
  ) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      studentId,
      mealType,
      distributedBy,
      validationCode: validationResult.validationCode,
      attendanceTime: validationResult.studentInfo?.time,
      distributionTime: new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Kolkata",
      }),
    }

    // Save to localStorage for demo purposes
    const existingLogs = JSON.parse(localStorage.getItem("mealDistributionLogs") || "[]")
    existingLogs.push(logEntry)
    localStorage.setItem("mealDistributionLogs", JSON.stringify(existingLogs))

    return logEntry
  }

  static getStudentMealStatus(
    studentId: string,
    attendanceRecords: AttendanceRecord[],
    mealRecords: MealRecord[],
    targetDate: string = new Date().toISOString().split("T")[0],
  ) {
    const mealTypes: ("breakfast" | "lunch" | "snack")[] = ["breakfast", "lunch", "snack"]

    return mealTypes.map((mealType) => {
      const validation = this.validateMealEligibility(studentId, mealType, attendanceRecords, mealRecords, targetDate)

      return {
        mealType,
        isEligible: validation.isEligible,
        status: validation.validationCode,
        reason: validation.reason,
        received: validation.mealInfo ? true : false,
        receivedAt: validation.mealInfo?.time,
      }
    })
  }
}
