import React from 'react';
import logo from './logo.svg';
import './App.scss';
import {Buttons} from "./components/Buttons";
import {Stream} from "./components/Stream";

function App() {
  return (
    <div className="App">
        <Buttons ip={"192.168.1.161"} naam={"Cam 1"} amount={10}></Buttons>
        <Buttons ip={"192.168.1.162"} naam={"Cam 2"} amount={10}></Buttons>
        <Buttons ip={"192.168.1.163"} naam={"Cam 3"} amount={10}></Buttons>
        <Buttons ip={"192.168.1.164"} naam={"Cam 4"} amount={10}></Buttons>
        <Buttons ip={"192.168.1.165"} naam={"Cam 5"} amount={10}></Buttons>
    </div>
  );
}

export default App;
