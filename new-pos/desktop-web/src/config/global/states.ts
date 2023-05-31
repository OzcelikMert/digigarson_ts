import {MODAL} from "constants/modalTypes";
import {GlobalStateDocument} from "modules/config/global/states";

let GlobalStates: GlobalStateDocument = {
    isFastPayment: false,
    ProductsToBeMoving: [],
    LastClickedButton: {},
    SelectedPaymentTypeId: 0,
    Ticks: [],
    CurrentModal: {},
    AllTables: [
        {
            orders: {},
        },
    ],
    MyCase: [
        {
            balance: [],
            checks: [],
            start_balance: [],
        },
    ],
    AllCheck: [
        {
            order: [],
        },
    ],
    ModalOpen: false,
    CurrentTable: {},
    CustomerId: "",
    Type: "",
    SelectedCourier: 0,
    LastClickedButtonPos: {
        y: "",
        x: "",
    },
    RightButtons: [],
    BottomButtons: [],
    TakeawayButtons: [],
    CaseSaleButtons: [],
    Cash: false,
    SelectedTableId: "",
    SelectedCourierId: ""
};

export default GlobalStates;