import {useCallback, useRef} from "react";

export const LongPressCallback = ( callback: (button: HTMLButtonElement) => void, ms: number) => {
    const timeout = useRef<NodeJS.Timeout>();
    const start = (event:any) => {
        console.log(event.target);
        timeout.current = setTimeout(() => callback(event.target), ms);
    }
    const clear = () => {
        timeout.current && clearTimeout(timeout.current);
    }
    return {
        onMouseDown: start,
        onMouseUp: clear,
        onMouseLeave: clear,
        onTouchStart: start,
        onTouchEnd: clear,
    }
}