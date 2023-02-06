import {createRef, FC, useEffect} from "react";
import { Player} from 'rtsp-relay/browser';
import {PlayerOptions} from "rtsp-relay/browser/jsmpeg";

export type ScreenShotFunctie = HTMLCanvasElement

export const Stream: FC<{ip:string,setTakeScreenshot?: (screenshotFunction:ScreenShotFunctie)=>void, showVideo? : boolean }> = ({showVideo=true,...props})=>{
    const videoCanvas = createRef<HTMLCanvasElement>()

    const takeScreenShot = () => {
            return videoCanvas.current?.toDataURL('image/png');
    }

    const importJSMpeg = () =>
        new Promise((resolve, reject) => {
            const script = Object.assign(document.createElement('script'), {
                src: 'jsmpeg.min.js',
                onload: resolve,
                onerror: reject,
            });
            document.head.appendChild(script);
        });

    /**
     * Creates a `Player`. If you intend to create multiple players, you must
     * await for this promise to complete before creating the next player.
     * @param {import("./jsmpeg").PlayerOptions} options
     * @returns {Promise<Player>}
     */
    const loadPlayer: (options: PlayerOptions)=> Promise<Player>  = ({
                            url,
                            onDisconnect,
                            disconnectThreshold = 3e3,
                            ...options
                        }) =>
        importJSMpeg().then(() => {
            return new Promise((resolve, reject) => {
                // hide the canvas until it's loaded and the correct size
                const originalDisplay = options.canvas.style.display;
                // eslint-disable-next-line no-param-reassign
                options.canvas.style.display = 'none';

                let lastRx = Date.now(); // Date.now() is more efficient than performance.now()
                if (options.onVideoDecode && onDisconnect) {
                    reject(
                        new Error('You cannot specify both onDisconnect and onVideoDecode'),
                    );
                    return;
                }

                const player = new window.JSMpeg.Player(url, {
                    // for performance reasons, only record last packet Rx time if onDisconnect is specified
                    onVideoDecode: onDisconnect
                        ? () => {
                            lastRx = Date.now();
                        }
                        : undefined,
                    ...options,
                });

                const o = new MutationObserver((mutations) => {
                    if (mutations.some((m) => m.type === 'attributes')) {
                        // eslint-disable-next-line no-param-reassign
                        options.canvas.style.display = originalDisplay;
                        resolve(player);
                        o.disconnect();
                    }
                });
                o.observe(options.canvas, { attributes: true });

                if (onDisconnect) {
                    const i = setInterval(() => {
                        if (Date.now() - lastRx > disconnectThreshold) {
                            onDisconnect();
                            clearInterval(i);
                        }
                    }, disconnectThreshold / 2);
                }
            });
        });

    async function startVideoPreview() {
        if(videoCanvas.current){
            const canvas = videoCanvas.current
            setTimeout(()=>{
                loadPlayer({
                    url: `ws://localhost:4123/api/stream/${props.ip}`,
                    canvas: canvas,
                    disableGl: true,
                    disconnectThreshold: 10000,
                    // optional
                    onDisconnect: () => console.log('Connection lost!'),
                });
            },1000)
        }
    }

    useEffect(()=>{
            if(videoCanvas.current && props.setTakeScreenshot ) props.setTakeScreenshot(videoCanvas.current)
            startVideoPreview()
    },[videoCanvas.current])

    return <div className={'button-video-container'}>
        <canvas className={'button-video'} style={{display: !showVideo ? "none" : ""}} ref={videoCanvas}></canvas>
    </div>
}



