import React from "react";

const CustomArrow = ({ onClick, direction }: any) => {
  return (
    <div
      className={`${
        direction === "left" ? "left-1" : "right-1"
      } absolute top-1/2 z-10 -translate-y-1/2 cursor-pointer rounded-full  bg-light-800 p-2 font-bold text-blue-500 shadow-md hover:scale-105 hover:!bg-light-900  dark:bg-dark-300  dark:text-light-700 dark:hover:!bg-dark-200 dark:hover:!text-white`}
      onClick={onClick}
    >
      {direction === "left" ? "<" : ">"}
    </div>
  );
};

export default CustomArrow;
