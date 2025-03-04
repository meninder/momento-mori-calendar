
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
  lifeExpectancy = 90, // Increased to accommodate two columns of 45 years
  circleSize = 5,
}) => {
  const WEEKS_PER_YEAR = 52;
  const ROWS_PER_COLUMN = 45; // 45 rows per column
  const [completedWeeks, setCompletedWeeks] = useState(0);
  const [currentWeekPercentage, setCurrentWeekPercentage] = useState(0);
  const [totalRows, setTotalRows] = useState(ROWS_PER_COLUMN);
  const [today] = useState(new Date());

  useEffect(() => {
    if (!birthday) return;

    // Calculate weeks lived
    const weekNumber = differenceInWeeks(today, birthday);
    const fullYears = Math.floor(weekNumber / 52);

    // Calculate the anniversary date for the current year
    const currentYear = today.getFullYear();
    const birthdayThisYear = new Date(currentYear, birthday.getMonth(), birthday.getDate());
    if(birthdayThisYear > today){
      birthdayThisYear.setFullYear(currentYear - 1);
    }
    const circlesToFill = (fullYears * 52) + differenceInWeeks(today, birthdayThisYear);

    setCompletedWeeks(circlesToFill);

    // Calculate current week percentage
    const currentWeekStart = startOfWeek(addDays(birthday, weekNumber * 7));
    const currentWeekEnd = endOfWeek(currentWeekStart);
    const totalDaysInWeek = 7;
    const daysPassedInCurrentWeek = differenceInDays(today, currentWeekStart);
    const currentPercentage = Math.min(100, (daysPassedInCurrentWeek / totalDaysInWeek) * 100);
    setCurrentWeekPercentage(currentPercentage);

  }, [birthday, today]);

  // Calculate grid-related values
  const columnCount = WEEKS_PER_YEAR;
  const gridWidth = (circleSize * columnCount) + ((columnCount - 1) * 2); // Account for gap

  return (
    <div className="relative w-full overflow-hidden">
      <div className="calendar-container pb-4">
        <div className="flex justify-between gap-8">
          {/* First column (years 0-44) */}
          <div className="calendar-grid" style={{ width: `${gridWidth}px` }}>
            {Array.from({ length: ROWS_PER_COLUMN }, (_, rowIndex) => (
              <WeekRow
                key={rowIndex}
                row={rowIndex}
                completedWeeks={completedWeeks}
                totalWeeks={WEEKS_PER_YEAR}
                currentWeek={Math.floor(completedWeeks / WEEKS_PER_YEAR) === rowIndex ? completedWeeks % WEEKS_PER_YEAR : null}
                currentWeekPercentage={currentWeekPercentage}
                circleSize={circleSize}
              />
            ))}
          </div>
          
          {/* Second column (years 45-89) */}
          <div className="calendar-grid" style={{ width: `${gridWidth}px` }}>
            {Array.from({ length: ROWS_PER_COLUMN }, (_, rowIndex) => {
              const actualRowIndex = rowIndex + ROWS_PER_COLUMN;
              return (
                <WeekRow
                  key={actualRowIndex}
                  row={actualRowIndex}
                  completedWeeks={completedWeeks}
                  totalWeeks={WEEKS_PER_YEAR}
                  currentWeek={Math.floor(completedWeeks / WEEKS_PER_YEAR) === actualRowIndex ? completedWeeks % WEEKS_PER_YEAR : null}
                  currentWeekPercentage={currentWeekPercentage}
                  circleSize={circleSize}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MementoMoriCalendar;
