import React, {useState} from "react"
import "./cover.css"
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

export default ({ props }: { props: any }) => {
    const {
        id,
        Services,
        closeModal
    } = props;
    const [coverPrice, setCoverPrice] = useState(0)
    const [coverQuantity, setCoverQuantity] = useState(0)
    const [coverTitle, setCoverTitle] = useState("");
    const { t, i18n } = useTranslation();
    function handleAddCover(): void {
        const data = {
            "price": coverPrice,
            "quantity": coverQuantity,
            "title": coverTitle
        }
        Services.Order.cover(id,data)
        closeModal()
        Swal.fire({
            title:"Kuver eklendi",
            icon:"success"
        })
    }
   

    return (
        <div className="discount">
            <div className="descriptionTitle"> {t("description")}: </div>
            <div className="discountDescription">
                <input style={{color:"black"}} onChange={(event)=>setCoverTitle(event.target.value)} type="text"/>
            </div>
            <div className="descriptionTitle">{t("cover-amount")}: </div>

            <div className="discountAmount">
                <input 
                    type="number"
                    className="amount"
                    onChange={(event)=>setCoverPrice(Number(event.target.value))}
                    defaultValue={coverPrice}/>
                <div className="percent">
                    <div className="percent">TL</div>
                </div>
            </div>

            <div className="discountAmount">
                <input 
                    type="number"
                    className="amount"
                    onChange={(event) => setCoverQuantity(Number(event.target.value))}
                    defaultValue={coverQuantity}/>
                <div className="percent">
                    <div className="percent">{t("item-number")}</div>
                </div>
            </div>

            <div className="descriptionTitle">
            {t("total-coverage-amount")}: {coverQuantity * coverPrice}
            </div>

            <div
             onClick={() => handleAddCover()}
             className="submitDiscount">
                {t("submit")}
            </div>
        </div>
    )
}

