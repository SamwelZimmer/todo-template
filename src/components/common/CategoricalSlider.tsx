"use client";

import {
  useState,
  useRef,
  useEffect,
  createRef,
  useMemo,
  useLayoutEffect,
} from "react";

import { CategoricalSliderItem } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CategoricalSliderProps {
  options: CategoricalSliderItem[];
  activeItemIdx: number | null;
  setActiveItemIdx: (_itemIdx: number | null) => void;
  initialWindowWidth?: number;
  className?: string;
}

export default function CategoricalSlider({
  options,
  activeItemIdx,
  setActiveItemIdx,
  className,
  initialWindowWidth,
}: CategoricalSliderProps) {
  // create an array of refs
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  refs.current = options.map(
    (_, i) => refs.current[i] ?? createRef<HTMLDivElement>().current
  );

  const [position, setPosition] = useState<"left" | "center" | "right">("left");
  const [windowConfig, setWindowConfig] = useState({
    width: initialWindowWidth ?? 20,
    height: 40,
    left: 0,
    top: 0,
  });

  useLayoutEffect(() => {
    if (activeItemIdx === null || !refs.current[activeItemIdx]) return;

    if (refs.current[activeItemIdx]) {
      setWindowConfig({
        left: refs.current[activeItemIdx].offsetLeft,
        width: refs.current[activeItemIdx].clientWidth,
        height: refs.current[activeItemIdx].clientHeight,
        top: refs.current[activeItemIdx].offsetTop,
      });
    }

    if (activeItemIdx === 0) {
      setPosition("left");
    } else if (activeItemIdx === options.length - 1) {
      setPosition("right");
    } else {
      setPosition("center");
    }
  }, [activeItemIdx]);

  return (
    <div
      className={cn(
        "flex flex-wrap md:flex-nowrap justify-center border relative rounded-2xl w-full",
        className
      )}
    >
      <div
        style={{
          width: windowConfig.width + 2,
          left: windowConfig.left - 1,
          top: windowConfig.top - 1,
          height: windowConfig.height + 2,
        }}
        className={`${
          activeItemIdx === null && "opacity-0"
        } absolute  border-2 border-primary transition-all duration-300 ${
          position === "left"
            ? "md:rounded-l-xl rounded-t-xl"
            : "md:rounded-l-sm rounded-t-sm"
        } ${
          position === "right"
            ? "md:rounded-r-xl rounded-b-xl"
            : "md:rounded-r-sm rounded-b-sm"
        }`}
      />

      {options.map((option, i) => {
        const IconComponent = option.icon;
        const active = activeItemIdx === i;

        return (
          <div
            ref={(el) => {
              refs.current[i] = el;
            }}
            key={i}
            onClick={() => setActiveItemIdx(i)}
            className={`cursor-pointer px-4 gap-2 min-w-max w-full h-10 flex items-center justify-center border-b last:border-b-0 md:border-b-0 md:border-r last:border-r-0 transition-all duration-300 hover:bg-muted capitalize
             last:rounded-r-2xl ${i === 0 && "rounded-l-2xl"} ${
              active ? "text-text" : "text-muted-foreground"
            }`}
          >
            {IconComponent && (
              <IconComponent
                className={`w-6 ${
                  active ? " text-text" : "text-muted-foreground"
                } `}
              />
            )}

            {option.text}
          </div>
        );
      })}
    </div>
  );
}
