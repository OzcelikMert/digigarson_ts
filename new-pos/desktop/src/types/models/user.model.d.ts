type IUserModel = {
    id: number;
    token: string;
    isDarkMode: boolean;
    printerSettings: IUserPrinterSettingsModel;
}

type IUserPrinterSettingsModel = {
    id: number;
    name: string;
}