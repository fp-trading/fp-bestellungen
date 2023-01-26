const bodyParser = require('body-parser');
const { app, BrowserWindow } = require('electron');
require('update-electron-app');
//const path = require('path')
const serve = require('electron-serve');
const express = require('express');
const cors = require('cors');
const { OrderFulfiller } = require('./src/server/OrderFulfiller.cjs');
const loadURL = serve({ directory: 'dist'});

let mainWindow;

function isDev() {
    return !app.isPackaged
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1225,
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
const orderFulfiller = new OrderFulfiller()

expressApp.use(bodyParser.json())

expressApp.use(cors({
    origin: ['http://localhost:5173', 'app://-']
}))

expressApp.post('/api/fulfill', async (req, res) => {
    const [username, password] = Buffer.from(req.headers.authorization.split(' ')[1], 'base64').toString('utf-8').split(':')
    const result = await orderFulfiller.fulfill(req.body.address, req.body.products, { username: username, password: password })
    res.status(result.status).json({message: result.message})
})

expressApp.all('*', async (req, res) => {
    console.log(req.body)
    res.status(404).json( { error: 'invalid endpoint' })
})

expressApp.listen(5172, () => {
    console.log('Express Server running and listening on port 5172...')
})