import {Component} from "react";
import {BlockPicker} from "react-color";
import "./buttonRight.css";
import {PagePropCommonDocument} from "modules/views/pages/pageProps";
import {GlobalStates} from "config/global";
import Table from "./table";
import LocalStorages from "../../../../../../config/global/localStorages";

type PageState = {
    currentColor: any;
};

type PageProps = {
    pageOrderTable: Table
} & PagePropCommonDocument;

class ColorPicker extends Component<PageProps, PageState> {
    constructor(props: any) {
        super(props);
        this.state = {
            currentColor: GlobalStates.LastClickedButtonElement?.style.backgroundColor,
        };
    }

    handleColorChange = (color: any) => {
        this.setState({
            currentColor: color.hex,
        });

        if (GlobalStates.LastClickedButtonElement) {
            GlobalStates.LastClickedButtonElement.style.background = color.hex;
        }

        console.log(GlobalStates.LastClickedButton)
        GlobalStates.LastClickedButton.color = color.hex;
        console.log(GlobalStates.LastClickedButton)


        LocalStorages.Buttons.set({
            takeawayButtons: GlobalStates.TakeawayButtons,
            rightButtons: GlobalStates.RightButtons,
            caseSaleButtons: GlobalStates.CaseSaleButtons,
            bottomButtons: GlobalStates.BottomButtons
        })
    };

    handleColorPickSave = (event: any) => {
        this.props.pageOrderTable.setState({
            isColorPickerFired: false
        })
    };

    render() {
        return (
            <div>
                <div
                    className="colorPickerWrapper"
                    style={{
                        position: "absolute",
                        zIndex: "10",
                        top: GlobalStates.LastClickedButtonPos.y + 65,
                        left: GlobalStates.LastClickedButtonPos.x,
                    }}
                >
                    <div
                        onClick={(e) => this.handleColorPickSave(e)}
                        style={{
                            position: "absolute",
                            color: "white",
                            fontSize: "1.2rem",
                            fontWeight: "bold",
                            zIndex: "259",
                            border: "1px solid white",
                            width: "fit-content",
                        }}
                    >
                        {this.props.router.t("submit")}
                    </div>
                    <BlockPicker
                        color={this.state.currentColor}
                        onChange={this.handleColorChange}
                    />
                </div>
            </div>
        );
    }
}

export default ColorPicker;
