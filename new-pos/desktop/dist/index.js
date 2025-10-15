"use strict";
const config = require("config");
const electron = require("electron");
const ptp = require("pdf-to-printer");
const pdf = require("html-pdf");
const del = require("del");
const fs = require("fs");
const StoreDefault = require("electron-store");
const si = require("systeminformation");
const os = require("os");
const crypto = require("crypto");
function convertQueryData(data) {
  return JSON.stringify({
    d: typeof data === "number" ? data.toString() : data
  });
}
Array.prototype.indexOfKey = function(key, value) {
  let findIndex = -1;
  let index = 0;
  if (typeof value !== "undefined") {
    for (const item of this) {
      let _data = item;
      if (key.length > 0) {
        for (const name of key.split(".")) {
          if (typeof _data !== "undefined") {
            _data = _data[name];
          }
        }
      }
      if (convertQueryData(_data) == convertQueryData(value)) {
        findIndex = index;
        break;
      }
      index++;
    }
  }
  return findIndex;
};
Array.prototype.findSingle = function(key, value) {
  let foundItem = null;
  if (typeof value !== "undefined") {
    for (const item of this) {
      let _data = item;
      if (key.length > 0) {
        for (const name of key.split(".")) {
          if (typeof _data !== "undefined") {
            _data = _data[name];
          }
        }
      }
      if (convertQueryData(_data) == convertQueryData(value)) {
        foundItem = item;
        break;
      }
    }
  }
  return foundItem;
};
Array.prototype.findMulti = function(key, value, isEquals = true) {
  const foundItems = [];
  if (typeof value !== "undefined") {
    for (const item of this) {
      let _data = item;
      if (key.length > 0) {
        for (const name of key.split(".")) {
          if (typeof _data !== "undefined") {
            _data = _data[name];
          }
        }
      }
      let query = false;
      if (Array.isArray(value)) {
        query = value.some(
          (v) => convertQueryData(v) == convertQueryData(_data)
        );
      } else {
        query = convertQueryData(_data) == convertQueryData(value);
      }
      if (query == isEquals) {
        foundItems.push(item);
      }
    }
  }
  return foundItems;
};
Array.prototype.orderBy = function(key, sort_type) {
  return this.sort(function(a, b) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      return 0;
    }
    const varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
    const varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];
    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return sort_type === "desc" ? comparison * -1 : comparison;
  });
};
Array.prototype.serializeObject = function() {
  const result = {};
  this.forEach((item) => {
    result[item.name] = item.value;
  });
  return result;
};
Array.prototype.remove = function(index, deleteCount = 1) {
  this.splice(index, deleteCount);
};
String.prototype.replaceArray = function(find, replace) {
  let replaceString = this;
  for (let i = 0; i < find.length; i++) {
    replaceString = replaceString.replaceAll(find[i], replace[i]);
  }
  return replaceString.toString();
};
String.prototype.removeLastChar = function(remove_count = 1) {
  return this.slice(0, remove_count * -1);
};
String.prototype.encode = function() {
  return encodeURIComponent(this.toString());
};
String.prototype.decode = function() {
  return decodeURIComponent(this.toString());
};
String.prototype.convertKey = function() {
  return unescape(encodeURIComponent(this.convertSEOUrl()));
};
String.prototype.stripTags = function() {
  return this.replace(/<\/?[^>]+>/gi, "");
};
String.prototype.removeScriptTags = function() {
  return this.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    ""
  );
};
String.prototype.convertSEOUrl = function() {
  let $this = this.toString();
  $this = $this.toString().toLowerCase().trim().stripTags();
  $this = $this.replace("'", "");
  const tr = [
    "ş",
    "Ş",
    "ı",
    "I",
    "İ",
    "ğ",
    "Ğ",
    "ü",
    "Ü",
    "ö",
    "Ö",
    "Ç",
    "ç",
    "(",
    ")",
    "/",
    ":",
    ",",
    "!"
  ];
  const eng = [
    "s",
    "s",
    "i",
    "i",
    "i",
    "g",
    "g",
    "u",
    "u",
    "o",
    "o",
    "c",
    "c",
    "",
    "",
    "_",
    "_",
    "",
    ""
  ];
  $this = $this.replaceArray(tr, eng);
  $this = $this.replace(/[^-\w\s]/g, "");
  $this = $this.replace(/^\s+|\s+$/g, "");
  $this = $this.replace(/[-\s]+/g, "-");
  return $this;
};
String.prototype.toCapitalizeCase = function() {
  const arr = this.split(" ");
  for (let i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
  }
  return arr.join(" ");
};
String.prototype.isJson = function() {
  let item = typeof this !== "string" ? JSON.stringify(this) : this;
  try {
    item = JSON.parse(item);
  } catch (e) {
    return false;
  }
  if (typeof item === "object" && item !== null) {
    return true;
  }
  return false;
};
Number.prototype.isInt = function() {
  if (typeof this !== "number") return false;
  const n = this;
  return Number(n) === n && n % 1 === 0;
};
Number.prototype.isFloat = function() {
  if (typeof this !== "number") return false;
  const n = this;
  return Number(n) === n && n % 1 !== 0;
};
Number.prototype.getPercent = function(min, max) {
  if (typeof this !== "number") return 0;
  return 100 * (this - min) / (max - min);
};
Date.prototype.addDays = function(n) {
  this.setDate(this.getDate() + n);
};
Date.prototype.tomorrow = function() {
  this.addDays(1);
};
Date.prototype.yesterday = function() {
  this.addDays(-1);
};
Date.prototype.addMonths = function(n) {
  this.setMonth(this.getMonth() + n);
};
Date.prototype.addYears = function(n) {
  this.setFullYear(this.getFullYear() + n);
};
Date.prototype.getStringWithMask = function(mask, utc = false) {
  let date = this;
  const i18n = {
    dayNames: [
      "Sun",
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ],
    monthNames: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ]
  };
  const token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g, timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g, timezoneClip = /[^-+\dA-Z]/g;
  function pad(val, len = 0) {
    val = String(val);
    len = len || 2;
    while (val.length < len) val = "0" + val;
    return val;
  }
  if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
    mask = date;
    date = void 0;
  }
  date = date ? new Date(date) : /* @__PURE__ */ new Date();
  if (isNaN(date)) throw SyntaxError("invalid date");
  if (mask.slice(0, 4) == "UTC:") {
    mask = mask.slice(4);
    utc = true;
  }
  const _ = utc ? "getUTC" : "get", d = date[_ + "Date"](), D = date[_ + "Day"](), m = date[_ + "Month"](), y = date[_ + "FullYear"](), H = date[_ + "Hours"](), M = date[_ + "Minutes"](), s = date[_ + "Seconds"](), L = date[_ + "Milliseconds"](), o = utc ? 0 : date.getTimezoneOffset(), flags = {
    d,
    dd: pad(d),
    ddd: i18n.dayNames[D],
    dddd: i18n.dayNames[D + 7],
    m: m + 1,
    mm: pad(m + 1),
    mmm: i18n.monthNames[m],
    mmmm: i18n.monthNames[m + 12],
    yy: String(y).slice(2),
    yyyy: y,
    h: H % 12 || 12,
    hh: pad(H % 12 || 12),
    H,
    HH: pad(H),
    M,
    MM: pad(M),
    s,
    ss: pad(s),
    l: pad(L, 3),
    L: pad(L > 99 ? Math.round(L / 10) : L),
    t: H < 12 ? "a" : "p",
    tt: H < 12 ? "am" : "pm",
    T: H < 12 ? "A" : "P",
    TT: H < 12 ? "AM" : "PM",
    // @ts-ignore
    Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
    o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
    // @ts-ignore
    S: ["th", "st", "nd", "rd"][
      // @ts-ignore
      d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10
    ]
  };
  return mask.replace(token, function($0) {
    return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
  });
};
Date.prototype.diffDays = function(date) {
  let diff = (date.getTime() - this.getTime()) / 1e3;
  diff /= 60 * 60 * 24;
  return Math.ceil(diff);
};
Date.prototype.diffMinutes = function(date) {
  let diff = (this.getTime() - date.getTime()) / 1e3;
  diff /= 60;
  return Math.round(diff);
};
Date.prototype.diffSeconds = function(date) {
  const diff = (this.getTime() - date.getTime()) / 1e3;
  return Math.round(diff);
};
Date.convertHoursToMS = function(hours) {
  return 1e3 * 60 * 60 * hours;
};
Math.randomCustom = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
Math.range = function(value, min, max, equal = false) {
  return equal ? value >= min && value <= max : value > min && value < max;
};
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
const Store = StoreDefault.default || StoreDefault;
const store = new Store({
  defaults: {
    users: [],
    printer: {
      title: "",
      cancelPrinterName: "",
      safePrinterName: "",
      settings: {
        callerId: false,
        payyedPrint: false,
        cancelInvoice: false,
        showUserName: false,
        showQuantityName: true
      },
      groups: []
    },
    customize: {
      triggerProductOptionModal: false,
      enableBarcodeSystem: false,
      enableNotifications: true
    }
  }
});
const get$2 = () => {
  return store.get("printer");
};
const update$2 = (params) => {
  try {
    store.set("printer", params);
  } catch (error) {
    console.log(error);
    return false;
  }
  return true;
};
const PrinterService = {
  get: get$2,
  update: update$2
};
const initPrinterEvent = (window) => {
  electron.ipcMain.handle("getPrinters", async (event) => {
    const printers = await window.webContents.getPrintersAsync();
    return printers;
  });
  electron.ipcMain.handle("getPrinterSettings", async (event) => {
    return PrinterService.get();
  });
  electron.ipcMain.handle("setPrinterSettings", async (event, value) => {
    return PrinterService.update(value);
  });
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
    const invoiceHTML2 = DraftUtil.getInvoiceMain(
      invoiceHeight,
      jsonArgs.data.map((e) => e.value).join("")
    );
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
  electron.ipcMain.handle("multiPrint", async (event) => {
    return false;
  });
  electron.ipcMain.handle("viewInvoice", async (event) => {
    return false;
  });
};
const get$1 = (params) => {
  const users = store.get("users");
  return users.find((user) => user.id === params.id) || { id: params.id, isDarkMode: false };
};
const update$1 = (params) => {
  try {
    let users = store.get("users");
    let found = false;
    users = users.map((user) => {
      if (user.id === params.id) {
        user = params;
        found = true;
      }
      return user;
    });
    if (!found) {
      users.push(params);
    }
    store.set("users", users);
  } catch (error) {
    console.log(error);
    return false;
  }
  return true;
};
const UserService = {
  get: get$1,
  update: update$1
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
  electron.ipcMain.handle("getUser", async (event, value) => {
    return UserService.get({ id: value });
  });
  electron.ipcMain.handle("setUser", async (event, value) => {
    return UserService.update(value);
  });
};
const get = () => {
  return store.get("customize");
};
const update = (params) => {
  try {
    store.set("customize", params);
  } catch (error) {
    console.log(error);
    return false;
  }
  return true;
};
const CustomizeService = {
  get,
  update
};
const initCustomizeEvent = (window) => {
  electron.ipcMain.handle("getCustomizeSettings", () => {
    return CustomizeService.get();
  });
  electron.ipcMain.handle("setCustomizeSettings", (event, value) => {
    return CustomizeService.update(value);
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
  initCustomizeEvent();
  if (!electron.app.isPackaged) return;
  electron.app.on("window-all-closed", () => {
    if (process.platform !== "darwin") electron.app.quit();
  });
});
//# sourceMappingURL=index.js.map
