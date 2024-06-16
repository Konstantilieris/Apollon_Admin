"use client";
import React from "react";
import { HexColorPicker } from "react-colorful";
import { colors } from "@/constants";

const ColorPicker = ({ color, setColor, disabled }: any) => {
  return (
    <div className="mt-2 flex h-full flex-col items-start">
      <HexColorPicker color={color} onChange={setColor} />
      <div className="mt-4 grid grid-cols-7 gap-2">
        {colors.map((color: any, i) => {
          return (
            <button
              key={i}
              style={{ backgroundColor: color.value }}
              className="h-6 w-6 rounded-md  border-2 border-white hover:scale-105 hover:animate-bounce focus:outline-none"
              onClick={() => setColor(color.value)}
            >
              <br />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ColorPicker;
