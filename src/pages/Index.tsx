
import React, { useState } from 'react';
import BirthdayInput from '@/components/BirthdayInput';
import MementoMoriCalendar from '@/components/MementoMoriCalendar';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { differenceInYears } from 'date-fns';
import { TooltipProvider } from '@/components/ui/tooltip';

const Index = () => {
  // Use state for birthday with no default value
  const [birthday, setBirthday] = useState<Date | undefined>(undefined);
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
    
    setBirthday(date);
    
    if (date && !hasViewed) {
      setHasViewed(true);
      const age = differenceInYears(new Date(), date);
      
      toast({
        title: "Calendar generated",
        description: `You've lived ${age} years. Each circle represents one week of your life.`,
      });
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
                  date={birthday}
                  setDate={handleDateChange}
                  className="w-full"
                />
                {!birthday && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Please select your birthday to generate the calendar.
                  </p>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {birthday ? (
          <div className="mt-4 space-y-4 animate-fade-up">
            <Card className="border border-slate-200 shadow-sm bg-white/90 backdrop-blur-sm p-4 rounded-lg">
              <CardContent className="p-0">
                <TooltipProvider delayDuration={50}>
                  <MementoMoriCalendar 
                    birthday={birthday} 
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
        ) : (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center">
            <p className="text-lg text-slate-600 mb-4">
              Select your birthday in the settings to generate your Memento Mori Calendar
            </p>
            <SheetTrigger asChild>
              <Button>
                <Settings className="mr-2 h-4 w-4" />
                Open Settings
              </Button>
            </SheetTrigger>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
