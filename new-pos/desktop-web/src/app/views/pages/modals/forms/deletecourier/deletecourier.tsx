import "./deletecourier.css";
import Swal from "sweetalert2";
import {Component} from "react";
import {PagePropCommonDocument} from "modules/views/pages/pageProps";
import Services from "../../../../../../services/index";

type PageProps = {} & PagePropCommonDocument;

type PageState = {
    selectedCourierId: string
};

class Deletecourier extends Component<PageProps, PageState> {
    constructor(props: any) {
        super(props);
        this.state = {
            selectedCourierId: ""
        };
    }

    handleDelete() {
        Swal.fire({
            title: this.props.router.t("delete-courier-question"),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: this.props.router.t("cancel"),
            confirmButtonText: this.props.router.t("yes"),
        }).then((result) => {
            if (result.isConfirmed) {
                Services.Delete.couriers({
                    courierId: this.state.selectedCourierId
                }).then(resData => {
                    if (resData.status) {
                        this.props.setGlobalData({
                            AllCourier: this.props.getGlobalData.AllCourier.filter(courier => courier._id != this.state.selectedCourierId)
                        }, () => {
                            this.props.closeModal();
                            Swal.fire({
                                title: this.props.router.t("success-delete-courier"),
                                icon: "success",
                            });
                        })
                    }
                });
            }
        });
    }

    handleCancel() {
        Swal.fire({
            icon: "question",
            title: this.props.router.t("cancel-question"),
            showCancelButton: true,
        }).then((result) => {
            if (result.isConfirmed) {
                this.props.closeModal();
            }
        });
    }

    render() {
        return (
            <div className="delete-courier">
                <div
                    style={{paddingLeft: "1vw", paddingRight: "1vw"}}
                    className="row"
                >
                    <div style={{width: "20%"}}>
                        {this.props.router.t("courier-name")}
                    </div>
                    <div style={{width: "80%"}}>
                        <select
                            style={{width: "100%", textAlign: "center"}}
                            placeholder={this.props.router.t("courier-name")}
                            value={this.state.selectedCourierId}
                            onChange={(val) => this.setState({selectedCourierId: val.target.value})}
                        >
                            {
                                this.props.getGlobalData.AllCourier.map(courier => (
                                    <option value={courier._id}>{courier.title}</option>
                                ))
                            }
                        </select>
                    </div>
                </div>
                <div
                    style={{paddingTop: "1vw"}}
                    className="row"
                >
                    <div
                        onClick={() => this.handleDelete()}
                        style={{height: "7vh", fontSize: "xx-large"}}
                        className="btn btn-success"
                    >
                        {this.props.router.t("delete")}
                    </div>
                    <div
                        onClick={() => this.handleCancel()}
                        style={{height: "7vh", fontSize: "xx-large"}}
                        className="btn btn-danger"
                    >
                        {this.props.router.t("cancel")}
                    </div>
                </div>
            </div>
        );
    }
}

export default Deletecourier;
