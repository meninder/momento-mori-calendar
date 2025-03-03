
import React from 'react';
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

interface BirthdayInputProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  className?: string;
}

const BirthdayInput: React.FC<BirthdayInputProps> = ({ date, setDate, className }) => {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor="birthday" className="text-sm font-medium">
        Your birthday
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="birthday"
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
            captionLayout="dropdown-buttons"
            fromYear={1900}
            toYear={new Date().getFullYear()}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default BirthdayInput;
