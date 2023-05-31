import React, {useState} from "react"
import "./discount.css"
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

export default ({ props }: { props: any }) => {
    const {
        currentTable,
        Services,
        modalOpen, closeModal,
    } = props;
    const [type, setType] = useState("percent")
    const [discountAmount, setDiscountAmount] = useState(0)
    const { t, i18n } = useTranslation();


    const handleAddDiscount = () => {
        const data = {
            "type": type === "percent" ? 0 : 1,
            "amount": discountAmount
        }
        Services.Order.discount(currentTable._id,data);
        closeModal()
        Swal.fire({
            title: t("discount-success"),
            icon:"success"
        })
    }
    return (
        <div className="discount">
            <div className="descriptionTitle"> {t("description")}: </div>
            <div className="discountDescription">
                <div contentEditable="true"></div>
            </div>
            <div className="descriptionTitle"> {t("discount-rate")}: </div>
            <div className="discountAmount">
                <input 
                    onChange={(e) => setDiscountAmount(Number(e.target.value))}
                    type="number"
                    className="amount"
                    defaultValue={discountAmount}/>
                <div className="percent">
                    <div 
                        style={{backgroundColor: type === "percent" ? "red" : "rgb(70, 0, 0)" }}
                        onClick={() => setType("percent")}
                        className="percent">%</div>
                    <div 
                        style={{fontSize:"1.05vw", backgroundColor: type === "amount" ? "red" : "rgb(70, 0, 0)", wordWrap: "break-word", whiteSpace: "nowrap", wordBreak: "break-word"}}
                        onClick={() => setType("amount")}
                        className="amount">Miktar</div>
                </div>
            </div>
            <div
             onClick={() => handleAddDiscount()}
             className="submitDiscount">
               {t("submit")}
            </div>
        </div>
    )
}


