import {Component} from "react";
import {MODAL} from "constants/modalTypes";
import "./getcreditlist.css";
import {PagePropCommonDocument} from "modules/views/pages/pageProps";
import Services from "services/index";

type PageState = {
    ticks: any[];
    showingTicks: any[]
    checkId: string;
};

type PageProps = {
    data: {
        tickCustomerId: string
    }
} & PagePropCommonDocument;

class Getcreditlist extends Component<PageProps, PageState> {
    constructor(props: any) {
        super(props);
        const ticks = Services.Get.tick({
            tickCustomerId: this.props.data.tickCustomerId
        }).data;
        console.log(ticks)
        this.state = {
            ticks: ticks,
            showingTicks: ticks,
            checkId: ""
        };
    }

    handleCheck(checkID: any) {
        this.setState({
            checkId: checkID
        }, () => {
            this.props.openModal(MODAL.OLD_CREDIT_CHECK, {
                checkId: this.state.checkId,
                tickCustomerId: this.props.data.tickCustomerId
            });
        })


    }

    Ticks = (props: any) => {
        return (
            <tr className="checkInList">
                <th style={{width: "10vw"}}>{new Date(props.createdAt).toLocaleString()}</th>
                <th style={{width: "20vw"}}>{props.debt.toFixed(2)} TL</th>
                <th style={{width: "19vw"}}>
                    <button
                        style={{background: "blue"}}
                        onClick={() => this.handleCheck(props.checkId)}
                    >
                        {this.props.router.t("detail")}
                    </button>
                </th>
            </tr>
        );
    };

    render() {
        return (
            <>
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
                                        {this.props.router.t("date")}
                                    </th>
                                    <th style={{width: "20vw"}}>
                                        {this.props.router.t("total-ticks")}
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
                    <div style={{height: "46vh", overflow: "auto"}}>
                        <table style={{width: "59vw"}} cellSpacing="0" cellPadding="1">
                            {
                                this.state.showingTicks.orderBy("_id", "desc").map((tick: any, index) => (
                                        <this.Ticks {...tick} key={index}/>
                                    )
                                )
                            }
                        </table>
                    </div>
                    </tbody>
                </table>
            </>
        );
    }
}

export default Getcreditlist;
