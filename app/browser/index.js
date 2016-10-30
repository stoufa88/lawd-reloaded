'use strict';

const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module for communication
const ipcMain = electron.ipcMain;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const os = require('os');
const path = require('path');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let session;

function createWindow() {
  // Create the browser window.
  var windowSettings = {
    title: 'Lawd',
    icon: __dirname + './renderer/assets/images/logo.png',
    width: 1024,
    height: 800
  };

  mainWindow = new BrowserWindow(windowSettings);

  // Load the index.html of the app.
  // Most examples use __dirname instead of process.cwd().
  // However Webpack, at least by default, injects "" as
  // the __dirname parameter in the bundled file. So to keep
  // things working both in regular electron usage AND webpack,
  // we have to go with process.cwd() instead of __dirname.
  mainWindow.loadURL('file://' + path.resolve(__dirname, '..', 'renderer', 'app.html'));

  // Open the DevTools.
	if(process.env.HOT) {
		mainWindow.webContents.openDevTools();
	}

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('download-path-request', (event, arg) => {
	var p = app.getPath('videos');
	console.log(p)

  event.returnValue = p;
});

require('./db.js')
