import FuzzySearch from "fuzzy-search";
import {Component} from "react";
import {MODAL} from "constants/modalTypes";
import Printer from "../../../config/global/printers/index";
import "../../../assets/app/styles/customers.css";
import Swal from "sweetalert2";
import {PagePropCommonDocument} from "../../../modules/views/pages/pageProps";
import V from "../../../library/variable";
import {getGlobalAuthData} from "config/global";
import {GlobalStates} from "../../../config/global";

type PageState = {
    customerId: string;
    customers: any[];
    selectedCustomer: any;
    addressIndex: number;
    searchCustomer: any;
};

type PageProps = {} & PagePropCommonDocument;

class PageCustomer extends Component<PageProps, PageState> {
    constructor(props: any) {
        super(props);
        this.state = {
            customerId: "",
            customers: [],
            selectedCustomer: {
                id: "",
                title: "",
                description: "",
                credit_amount: "",
                currency: "",
                branchName: "" || "Digigarson",
                address: [],
            },
            addressIndex: 0,
            searchCustomer: [],
        };
    }

    componentDidMount() {
        this.sets();
    }

    sets() {
        this.setState({
            customers: this.props.getGlobalData.AllCustomers,
            searchCustomer: this.props.getGlobalData.AllCustomers,
        });
    }

    searchCustomer(event: any, type: string) {
        let value = (event.target.value) ? event.target.value.toString() : "";
        this.setState({
            searchCustomer: this.state.customers.filter(customer => customer[type] && customer[type].toString().toLowerCase().search(value.toString().toLowerCase()) > -1),
        });
    }

    createCustomer() {
        this.props.openModal(MODAL.CREATE_CUSTOMER);
    }

    findCheck(id: any) {
        this.setState(
            {
                customerId: id,
            },
            () => {
                this.props.openModal(MODAL.FIND_ADITION, this);
            }
        );
    }

    customerPopup(t: any, id: any): void {
        let customer = this.props.getGlobalData.AllCustomers.find(
            (customer: any) => customer.id == id
        );
        customer &&
        Swal.fire({
            title: `<b>${t("customer-detail")}</b>`,
            html: `
                <b>${t("customer-name")}</b>: ${customer.title}<br/>
                <b>${t("address")}</b>: ${customer.address[0].address} - ${
                customer.address[0].title
            }</br> 
                <b>${t("creation-date")}</b>: ${new Date(
                customer.createdAt
            ).toLocaleTimeString()}</br>
                <b>${t("customer-loan")}</b>: ${customer.credit_amount} ${
                customer.currency
            }<br/>
                <b>${t("description")}</b>: ${customer.description}<br/>
                <b>${t("phone-number")}</b>: ${customer.gsm_no}<br/>
                `,
            confirmButtonText: t("close"),
        });
    }

    edit() {
        // this.props.openModal(MODAL.EDIT_CUSTOMER);
    }

    callerList(): void {
        throw new Error("Function not implemented.");
    }

    selectCustomer() {
        GlobalStates.CustomerId = this.state.selectedCustomer.id;
        let table = this.props.getGlobalData.AllTables.findSingle("isHomeDeliverySales", true);
        GlobalStates.CurrentTable = table;
        GlobalStates.SelectedTableId = table._id;
        this.props.router.navigate("/table/" + table._id, {replace: true});
    }

