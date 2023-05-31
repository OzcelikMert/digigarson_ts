import {Component} from "react";
import Printer from "../../../config/global/printers/index";
import Operations from "../components/operations";
import Sections from "../components/sections";
import "../../../assets/app/styles/tables.css";
import Table from "../components/tables";
import Swal from "sweetalert2";
import "../../../assets/app/styles/order.css";
import {PagePropCommonDocument} from "../../../modules/views/pages/pageProps";
import { GlobalStates } from "../../../config/global";
import Services from "../../../services/index";

type PageState = {
    currentSection: any;
    caseId: string
    modal: {
        isModalOpen: boolean
        currentModal: any,
        data: any
    }
};

type PageProps = {} & PagePropCommonDocument;

class PageIndex extends Component<PageProps, PageState> {
    constructor(props: any) {
        super(props);
        this.state = {
            currentSection: "all",
            caseId: "",
            modal: {
                isModalOpen: false,
                currentModal: null,
                data: null
            }
        };
    }

    componentDidUpdate(prevProps: Readonly<PageProps>) {
        this.clearGlobalStates();
    }

    componentDidMount() {
        this.clearGlobalStates();
    }

    clearGlobalStates(isForce?: boolean) {
        if (
            isForce ||
            GlobalStates.Type != "moveProduct"
        ) {
            GlobalStates.CustomerId = "";
            GlobalStates.SelectedCourierId = "";
            GlobalStates.SelectedPaymentTypeId = 0;
            GlobalStates.SelectedTableId = "";
            GlobalStates.Type = "";
            GlobalStates.CurrentModal = {};
        }
    }

    handleMoveProduct(targetTableId: string) {
        let orderId: string[] = [];
        GlobalStates.ProductsToBeMoving.forEach(order => {
            console.log(order);
            orderId.push(order._id);
        })
        Services.Put.moveOrder({
            currentTable: GlobalStates.SelectedTableId,
            targetTable: targetTableId,
            orderIds: orderId,
        }).then(resData => {
            if (resData.status) {
                let allTables = this.props.getGlobalData.AllTables.map(table => {
                    if (table._id == targetTableId) {
                        table.orders = table.orders.concat(GlobalStates.ProductsToBeMoving);
                    } else if (table._id == GlobalStates.SelectedTableId) {
                        table.orders = table.orders.filter((order: any) => !orderId.includes(order._id))
                    }
                    return table;
                })

                let findTable = this.props.getGlobalData.AllTables.findSingle("_id", GlobalStates.SelectedTableId);
                if (findTable) {
                    if (findTable.orders.findMulti("isDeleted", false)?.length === 0) {
                        allTables.map(table => {
                            if (table._id == targetTableId) {
                                table.cover = findTable.cover;
                                table.discount = findTable.discount;
                                table.payments = findTable.payments;
                                table.busy = true;
                            } else if (table._id == GlobalStates.SelectedTableId) {
                                table.cover = [];
                                table.discount = [];
                                table.payments = [];
                                table.busy = false;
                            }
                            return table;
                        })
                    }
                }

                this.props.setGlobalData({
                    AllTables: allTables
                }, () => {
                    Swal.fire({
                        title: this.props.router.t("products-moved"),
                        icon: "success",
                    });
                    GlobalStates.ProductsToBeMoving = [];
                    this.clearGlobalStates(true);
                    this.handleTableClick(null, targetTableId);
                })
            } else {
                Swal.fire({
                    title: this.props.router.t("auth-err"),
                    icon: "error",
                }).then(() => this.props.router.navigate("/table/" + GlobalStates.SelectedTableId, {replace: true}));
            }
        })
    }

    handleTableClick(table: any, tableId?: string) {
        if (tableId) table = this.props.getGlobalData.AllTables.findSingle("_id", tableId);

        if (GlobalStates.Type == "moveProduct") {
            if (GlobalStates.SelectedTableId == table._id) {
                Swal.fire({
                    title: "Iptal Islemi",
                    html: "Masa tasima islemini iptal etmek istediginizden emin misiniz?",
                    icon: "question",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    cancelButtonText: this.props.router.t("cancel"),
                    confirmButtonText: this.props.router.t("yes"),
                }).then((result) => {
                    if (result.isConfirmed) {
                        GlobalStates.ProductsToBeMoving = [];
                        this.clearGlobalStates(true);
                        this.handleTableClick(null, table._id);
                    }
                });
            } else {
                this.handleMoveProduct(table._id)
            }
            return;
        }

        GlobalStates.CurrentTable = table;
        GlobalStates.SelectedTableId = table._id;

        this.props.router.navigate("/table/" + table._id, {replace: true});
    };

    getTableBusyRatio() {
        let busy = 0;
        if (this.props.getGlobalData.AllTables.length > 0) {
            this.props.getGlobalData.AllTables.forEach((table: any) => {
                if (table.busy) busy++;
            });
            return Math.floor((busy / this.props.getGlobalData.AllTables.length) * 100);
        }
        return 0;
    }

    printReport(type: string) {
        if (GlobalStates.MyCase[0].data.balance.length > 0) {
            let resData = Services.Get.case({
                caseId: GlobalStates.MyCase[0]?.data._id,
            });
            if (resData.status) {
                Printer.Report.printReport(resData.data, type);
            }
        } else {
            Swal.fire({
                icon: "info",
                title: this.props.router.t("not-report"),
            });
        }
    }

    render() {
        return (
            <div className="Home">
                <div className="TableAndSections">
                    <main className="Tables">
                        <div className="headerBar">
                            <div>
                                {this.props.router.t("occupancy")}: {this.getTableBusyRatio()}%
                            </div>
                            <div className="TableEdit">
                                <div>
                                    {this.props.router.t("edit-tables")}
                                </div>
                            </div>
                        </div>
                        <section>
                            {
                                this.props.getGlobalData.AllTables.length > 0
                                    ? (
                                        this.props.getGlobalData.AllTables?.filter(table => this.state.currentSection == "all" || this.state.currentSection == table.section).map((table, index) =>
                                            !table.isSafeSales && !table.isHomeDeliverySales
                                                ? <Table
                                                    key={index}
                                                    router={this.props.router}
                                                    onClick={() => this.handleTableClick(table)}
                                                    tableTitle={table.title}
                                                    sectionTitle={this.props.getGlobalData.Sections?.findSingle("_id", table.section)?.title}
                                                    createdAt={table.createdAt}
                                                    updatedAt={table.updatedAt}
                                                    isSelected={GlobalStates.SelectedTableId == table._id}
                                                    isBusy={table.orders.length > 0}
                                                    isPrinted={table.isPrint?.status}
                                                /> : null
                                        )
                                    ) : (
                                        <div className="caseClosed">{this.props.router.t("no-tables")}</div>
                                    )}
                        </section>
                    </main>
                    <div style={{display: "flex", flexDirection: "row"}}>
                        {
                            [{
                                title: this.props.router.t("all"),
                                _id: "all"
                            }].concat(this.props.getGlobalData.Sections).map(item =>
                                <Sections
                                    isSelected={this.state.currentSection === item._id}
                                    sectionName={item.title}
                                    {...this.props}
                                    onClick={() => this.setState({currentSection: item._id})}
                                />
                            )
                        }
                    </div>
                </div>
                <Operations
                    {...this.props}
                    pageIndex={this}
                />
            </div>
        );
    }
}

export default PageIndex;
