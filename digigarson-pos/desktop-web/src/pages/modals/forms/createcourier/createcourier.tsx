import './createcustomer.css'
import IntlTelInput from 'react-intl-tel-input';
import 'react-intl-tel-input/dist/main.css';
import { createCustomer, phone } from 'services/interfaces/customer';
import Swal from 'sweetalert2';
import { useState } from 'react';
import { useTranslation } from "react-i18next";
export default function Createcourier({ props }: { props: any }) {
    const { t, i18n } = useTranslation();
    const {
        currentTable, setCurrentTable,
        rightButtons, setRightButtons,
        bottomButtons, setBottomButtons,
        takeawayButtons, setTakeawayButtons,
        category, setCategory,
        productSearchText, setProductSearchText,
        categories, setCategories,
        modalOpen, setModalOpen,
        currentModal, setCurrentModal,
        lastClickedButtonPos, setLastClickedButtonPos,
        lastClickedButton, setLastClickedButton,
        lastClickedButtonElement, setLastClickedButtonElement,
        currentCategory, selectCurrentCategory,
        productsFromCategory, setProductsFromCategory,
        products, setProducts,
        selectedCategory, setSelectedCategory,
        productsInCheck, setProductsInCheck,
        allchecked, setAllchecked,
        productsInOrder, setProductsInOrder,
        paidOrders, setPaidOrders,
        tobepaid, setToBePaid,
        check, setCheck,
        discounts, setDiscounts,
        totalAmount, setTotalAmount,
        currentCheckLeft, setCurrentCheckLeft,
        multiplier, setMultiplier,
        calculator, setCalculator,
        colorPickerFired, setColorPickerFired,
        time, setTime,
        optionList, setOptionList,
        clickedProduct, setClickedProduct,
        payments, setPayments,
        coverList, setCoverList,
        discountList, setDiscountList,
        cash, setChash,
        productToBeSendFirst, setProductToBeSendFirst,
        couriers, setCouriers,
        selectedCourier, setSelectedCourier,
        syncCheck,
        createUUID,
        closeModal,
        handleCheckAll,
        handleChecked,
        handleCategoryClick,
        handleCategorySearchChange,
        handleProductChange,

        SendOrder,
        handleRightClick,
        productName,


        buttonNameList,
        BranchContext,
        Services,
        Fetchs,
        id,
        customerId
    } = props;
    const [courier, setCourier] = useState<any>({title:"", number:""})
    const [phone, setPhone] = useState<phone>()
    const handleSave = () => {
        if(!courier)
            return
        const data = courier;
        if (data.title.replace(/\s/g, '').length > 0 ) {
            if (phone?.isValid) {
                data.number = phone.number.replace(/\s/g, '');
                Services.Couriers.create(data).then(()=>{
                setModalOpen(false)
                setCourier({ title: "", number: "" })
                setPhone({...phone, isValid:false, number:""})
                Fetchs.Couriers.handle(Services.Couriers.get())
                Swal.fire({
                    icon: "success",
                    title: t("added-new-courier")
                })
                }).catch(() => {
                    Swal.fire({
                        icon: "error",
                        title: t("error-try-again")
                    })
                })

            }
            else {
                Swal.fire({
                    icon: "error",
                    title: t("valid-phone")
                })
            }
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
                setModalOpen(false)
            }
        })
    }
    return (
        <div className="create-courier">
            <div style={{ paddingLeft: "1vw", paddingRight: "1vw" }} className="row">
                <div style={{ width: "20%" }}>{t("phone")}</div>
                <div style={{ width: "80%" }}>
                    <IntlTelInput
                        preferredCountries={['tr']}
                        format={true}
                        telInputProps={{
                            maxLength: 14,
                        }}
                        value={phone?.number}
                        onPhoneNumberChange={(isValid, number, country) => {
                            setPhone({ isValid, number, country })
                        }}
                        style={{ color: "black", width: "100%" }}
                    />
                </div>
            </div>
            <div style={{ paddingLeft: "1vw", paddingRight: "1vw" }} className="row">
                <div style={{ width: "20%" }}>{t("courier-name")}</div>
                <div style={{ width: "80%" }}>
                    <input
                        type={"text"}
                        placeholder= {t("courier-name")}
                        value={courier.title}
                        onChange={(event) => setCourier({...courier, title:event.target.value})} />
                </div>
            </div>
            <div style={{ paddingLeft: "1vw", paddingRight: "1vw" }} className="row">
                <div onClick={() => handleSave()} style={{ height: "6vh", fontSize: "xx-large" }} className='butn green'>{t("submit")}</div>
                <div onClick={() => handleCancel()} style={{ height: "6vh", fontSize: "xx-large" }} className='butn red'>{t("cancel")}</div>
            </div>
        </div>
    )
}


