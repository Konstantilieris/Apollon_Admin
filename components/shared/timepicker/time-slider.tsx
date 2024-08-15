"use client";
import React, { useState, useEffect } from "react";
import "rc-slider/assets/index.css";
import Slider from "rc-slider";
import moment from "moment";

interface TimeSliderProps {
  initialTime: string;
  onTimeChange: (time: string) => void;
}

const TimeSlider: React.FC<TimeSliderProps> = ({ initialTime, onTimeChange }) => {
  // Define time range in 15-minute intervals
  const times = Array.from({ length: 60 }, (_, i) => {
    const hour = Math.floor(i / 4) + 8; // Start from 8 AM
    const minutes = (i % 4) * 15; // 0, 15, 30, 45 minutes
    return `${hour.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  });

  // Convert time to numeric value
  const timeToValue = (time: string) => times.indexOf(time);

  // Convert numeric value back to time
  const valueToTime = (value: number) => times[value];

  // Round time to the nearest available 15-minute slot
  const roundToNearestSlot = (time: string) => {
    const momentTime = moment(time, "HH:mm");
    const minutes = momentTime.minutes();
    const roundedMinutes = Math.round(minutes / 15) * 15;
    return momentTime.minutes(roundedMinutes).format("HH:mm");
  };

  // Adjust initial time if not exactly on a slot
  const adjustedInitialTime = roundToNearestSlot(initialTime);
  const [value, setValue] = useState(timeToValue(adjustedInitialTime));

  useEffect(() => {
    if (value !== -1) {
      onTimeChange(valueToTime(value));
    }
  }, [value]);

  // Handler to update slider value
  const handleSliderChange = (newValue: any) => {
    setValue(newValue);
    onTimeChange(valueToTime(newValue));
  };

  // Convert slider value to time string
  const timeDisplay = valueToTime(value);

  return (
    <div className="flex flex-col justify-between p-[1rem] text-light-700 w-full">
      <div className="mb-2 px-4 h-full">
        <Slider
          styles={{
            track: { backgroundColor: "#86efac" },
            handle: { backgroundColor: "#ffffff", borderColor: "#7c43bd" },
            rail: { backgroundColor: "#121212 " },
          }}
          dotStyle={{
            backgroundColor: "#121212",
            borderColor: "#dce3f1",
          }}
          activeDotStyle={{ backgroundColor: "#7c43bd" }}
          min={0}
          max={times.length - 1}
          value={value}
          step={1} // Step set to 15 minutes
          onChange={handleSliderChange}
        />
      </div>
      <div className="mt-6 flex w-full font-sans text-md font-medium justify-between items-end text-dark-100 dark:text-light-700">
        <p>Επιλεγμένος Χρόνος: {timeDisplay}</p>
        <div className="flex flex-row items-center gap-2 p-1">
          <button className="px-3 py-1 rounded-full bg-[#1ED760] font-bold text-white tracking-widest transform hover:scale-105 hover:bg-[#21e065] transition-colors duration-200">
            Ενημέρωση
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeSlider;

