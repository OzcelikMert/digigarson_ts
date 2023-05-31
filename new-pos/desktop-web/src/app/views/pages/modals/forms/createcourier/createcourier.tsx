import "./createcustomer.css";
import IntlTelInput from "react-intl-tel-input";
import "react-intl-tel-input/dist/main.css";
import Swal from "sweetalert2";
import {Component} from "react";
import {PagePropCommonDocument} from "modules/views/pages/pageProps";
import Services from "services/index";
import Variable from "../../../../../../library/variable";

interface ICourier {
    title: string;
    number: string;
}

interface IPhone {
    isValid: boolean;
    number: string;
    country: any;
}

type PageProps = {} & PagePropCommonDocument;

type PageState = {
    courier: ICourier;
    phone: IPhone;
};

class Createcourier extends Component<PageProps, PageState> {
    constructor(props: any) {
        super(props);
        this.state = {
            courier: {
                title: "",
                number: "",
            },
            phone: {
                isValid: false,
                number: "",
                country: "",
            },
        };
    }

    handleSave() {
        const data = this.state.courier;
        if (!Variable.isEmpty(data.title)) {
            if (this.state.phone.isValid) {
                data.number = Variable.clear(this.state.phone.number);
                Services.Post.couriers(data).then((resData) => {
                    if (resData.status) {
                        this.props.setGlobalData({
                            AllCourier: this.props.getGlobalData.AllCourier.concat(resData.data)
                        }, () => {
                            this.props.closeModal();
                            Swal.fire({
                                icon: "success",
                                title: this.props.router.t("added-new-courier"),
                            });
                        })
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: this.props.router.t("error-try-again"),
                        });
                    }
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: this.props.router.t("valid-phone"),
                });
            }
        } else {
            Swal.fire({
                icon: "error",
                title: this.props.router.t("fill-fields"),
            });
        }
    }

    handleCancel = () => {
        Swal.fire({
            icon: "question",
            title: this.props.router.t("cancel-question"),
            showCancelButton: true,
        }).then((result) => {
            if (result.isConfirmed) {
                this.props.closeModal();
            }
        });
    };

    render() {
        return (
            <div className="create-courier">
                <div
                    style={{paddingLeft: "1vw", paddingRight: "1vw", marginBottom: "2vw", marginTop: "1vw"}}
                    className="row"
                >
                    <div style={{width: "20%"}}>{this.props.router.t("phone")}</div>
                    <div style={{width: "80%"}}>
                        <IntlTelInput
                            preferredCountries={["tr"]}
                            format={true}
                            telInputProps={{
                                maxLength: 14,
                            }}
                            value={this.state.phone?.number}
                            onPhoneNumberChange={(isValid, number, country) => {
                                this.setState({
                                    phone: {
                                        isValid,
                                        number,
                                        country,
                                    },
                                });
                            }}
                            style={{color: "black", width: "100%"}}
                        />
                    </div>
                </div>
                <div
                    style={{paddingLeft: "1vw", paddingRight: "1vw"}}
                    className="row"
                >
                    <div style={{width: "20%"}}>
                        {this.props.router.t("courier-name")}
                    </div>
                    <div style={{width: "80%"}}>
                        <input
                            type={"text"}
                            placeholder={this.props.router.t("courier-name")}
                            value={this.state.courier.title}
                            onChange={(event) =>
                                this.setState({
                                    courier: {...this.state.courier, title: event.target.value},
                                })
                            }
                        />
                    </div>
                </div>
                <div
                    style={{marginTop: "3vw"}}
                    className="row"
                >
                    <div
                        onClick={() => this.handleSave()}
                        style={{height: "8vh", fontSize: "xx-large"}}
                        className="btn btn-success"
                    >
                        {this.props.router.t("submit")}
                    </div>
                    <div
                        onClick={() => this.handleCancel()}
                        style={{height: "8vh", fontSize: "xx-large"}}
                        className="btn btn-danger"
                    >
                        {this.props.router.t("cancel")}
                    </div>
                </div>
            </div>
        );
    }
}

export default Createcourier;
