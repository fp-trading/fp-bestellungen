const bodyParser = require('body-parser');
const { app, BrowserWindow } = require('electron')
//const path = require('path')
const serve = require('electron-serve')
const express = require('express')
const loadURL = serve({ directory: 'dist'})

let mainWindow;

function isDev() {
    return !app.isPackaged
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1080,
        height: 720,
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
        console.error(err)
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

const expressApp = express()

expressApp.use(bodyParser.json())

expressApp.post('/api/fulfill', async (req, res) => {
    console.log(req.body)
    res.status(200).send('fulfilling')
})

expressApp.all('*', async (req, res) => {
    console.log(req.body)
    res.status(404).json( { error: 'invalid endpoint' })
})

expressApp.listen(5172, () => {
    console.log('Express Server running and listening on port 5172...')
})