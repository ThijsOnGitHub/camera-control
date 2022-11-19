import {createElement, createRef, FC, forwardRef, RefObject, useCallback, useEffect, useRef} from "react";
const Wfs = require("./wfs.js");
import { loadPlayer } from 'rtsp-relay/browser';

export type ScreenShotFunctie = HTMLCanvasElement

export const Stream: FC<{ip:string,setTakeScreenshot?: (screenshotFunction:ScreenShotFunctie)=>void, showVideo? : boolean }> = ({showVideo=true,...props})=>{
    const videoCanvas = createRef<HTMLCanvasElement>()

    const takeScreenShot = () => {
            return videoCanvas.current?.toDataURL('image/png');
    }


    useEffect(()=>{
        if(videoCanvas.current && props.setTakeScreenshot ) props.setTakeScreenshot(videoCanvas.current)
        if(videoCanvas.current){
            loadPlayer({
                url: `ws://localhost:4123/api/stream/${props.ip}`,
                canvas: videoCanvas.current,
                disableGl: true,
                // optional
                onDisconnect: () => console.log('Connection lost!'),
            });
        }
    },[videoCanvas.current])

    return <div className={'button-video-container'}>
        <canvas className={'button-video'} style={{display: !showVideo ? "none" : ""}} ref={videoCanvas}></canvas>
    </div>
}



