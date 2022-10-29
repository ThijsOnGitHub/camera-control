import {createElement, createRef, FC, forwardRef, RefObject, useEffect, useRef} from "react";
const Wfs = require("./wfs.js");

export const Stream: FC<{ip:string}> = (props)=>{
    const video = createRef<HTMLVideoElement>()
    const canvas = createRef<HTMLCanvasElement>()

    const takeScreenShot = () => {
        if(!video.current || !canvas.current) return
        const canvasTemp = createElement("canvas") as unknown as HTMLCanvasElement
        let ctx = canvasTemp.getContext('2d');
        if(!ctx) return
        ctx.drawImage( video.current, 0, 0, canvasTemp.width, canvasTemp.height );
    }

    useEffect(()=>{
        // @ts-ignore
        const wfs = new Wfs()
        wfs.attachMedia(video.current, `ws://${props.ip}:8088/live/av0`);
    })

    return <div className={'button-video-container'}>
        <video className={'button-video'} ref={video}></video>
    </div>
}



