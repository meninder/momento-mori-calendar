
import React, { useState } from 'react';
import BirthdayInput from '@/components/BirthdayInput';
import MementoMoriCalendar from '@/components/MementoMoriCalendar';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { differenceInYears } from 'date-fns';

const Index = () => {
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
    <div className="min-h-screen flex flex-col items-center py-12 px-4 md:px-8 bg-gradient-to-b from-slate-50 to-white">
      <div className="w-full max-w-4xl mx-auto animate-fade-up">
        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-serif font-medium text-slate-800 mb-3">
            Memento Mori Calendar
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto">
            A visual reminder of life's finite nature. Each circle represents one week of your life, 
            with filled circles showing weeks you've already lived.
          </p>
        </header>

        <Card className="birthday-container">
          <CardContent className="pt-6">
            <BirthdayInput
              date={birthday}
              setDate={handleDateChange}
              className="max-w-sm mx-auto"
            />
          </CardContent>
        </Card>

        {birthday && (
          <div className="mt-8 space-y-4 animate-fade-up">
            <div className="text-center mb-4">
              <span className="inline-block px-3 py-1 text-xs font-medium bg-slate-100 text-slate-800 rounded-full mb-2">
                Your life in weeks
              </span>
              <div className="text-slate-700 text-sm">
                Each row represents one year (52 weeks)
              </div>
            </div>
            
            <Card className="border border-slate-200 shadow-sm bg-white/90 backdrop-blur-sm p-4 rounded-lg">
              <CardContent className="p-0">
                <MementoMoriCalendar 
                  birthday={birthday} 
                  circleSize={8}
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
