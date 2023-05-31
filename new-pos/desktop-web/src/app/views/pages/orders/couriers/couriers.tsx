import React, {Component} from "react";
import "./couriers.css";
import FuzzySearch from "fuzzy-search";
import Swal from "sweetalert2";
import {MODAL} from "constants/modalTypes";
import {PagePropCommonDocument} from "modules/views/pages/pageProps";
import PageOrder from "../index";
import Functions from "../../../../../config/global/functions";
import {GlobalStates} from "../../../../../config/global";

type PageState = {};

type PageProps = {
    pageOrder: PageOrder
} & PagePropCommonDocument;

class Courier extends Component<PageProps, PageState> {
    constructor(props: any) {
        super(props);
    }

    handleClick(courier: any) {
        Swal.fire({
            icon: "question",
            title:
                this.props.router.t("this-order") +
                courier.title +
                this.props.router.t("courier-named"),
            showCancelButton: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                GlobalStates.SelectedCourierId = courier._id;
                Functions.SendOrder(
                    this.props,
                    this.props.pageOrder
                );
            }
        });
    }

    newCourier() {
        this.props.openModal(MODAL.CREATE_COURIER);
    }

    deleteCourier() {
        this.props.openModal(MODAL.DELETE_COURIER);
    }

    render() {
        return (
            <div className="couriesContainer">
                {
                    this.props.getGlobalData.AllCourier.map((courier: any) => (
                        <article onClick={() => this.handleClick(courier)}>
                            <strong>{courier.title}</strong>
                        </article>
                    ))
                }
                <article
                    style={{backgroundColor: "blue"}}
                    onClick={() => this.newCourier()}
                >
                    <strong>{this.props.router.t("add-courier")}</strong>
                </article>
                <article
                    style={{backgroundColor: "blue"}}
                    onClick={() => this.deleteCourier()}
                >
                    <strong>{this.props.router.t("deletecourier")}</strong>
                </article>
            </div>
        );
    }
}

export default Courier;
