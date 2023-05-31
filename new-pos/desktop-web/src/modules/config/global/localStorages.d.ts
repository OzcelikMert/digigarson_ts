interface LocalStoragesButtonDocument {
    rightButtons: any,
    bottomButtons: any,
    takeawayButtons: any,
    caseSaleButtons: any,
}

interface LocalStoragesPrinterGroupDocument {
    id: any,
    printer: string,
    name: string,
    categories: string[]
}

interface LocalStoragesGeneralPrinterDocument {
    printer: string,
    name: string
}

export {LocalStoragesButtonDocument, LocalStoragesPrinterGroupDocument, LocalStoragesGeneralPrinterDocument}