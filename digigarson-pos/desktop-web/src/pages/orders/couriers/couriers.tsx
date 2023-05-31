import React, { useContext, useEffect, useState } from "react"
import { useTranslation } from "react-i18next";
import "./couriers.css"
import FuzzySearch from "fuzzy-search";
import Swal from "sweetalert2";
import { MODAL } from "constants/modalTypes";



export default ({ props }: { props: any }) => {
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
    

    const courierSearcher = new FuzzySearch(
        Fetchs.Couriers.data,
        ["title"],
        {
            caseSensitive: false
        });
    useEffect(() => {
        if (productSearchText.length > 0 || productSearchText == "") {
            const result = courierSearcher.search(productSearchText);
            setCouriers(result);
        }
        else {
            setCouriers(Fetchs.Couriers.data)
        }
    }, [productSearchText, Fetchs.Couriers.data])

    useEffect(()=>{
        if(selectedCourier!=-1 && selectedCourier !=0){
            SendOrder(productsInOrder, productToBeSendFirst)
        }
    },[selectedCourier])

    const handleClick =  (courier:any) =>{
        Swal.fire({
          icon:"question",
          title: t("this-order") +courier.title+ t("courier-named"),
          showCancelButton:true
        }).then(async (result)=>{
            if(result.isConfirmed){
                
                SendOrder(productsInOrder, productToBeSendFirst, courier._id)
            }
        })
    }
    
    const newCourier = () =>{
        setCurrentModal(MODAL.CREATE_COURIER)
        setModalOpen(true)
    }

    const deleteCourier = () =>{
        setCurrentModal(MODAL.DELETE_COURIER)
        setModalOpen(true)
    }

    return (
        <div className="couriesContainer">
            {couriers?.map((courier: any) => <article onClick={() => handleClick(courier)} ><strong>{courier.title}</strong></article>)}
            <article style={{ backgroundColor: "blue" }} onClick={() => newCourier()}  ><strong>{t("add-courier")}</strong></article>
            <article style={{ backgroundColor: "blue" }} onClick={() => deleteCourier()}  ><strong>{t("deletecourier")}</strong></article>
        </div>
    )
    
}