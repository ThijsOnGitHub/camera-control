import {createElement, createRef, FC, forwardRef, RefObject, useEffect, useRef} from "react";
const Wfs = require("./wfs.js");
import { loadPlayer } from 'rtsp-relay/browser';


export const Stream: FC<{ip:string}> = (props)=>{
    const videoCanvas = createRef<HTMLCanvasElement>()
    const canvas = createRef<HTMLCanvasElement>()

    const takeScreenShot = () => {
        if(!videoCanvas.current || !canvas.current) return
        const canvasTemp = createElement("canvas") as unknown as HTMLCanvasElement
        let ctx = canvasTemp.getContext('2d');
        if(!ctx) return
        ctx.drawImage( videoCanvas.current, 0, 0, canvasTemp.width, canvasTemp.height );
    }



    useEffect(()=>{
        if(videoCanvas.current){
            loadPlayer({
                url: `ws://localhost:4123/api/stream/${props.ip}`,
                canvas: videoCanvas.current,
                // optional
                onDisconnect: () => console.log('Connection lost!'),
            });
        }

    })

    return <div className={'button-video-container'}>
        <canvas className={'button-video'} ref={videoCanvas}></canvas>
    </div>
}



