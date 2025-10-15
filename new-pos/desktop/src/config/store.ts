import StoreDefault from 'electron-store';
import type ElectronStore from 'electron-store';

const Store: typeof ElectronStore = (StoreDefault as any).default || StoreDefault;

export const store = new Store<IStore>({
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
        showQuantityName: true,
      },
      groups: []
    },
    customize: {
      triggerProductOptionModal: false,
      enableBarcodeSystem: false,
      enableNotifications: true,
    }
  }
});