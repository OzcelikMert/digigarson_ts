export default class Print {
  static ipcRenderer: any = window.require("electron").ipcRenderer;
  static Printers: any = Print.ipcRenderer.sendSync("printers")

  static print(data: any, height?: number, printer?: string) {
    if (printer) data.settings.printer = printer;
    data.settings.height = 20 + Number(height);
      Print.ipcRenderer.send("print", JSON.stringify(data));
  }
}
