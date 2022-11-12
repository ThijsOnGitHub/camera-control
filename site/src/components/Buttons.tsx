import React, {useEffect} from "react";
import axios from "axios";
import {LongPressCallback} from "../hooks/LongPressCallback";
import {ScreenShotFunctie, Stream} from "./Stream";
import {AtemState} from "atem-connection";


function CallPreset(CameraIp: string, preset: number) {
    const data=  new FormData();
    data.append('szCmd',JSON.stringify({"SysCtrl": {"PtzCtrl": {"nChanel": 0, "szPtzCmd": "preset_call", "byValue": preset}}}))
    axios.post(`http://${CameraIp}/ajaxcom`, data)
}

function SetPreset(CameraIp: string, preset: number) {
    const data=  new FormData();
    data.append('szCmd',JSON.stringify({"SysCtrl": {"PtzCtrl": {"nChanel": 0, "szPtzCmd": "preset_set", "byValue": preset}}}))
    axios.post(`http://${CameraIp}/ajaxcom`, data)
}

function SetToInput(input:number){
    axios.get(`http://localhost:4123/api/setInput/${input}`)
}

export const Repeater: React.FC<{ amount: number, items: (i: number) => React.ReactElement }> = (props) => {
    return <>{[...new Array(props.amount)].map((_, i) => props.items(i))}
    </>
}

export type EventData = {
    event: "stateChanged",
    data: AtemState
}

export const Buttons: React.FC<{ip:string,naam:string, amount:number, inputNumber:number, liveInput:number, previewInput:number,lockLive:boolean}> = (props) => {
    const longPress = LongPressCallback((button)=>{
        console.log("Long Press")
        SetPreset(props.ip, parseInt(button.name))
    },500)

    const [canvasRef,setCanvasRef] = React.useState<HTMLCanvasElement|undefined>(undefined)
    const [screenshots, setScreenshots] = React.useState<(string|undefined)[]>([...new Array(props.amount)])

    const isLive = props.liveInput === props.inputNumber
    const isPreview = props.previewInput === props.inputNumber

    const takeScreenshot = (preset:number)=>{
        if(canvasRef){
            const screenshot = canvasRef.toDataURL('image/png');
            const newScreenshots = [...screenshots]
            newScreenshots[preset] = screenshot
            setScreenshots(newScreenshots)
        }
    }

   return <div className={'button-group'} style={{borderColor:isLive ? "red" : isPreview ? "green" : ""}}>
       <div style={{display:"flex",flexDirection:"column",gap:10, alignItems: "center"}}>
           <div>{props.naam}</div>
           <button onClick={()=>SetToInput(props.inputNumber)}>Schakel naar <br/> camera</button>
       </div>

        <div className={'button-col'}>
            <div className={'button-row'}>
                <div className={'button-row-info'}>Call</div>
                <Repeater items={(i) =>
                    <div className={'button-container button-goto'} style={{cursor:isLive && props.lockLive ?"not-allowed":""}} onClick={()=> props.lockLive && isLive ? "" : CallPreset(props.ip,i) }>
                        {screenshots[i] == null ? <div className={'button-screenshot'}></div> : <img src={screenshots[i]} className={'button-screenshot'}></img>}
                        <div>{i + 1}</div>
                    </div>
                } amount={props.amount}/>
            </div>
            <div className={'button-row'}>
                <div className={'button-row-info'}>Set</div>
                <Repeater items={(i) =>
                    <button className={'button button-set'} onClick={()=> {
                        SetPreset(props.ip, i)
                        takeScreenshot(i)
                    }} name={i+''} key={i + 1}>
                        {i + 1}
                    </button>
                } amount={props.amount}/>
            </div>
        </div>

        <Stream setTakeScreenshot={(canvas)=>setCanvasRef(canvas)} ip={props.ip}/>
    </div>
}