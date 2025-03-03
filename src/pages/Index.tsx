
import React, { useState } from 'react';
import BirthdayInput from '@/components/BirthdayInput';
import MementoMoriCalendar from '@/components/MementoMoriCalendar';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { differenceInYears } from 'date-fns';

const Index = () => {
  // Hardcode default birthday to June 1, 1980
  const defaultBirthday = new Date(1980, 5, 1); // Month is 0-indexed, so 5 is June
  const [birthday, setBirthday] = useState<Date | undefined>(defaultBirthday);
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
    <div className="min-h-screen flex flex-col items-center py-12 px-4 md:px-8 bg-gradient-to-b from-slate-50 to-white">
      <div className="w-full max-w-4xl mx-auto animate-fade-up">
        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-serif font-medium text-slate-800 mb-3">
            Memento Mori Calendar
          </h1>
        </header>

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
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {birthday && (
          <div className="mt-8 space-y-4 animate-fade-up">
            <Card className="border border-slate-200 shadow-sm bg-white/90 backdrop-blur-sm p-4 rounded-lg">
              <CardContent className="p-0">
                <MementoMoriCalendar 
                  birthday={birthday} 
                  circleSize={5}
                />
              </CardContent>
            </Card>

            <div className="flex items-center justify-center space-x-8 mt-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-calendar-filled"></div>
                <span className="text-xs text-slate-600">Weeks lived</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-calendar-current"></div>
                <span className="text-xs text-slate-600">Current week</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-calendar-empty"></div>
                <span className="text-xs text-slate-600">Future weeks</span>
              </div>
            </div>
            
            {birthday && (
              <div className="text-center text-sm text-slate-500 mt-8">
                <p>
                  "Remember that you will die. Let that inform how you live today."
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
