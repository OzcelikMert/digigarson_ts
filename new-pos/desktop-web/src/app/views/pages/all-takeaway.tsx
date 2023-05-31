import {Component} from "react";
import IntlTelInput from "react-intl-tel-input";
import {payment_types} from "constants/paymentTypes";
import {PagePropCommonDocument} from "../../../modules/views/pages/pageProps";
import {MODAL} from "constants/modalTypes";

interface IPhone {
    number: string;
    country: any;
}

interface ISearchParameters {
    phone: IPhone;
    name: string;
    paidStatus: number;
    dates: {
        start: any;
        end: any;
    };
}

type PageProps = {} & PagePropCommonDocument;

type PageState = {
    totalCount: number;
    takeAway: any[];
    searchParams: ISearchParameters;
    searchTakeaway: any;
};

class PageAllTakeAway extends Component<PageProps, PageState> {
    constructor(props: any) {
        super(props);
        this.state = {
            totalCount: 0,
            takeAway: [],
            searchParams: {
                phone: {
                    number: "",
                    country: "",
                },
                name: "",
                paidStatus: -1,
                dates: {
                    start: new Date().toLocaleDateString("en-CA"),
                    end: new Date().toLocaleDateString("en-CA"),
                },
            },
            searchTakeaway: [],
        };
    }

    componentDidMount() {
        this.sets();
    }

    sets() {
        this.setState(
            (state: PageState) => {
                state.takeAway = [];

                this.props.getGlobalData.AllTakeaway.forEach((takeaway: any) => {
                        let customer = this.props.getGlobalData.AllCustomers.findSingle("id", takeaway.customer.customer_id);
                        state.takeAway.push({...takeaway, gsm_no: customer.gsm_no});
                    }
                );

                state.searchTakeaway = state.takeAway;
                state.totalCount = this.state.searchTakeaway.length;
                return state;
            },
            () => {
                this.filter();
            }
        );
    }

    filter() {
        this.setState((state: PageState) => {
            state.searchTakeaway = state.takeAway
                .filter(
                    (takeAway) =>
                        !takeAway.gsm_no || takeAway.gsm_no.toString().search(state.searchParams.phone.number) >
                        -1
                )
                .filter(
                    (takeAway) =>
                        takeAway.customer.full_name.search(state.searchParams.name) > -1
                )
                .filter(
                    (takeAway) =>
                        state.searchParams.paidStatus == -1 ||
                        takeAway.is_it_paid == state.searchParams.paidStatus
                )
                .filter((takeAway) => {
                    const date = new Date(takeAway.createdAt).toLocaleDateString("en-CA");
                    return (
                        date >= state.searchParams.dates.start &&
                        date <= state.searchParams.dates.end
                    );
                });
            state.totalCount = this.state.searchTakeaway.length;
            return state;
        });
    }

    searchParameters(data: any) {
        this.setState(
            (state: PageState) => {
                state.searchParams = Object.assign(state.searchParams, data);
                return state;
            },
            () => {
                this.filter();
            }
        );
    }

    selectCourier = (id: any) => {
        let selectedCourier = this.props.getGlobalData.AllCourier.findSingle("_id", id);

        if (selectedCourier?.title == undefined) {
            return "Kurye silinmiş";
        } else if (selectedCourier?.title == null) {
            return "a";
        } else {
            return selectedCourier?.title;
        }
    };

