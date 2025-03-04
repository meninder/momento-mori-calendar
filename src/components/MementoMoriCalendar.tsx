
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
  const [totalRows, setTotalRows] = useState(lifeExpectancy);
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

  // Calculate grid-related values
  const columnCount = WEEKS_PER_YEAR;
  const gridWidth = (circleSize * columnCount) + ((columnCount - 1) * 2);

  return (
    <div className="relative w-full overflow-hidden">
      <div className="calendar-container overflow-auto pb-4">
        <div className="calendar-grid mx-auto" style={{ width: `${gridWidth}px` }}>
          {Array.from({ length: totalRows }, (_, rowIndex) => (
            <WeekRow
              key={rowIndex}
              row={rowIndex}
              completedWeeks={completedWeeks}
              totalWeeks={WEEKS_PER_YEAR}
              currentWeek={Math.floor(completedWeeks / WEEKS_PER_YEAR) === rowIndex ? completedWeeks % WEEKS_PER_YEAR : null}
              currentWeekPercentage={currentWeekPercentage}
              circleSize={circleSize}
              birthday={birthday}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MementoMoriCalendar;
