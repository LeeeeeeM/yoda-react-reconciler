// @ts-nocheck

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { HOST_TAG } from "./customReactDOM";

const TEXT_MAP = {
  LOCKED: "locked",
  UNLOCKED: "unlocked",
};

const COLOR_MAP = {
  RED: "#ff0000",
  GREEN: "#00ff00",
  BLUE: "#0000ff",
  YELLOW: "#ffff00",
  WHITE: "#ffffff",
};

function App() {
  const [count, setCount] = useState(0);
  const [div1Color, setDiv1Color] = useState(COLOR_MAP.RED);
  const [div2Flex, setDiv2Flex] = useState(1.0);
  const [div3Flex, setDiv3Flex] = useState(1.0);
  const [text, setText] = useState(TEXT_MAP.LOCKED);

  const openRef = useRef<boolean>(false);

  const openColor = useMemo(() => {
    return text === TEXT_MAP.UNLOCKED ? COLOR_MAP.YELLOW : COLOR_MAP.WHITE;
  }, [text]);

  const switchRef = useCallback(() => {
    openRef.current = !openRef.current;
    console.log(
      `openRef.current is ${openRef.current}, 父级开关${
        openRef.current ? "打开" : "关闭"
      }`
    );
    setText(openRef.current ? TEXT_MAP.UNLOCKED : TEXT_MAP.LOCKED);
  }, []);

  const handleClick1 = useCallback(() => {
    if (!openRef.current) {
      console.log("openRef.current is false, 请打开父级开关");
      return;
    }
    console.log("正在切换 div1 的颜色");
    setDiv1Color(div1Color === COLOR_MAP.RED ? COLOR_MAP.BLUE : COLOR_MAP.RED);
  }, [div1Color]);

  const handleClick2 = useCallback(() => {
    if (!openRef.current) {
      console.log("openRef.current is false, 请打开父级开关");
      return;
    }
    console.log("正在切换 div2 的flex");
    setDiv2Flex(div2Flex === 1.0 ? 2.0 : 1.0);
  }, [div2Flex]);

  const handleClick3 = useCallback(() => {
    if (!openRef.current) {
      console.log("openRef.current is false, 请打开父级开关");
      return;
    }
    console.log("正在切换 div3 的颜色");
    setDiv3Flex(div3Flex === 1.0 ? 2.0 : 1.0);
  }, [div3Flex]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((count) => count + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <HOST_TAG.NODE style={{ margin: 10.0 }}>{`HELLO WORLD!`}</HOST_TAG.NODE>
      <HOST_TAG.NODE
        style={{ flex: 2.0, margin: 5.0, flexDirection: "column" }}
      >
        <HOST_TAG.NODE
          style={{ flex: 1.0, margin: 5.0, backgroundColor: openColor }}
          onClick={switchRef}
        >
          {`Click me to switch. It's ${text} now. Now U can ${
            openRef.current ? "" : "not"
          } click Nodes below.`}
        </HOST_TAG.NODE>
        <HOST_TAG.NODE
          style={{ flex: 3.0, margin: 5.0, flexDirection: "column" }}
        >
          <HOST_TAG.NODE
            style={{ margin: 15.0, backgroundColor: div1Color }}
            onClick={handleClick1}
          >
            {`Div1 Current Color: ${div1Color}. Click me to change`}
          </HOST_TAG.NODE>
          <HOST_TAG.NODE style={{ margin: 5.0 }}>
            <HOST_TAG.NODE
              style={{
                flex: div2Flex,
                margin: 5.0,
                backgroundColor: COLOR_MAP.GREEN,
              }}
              onClick={handleClick2}
            >
              {`Div2 Flex: 1. Click me to change`}
            </HOST_TAG.NODE>
            <HOST_TAG.NODE
              style={{
                flex: div3Flex,
                margin: 5.0,
                backgroundColor: COLOR_MAP.RED,
              }}
              onClick={handleClick3}
            >
              {`Div3 Flex: ${div3Flex}. Click me to change`}
            </HOST_TAG.NODE>
          </HOST_TAG.NODE>
        </HOST_TAG.NODE>
      </HOST_TAG.NODE>
      <HOST_TAG.NODE
        style={{ flex: 1.0, margin: 5.0, flexDirection: "column" }}
      >
        {`Start: ${count} seconds`}
      </HOST_TAG.NODE>
    </>
  );
}

export default App;
