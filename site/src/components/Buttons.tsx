import React from "react";
import axios from "axios";
import {LongPressCallback} from "../hooks/LongPressCallback";


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

export const Repeater: React.FC<{ amount: number, items: (i: number) => React.ReactElement }> = (props) => {
    return <>{[...new Array(props.amount)].map((_, i) => props.items(i))}
    </>
}

function test(){
    window.postMessage("test")
}

export const Buttons: React.FC<{ip:string,naam:string, amount:number}> = (props) => {
    const longPress = LongPressCallback((button)=>{
        console.log("Long Press")
        SetPreset(props.ip, parseInt(button.name))
    },500)
    return <div className={'button-group'}>
        <div>{props.naam}</div>
        <div className={'button-col'}>
            <div className={'button-row'}>
                <div>Call  </div>
                <Repeater items={(i) =>
                    <button  className={'button button-goto'} name={i+''} onClick={event => CallPreset(props.ip, i)} key={i + 1}>
                        <div>{i + 1}</div>
                    </button>
                } amount={props.amount}/>
            </div>
            <div className={'button-row'}>
                <div>Set  </div>
                <Repeater items={(i) =>
                    <button className={'button button-set'} onClick={()=> SetPreset(props.ip,i)} name={i+''} key={i + 1}>
                        {i + 1}
                    </button>
                } amount={props.amount}/>
            </div>
        </div>
    </div>
}