import {ICustomer} from "../../../services/old/interfaces/"

interface GlobalStateDocument {
    isFastPayment: boolean
    ProductsToBeMoving: any[]
    SelectedPaymentTypeId: number
    LastClickedButton: any
    Ticks: any,
    CurrentModal: any,
    AllTables: any,
    MyCase: any,
    AllCheck: any,
    ModalOpen: boolean,
    CurrentTable: any,
    Type: string,
    CustomerId: string,
    SelectedCourier: number,
    LastClickedButtonPos: any,
    LastClickedButtonElement?: HTMLButtonElement,
    RightButtons: any[],
    BottomButtons: any[],
    TakeawayButtons: any[],
    CaseSaleButtons: any[],
    Cash: boolean,
    SelectedTableId: string
    SelectedCourierId: string
}

export {
    GlobalStateDocument
}