
import React, { useState } from 'react';
import BirthdayInput from '@/components/BirthdayInput';
import MementoMoriCalendar from '@/components/MementoMoriCalendar';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Settings, RefreshCw } from 'lucide-react';
import { differenceInYears } from 'date-fns';
import { TooltipProvider } from '@/components/ui/tooltip';

const Index = () => {
  // Initialize with a default birthday of June 1, 1980
  const [birthday, setBirthday] = useState<Date | undefined>(new Date(1980, 5, 1));
  const [tempBirthday, setTempBirthday] = useState<Date | undefined>(new Date(1980, 5, 1));
  const { toast } = useToast();
  const [hasViewed, setHasViewed] = useState(false);
  
  const handleDateChange = (date: Date | undefined) => {
    if (date && date > new Date()) {
      toast({
        title: "Invalid date",
        description: "Your birthday cannot be in the future.",
        variant: "destructive",
      });
      return;
    }
    
    // Update the temp birthday without recalculating
    setTempBirthday(date);
  };

  const handleRefresh = () => {
    // Only display toast when user refreshes with a new date
    if (tempBirthday && (!birthday || tempBirthday.getTime() !== birthday.getTime())) {
      const age = differenceInYears(new Date(), tempBirthday);
      
      toast({
        title: "Calendar updated",
        description: `You've lived ${age} years. Each circle represents one week of your life.`,
      });

      // Update the actual birthday used by the calendar
      setBirthday(tempBirthday);
      setHasViewed(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4 md:px-8 bg-gradient-to-b from-slate-50 to-white">
      <div className="w-full mx-auto animate-fade-up">
        <h1 className="text-3xl font-serif text-center mb-6">Memento Mori Calendar</h1>
        
        {/* Side panel trigger button */}
        <div className="fixed right-4 top-4 z-10">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
                <span className="sr-only">Settings</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="py-6">
                <h3 className="text-lg font-medium mb-4">Calendar Settings</h3>
                <BirthdayInput
                  date={tempBirthday}
                  setDate={handleDateChange}
                  className="w-full"
                />
                <div className="mt-4">
                  <Button 
                    onClick={handleRefresh}
                    className="w-full"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Update Calendar
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {birthday ? 
                    "Change your birthday and click Update to refresh the calendar." : 
                    "Please select your birthday to generate the calendar."}
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="mt-4 space-y-4 animate-fade-up">
          <Card className="border border-slate-200 shadow-sm bg-white/90 backdrop-blur-sm p-4 rounded-lg">
            <CardContent className="p-0">
              <TooltipProvider delayDuration={50}>
                <MementoMoriCalendar 
                  birthday={birthday ?? new Date(1980, 5, 1)} 
                  circleSize={5}
                />
              </TooltipProvider>
            </CardContent>
          </Card>
          
          <div className="text-center text-sm text-slate-500 mt-4">
            <p>
              "Remember that you will die. Let that inform how you live today."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
