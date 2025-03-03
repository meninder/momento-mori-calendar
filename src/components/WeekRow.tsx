
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

  return (
    <div className="flex space-x-[1px]"> {/* Reduced spacing from 2px to 1px */}
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
          />
        );
      })}
    </div>
  );
};

export default WeekRow;
