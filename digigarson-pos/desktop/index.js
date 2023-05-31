const { app, ipcMain, BrowserWindow } = require("electron")
const { checkForUpdates, downloadAsar } = require("./updater")
const ptp = require("pdf-to-printer");
let pdf = require('html-pdf');
const del = require('del');

const { PosPrinter } = require("electron-pos-printer");

app.whenReady().then(() => {
    const window = new BrowserWindow({
        width: 1270,
        height: 720,
        minWidth: 800,
        minHeight: 600,
        autoHideMenuBar: true,
        webPreferences: {
            enableRemoteModule: true,
            nodeIntegration: true,
            contextIsolation: false,
            devTools: true
        }
    })

    window.loadURL("http://localhost:3000")
    window.webContents.openDevTools()

    ipcMain.on("maximize", () => window.maximize())
    ipcMain.on("minimize", () => window.minimize())
    ipcMain.on("exit", () => app.exit())
    ipcMain.on("restart", () => (app.relaunch(), app.exit()))
    ipcMain.on("new", (event, url)=>{
        console.log(url)
        const newWindow = new BrowserWindow({
            width: 800,
            height: 600,
            minWidth: 800,
            minHeight: 600,
            autoHideMenuBar: true,
            webPreferences: {
                enableRemoteModule: true,
                nodeIntegration: true,
                contextIsolation: false,
                devTools: true
            }
        })
        newWindow.loadURL(url)
    })

    ipcMain.on("printers", event => event.returnValue = window.webContents.getPrinters())
    ipcMain.on("print", (event, args) => {
        const arguments = JSON.parse(args)
        let height = arguments.settings.height


        let options = {
            pdf: {win32: ['-print-settings "noscale"'], "type": ".pdf", "height":`${height ? (height*7):"80"}mm`, "width": "72mm",  "renderDelay": 0},
            print : {printer: arguments.settings.printer, win32: ['-print-settings "noscale"']},
        }
let html = () => {
  let element =   `<html style="width: 72mm;height: ${height ? (height*7):"80"}mm; overflow: hidden; overflow-y: scroll;" lang="tr">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
   <style>
   ::-webkit-scrollbar {width: 0 !important;}
   * {margin: 0 auto;padding: 0}
   .invoice {display: block;width: 64mm;font-family: Tahoma,serif;padding: 0 4mm}
   .header {padding-bottom: 2mm}
   .body {padding: 2mm 0}
   .w-100 {width: 100% !important}
   .w-50 {width: 50% !important}
   .d-block {display: block !important}
   .mt-1 {margin-top: 1mm}
   .mt-2 {margin-top: 2mm}
   .mt-3 {margin-top: 3mm}
   .mt-4 {margin-top: 4mm}
   .mt-5 {margin-top: 5mm}
   .mb-1 {margin-bottom: 1mm}
   .mb-2 {margin-bottom: 2mm}
   .mb-3 {margin-bottom: 3mm}
   .mb-4 {margin-bottom: 4mm}
   .mb-5 {margin-bottom: 5mm}
   .ml-1 {margin-left: 1mm}
   .ml-2 {margin-left: 2mm}
   .ml-3 {margin-left: 3mm}
   .ml-4 {margin-left: 4mm}
   .ml-5 {margin-left: 5mm}
   .bold {font-weight: 700 !important}
   .font-size-xxxs {font-size: 3mm !important}
   .font-size-xxs {font-size: 3.4mm !important}
   .font-size-x {font-size: 3.8mm !important}
   .font-size-xs {font-size: 4.2mm !important}
   .font-size-xm {font-size: 5mm !important}
   .font-size-xxm {font-size: 5.5mm !important}
   .font-size-xl {font-size: 7.5mm !important}
   .text-center {text-align: center !important}
   .text-left {text-align: left !important}
   .text-right {text-align: right !important}
   .float-left {float: left !important}
   .float-right {float: right !important}
   </style><title>Print</title>
   </head>
   <body><div id="print" style="width:72mm; height: ${height ? (height*7):"80"}mm; background-color: #ffffff;">`;
    arguments.data.map(e => {
    element += e.value
    })
  element += 
   `</div></body>
   </html>`;

   return element
}  
let dir = `./invoices/${Math.random()}.pdf`
        pdf.create(html(), options.pdf).toFile(dir, function(err, res) {
        if (err) return console.log(err);
        ptp.print(dir, options.print).then( async ()=> {
            await del(dir);
        })
        });
    })

    if (!app.isPackaged) return

    ipcMain.on("check-for-updates", (event) =>
        checkForUpdates().then(data => data ? downloadAsar().then(data => event.reply("cfu-data", data)) : event.reply("cfu-data", data))
    )
})