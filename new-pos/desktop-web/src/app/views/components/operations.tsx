import Swal from "sweetalert2";
import "../../../assets/app/styles/tables.css";
import DateTime from "./dateTime";

import {MODAL} from "../../../constants/modalTypes";
import {Component} from "react";
import {PagePropCommonDocument} from "modules/views/pages/pageProps";
import {
    getGlobalAuthData,
    GlobalLocalStorages, setGlobalAuthData,
} from "config/global";
import Functions from "../../../config/global/functions/index";
import Services from "services/index";
import PageIndex from "../pages";
import Printer from "../../../config/global/printers";

type PageState = {
    settingsOpen: boolean;
};

type PageProps = {
    pageIndex: PageIndex
} & PagePropCommonDocument;

class Operations extends Component<PageProps, PageState> {
    constructor(props: any) {
        super(props);
        this.state = {
            settingsOpen: false,
        };
    }

    caseStatePopup(t: any): void {
        let getMyCase = Services.Get.case({}).data
        console.log(getMyCase)
        let getCost = Services.Get.costs().data
        getMyCase &&
        Swal.fire({
            title: `<b>${t("case-status")}</b>`,
            html: `
                        <b>${t("tickets-paid")}</b>: ${
                getMyCase?.checks.length
            }</br>
                        <b>${t("opening-amount")}</b>: ${
                            getMyCase?.start_balance[0]?.amount 
            } ${getMyCase.start_balance[0]?.currency}<br/>
                        <b>${t(
                "total-amount"
            )}</b>: ${this.getTotalAmount(getMyCase).toFixed(2)} TL</br>
                        <b>${t(
                "remaining-amount"
            )}</b>: ${this.getTotalPayment(getMyCase, getCost).toFixed(2)} TL</br>
                        <b>Masraf</b>: ${this.getTotalCost(getCost).toFixed(2)} TL
                            `,
            confirmButtonText: t("close"),
        });
    }

     getTotalAmount(myCase: any) {
        let sum = 0;
        let sum_payment = 0;
        let start_balance = myCase?.start_balance[0]?.amount 
        myCase.balance.forEach(
            (payment: any) => (sum_payment += Number(payment.amount))
        );
        sum = Number(start_balance) + Number(sum_payment);
        return sum;
    }

    getTotalPayment(myCase: any, cost: any) {
        let sum = 0;
        let sum_payment = 0;
        let start_balance = myCase.start_balance[0]?.amount   
        let sum_cost = 0;
        let today = new Date().toLocaleDateString();
        myCase.balance.forEach(
            (payment: any) => (sum_payment += Number(payment.amount))
        );
        cost.forEach((cost: any) => {
            let costDate = new Date(cost?.createdAt).toLocaleDateString();
            if (today == costDate) {
                sum_cost += cost.expense_amount;
            }
        });
        sum = Number(start_balance) + Number(sum_payment) - Number(sum_cost);
        return sum;
    }

    getTotalCost(cost: any) {
        let sum = 0;
        let today = new Date().toLocaleDateString();
        cost.forEach((cost: any) => {
            let costDate = new Date(cost?.createdAt).toLocaleDateString();
            if (today == costDate) {
                sum += cost.expense_amount;
            }
        });
        return sum;
    }

    createBrowserWindow(url: string) {
        window.require("electron").ipcRenderer.send("new", url);
    }

    handleNewTab = (perm: string) => {
        if (Functions.checkPerm(perm)) {
            switch (perm) {
                case "509":
                    this.createBrowserWindow("https://manager.digigarson.com/sign-in");
                    break;
                case "510":
                    this.createBrowserWindow("https://analysis.digigarson.com/sign-in");
                    break;
                default:
                    break;
            }
        } else {
            Swal.fire({
                icon: "error",
                title: this.props.router.t("not-permission"),
            });
        }
    };

    signOut() {
        GlobalLocalStorages.Token.delete();
        GlobalLocalStorages.User.delete();
        this.props.router.navigate("sign-in", {replace: true});
    }

    safeSales() {
        let table = this.props.getGlobalData.AllTables.findSingle("isSafeSales", true);
        if (table) {
            this.props.pageIndex.handleTableClick(table);
        }
    }

    getXReport() {
        if (this.props.getGlobalData.caseId) {
            Swal.fire({
                title: this.props.router.t("pleaseWait").toCapitalizeCase(),
                html: this.props.router.t("uploading") + "...",
                showConfirmButton: false,
                showCancelButton: false,
                allowOutsideClick: false,
                willOpen(popup: HTMLElement) {
                    Swal.showLoading()
                }
            });

            let response = Services.Get.case({
                caseId: this.props.getGlobalData.caseId
            });
            if (response.status) {
                Printer.Report.printReport(response.data, "X");
                setTimeout(() => {
                    Swal.fire({
                        icon: "success",
                        title: this.props.router.t("x-report"),
                        html: this.props.router.t("printedXReport"),
                    });
                }, 1000)
            }
            return;
        }
        Swal.fire({
            icon: "info",
            title: this.props.router.t("not-report"),
        });
    }

