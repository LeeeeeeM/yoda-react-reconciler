import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { HOST_TAG } from "./customReactDOM";

function App() {
  const [count, setCount] = useState(0);
  const [div1Color, setDiv1Color] = useState("#ff0000");
  const [div2Color, setDiv2Color] = useState("#00ff00");
  const div1Flex = useMemo(() => {
    return "#ff0000" === div1Color ? 1.0 : 2.0;
  }, [div1Color])

  const openRef = useRef<boolean>(false);

  const switchRef = useCallback(() => {
    openRef.current = !openRef.current;
    console.log(
      `openRef.current is ${openRef.current}, 父级开关${
        openRef.current ? "打开" : "关闭"
      }`
    );
  }, []);

  const handleClick1 = useCallback(() => {
    if (!openRef.current) {
      console.log("openRef.current is false, 请打开父级开关");
      return;
    }
    console.log("正在切换 div1 的颜色");
    setDiv1Color(div1Color === "#0000ff" ? "#ff0000" : "#0000ff");
  }, [div1Color]);

  const handleClick2 = useCallback(() => {
    if (!openRef.current) {
      console.log("openRef.current is false, 请打开父级开关");
      return;
    }
    console.log("正在切换 div2 的颜色");
    setDiv2Color(div2Color === "#0000ff" ? "#00ff00" : "#0000ff");
  }, [div2Color]);

  useEffect(() => {
    setTimeout(() => {
      setCount(count + 1);
    }, 1000);
  }, [count]);

  return (
    <>
      <HOST_TAG.NODE></HOST_TAG.NODE>
      <div style={{ flex: 2.0, margin: 5.0 }} onClick={switchRef}>
        <div
          style={{ flex: div1Flex, margin: 15.0, backgroundColor: div1Color }}
          onClick={handleClick1}
        ></div>
        <div
          style={{ flex: 1.0, margin: 15.0, backgroundColor: div2Color }}
          onClick={handleClick2}
        ></div>
      </div>
      {count > 0 ? <div>123123</div> : null}
    </>
  );
}

export default App;
