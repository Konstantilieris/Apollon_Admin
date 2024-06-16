import React from "react";

const CustomDot = ({
  onClick,
  active,
}: {
  onClick?: () => void;
  active?: boolean;
}) => {
  return (
    <button
      className={`${active ? "bg-black dark:bg-purple-500" : "bg-gray-300"} `}
      onClick={onClick}
      style={{
        borderRadius: "50%",
        width: "8px",
        height: "8px",
        border: "none",
        margin: "0 4px",
        padding: 0,
        cursor: "pointer",
      }}
    />
  );
};

export default CustomDot;
