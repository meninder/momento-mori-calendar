
import React, { useState, useEffect } from 'react';
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BirthdayInputProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  className?: string;
}

const BirthdayInput: React.FC<BirthdayInputProps> = ({ date, setDate, className }) => {
  // Initialize with current date values or defaults
  const [month, setMonth] = useState<number>(date ? date.getMonth() : 0);
  const [day, setDay] = useState<number>(date ? date.getDate() : 1);
  const [year, setYear] = useState<number>(date ? date.getFullYear() : 1990);
  
  // Get the number of days in the selected month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const daysInMonth = getDaysInMonth(year, month);
  
  // Update the day if it's greater than the number of days in the month
  useEffect(() => {
    if (day > daysInMonth) {
      setDay(daysInMonth);
    }
  }, [month, year, day, daysInMonth]);
  
  // Update parent component's date when any value changes
  useEffect(() => {
    const newDate = new Date(year, month, day);
    setDate(newDate);
  }, [month, day, year, setDate]);
  
  // Generate arrays for months, days, and years
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);
  
  return (
    <div className={cn("space-y-4", className)}>
      <Label className="text-sm font-medium">Your birthday</Label>
      
      <div className="grid grid-cols-3 gap-2">
        {/* Month Select */}
        <div>
          <Label htmlFor="month" className="text-xs text-muted-foreground">Month</Label>
          <Select
            value={month.toString()}
            onValueChange={(value) => setMonth(parseInt(value))}
          >
            <SelectTrigger id="month">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((monthName, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {monthName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Day Select */}
        <div>
          <Label htmlFor="day" className="text-xs text-muted-foreground">Day</Label>
          <Select
            value={day.toString()}
            onValueChange={(value) => setDay(parseInt(value))}
          >
            <SelectTrigger id="day">
              <SelectValue placeholder="Day" />
            </SelectTrigger>
            <SelectContent>
              {days.map((d) => (
                <SelectItem key={d} value={d.toString()}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Year Select */}
        <div>
          <Label htmlFor="year" className="text-xs text-muted-foreground">Year</Label>
          <Select
            value={year.toString()}
            onValueChange={(value) => setYear(parseInt(value))}
          >
            <SelectTrigger id="year">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={y.toString()}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="text-sm text-muted-foreground">
        {date && (
          <p>Selected: {format(date, "MMMM d, yyyy")}</p>
        )}
      </div>
    </div>
  );
};

export default BirthdayInput;
