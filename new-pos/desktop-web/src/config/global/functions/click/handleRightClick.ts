import GlobalStates from "config/global/states";
import {
    buttonNameList,
    caseSaleButtonNameList,
    takeAwayButtonNameList,
} from "constants/checkButtons";
import Swal from "sweetalert2";
import Table from "../../../../app/views/pages/orders/check/components/table";
import LocalStorages from "../../localStorages";
import Providers from "../../../../app/providers";
import {PagePropCommonDocument} from "../../../../modules/views/pages/pageProps";

const handleRightClick = (
    pageOrderTable: Table,
    event: any,
    i: number,
    button: any,
    type: string,
    commonProp: PagePropCommonDocument
) => {
    const x = event?.target?.offsetLeft;
    const y = event?.target?.offsetTop;

    GlobalStates.LastClickedButton = button;
    GlobalStates.LastClickedButtonPos = {x, y};
    GlobalStates.LastClickedButtonElement = event.target;

    Swal.fire({
        title: commonProp.router.t("select-button"),
        input: "select",
        html: `
            <div buttonId="${i}" id="colorPickButton" class="colorPickButton">
                ${commonProp.router.t("change-color")}
            </div>
        `,
        inputOptions: GlobalStates.CustomerId
            ? takeAwayButtonNameList
            : GlobalStates.CurrentTable.isSafeSales
                ? caseSaleButtonNameList
                : buttonNameList,
        showCancelButton: true,
    }).then((result: any) => {
        if (result.dismiss == "cancel" || result.value === undefined) {
        } else {
            if (type == "bottom") GlobalStates.BottomButtons[i].name = result.value;
            else {
                if (GlobalStates.CustomerId) GlobalStates.TakeawayButtons[i].name = result.value;
                else if (GlobalStates.CurrentTable.isSafeSales) GlobalStates.CaseSaleButtons[i].name = result.value;
                else GlobalStates.RightButtons[i].name = result.value;
            }
            LocalStorages.Buttons.set({
                takeawayButtons: GlobalStates.TakeawayButtons,
                rightButtons: GlobalStates.RightButtons,
                caseSaleButtons: GlobalStates.CaseSaleButtons,
                bottomButtons: GlobalStates.BottomButtons
            })
            commonProp.toggleState();
        }
    });
    let colorPickerButton = document.getElementById("colorPickButton");
    if (colorPickerButton) {
        colorPickerButton.addEventListener("click", () => {
            Swal.close();
            pageOrderTable.setState({
                isColorPickerFired: true
            })
        });
    }
};

export default handleRightClick;
