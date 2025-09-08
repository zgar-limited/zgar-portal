"use client";

const colorOptions = [
  { name: "Blue", color: "blue", bgClass: "bg-blue-1" },
  { name: "Gray", color: "gray", bgClass: "bg-caramel" },
  { name: "Pink", color: "pink", bgClass: "bg-hot-pink" },
  { name: "Green", color: "green", bgClass: "bg-dark-jade" },
  { name: "White", color: "white", bgClass: "bg-white" },
];

export default function ColorSelector({ activeColor, setActiveColor }) {
  return (
    <>
      {colorOptions.map((item) => (
        <div
          key={item.color}
          className={`hover-tooltip tooltip-bot color-btn ${
            activeColor === item.color ? "active" : ""
          }`}
          data-color={item.color}
          onClick={() => setActiveColor(item.color)}
        >
          <span className={`check-color ${item.bgClass}`} />
          <span className="tooltip">{item.name}</span>
        </div>
      ))}
    </>
  );
}