    render() {
        return (
            <>
                <div className="Home">
                    <div className="search-show">
                        <div className="search">
                            <table>
                                <thead>
                                <tr>
                                    <th>{this.props.router.t("phone-number")}</th>
                                    <th>{this.props.router.t("name")}</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    {["gsm_no", "title"].map((type: string) => (
                                        <td>
                                            <input
                                                style={{color: "black", borderRadius: "16px"}}
                                                onChange={(event) => this.searchCustomer(event, type)}
                                            />
                                        </td>
                                    ))}
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="show">
                            <table>
                                <thead>
                                <tr>
                                    <th style={{width: "8vw"}}>
                                        {this.props.router.t("phone-number")}
                                    </th>
                                    <th style={{width: "7vw"}}>
                                        {this.props.router.t("name")}
                                    </th>
                                    <th style={{width: "50vw"}}>
                                        {this.props.router.t("adress")}
                                    </th>
                                    <th style={{width: "7vw"}}>
                                        {this.props.router.t("note")}
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {this.state.searchCustomer.map((customer: any) => {
                                    if (customer.address.length > 1) {
                                        return (
                                            <>
                                                {customer.address.map(
                                                    (address: any, index: number) => (
                                                        <tr
                                                            style={
                                                                customer.id ==
                                                                this.state.selectedCustomer?.id &&
                                                                index == this.state.addressIndex
                                                                    ? {background: "blue"}
                                                                    : undefined
                                                            }
                                                            onClick={() => {
                                                                this.setState({
                                                                    selectedCustomer: customer,
                                                                    addressIndex: 0,
                                                                });
                                                            }}
                                                        >
                                                            <th style={{width: "10vw"}}>
                                                                {customer.gsm_no}
                                                            </th>
                                                            <th style={{width: "10vw"}}>
                                                                {customer.title}
                                                            </th>
                                                            <th style={{width: "40vw"}}>
                                                                {address.address}
                                                            </th>
                                                            <th style={{width: "10vw"}}>
                                                                {customer.description}
                                                            </th>
                                                        </tr>
                                                    )
                                                )}
                                            </>
                                        );
                                    } else {
                                        return (
                                            <tr
                                                style={
                                                    customer.id == this.state.selectedCustomer?.id
                                                        ? {background: "blue"}
                                                        : undefined
                                                }
                                                onClick={() => {
                                                    this.setState({
                                                        selectedCustomer: customer,
                                                        addressIndex: 0,
                                                    });
                                                }}
                                            >
                                                <th style={{width: "10vw"}}>{customer.gsm_no}</th>
                                                <th style={{width: "10vw"}}>{customer.title}</th>
                                                <th style={{width: "40vw"}}>
                                                    {customer.address[0].address}
                                                </th>
                                                <th style={{width: "10vw"}}>
                                                    {customer.description}
                                                </th>
                                            </tr>
                                        );
                                    }
                                })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="customer-operations">
                        <button
                            disabled={V.isEmpty(this.state.selectedCustomer.id)}
                            onClick={() => this.selectCustomer()}
                        >
                            {this.props.router.t("choose-customer")}
                        </button>
                        <button
                            disabled={!V.isEmpty(this.state.selectedCustomer.id)}
                            onClick={() => this.createCustomer()}
                        >
                            {this.props.router.t("new-customer")}
                        </button>
                        <button
                            disabled={V.isEmpty(this.state.selectedCustomer.id)}
                            onClick={() => this.findCheck(this.state.selectedCustomer?.id)}
                        >
                            {this.props.router.t("find-ticket")}
                        </button>
                        <button
                            disabled={V.isEmpty(this.state.selectedCustomer.id)}
                            onClick={() =>
                                this.customerPopup(
                                    this.props.router.t,
                                    this.state.selectedCustomer?.id
                                )
                            }
                        >
                            {this.props.router.t("customer-account")}
                        </button>
                        <button
                            disabled={V.isEmpty(this.state.selectedCustomer.id)}
                            onClick={() =>
                                Printer.Customer.printCustomer({
                                    name: this.state.selectedCustomer?.title,
                                    gsm_no: this.state.selectedCustomer.gsm_no,
                                    description: this.state.selectedCustomer?.description,
                                    customerCredit:
                                        this.state.selectedCustomer?.credit_amount +
                                        this.state.selectedCustomer?.currency,
                                    address: this.state.selectedCustomer?.address?.map(
                                        (a: any) => {
                                            return a.address;
                                        }
                                    ),
                                    title: this.state.selectedCustomer?.address?.map((a: any) => {
                                        return a.title;
                                    }),
                                })
                            }
                        >
                            {this.props.router.t("customer-print")}
                        </button>
                        <button
                            disabled={V.isEmpty(this.state.selectedCustomer.id)}
                            onClick={() => this.edit()}
                        >
                            {this.props.router.t("edit-customer")}
                        </button>
                        <button
                            disabled={!V.isEmpty(this.state.selectedCustomer.id)}
                            onClick={() => this.callerList()}
                        >
                            {this.props.router.t("caller-list")}
                        </button>
                        <button
                            disabled={V.isEmpty(this.state.selectedCustomer.id)}
                            onClick={() => {
                                this.setState({selectedCustomer: false, addressIndex: 0});
                            }}
                        >
                            {this.props.router.t("clear-selection")}
                        </button>
                        <button
                            disabled={false}
                            onClick={() =>
                                this.props.router.navigate("/takeaway", {replace: true})
                            }
                        >
                            {this.props.router.t("back")}
                        </button>
                        <button
                            disabled={false}
                            onClick={() => this.props.router.navigate("/", {replace: true})}
                        >
                            {this.props.router.t("close")}
                        </button>
                    </div>
                </div>
            </>
        );
    }
}

export default PageCustomer;
