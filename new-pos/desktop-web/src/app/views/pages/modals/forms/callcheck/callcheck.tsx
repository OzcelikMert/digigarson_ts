import {Component} from "react";
import {MODAL} from "constants/modalTypes";
import {PagePropCommonDocument} from "modules/views/pages/pageProps";
import Services from "services/index";

export type CallCheckState = {
    slice: number;
    checks: any[];
    table: any;
    oldCheckUser: any;
    checkID: string;
};

type PageProps = {
    data: any;
} & PagePropCommonDocument;

class Callcheck extends Component<PageProps, CallCheckState> {
    constructor(props: any) {
        super(props);
        this.state = {
            slice: 20,
            checks: [],
            table: [],
            oldCheckUser: [],
            checkID: "",
        };
    }

    componentDidMount() {
        this.sets();
    }

    sets() {
        const getMyCase = Services.Get.case({}).data;
        this.setState({
            checks: getMyCase.checks.orderBy("id", "desc"),
        });
    }

    handleUpdateOldCheck = (checkID: string) => {
        this.setState(
            {
                checkID: checkID,
            },
            () => {
                this.props.openModal(MODAL.UPDATE_OLD_CHECK, this);
            }
        );
    };

    update = (checkID: string, user: any) => {
        this.setState({
            oldCheckUser: user,
        });
        this.handleUpdateOldCheck(checkID);
    };

    handleCheck = (checkID: any, table: any, user: any) => {
        this.setState(
            {
                table: table,
                oldCheckUser: user,
                checkID: checkID,
            },
            () => {
                this.props.openModal(MODAL.OLD_CHECK, this);
            }
        );
    };

    Checks = (check: any) => {
        let table = this.props.getGlobalData.AllTables.findSingle("_id", check.check.table);
        return (
            !table ? null :
                <tr className="checkInList">
                    <th style={{width: "10vw"}}>{check.check?.user}</th>
                    <th style={{width: "10vw"}}>{
                        table?.isSafeSales
                            ? this.props.router.t("case-sale")
                            : table?.title
                    }</th>
                    <th style={{width: "20vw"}}>
                        {new Date(check.check.createdAt).toLocaleTimeString()}
                    </th>
                    <th style={{width: "19vw"}}>
                        <button
                            style={{background: "blue"}}
                            onClick={() =>
                                this.handleCheck(check.check.id, table, check.check?.user)
                            }
                        >
                            {this.props.router.t("go-ticket")}
                        </button>
                        <button
                            onClick={() => this.update(check.check.id, check.check?.user)}
                        >
                            {this.props.router.t("update-product")}
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
                                        {this.props.router.t("user")}
                                    </th>
                                    <th style={{width: "10vw"}}>
                                        {this.props.router.t("table")}
                                    </th>
                                    <th style={{width: "20vw"}}>
                                        {this.props.router.t("creation-date")}
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
                    <div style={{height: "41vh", overflow: "auto"}}>
                        <table style={{width: "59vw"}} cellSpacing="0" cellPadding="1">
                            {this.state.checks
                                .slice(
                                    0,
                                    Math.min(this.state.slice, this.state.checks.length)
                                )
                                .map((check: any) => (
                                    <this.Checks check={check}/>
                                ))}
                        </table>
                        {this.state.slice < this.state.checks.length ? (
                            <tr style={{border: "none"}} className="checkInList">
                                <th style={{width: "20vw"}}></th>
                                <th
                                    style={{
                                        width: "20vw",
                                        display: "flex",
                                        flexDirection: "row",
                                    }}
                                >
                                    <button
                                        style={{background: "blue", height: "fit-content"}}
                                        onClick={() =>
                                            this.setState({
                                                slice: this.state.slice + 20,
                                            })
                                        }
                                    >
                                        {" "}
                                        {this.props.router.t("show-more")}{" "}
                                    </button>
                                    <button
                                        style={{background: "green", height: "fit-content"}}
                                        onClick={() =>
                                            this.setState({
                                                slice: this.state.checks.length,
                                            })
                                        }
                                    >
                                        {" "}
                                        {this.props.router.t("show-all")}{" "}
                                    </button>
                                </th>
                                <th style={{width: "19vw"}}></th>
                            </tr>
                        ) : null}
                    </div>
                    </tbody>
                </table>
                {/* <div className='changePriceButtons'>
          <button style={{ background: "green" }} onClick={() => console.log(myCase[0]?.checks)}> KAYDET </button>
          <button onClick={() => console.log(Context)}> İPTAL </button>
        </div> */}
            </>
        );
    }
}

export default Callcheck;