    caseClose() {
        const message = Functions.checkForOpenTable()
            ? this.props.router.t("there-are-open-tables") + "." + this.props.router.t("close-case-description")
            : this.props.router.t("close-case-description");
        Swal.fire({
            title: `${message}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: this.props.router.t("yes"),
            cancelButtonText: this.props.router.t("cancel"),
        }).then((result) => {
            if (result.isConfirmed) {
                let resCaseData = Services.Get.case({caseId: this.props.getGlobalData.caseId});
                if (!resCaseData.status) return;

                if (resCaseData.data.payments.length > 0) {
                    Printer.Report.printReport(resCaseData.data, "Z");
                    Services.Put.case({
                        isClose: true,
                    }).then(resData => {
                        if (resData.status) {
                            Swal.fire({
                                title: this.props.router.t("case-closed"),
                                icon: "success",
                            });
                            window.location.href = "/";
                        }
                    });
                } else {
                    Swal.fire({
                        title: this.props.router.t("report-warning"),
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: this.props.router.t("yes"),
                        cancelButtonText: this.props.router.t("cancel"),
                    }).then((result: any) => {
                        if (result.isConfirmed) {
                            Services.Put.case({
                                isClose: true,
                            }).then(resData => {
                                if (resData.status) {
                                    Swal.fire({
                                        title: this.props.router.t("case-closed"),
                                        icon: "success",
                                    });
                                    window.location.href = "/";
                                }
                            });
                        }
                    });
                }
            }
        });
    }

    render() {
        return (
            <section className="Operations">
                <div className="headerBarOperations">
                    <div className="in">
                        <div className="profile">
                            <div>
                                <span>{getGlobalAuthData().user.name}</span> <br/>
                                <span>{getGlobalAuthData().user.lastname}</span>
                            </div>
                        </div>
                        <div className="date">
                            <DateTime {...this.props}/>
                        </div>
                    </div>
                </div>
                <div className="Buttons">
                    <article
                        onClick={() => {
                            this.props.openModal(MODAL.CALL_CHECK)
                        }}
                    >
                        {this.props.router.t("call-check")}
                    </article>
                    <article
                        onClick={() =>
                            this.props.router.navigate("/takeaway", {replace: true})
                        }
                    >
                        {this.props.router.t("take-away")}
                    </article>
                    <article onClick={() => this.caseStatePopup(this.props.router.t)}>
                        {" "}
                        {this.props.router.t("case-status")}{" "}
                    </article>
                    <article
                        onClick={() => this.safeSales()}
                    >
                        {this.props.router.t("case-sale")}
                    </article>
                    <article
                        style={{background: "blue"}}
                        onClick={() => this.getXReport()}
                    >
                        {this.props.router.t("x-report")}
                    </article>
                    <article onClick={() => this.caseClose()}>
                        {this.props.router.t("close-case")}
                    </article>
                    <article
                        style={{width: "40%"}}
                        onClick={() => this.props.openModal(MODAL.GET_CREDIT_CUSTOMER)}
                    >
                        {this.props.router.t("ticks")}
                    </article>
                    <article
                        style={{width: "40%"}}
                        onClick={() => this.props.openModal(MODAL.COST)}
                    >
                        {this.props.router.t("cost")}
                    </article>
                    <article
                        style={{width: "40%"}}
                        onClick={() => this.handleNewTab("509")}
                    >
                        {this.props.router.t("manage")}
                    </article>
                    <article
                        style={{width: "40%"}}
                        onClick={() => this.handleNewTab("510")}
                    >
                        {this.props.router.t("analysis")}
                    </article>
                    <article
                        style={{
                            width: "80%",
                            background: this.state.settingsOpen ? "green" : "slategrey",
                        }}
                        onClick={() =>
                            this.setState({
                                settingsOpen: !this.state.settingsOpen,
                            })
                        }
                    >
                        {this.props.router.t("settings")}
                    </article>
                    {this.state.settingsOpen ? (
                        <>
                            <article
                                style={{width: "70%", background: "slategrey"}}
                                onClick={() =>
                                    this.props.openModal(MODAL.PRINTER_SETTING)
                                }
                                data-toggle="modal"
                                data-target="#globalModal"
                            >
                                {this.props.router.t("printer-setting")}
                            </article>

                            <article
                                style={{
                                    width: "70%",
                                    background:
                                        localStorage.getItem("language") == "en"
                                            ? "green"
                                            : "slategrey",
                                }}
                                onClick={() => (
                                    localStorage.setItem("language", "en"),
                                        this.props.router.i18n.changeLanguage("en")
                                )}
                            >
                                {this.props.router.t("english")}
                            </article>

                            <article
                                style={{
                                    width: "70%",
                                    background:
                                        localStorage.getItem("language") == "tr"
                                            ? "green"
                                            : "slategrey",
                                }}
                                onClick={() => (
                                    localStorage.setItem("language", "tr"),
                                        this.props.router.i18n.changeLanguage("tr")
                                )}
                            >
                                {this.props.router.t("turkish")}
                            </article>
                        </>
                    ) : null}
                </div>
                <div className="bButtons">
                    <article
                        onClick={() => this.signOut()}
                    >
                        {this.props.router.t("sign-out")}
                    </article>
                </div>
            </section>
        );
    }
}

export default Operations;
