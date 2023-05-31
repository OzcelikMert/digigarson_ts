import './createcreditcustomer.css'
//import IntlTelInput from 'react-intl-tel-input';
//import 'react-intl-tel-input/dist/main.css';
import { createCustomer } from 'services/interfaces/customer';
import Swal from 'sweetalert2';
import { useEffect, useState } from 'react';
import discount from '../discount';
import { useTranslation } from "react-i18next";

export default function Createcreditcustomer({ props }: { props: any }) {
    const { t, i18n } = useTranslation();
    const {
        closeModal,
        Services,
    } = props;



    const [tick, setTick] = useState<any>({
        name: '',
        phoneNum: 0,
        taxAdmin: '',
        taxNum: 0,
        discount: [
            {
                type: 0,
                price: 0
            }
        ]
    })


    const handleChange = (value: string, type: string) => {
        let temp = JSON.parse(JSON.stringify(tick));
        switch (type) {
            case "name":
                temp.name = value;
                break;
            case "phone-number":
                temp.phoneNum = value;
                break;
            case "discount":
                temp.discount[0].price = value;
                break;
            default:
                temp.discount[0].type = (value == "percent") ? 0 : 1;
                break;
        }
        setTick(temp);
    }
    const handleSave = () => {
        const data = tick;
        if (data.name.replace(/\s/g, '').length > 0 && data.phoneNum.replace(/\s/g, '').length > 0) {
            Services.Tick.create(data)
            closeModal()
            Swal.fire({
                icon: "success",
                title: t("customer-success")
            })
        }
        else {
            Swal.fire({
                icon: "error",
                title: t("fill-fields")
            })
        }
    }
    const handleCancel = () => {

        Swal.fire({
            icon: "question",
            title: t("cancel-question"),
            showCancelButton: true
        }).then((result) => {
            if (result.isConfirmed) {
                closeModal()
            }
        })
    }
    return (
        <div className="create-credit-customer">
            <div style={{ paddingLeft: "1vw", paddingRight: "1vw", paddingTop: "2vw" }} className="row">
                <div style={{ width: "20%" }}>{t("customer-name")}</div>
                <div style={{ width: "80%" }}>
                    <input
                        type={"text"}
                        onChange={(event) => (handleChange(event?.target.value, "name"))} />
                </div>
            </div>
            <div style={{ paddingLeft: "1vw", paddingRight: "1vw" }} className="row">
                <div style={{ width: "20%" }}>{t("phone")}</div>
                <div style={{ width: "80%" }}>
                    <input
                        type={"text"}
                        onChange={(event) => (handleChange(event?.target.value, "phone-number"))} />
                </div>
            </div>
            <div style={{ paddingLeft: "1vw", paddingRight: "1vw" }} className="row">
                <div style={{ width: "20%" }}>{t("discount")}</div>
                <div style={{ width: "80%", textAlign: "center" }}>
                    <input
                        style={{ marginRight: "1vw" }}
                        min={0}
                        type={"number"}
                        onChange={(event) => (handleChange(event?.target.value, "discount"))} />
                    <div>
                        <div
                            style={{ marginRight: "1vw", fontSize: "1.5rem", textAlign: 'center', alignItems: "center", backgroundColor: tick.discount[0].type == 0 ? "red" : "rgb(70, 0, 0)" }}
                            onClick={() => handleChange("percent", "discount-type")}>%</div>
                        <div
                            style={{ color: "white", alignItems: "center", textAlign: "center", fontSize: "1.05vw", backgroundColor: tick.discount[0].type == 1 ? "red" : "rgb(70, 0, 0)", wordWrap: "break-word", whiteSpace: "nowrap", wordBreak: "break-word" }}
                            onClick={() => handleChange("amount", "discount-type")}>{t("quantity")}</div>
                    </div>
                </div>
            </div>
            <div style={{ paddingLeft: "1vw", paddingRight: "1vw", paddingTop: "1vw" }} className="row">
                <div onClick={() => handleSave()} style={{ height: "6vh", fontSize: "large" }} className='butn green'>{t("submit")}</div>
                <div onClick={() => handleCancel()} style={{ height: "6vh", fontSize: "large" }} className='butn red'>{t("cancel")}</div>
            </div>
        </div>
    )
}