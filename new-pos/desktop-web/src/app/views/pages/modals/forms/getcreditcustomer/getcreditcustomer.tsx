import {Component} from "react";
import {MODAL} from "constants/modalTypes";
import "./getcreditcustomer.css";
import FuzzySearch from "fuzzy-search";
import {PagePropCommonDocument} from "modules/views/pages/pageProps";

type PageState = {
    showingCreditList: any;
    customerId: string;
};

type PageProps = {
    data: any;
} & PagePropCommonDocument;

class Getcreditcustomer extends Component<PageProps, PageState> {
    constructor(props: any) {
        super(props);
        this.state = {
            showingCreditList: this.props.getGlobalData.Ticks,
            customerId: "",
        };
    }

    handleCheck(id: any) {
        this.setState(
            {
                customerId: id,
            },
            () => {
                this.props.openModal(MODAL.GET_CREDIT_LIST, {
                    tickCustomerId: id
                });
            }
        );
    }

    Ticks = () => {
        return this.state.showingCreditList.map((item: any) => (
            <tr className="checkInList">
                <th style={{width: "10vw"}}>{item.name}</th>
                <th style={{width: "20vw"}}>{item.phoneNum}</th>
                <th style={{width: "20vw"}}>{item.totalAmount.toFixed(2)} TL</th>
                <th style={{width: "19vw"}}>
                    <button
                        style={{background: "blue"}}
                        onClick={() => this.handleCheck(item._id)}
                    >
                        {this.props.router.t("detail")}
                    </button>
                </th>
            </tr>
        ));
    };

    searchTick(event: any, type: string) {
        let tick: any = this.props.getGlobalData.Ticks;
        const tickSearcher = new FuzzySearch(tick, [type], {
            caseSensitive: false,
        });
        const result = tickSearcher.search(event.target.value.trim());

        this.setState({
            showingCreditList: result,
        });
    }

    render() {
        return (
            <>
                <div className="searchcost">
                    <table>
                        <thead>
                        <tr>
                            <th>{this.props.router.t("phone-number")}</th>
                            <th>{this.props.router.t("name")}</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            {["phoneNum", "name"].map((type: string) => (
                                <td>
                                    <input
                                        style={{color: "black", borderRadius: "16px"}}
                                        onChange={(event) => this.searchTick(event, type)}
                                    />
                                </td>
                            ))}
                        </tr>
                        </tbody>
                    </table>
                </div>
                <table cellSpacing="0" cellPadding="0">
                    <thead>
                    <tr>
                        <td>
                            <table
                                style={{width: "59vw"}}
                                cellSpacing="0"
                                cellPadding="1"
                            >
                                <tr style={{color: "white", background: "grey"}}>
                                    <th style={{width: "10vw"}}>
                                        {this.props.router.t("user")}
                                    </th>
                                    <th style={{width: "20vw"}}>
                                        {this.props.router.t("phone-number")}
                                    </th>
                                    <th style={{width: "20vw"}}>
                                        {this.props.router.t("total")}
                                    </th>
                                    <th style={{width: "19vw"}}>
                                        {this.props.router.t("actions")}
                                    </th>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    </thead>
                    <tbody>
                    {console.log()}
                    <div style={{height: "34vh", overflow: "auto"}}>
                        <table style={{width: "59vw"}} cellSpacing="0" cellPadding="1">
                            {<this.Ticks/>}
                        </table>
                    </div>
                    </tbody>
                </table>
            </>
        );
    }
}

export default Getcreditcustomer;
