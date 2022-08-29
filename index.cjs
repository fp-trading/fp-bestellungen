const { app, BrowserWindow } = require('electron')
//const path = require('path')
const serve = require('electron-serve')
const loadURL = serve({ directory: 'dist'})

let mainWindow;

function isDev() {
    return !app.isPackaged
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 900,
        height: 716,
        webPreferences: {
            nodeIntegration: true,
            //preload: path.join(__dirname, 'preload.js')
        },
        //icon: path.join(__dirname, 'public/favicon.png'),
        show: false
    })

    if (isDev()) {
        loadPage()
    } else {
        loadURL(mainWindow)
    }

    mainWindow.on('closed', () => {
        mainWindow = null
    })

    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    })
}

function loadPage() {
    mainWindow.loadURL('http://localhost:5173/').catch((err) => {
        setTimeout(() => { loadPage() }, 200)
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
    if (mainWindow === null) createWindow()
})
