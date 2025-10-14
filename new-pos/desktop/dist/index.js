"use strict";
const config = require("config");
const electron = require("electron");
const ptp = require("pdf-to-printer");
const pdf = require("html-pdf");
const del = require("del");
const fs = require("fs");
const si = require("systeminformation");
const os = require("os");
const crypto = require("crypto");
const initWindowEvent = (window) => {
  electron.ipcMain.handle("maximize", () => window.maximize());
  electron.ipcMain.handle("minimize", () => window.minimize());
  electron.ipcMain.handle("exit", () => electron.app.exit());
  electron.ipcMain.handle("restart", () => (electron.app.relaunch(), electron.app.exit()));
  electron.ipcMain.handle("zoom", (event, zoomDirection) => {
    var currentZoom = window.webContents.getZoomFactor();
    if (zoomDirection === "in") {
      window.webContents.zoomFactor = currentZoom + 0.2;
    }
    if (zoomDirection === "out") {
      window.webContents.zoomFactor = currentZoom - 0.2;
    }
  });
  electron.ipcMain.on("changeURL", (event, path) => {
    window.loadURL(path);
  });
};
var InvoiceMainDraftVariables = /* @__PURE__ */ ((InvoiceMainDraftVariables2) => {
  InvoiceMainDraftVariables2["HEIGHT"] = "{{height}}";
  InvoiceMainDraftVariables2["PRINT"] = "{{print}}";
  return InvoiceMainDraftVariables2;
})(InvoiceMainDraftVariables || {});
const invoiceHTML = '<html\r\n  style="width: 72mm;height: {{height}}mm; overflow: hidden; overflow-y: scroll;"\r\n  lang="tr"\r\n>\r\n  <head>\r\n    <meta charset="UTF-8" />\r\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\r\n    <style>\r\n      ::-webkit-scrollbar {\r\n        width: 0 !important;\r\n      }\r\n      * {\r\n        margin: 0 auto;\r\n        padding: 0;\r\n      }\r\n      .invoice {\r\n        display: block;\r\n        width: 64mm;\r\n        font-family: Tahoma, serif;\r\n        padding: 0 4mm;\r\n      }\r\n      .header {\r\n        padding-bottom: 2mm;\r\n      }\r\n      .body {\r\n        padding: 2mm 0;\r\n      }\r\n      .w-100 {\r\n        width: 100% !important;\r\n      }\r\n      .w-50 {\r\n        width: 50% !important;\r\n      }\r\n      .d-block {\r\n        display: block !important;\r\n      }\r\n      .mt-1 {\r\n        margin-top: 1mm;\r\n      }\r\n      .mt-2 {\r\n        margin-top: 2mm;\r\n      }\r\n      .mt-3 {\r\n        margin-top: 3mm;\r\n      }\r\n      .mt-4 {\r\n        margin-top: 4mm;\r\n      }\r\n      .mt-5 {\r\n        margin-top: 5mm;\r\n      }\r\n      .mb-1 {\r\n        margin-bottom: 1mm;\r\n      }\r\n      .mb-2 {\r\n        margin-bottom: 2mm;\r\n      }\r\n      .mb-3 {\r\n        margin-bottom: 3mm;\r\n      }\r\n      .mb-4 {\r\n        margin-bottom: 4mm;\r\n      }\r\n      .mb-5 {\r\n        margin-bottom: 5mm;\r\n      }\r\n      .ml-1 {\r\n        margin-left: 1mm;\r\n      }\r\n      .ml-2 {\r\n        margin-left: 2mm;\r\n      }\r\n      .ml-3 {\r\n        margin-left: 3mm;\r\n      }\r\n      .ml-4 {\r\n        margin-left: 4mm;\r\n      }\r\n      .ml-5 {\r\n        margin-left: 5mm;\r\n      }\r\n      .bold {\r\n        font-weight: 700 !important;\r\n      }\r\n      .font-size-xxxs {\r\n        font-size: 3mm !important;\r\n      }\r\n      .font-size-xxs {\r\n        font-size: 3.4mm !important;\r\n      }\r\n      .font-size-x {\r\n        font-size: 3.8mm !important;\r\n      }\r\n      .font-size-xs {\r\n        font-size: 4.2mm !important;\r\n      }\r\n      .font-size-xm {\r\n        font-size: 5mm !important;\r\n      }\r\n      .font-size-xxm {\r\n        font-size: 5.5mm !important;\r\n      }\r\n      .font-size-xl {\r\n        font-size: 7.5mm !important;\r\n      }\r\n      .text-center {\r\n        text-align: center !important;\r\n      }\r\n      .text-left {\r\n        text-align: left !important;\r\n      }\r\n      .text-right {\r\n        text-align: right !important;\r\n      }\r\n      .float-left {\r\n        float: left !important;\r\n      }\r\n      .float-right {\r\n        float: right !important;\r\n      }\r\n    </style>\r\n    <title>Print</title>\r\n  </head>\r\n  <body>\r\n    <div\r\n      id="print"\r\n      style="width:72mm; height: {{height}}mm; background-color: #ffffff;"\r\n    >\r\n      `; {{print}}\r\n    </div>\r\n  </body>\r\n</html>\r\n';
const getInvoiceMain = (height, print) => {
  let html = invoiceHTML.replaceAll(InvoiceMainDraftVariables.HEIGHT, height.toString());
  html = html.replaceAll(InvoiceMainDraftVariables.PRINT, print);
  return html;
};
const DraftUtil = {
  getInvoiceMain
};
const initPrinterEvent = (window) => {
  electron.ipcMain.handle(
    "getPrinters",
    async (event) => {
      const printers = await window.webContents.getPrintersAsync();
      return printers;
    }
  );
  electron.ipcMain.handle(
    "getPrinterSettings",
    async (event) => {
      const printers = await window.webContents.getPrintersAsync();
      return printers;
    }
  );
  electron.ipcMain.handle(
    "setPrinterSettings",
    async (event) => {
      return false;
    }
  );
  electron.ipcMain.handle("print", (event, args) => {
    const jsonArgs = JSON.parse(args);
    let invoiceHeight = jsonArgs.settings.height;
    invoiceHeight = invoiceHeight ? invoiceHeight * 7 : 80;
    const pdfOptions = {
      //win32: ['-print-settings "noscale"'],
      type: "pdf",
      height: `${invoiceHeight}mm`,
      width: "72mm",
      renderDelay: 0
    };
    const printOptions = {
      printer: jsonArgs.settings.printer,
      scale: "noscale"
      //win32: ['-print-settings "noscale"'],
    };
    const invoiceHTML2 = DraftUtil.getInvoiceMain(invoiceHeight, jsonArgs.data.map((e) => e.value).join(""));
    let dir = `./invoices/${Math.random()}.pdf`;
    pdf.create(invoiceHTML2, pdfOptions).toFile(dir, function(err, res) {
      if (err) return console.log(err);
      ptp.print(dir, printOptions).then(async () => {
        console.log(dir);
        await fs.unlink(dir, () => {
          del.deleteAsync(dir);
        });
        return true;
      }).catch((ptpErr) => {
        console.error(ptpErr);
      });
    });
    return false;
  });
  electron.ipcMain.handle(
    "multiPrint",
    async (event) => {
      return false;
    }
  );
  electron.ipcMain.handle(
    "viewInvoice",
    async (event) => {
      return false;
    }
  );
};
const getDeviceIds = async () => {
  const system = await si.system();
  const bios = await si.bios();
  const osInfo = await si.osInfo();
  const uuid = system?.uuid || bios?.serial || "";
  const hostname = os.hostname();
  const osIdRaw = uuid || `${osInfo.platform}|${osInfo.distro}|${osInfo.release}|${hostname}`;
  const biosIdRaw = bios?.serial || `${bios?.vendor || ""}|${bios?.version || ""}|${bios?.releaseDate || ""}`;
  return {
    osIdRaw,
    biosIdRaw,
    system,
    bios,
    osInfo
  };
};
const createDeviceHash = async () => {
  const { osIdRaw, biosIdRaw } = await getDeviceIds();
  const combined = `${osIdRaw}||${biosIdRaw}`;
  const hash = crypto.createHash("sha256").update(combined).digest("hex");
  return hash;
};
const SystemUtil = {
  getDeviceIds,
  createDeviceHash
};
const initUserEvent = (window) => {
  electron.ipcMain.handle("getToken", async () => {
    const token = await SystemUtil.createDeviceHash();
    return token;
  });
};
const url = config.get("url");
const runType = config.get("runType");
const isDev = runType === "dev" ? true : false;
electron.app.whenReady().then(() => {
  const window = new electron.BrowserWindow({
    minWidth: 1200,
    minHeight: 800,
    autoHideMenuBar: true,
    fullscreen: !isDev,
    frame: false,
    titleBarStyle: "hidden",
    resizable: false,
    center: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: isDev
    }
  });
  window.loadURL(url);
  if (isDev) {
    window.webContents.openDevTools();
  }
  initWindowEvent(window);
  initPrinterEvent(window);
  initUserEvent();
  if (!electron.app.isPackaged) return;
  electron.app.on("window-all-closed", () => {
    if (process.platform !== "darwin") electron.app.quit();
  });
});
//# sourceMappingURL=index.js.map
