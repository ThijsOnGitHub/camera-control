import { app, BrowserWindow } from "electron";
const path = require('path');
require('update-electron-app')({
  repo: 'ThijsOnGitHup/camera-control'
})

app.commandLine.appendSwitch('disable-features', 'BlockInsecurePrivateNetworkRequests')
app.commandLine.appendSwitch('disable-features', 'PrivateNetworkAccessSendPreflights')
app.commandLine.appendSwitch('disable-features', 'PrivateNetworkAccessRespectPreflightResults')
const createWindow = () => {

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    webPreferences: {
      webSecurity: false,
    },
  });

   // and load the index.html of the app.
  //mainWindow.loadURL("https://camera-control-ijwg.vercel.app/")
  mainWindow.loadFile(`${path.join(__dirname, "../site/index.html")}`)

  // listen to postMessage
    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.executeJavaScript(`window.addEventListener('message', event => {
            console.log(event.data)
        })`)
    })

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.

  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.