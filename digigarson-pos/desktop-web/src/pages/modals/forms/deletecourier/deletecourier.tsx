import './deletecourier.css'
import IntlTelInput from 'react-intl-tel-input';
import 'react-intl-tel-input/dist/main.css';
import { createCustomer, phone } from 'services/interfaces/customer';
import Swal from 'sweetalert2';
import { useEffect, useState } from 'react';
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

    const [courier, setCourier] = useState<any>({title:""})
    const [phone, setPhone] = useState<phone>()

    useEffect(() => (!Fetchs.Couriers.data && Fetchs.Couriers.handle(Services.Couriers.get()), undefined), [Fetchs.Couriers.data])
    useEffect(() => Fetchs.Couriers.data && setCouriers(Fetchs.Couriers.data), [Fetchs.Couriers.data])

    const handleChange = (value: string, type: string) => {
        let temp = JSON.parse(JSON.stringify(courier));
        switch (type) {
            case "name":
                temp.title = value;
                break;
            default:
                break;
        }
        setCourier(temp);
    }
    const handleDelete = () => {
        Swal.fire({ 
            title: t("delete-courier-question"),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: t("cancel"),
            confirmButtonText: t("yes")
        }).then((result) => {
            if (result.isConfirmed) {
                let selectedCourier = Fetchs.Couriers.data.find((couriers:any) => couriers.title == courier.title )
                Services.Couriers.delete(selectedCourier._id)
                Swal.fire({
                    title: t("success-delete-courier"),
                    icon: "success"
                }).then((result) => {
                    if (result.isConfirmed) {
                        syncCourier()
                        setModalOpen(false)
                    }
                })
            }
        })
    }

    const syncCourier = async () => {
        Fetchs.Couriers.handle(Services.Tick.get())
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
        <div className="delete-courier">
            <div style={{ paddingLeft: "1vw", paddingRight: "1vw" }} className="row">
                <div style={{ width: "20%" }}>{t("courier-name")}</div>
                <div style={{ width: "80%" }}>
                    <input
                        type={"text"}
                        placeholder= {t("courier-name")}
                        value={courier.title}
                        onChange={(event) => (handleChange(event?.target.value, "name"))} />
                </div>
            </div>
            <div style={{ paddingLeft: "1vw", paddingRight: "1vw" }} className="row">
                <div onClick={() => handleDelete()} style={{ height: "8vh", fontSize: "xx-large" }} className='butn green'>{t("delete")}</div>
                <div onClick={() => handleCancel()} style={{ height: "8vh", fontSize: "xx-large" }} className='butn red'>{t("cancel")}</div>
            </div>
        </div>
    )
}