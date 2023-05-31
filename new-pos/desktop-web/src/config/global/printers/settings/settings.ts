import LocalStorages from "../../localStorages";

export enum SaveSettings {
    General,
    Groups,
}

export const PrinterDefaultColumnHeight = 2;

export default class Settings {
    static CurrentPrinter: string | null = null;
    static CurrentSafePrinterName: string | null = null;
    static Groups: any[] = [];
    static IsPreview: boolean = false;

    static saveSettings(type: SaveSettings) {
        if (type === SaveSettings.General) {
            LocalStorages.GeneralPrinter.set({
                printer: this.CurrentPrinter || "",
                name: this.CurrentSafePrinterName || "",
            })
        }

        if (type === SaveSettings.Groups) {
            LocalStorages.PrinterGroups.set(this.Groups);
        }
    }

    static loadSettings() {
        const printerSettings = LocalStorages.GeneralPrinter.get;

        if (printerSettings) {
            this.CurrentPrinter = printerSettings.printer;
            this.CurrentSafePrinterName = printerSettings.name;
        }

        this.Groups = LocalStorages.PrinterGroups.get;
    }

    static get settings() {
        return {
            printer: this.CurrentPrinter,
            preview: this.IsPreview,
        };
    }

    static payload_with_settings(data: any) {
        return {
            data,
            settings: this.settings,
        };
    }
}
