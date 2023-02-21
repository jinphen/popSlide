import React, { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { CSSTransition } from "react-transition-group";

import styles from "./index.module.scss";

function setProperties(
  element: HTMLElement,
  properties: Record<string, string>
) {
  Object.keys(properties).forEach((key) => {
    element.style.setProperty(key, properties[key]);
  });
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
  const { children, popWidth, visible, onVisibleChange, onHover } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const closedRef = useRef<boolean>(true);

  const onBodyClick = useCallback(
    (e: MouseEvent) => {
      if (e.target && !containerRef.current?.contains(e.target as Node)) {
        onVisibleChange(false);
      }
    },
    [onVisibleChange]
  );

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

  const onTransitionEnter = () => {
    console.log("transition enter");
    const containerElement = containerRef.current;
    if (!containerElement) return;
    if (!closedRef.current) return;

    const rect = containerElement.getBoundingClientRect();
    console.log("rect", rect.x);
    const offset = -(rect.left + rect.width);
    setProperties(containerElement, {
      transform: `translateX(${offset}px)`,
    });
    closedRef.current = false;
  };
  const onTransitionExisted = () => {
    console.log(
      "transition existed",
      containerRef.current?.getBoundingClientRect()?.x
    );
    closedRef.current = true;
    containerRef.current?.style.removeProperty("transform");
  };

  const style: React.CSSProperties = {
    width: popWidth,
  };

  return (
    <CSSTransition
      nodeRef={containerRef}
      timeout={200}
      in={visible}
      classNames="popSlide"
      onEnter={onTransitionEnter}
      onExited={onTransitionExisted}
    >
      <div
        className={clsx(styles.popSlide)}
        style={style}
        onMouseLeave={onMouseLeave}
        onMouseEnter={onMouseEnter}
        onContextMenu={onContextMenu}
        ref={containerRef}
      >
        <div className={styles.popSlideInner}>{children}</div>
      </div>
    </CSSTransition>
  );
};

export default PopSlide;
