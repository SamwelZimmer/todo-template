import * as React from "react";

export function useMediaQuery(query: string) {
  const [value, setValue] = React.useState(false);

  React.useEffect(() => {
    function onChange(event: MediaQueryListEvent) {
      setValue(event.matches);
    }

    const result = matchMedia(query);
    result.addEventListener("change", onChange);
    setValue(result.matches);

    return () => result.removeEventListener("change", onChange);
  }, [query]);

  return value;
}

export function useContainerWidth(
  deps: React.DependencyList = []
): [React.RefObject<HTMLDivElement>, number] {
  const ref = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = React.useState(0);

  React.useEffect(() => {
    const updateWidth = () => {
      if (ref.current) {
        setWidth(ref.current.offsetWidth);
      }
    };

    updateWidth();

    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [ref.current, ...deps]);

  return [ref, width];
}

export function useContainerHeight(
  deps: React.DependencyList = []
): [React.RefObject<HTMLDivElement>, number] {
  const ref = React.useRef<HTMLDivElement>(null);
  const [height, setHeight] = React.useState(0);

  React.useEffect(() => {
    const updateHeight = () => {
      if (ref.current) {
        setHeight(ref.current.offsetHeight);
      }
    };

    updateHeight();

    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [ref.current, ...deps]);

  return [ref, height];
}

export function useScreenWidth() {
  const [screenWidth, setScreenWidth] = React.useState(window.innerWidth);

  React.useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return screenWidth;
}
