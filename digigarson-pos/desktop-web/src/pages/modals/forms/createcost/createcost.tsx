import './createcost.css'
//import IntlTelInput from 'react-intl-tel-input';
//import 'react-intl-tel-input/dist/main.css';
import { createCustomer } from 'services/interfaces/customer';
import Swal from 'sweetalert2';
import { useEffect, useState } from 'react';
import discount from '../discount';
import { useTranslation } from "react-i18next";

export default function Createcost({ props }: { props: any }) {
    const { t, i18n } = useTranslation();
    const {
        closeModal,
        Services, costs, setCosts
    } = props;



    const [cost, setCost] = useState<any>({
        title: '',
        expense_type: 0,
        currency: 'TL',
        expense_amount: 0,
        description: '',
        expense_time: new Date()
    })

    const handleChange = (value: string, type: string) => {
        let temp = JSON.parse(JSON.stringify(cost));
        switch (type) {
            case "title":
                temp.title = value;
                break;
            case "cost-amount":
                temp.expense_amount = value;
                break;
            case "cost-type":
                temp.expense_type = value;
                break;
            case "description":
                temp.description = value;
                break;
            default:
                break;
        }
        setCost(temp);   
    }
    const handleSave = () => {
        const data = cost;
        if(data.description.replace(/\s/g, '').length < 10)
        {
            Swal.fire({
                icon: "error",
                title: t("error-cost-description")
            })
        }
        else if(data.title.replace(/\s/g, '').length > 0 && data.description.replace(/\s/g, '').length > 0) {
            Services.Cost.create(data)
            closeModal()
            Swal.fire({
                icon: "success",
                title: t("cost-success")
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
                <div style={{ width: "20%", alignItems:"center" }}>{t("cost-name")}</div>
                <div style={{ width: "80%" }}>
                    <input
                        type={"text"}
                        onChange={(event) => (handleChange(event?.target.value, "title"))} />
                </div>
            </div>
            <div style={{ paddingLeft: "1vw", paddingRight: "1vw", marginTop:"5px" }} className="row">
                <div style={{ width: "20%" }}>{t("cost-amount")}</div>
                <div style={{ width: "80%" }}>
                    <input
                        style={{ width:"10vw" }}
                        type={"text"}
                        onChange={(event) => (handleChange(event?.target.value, "cost-amount"))} />
                    <div>
                        <div style={{marginLeft:"19px", alignItems:"center" }}>{t("payment-type")}</div>
                        <input
                            style={{ marginLeft:"10px" }}
                            type={"text"}
                            onChange={(event) => (handleChange(event?.target.value, "cost-type"))} />
                    </div>
                </div>
            </div>
            <div style={{ paddingLeft: "1vw", paddingRight: "1vw", marginTop:"5px" }} className="row">
                <div style={{ width: "20%" }}>{t("cost-description")}</div>
                <div style={{ width: "80%" }}>
                    <input
                        type={"text"}
                        onChange={(event) => (handleChange(event?.target.value, "description"))} />
                </div>
            </div>
            <div style={{ paddingLeft: "1vw", paddingRight: "1vw", paddingTop: "1vw" }} className="row">
                <div onClick={() => handleSave()} style={{ height: "6vh", fontSize: "large" }} className='butn green'>{t("submit")}</div>
                <div onClick={() => handleCancel()} style={{ height: "6vh", fontSize: "large" }} className='butn red'>{t("cancel")}</div>
            </div>
        </div>
    )
}