
import React, { useState, useEffect } from 'react';
import WeekRow from './WeekRow';
import { differenceInWeeks, addDays, startOfWeek, endOfWeek, differenceInDays } from 'date-fns';

interface MementoMoriCalendarProps {
  birthday: Date;
  lifeExpectancy?: number;
  circleSize?: number;
}

const MementoMoriCalendar: React.FC<MementoMoriCalendarProps> = ({ 
  birthday, 
  lifeExpectancy = 85,
  circleSize = 5,
}) => {
  const WEEKS_PER_YEAR = 52;
  const [completedWeeks, setCompletedWeeks] = useState(0);
  const [currentWeekPercentage, setCurrentWeekPercentage] = useState(0);
  const [today] = useState(new Date());

  useEffect(() => {
    if (!birthday) return;

    // Calculate weeks lived
    const weeksLived = differenceInWeeks(today, birthday);
    setCompletedWeeks(weeksLived);

    // Calculate current week percentage
    const currentWeekStart = startOfWeek(addDays(birthday, weeksLived * 7));
    const currentWeekEnd = endOfWeek(currentWeekStart);
    const totalDaysInWeek = 7;
    const daysPassedInCurrentWeek = differenceInDays(today, currentWeekStart);
    const currentPercentage = Math.min(100, (daysPassedInCurrentWeek / totalDaysInWeek) * 100);
    setCurrentWeekPercentage(currentPercentage);

  }, [birthday, today]);

  // Rotated grid: 52 rows (weeks) and lifeExpectancy columns (years)
  const rowCount = WEEKS_PER_YEAR;
  const columnCount = lifeExpectancy;
  
  // Calculate overall grid dimensions
  const gridHeight = (circleSize * rowCount) + ((rowCount - 1) * 2); // Account for gap

  return (
    <div className="relative w-full overflow-hidden">
      <div className="calendar-container overflow-auto pb-4">
        <div className="calendar-grid mx-auto" style={{ height: `${gridHeight}px` }}>
          {Array.from({ length: rowCount }, (_, weekIndex) => (
            <WeekRow
              key={weekIndex}
              weekIndex={weekIndex}
              completedWeeks={completedWeeks}
              totalYears={lifeExpectancy}
              currentWeek={completedWeeks % WEEKS_PER_YEAR === weekIndex ? Math.floor(completedWeeks / WEEKS_PER_YEAR) : null}
              currentWeekPercentage={currentWeekPercentage}
              circleSize={circleSize}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MementoMoriCalendar;
