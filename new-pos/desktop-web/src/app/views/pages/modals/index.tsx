import "./styles/modal.css";
import "./forms/checkout/checkout.css";
// forms
import Checkout from "./forms/checkout/checkout";
import OptionMenu from "./forms/optionmenu/optionmenu";
import Discount from "./forms/discount";
import Cover from "./forms/cover";
import PrinterSettings from "./printerSettings";
import Callcheck from "./forms/callcheck/callcheck";
import Oldcheck from "./forms/callcheck/oldcheck";
import Updatecheck from "./forms/callcheck/updatecheck";
import Createcustomer from "./forms/createcustomer/createcustomer";
import GetCustomer from "./forms/getcustomer/getcustomer";
import Createcourier from "./forms/createcourier/createcourier";
import Deletecourier from "./forms/deletecourier/deletecourier";
import Createcreditcustomer from "./forms/createcreditcustomer/createcreditcustomer";
import Getcreditcustomer from "./forms/getcreditcustomer/getcreditcustomer";
import Oldcreditcheck from "./forms/callcheck/oldcreditcheck";
import Cost from "./forms/cost/cost";
import Createcost from "./forms/createcost/createcost";
import ChangePrice from "./forms/changePrice";
import FindAdition from "./forms/findadition/findadition";
import TakeawayDetail from "./forms/takeawaydetail/takeawaydetail"
import Getcreditlist from "./forms/getcreditlist/getcreditlist";
import {Component, ReactNode} from "react";
import {PagePropCommonDocument} from "modules/views/pages/pageProps";
import Functions from "../../../../config/global/functions/index";

type PageState = {
    settingsOpen: boolean;
};

type PageProps = {
    isOpen: boolean
    type: any
    data?: any;
} & PagePropCommonDocument;

class Modals extends Component<PageProps, PageState> {
    constructor(props: any) {
        super(props);
    }

    forms = (props: any) => {
        let element: any;
        switch (props.modalName) {
            case "checkout":
                element = (
                    <Checkout
                        data={this.props.data}
                        {...this.props}
                    />
                );
                break;
            case "optionmenu":
                element = (
                    <OptionMenu
                        data={this.props.data}
                        {...this.props}
                    />
                );
                break;
            case "discount":
                element = (
                    <Discount
                        data={this.props.data}
                        {...this.props}
                    />
                );
                break;
            case "cover":
                element = (
                    <Cover
                        data={this.props.data}
                        {...this.props}
                    />
                );
                break;
            case "printersettings":
                element = (
                    <PrinterSettings
                        {...this.props}
                    />
                );
                break;
            case "callcheck":
                element = (
                    <Callcheck
                        data={this.props.data}
                        {...this.props}
                    />
                );
                break;
            case "oldcheck":
                element = (
                    <Oldcheck
                        data={this.props.data}
                        {...this.props}
                    />
                );
                break;
            case "updateoldcheck":
                element = (
                    <Updatecheck
                        data={this.props.data}
                        {...this.props}
                    />
                );
                break;
            case "createcustomer":
                element = (
                    <Createcustomer
                        {...this.props}
                    />
                );
                break;
            case "getcustomer":
                element = (
                    <GetCustomer
                        data={this.props.data}
                        {...this.props}
                    />
                );
                break;
            case "createcourier":
                element = <Createcourier
                    {...this.props}
                />;
                break;
            case "deletecourier":
                element = <Deletecourier
                    {...this.props}
                />;
                break;
            case "createcreditcustomer":
                element = (
                    <Createcreditcustomer
                        data={this.props.data}
                        {...this.props}
                    />
                );
                break;
            case "getcreditcustomer":
                element = (
                    <Getcreditcustomer
                        data={this.props.data}
                        {...this.props}
                    />
                );
                break;
            case "getcreditlist":
                element = (
                    <Getcreditlist
                        data={this.props.data}
                        {...this.props}
                    />
                );
                break;
            case "oldcreditcheck":
                element = (
                    <Oldcreditcheck
                        data={this.props.data}
                        {...this.props}
                    />
                );
                break;
            case "cost":
                element = (
                    <Cost
                        data={this.props.data}
                        {...this.props}
                    />
                );
                break;
            case "createcost":
                element = (
                    <Createcost
                        data={this.props.data}
                        {...this.props}
                    />
                );
                break;
            case "changePrice":
                element = (
                    <ChangePrice
                        data={this.props.data}
                        {...this.props}
                    />
                );
                break;
            case "findadition":
                element = <FindAdition
                    data={this.props.data}
                    {...this.props}
                />;
                break;
            case "takeawaydetail":
                element = (
                    <TakeawayDetail
                        data={this.props.data}
                        {...this.props}
                    />
                );
                break;
        }
        return element;
    };

    render(): ReactNode {
        return this.props.isOpen ? (
            <>
                <div
                    className={
                        this.props.isOpen
                            ? "modalCover open"
                            : "modalCover"
                    }
                    onClick={() => this.props.closeModal()}
                />
                <div
                    className={
                        this.props.isOpen
                            ? "modalContainer open"
                            : "modalContainer close"
                    }
                    style={this.props.type.dimensions}
                >
                    <div className="modalHeader">
                        <div className="title">
                            {this.props.router.t(
                                this.props.type.form
                            )}
                        </div>
                        <div
                            className="close"
                            onClick={() => this.props.closeModal()}
                        >
                            <strong>X</strong>
                        </div>
                    </div>
                    <div className="modalBody">
                        {
                            // @ts-ignore
                            <this.forms
                                {...this.props}
                                modalName={this.props.type.form}
                            />
                        }
                    </div>
                </div>
            </>
        ) : null;
    }
}

export default Modals;
