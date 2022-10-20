import {useEffect, useRef} from "react";

export const Stream: React.FC<{ip:string,naam:string}> = (props) => {
    const video = useRef<HTMLVideoElement>()
    useEffect(() => {
        if(video.current){
            const onMediaSourceOpen =()=> {
                sourceBuffer = ms.addSourceBuffer('video/mp4; codecs="avc1.4D0033, mp4a.40.2"');
                sourceBuffer.addEventListener("updateend",loadPacket);
                sourceBuffer.addEventListener("onerror", sourceError);
            }

            let sourceBuffer :SourceBuffer
            var ms = new MediaSource();
            video.current.src = window.URL.createObjectURL(ms);
            ms.addEventListener('sourceopen', onMediaSourceOpen);
        }

    }, []);

}
