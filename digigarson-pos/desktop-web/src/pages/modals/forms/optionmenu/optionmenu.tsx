import React, { useEffect, useState } from "react"
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import "./optionmenu.css"




export default ({ props }: { props: any }) => {
    const { t, i18n } = useTranslation();
    const {
        clickedProduct, setModalOpen,
        optionList, productsInOrder, 
        createUUID, setProductsInOrder, 
        multiplier, setMultiplier, 
        currentTable,
        totalAmount, setTotalAmount,
        customerId,
    } = props;

    const [selectedOptions, setSelectedOptions] = useState<any[]>([])
    const [priceType, setPriceType] = useState(0);
    const [note, setNote] = useState("");
    const clearState = () =>{
        setSelectedOptions([])
        setPriceType(0);
        setNote("");
        setMultiplier(1);
    }
    function handleSubmit(): void {
        let remainForcedChoice = false;
        optionList.forEach((element: any) => {
            if (element.is_forced_choice) {
                let x = selectedOptions.find((opt: any) => opt.option.option._id == element.option._id)
                if (x == undefined) {
                    remainForcedChoice = true;
                    return;
                }
            }
        });
        if (remainForcedChoice) {
            Swal.fire({
                title: t("option-warning"),
                icon: "warning"
            })
        }
        else {
            const data = selectedOptions.map((soptions: any) => { return { id: soptions.option.option._id, sub_option: soptions.items.map((item: any) => item._id) } })
            const optionNames = selectedOptions.map((soptions: any) => { return { option: soptions.option.option.name, sub_options: soptions.items.map((item: any) => item.item_name) } })

            let pro = JSON.parse(JSON.stringify(clickedProduct));
            
            pro.prices[priceType].amount *= multiplier;
            selectedOptions.forEach((option:any)=>{
                option.items.forEach((item:any)=>{
                    pro.prices[priceType].price +=item.price;
                })
            })
            let chk = [...productsInOrder]
            chk.push({ product: pro, checked: false, uid: createUUID(), priceIndex: priceType, options: data, optionNames: optionNames })
            
            if (currentTable?.safeSales || customerId ) {
                setTotalAmount(totalAmount + pro.prices[priceType].price * multiplier)
            }
            clearState();
            setProductsInOrder(chk);
            setModalOpen(false);
        }
    }
    function handleSingleOptionSelect(option: any, item: any) {
        let selecteds = JSON.parse(JSON.stringify(selectedOptions))
        let opt = selecteds.find((element: any) => element.option.option._id == option.option._id)

        if (opt) {
            selecteds = selecteds.filter((element: any) => element.option.option._id != option.option._id)
            if (opt.items[0]._id == item._id) {
                setSelectedOptions(selecteds);
                return;
            }
        }
        let newItems: any[] = [];
        newItems.push(item)
        selecteds.push({ option: option, items: newItems })
        setSelectedOptions(selecteds)
    }

    function handleOptionSelect(option: any, item: any): void {
        let selecteds = JSON.parse(JSON.stringify(selectedOptions))
        let opt = selecteds.find((element: any) => element.option.option._id == option.option._id)
        if (opt) {
            let oldItem = opt.items.find((element: any) => element._id == item._id);
            if (oldItem) {
                let newItems = opt.items.filter((element: any) => element._id != item._id);
                selecteds = selecteds.filter((element: any) => element.option.option._id != option.option._id)
                if (newItems.length >= 1) {
                    selecteds.push({ option: option, items: newItems })
                }
            }
            else {
                if (opt.items.length >= opt.option.option.choose_limit) {
                    Swal.fire({
                        title: t("max-product"),
                        icon: "error"
                    })
                    return;
                }
                let newItems = JSON.parse(JSON.stringify(opt.items))
                newItems.push(item)
                selecteds = selecteds.filter((element: any) => element.option.option._id != option.option._id)
                selecteds.push({ option: option, items: newItems })
            }
        }
        else {
            let newItems = Array();
            newItems.push(item);
            selecteds.push({ option: option, items: newItems })
        }
        setSelectedOptions(selecteds)
    }
    const getColor = (item: any) => {
        let tempItem = selectedOptions.find((opt: any) => {
            return opt.items.find((itm: any) => itm._id == item._id);
        })
        if (tempItem) {
            return "green";
        }
        return "red";
    }
    return (
        <div className="optionmenu">
            <div className="optionNote">
                
                {
                    clickedProduct.sale_type == 5 ?
                        <>
                            <span>{t("portion")}</span>
                            <div>
                                {clickedProduct?.prices.map((price: any, i: number) => {
                                    return <button
                                        className="option"
                                        style={{ minWidth: "5vw", backgroundColor: priceType == i ? "green" : "blue", textAlign: "center" }}
                                        onClick={(event: any) => setPriceType(event?.target.value)}
                                        value={i}>
                                        {price.price_name}  {price.price}tl
                                    </button>
                                })
                                }
                            </div>
                        </>
                        :
                        <>
                            <span>{t("price")}</span>
                            <select onChange={(event: any) => setPriceType(event?.target.value)}>
                                {clickedProduct?.prices.map((price: any, i: number) => {
                                    return <option value={i}>{price.price_name}  {price.price}tl</option>
                                })
                                }
                            </select>
                        </>
                }
                <span>{t("note")}</span>
                <input value={note} onChange={(event: any) => setNote(event?.target.value)} />
                <div onClick={() => setNote("")} className="clearButton">{t("clear")}</div>
                <div
                    onClick={() => handleSubmit()}
                    className="submitOption">{t("add")}</div>
            </div>
            <div>
                <span className="optionTitle">{t("option")}</span>
                <div className="optionList">
                    {optionList.map((option: { option: any, is_forced_choice: boolean }) =>
                        <div className="optionContainer">
                            <div className="optionName">
                                {option.option.name}
                                {option.is_forced_choice ? <span style={{ color: "red" }}>*</span> : null}
                                <span style={{ color: "blue" }}>{selectedOptions.find((element: any) => element.option.option._id == option.option._id) ? selectedOptions.find((element: any) => element.option.option._id == option.option._id).items?.length : "0"}/{option.option.choose_limit}</span>
                            </div>
                            {option.option.items.map((item: any) => {
                                if (option.option.type == 2) {
                                    return (<>
                                        <div
                                            className="option"
                                            style={{ minWidth: "5vw", backgroundColor: getColor(item), textAlign: "center" }}
                                            onClick={() => handleOptionSelect(option, item)}
                                        >{item.item_name}</div>

                                    </>)
                                }
                                else {
                                    return (
                                        <>
                                            <div
                                                className="option"
                                                style={{ minWidth: "5vw", backgroundColor: getColor(item), textAlign: "center" }}
                                                onClick={() => handleSingleOptionSelect(option, item)}
                                            >{item.item_name}</div>
                                        </>)
                                }
                            }
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