    render() {
        return (
            <>
                <div className="takeaway-header">
                    <div className="left" style={{width: "100%"}}>
                        <div className="operations">
                            <input
                                type="date"
                                max={new Date().toLocaleDateString("en-CA")}
                                value={this.state.searchParams.dates.start}
                                onChange={(event: any) =>
                                    this.searchParameters({
                                        dates: {
                                            start: event.target.value,
                                            end:
                                                this.state.searchParams.dates.end > event.target.value
                                                    ? this.state.searchParams.dates.end
                                                    : event.target.value,
                                        },
                                    })
                                }
                                className="datePicker"
                                style={{width: "28vw"}}
                            />
                            <input
                                type="date"
                                min={this.state.searchParams.dates.start}
                                max={new Date().toLocaleDateString("en-CA")}
                                value={this.state.searchParams.dates.end}
                                onChange={(event: any) =>
                                    this.searchParameters({
                                        dates: {
                                            ...this.state.searchParams.dates,
                                            end: event.target.value,
                                        },
                                    })
                                }
                                className="datePicker"
                                style={{width: "28vw"}}
                            />
                            <button
                                className="col1-2"
                                style={{width: "41vw"}}
                                onClick={() =>
                                    this.props.router.navigate("/takeaway", {replace: true})
                                }
                            >
                                {this.props.router.t("back")}
                            </button>
                        </div>
                        <div className="search">
                            <table style={{width: "100%"}}>
                                <thead>
                                <tr>
                                    <th>{this.props.router.t("phone-number")}</th>
                                    <th>{this.props.router.t("name")}</th>
                                    <th>{this.props.router.t("payment-status")}</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>
                                        <IntlTelInput
                                            preferredCountries={["tr"]}
                                            format={true}
                                            telInputProps={{
                                                maxLength: 14,
                                            }}
                                            value={this.state.searchParams?.phone?.number}
                                            onPhoneNumberChange={(isValid, number, country) => {
                                                this.searchParameters({
                                                    phone: {isValid, number, country},
                                                });
                                            }}
                                            style={{color: "black", width: "100%"}}
                                            inputClassName="telInput"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            onChange={(event: any) =>
                                                this.searchParameters({
                                                    ...this.state.searchParams,
                                                    name: event.target.value,
                                                })
                                            }
                                            style={{color: "black"}}
                                        />
                                    </td>
                                    <td>
                                        <select
                                            defaultValue={-1}
                                            style={{color: "black", width: "100%", height: "3vw"}}
                                            onChange={(event: any) =>
                                                this.searchParameters({
                                                    ...this.state.searchParams,
                                                    paidStatus: Number(event.target.value),
                                                })
                                            }
                                        >
                                            <option value={-1}>{this.props.router.t("all")}</option>
                                            <option value={1}>{this.props.router.t("paid")}</option>
                                            <option value={0}>
                                                {this.props.router.t("not-paid")}
                                            </option>
                                        </select>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="takeaway-body">
                    <div style={{textAlign: "center"}}>
                        {this.props.router.t("total-takeaway-quantity")}{" "}
                        {this.state.totalCount}
                    </div>
                    <table>
                        <thead>
                        <tr>
                            <th>{this.props.router.t("phone-number")}</th>
                            <th>{this.props.router.t("name")}</th>
                            <th>{this.props.router.t("courier-name")}</th>
                            <th>{this.props.router.t("creation-date")}</th>
                            <th>{this.props.router.t("paid")}</th>
                            <th>{this.props.router.t("payment-type")}</th>
                            <th>{this.props.router.t("check")}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.searchTakeaway.map((data: any) => {
                            console.log(data)
                            return (
                                <tr style={{cursor: "pointer"}}>
                                    <th>{data.gsm_no}</th>
                                    <th>{data.customer.full_name}</th>
                                    <th>
                                        {data.courier ? this.selectCourier(data.courier) : ""}
                                    </th>
                                    <th>
                                        {new Date(data.createdAt).toLocaleDateString("en-CA")}{" "}
                                        {new Date(data.createdAt).toLocaleTimeString("en-US", {
                                            hour: "numeric",
                                            minute: "numeric",
                                            hour12: false,
                                        })}
                                    </th>
                                    <th
                                        style={{
                                            backgroundColor: data.is_it_paid ? "green" : "red",
                                        }}
                                    >
                                        {data.is_it_paid
                                            ? this.props.router.t("yes")
                                            : this.props.router.t("no")}
                                    </th>
                                    <th>
                                        {
                                            data.payments[0]?.type
                                            ? payment_types[Number(data.payments[0]?.type) - 1]
                                            : payment_types[Number(data.defaultPaymentType) - 1]
                                        }
                                    </th>
                                    <th>
                                        <button onClick={() => this.props.openModal(MODAL.TAKEAWAY_DETAIL, data)}>
                                            {this.props.router.t("detail")}
                                        </button>
                                    </th>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </>
        );
    }
}

export default PageAllTakeAway;
