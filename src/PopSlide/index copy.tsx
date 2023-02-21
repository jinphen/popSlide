import React, { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";

import styles from "./index.module.scss";

function setProperties(
  element: HTMLElement,
  properties: Record<string, string>
) {
  Object.keys(properties).forEach((key) => {
    element.style.setProperty(key, properties[key]);
  });
}

enum AnimationStatus {
  OPEN_START = "OPEN_START",
  OPENING = "OPENING",
  OPENED = "OPENED",
  CLOSE_START = "CLOSE_START",
  CLOSING = "CLOSING",
  CLOSED = "CLOSED",
}

interface PopSlideProps {
  visible: boolean;
  children: React.ReactNode;
  popWidth: number;
  onVisibleChange: (visible: boolean) => void;
  onHover?: (isHover: boolean) => void;
  top?: number;
  bottom?: number;
}
const PopSlide: React.FC<PopSlideProps> = (props) => {
  const {
    children,
    popWidth,
    visible,
    onVisibleChange,
    onHover,
    top = 0,
    bottom = 0,
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const animationStatus = useRef<AnimationStatus>(AnimationStatus.CLOSED);
  const [className, setClassName] = useState<string>("");

  const onBodyClick = useCallback(
    (e: MouseEvent) => {
      if (e.target && !containerRef.current?.contains(e.target as Node)) {
        onVisibleChange(false);
      }
    },
    [onVisibleChange]
  );

  const onAnimationEnd = useCallback(() => {
    console.log("onAnimationEnd");
    containerRef.current?.style.removeProperty("transform");
    switch (animationStatus.current) {
      case AnimationStatus.CLOSING:
        animationStatus.current = AnimationStatus.CLOSED;
        break;
      case AnimationStatus.OPENING:
        animationStatus.current = AnimationStatus.OPENED;
    }
    console.log("current animationStatus: " + animationStatus.current);
  }, []);

  useEffect(() => {
    const containerElement = containerRef.current;
    if (!containerElement) {
      console.log(`do nothing---`);
      return;
    }

    console.log(
      "on visible change, ",
      `visible: ${visible},`,
      `AnimationStatus: ${animationStatus.current}`
    );

    if (visible) {
      if (animationStatus.current === AnimationStatus.CLOSED) {
        const rect = containerElement.getBoundingClientRect();
        console.log("rect, ", `translateX: ${-rect?.left!}`);
        setProperties(containerElement, {
          transform: `translateX(${-rect?.left!}px)`,
        });
      }
      animationStatus.current = AnimationStatus.OPENING;
      setClassName(styles.popSlideIn);
    } else {
      if (animationStatus.current === AnimationStatus.OPENED) {
        animationStatus.current = AnimationStatus.CLOSING;
        setClassName(styles.popSlideOut);
      }
    }
  }, [visible]);

  useEffect(() => {
    const containerElement = containerRef.current;
    containerElement?.addEventListener("animationend", onAnimationEnd, false);
    return () => {
      containerElement?.removeEventListener(
        "animationend",
        onAnimationEnd,
        false
      );
    };
  }, [onAnimationEnd]);

  useEffect(() => {
    const containerElement = containerRef.current;
    if (!containerElement) {
      console.log(`do nothing`);
      return;
    }
    setProperties(containerElement, {
      "--slideInFrom": `-${popWidth}px`,
      "--slideInTo": "0px",
      "--slideOutFrom": "0px",
      "--slideOutTo": `-${popWidth}px`,
    });
  }, [popWidth]);

  useEffect(() => {
    document.body.addEventListener("click", onBodyClick, false);
    return () => {
      document.body.removeEventListener("click", onBodyClick, false);
    };
  }, [onBodyClick]);

  const onMouseLeave: React.MouseEventHandler<HTMLDivElement> = (event) => {
    onVisibleChange(false);
    onHover && onHover(false);
  };
  const onMouseEnter: React.MouseEventHandler<HTMLDivElement> = (event) => {
    onHover && onHover(true);
  };
  const onContextMenu: React.MouseEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
  };

  const style: React.CSSProperties = {
    width: popWidth,
    top,
    bottom,
  };

  return (
    <div
      className={clsx(styles.popSlide, className)}
      style={style}
      onMouseLeave={onMouseLeave}
      onMouseEnter={onMouseEnter}
      onContextMenu={onContextMenu}
      ref={containerRef}
    >
      <div className={styles.popSlideInner}>{children}</div>
    </div>
  );
};

export default PopSlide;
