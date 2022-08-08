import React from "react";
import clsx from "clsx";

interface Props {
  Root: {
    className?: string;
    show: boolean;
    position: "top" | "center" | "bottom";
    scrollable?: boolean;
    children?: React.ReactNode;
  };
  Row: {
    sticky?: boolean;
    className?: string;
    children?: React.ReactNode;
  };
}

function Root({
  className = "",
  show = true,
  position = "bottom",
  scrollable = false,
  children,
}: Props["Root"]) {
  return (
    <div
      className={clsx(
        "clamp transition-full z-10 flex flex-col overflow-hidden bg-white shadow-md duration-500",
        position === "bottom" && "rounded-t",
        position === "top" && "rounded-b",
        position === "center" && "rounded",
        show && "pointer-events-auto max-h-96 delay-500 ease-in-out",
        !show && "pointer-events-none max-h-0 ease-in",
        scrollable && "max-h-80 overflow-y-scroll",
        className
      )}
    >
      {children}
    </div>
  );
}

function Row({ sticky = false, className = "", children }: Props["Row"]) {
  return (
    <div
      className={clsx(
        "flex flex-row items-center space-x-1 bg-white",
        sticky && "sticky top-0",
        className
      )}
    >
      {children}
    </div>
  );
}

const Drawer = Object.assign(Root, { Row });
export default Drawer;
