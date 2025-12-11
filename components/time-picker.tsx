import * as React from "react"
import { format } from "date-fns"
import { Clock } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type TimePickerProps = {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
}

export function TimePicker({ date, setDate }: TimePickerProps) {
  const generateTimeOptions = () => {
    const options = []
    for (let hour = 0; hour < 24; hour++) {
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
      const period = hour < 12 ? 'AM' : 'PM'
      const displayTime = `${displayHour} ${period}`
      
      // Store 24-hour format for internal use (set minutes to 00)
      const hour24 = hour.toString().padStart(2, "0")
      const time24 = `${hour24}:00`
      
      options.push({ displayTime, time24 })
    }
    return options
  }

  const timeOptions = generateTimeOptions()
  const selectedTime24 = date ? format(date, "HH:mm") : ""
  const selectedValue = timeOptions.find(opt => opt.time24 === selectedTime24)?.time24 || ""

  const handleTimeChange = (time24: string) => {
    if (time24) {
      const [h] = time24.split(":")
      const newDate = date ? new Date(date) : new Date()
      newDate.setHours(parseInt(h))
      newDate.setMinutes(0)
      newDate.setSeconds(0)
      newDate.setMilliseconds(0)
      setDate(newDate)
    } else {
      setDate(undefined)
    }
  }

  return (
    <Select value={selectedValue} onValueChange={handleTimeChange}>
      <SelectTrigger className="w-full">
        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
        <SelectValue placeholder="Pick a time" />
      </SelectTrigger>
      <SelectContent>
        {timeOptions.map(({ displayTime, time24 }) => (
          <SelectItem key={time24} value={time24}>
            {displayTime}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
