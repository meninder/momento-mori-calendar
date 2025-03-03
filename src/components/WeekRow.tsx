
import React from 'react';
import Circle from './Circle';

interface WeekRowProps {
  row: number;
  completedWeeks: number;
  totalWeeks: number;
  currentWeek: number | null;
  currentWeekPercentage: number;
  circleSize?: number;
}

const WeekRow: React.FC<WeekRowProps> = ({ 
  row, 
  completedWeeks, 
  totalWeeks, 
  currentWeek, 
  currentWeekPercentage,
  circleSize = 5 // Reduced from 8 to 5
}) => {
  // Calculate base delay for the animation
  const baseDelay = row * 5;
  
  // Add extra bottom margin after each decade (every 10 rows)
  const isEndOfDecade = (row + 1) % 10 === 0;
  const rowClassName = `flex space-x-[1px] ${isEndOfDecade ? 'mb-4' : 'mb-[2px]'}`;

  return (
    <div className={rowClassName}>
      {Array.from({ length: totalWeeks }, (_, weekIndex) => {
        const weekNumber = row * totalWeeks + weekIndex;
        const isFilled = weekNumber < completedWeeks;
        const isCurrentWeek = currentWeek !== null && weekNumber === completedWeeks;
        const animationDelay = baseDelay + weekIndex * 3; // Staggered delay for each circle

        return (
          <Circle 
            key={weekIndex}
            filled={isFilled}
            percentage={isCurrentWeek ? currentWeekPercentage : 0}
            size={circleSize}
            delay={animationDelay}
            weekNumber={weekNumber}
            row={row}
            weekIndex={weekIndex}
          />
        );
      })}
    </div>
  );
};

export default WeekRow;
