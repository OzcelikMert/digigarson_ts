type IPrinterModel = {
    cancelPrinterName: string;
    safePrinterName: string;
    title: string;
    settings: IPrinterSettingsModel;
    groups: IPrinterGroupModel[];
}

type IPrinterSettingsModel = {
    callerId: false;
    payyedPrint: false;
    cancelInvoice: false;
    showUserName: boolean;
    showQuantityName: boolean;
}

type IPrinterGroupModel = {
    id: number;
    name: string;
    printerName: string;
    categories: number[];
}