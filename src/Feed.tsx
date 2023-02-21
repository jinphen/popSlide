import React, { useCallback, useRef, useState } from "react";
import PopSlide from "./PopSlide";

interface FeedProps {}
const Feed: React.FC<FeedProps> = (props) => {
  const {} = props;
  const [visible, setVisible] = useState<boolean>(false);
  const hoverRef = useRef(false);
  const [position, setPosition] = useState<{ top: number; bottom: number }>({
    top: 0,
    bottom: 0,
  });

  const onVisibleChange = (show: boolean) => {
    console.log("Feed LeftMenu onVisibleChange", show);
    setVisible(show);
  };

  const onMouseEnter: React.MouseEventHandler<HTMLDivElement> = (event) => {
    setVisible(true);
    const rect = event.currentTarget.getBoundingClientRect();
    setPosition({ top: rect.top + rect.height, bottom: 40 });
  };
  const onMouseLeave = useCallback(() => {
    setTimeout(() => {
      if (!hoverRef.current) {
        setVisible(false);
      }
    }, 100);
  }, []);
  const onHover = (hover: boolean) => {
    console.log("inner hover", hover);
    hoverRef.current = hover;
  };
  const onCloseClick = () => {
    setVisible(false);
  };

  return (
    <div className="feed">
      <div>hello</div>
      <div
        className="feedToggleIcon"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div>hover me</div>
      </div>
      {/* <PopSlide
        visible={visible}
        popWidth={250}
        onVisibleChange={onVisibleChange}
        onHover={onHover}
        {...position}
      > */}
      <div className="feedHoverMenu">
        <div>inner PopSlide</div>
        <div>
          <button onClick={onCloseClick}>click me to close</button>
        </div>
      </div>
      {/* </PopSlide> */}
    </div>
  );
};

export default Feed;
