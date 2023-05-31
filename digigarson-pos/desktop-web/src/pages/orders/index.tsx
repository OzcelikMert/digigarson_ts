import { useContext, useEffect, useState } from 'react';
import { useParams } from "react-router-dom";

import Navbar from "./navbar"
import Products from "./products/products"
import Couriers from "./couriers/couriers"
import Category from "./category/category"
import Check from "./check"
import Table from '../../services/table'
import Http from 'services/http';
import Response from 'services/response';
import Customer from 'services/customer'
import CheckService from 'services/checks';
import Cost from 'services/cost'
import Tick from 'services/tick'
import Takeaway from 'services/takeaway'
import CourierService from 'services/couriers'
import Authenticate from "services/authenticate"
import CService from 'services/category'
import FuzzySearch from 'fuzzy-search';
import Branch from 'services/branch';
import PService from 'services/product'
import Order from 'services/order'
import Swal from 'sweetalert2';
import {MODAL} from 'constants/modalTypes';
import { buttonNameList, caseSaleButtonNameList, takeAwayButtonNameList } from 'constants/checkButtons';
import Printer from "services/printer"
import { ICustomer } from "services/interfaces/customer";
import Modals from 'pages/modals';
import { useTranslation } from "react-i18next";
export default () => {

    const Context = useContext(Authenticate.Context)

    const [couriers, setCouriers] = useState<any[]>([])
    const [customer, setCustomer] = useState<ICustomer>();
    const [category, setCategory] = useState("all");
    const [productSearchText, setProductSearchText] = useState("");
    const [categories, setCategories] = useState([{}]);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentModal, setCurrentModal] = useState<any>(MODAL.CHECKOUT);
    const [calculator, setCalculator] = useState(0);
    const [multiplier, setMultiplier] = useState(1);
    const BranchContext = useContext(Branch.Context)!;
    const [lastClickedButtonPos, setLastClickedButtonPos] = useState({ x: 0, y: 0 })
    const [lastClickedButton, setLastClickedButton] = useState(false)
    const [lastClickedButtonElement, setLastClickedButtonElement] = useState(false)
    const [currentCategory, selectCurrentCategory] = useState<string>(String());
    const [selectedCategory, setSelectedCategory] = useState<string>("")
    const [selectedCourier, setSelectedCourier] = useState<any>()
    const [currentTable, setCurrentTable] = useState<any>();
    const [productsInCheck, setProductsInCheck] = useState<any[]>([])
    const [allchecked, setAllchecked] = useState(false);
    const [productsInOrder, setProductsInOrder] = useState<any[]>([]);
    const [paidOrders, setPaidOrders] = useState<any[]>([])
    const [manuallyPaid, setManuallyPaid] = useState<any[]>([])
    const [rightButtons, setRightButtons] = useState<any>([])
    const [bottomButtons, setBottomButtons] = useState<any>([])
    const [takeawayButtons, setTakeawayButtons] = useState<any>([])
    const [caseSaleButtons, setCaseSaleButtons] = useState<any>([])
    const [colorPickerFired, setColorPickerFired] = useState(false);
    const [time, setTime] = useState(0);
    const [optionList, setOptionList] = useState<any[]>()
    const [clickedProduct, setClickedProduct] = useState<any>();
    const [payments, setPayments] = useState<any>();
    const [coverList, setCoverList] = useState<any[]>([]);
    const [discountList, setDiscountList] = useState<any[]>([]);

    const [costs, setCosts] = useState<any[]>([])
    const [ticks, setTicks] = useState<any[]>([])
    const [cash, setChash] = useState(false);

    const [tobepaid, setToBePaid] = useState<any[]>([])
    const [check, setCheck] = useState<any[]>([])
    const [discounts, setDiscounts] = useState<any[]>([])
    const [totalAmount, setTotalAmount] = useState(0)
    const [currentCheckLeft, setCurrentCheckLeft] = useState(0)
    const [productsFromCategory, setProductsFromCategory] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [productToBeSendFirst, setProductToBeSendFirst] = useState<any[]>([])

    const { t, i18n } = useTranslation();
    
    const Services = {
        Table: new Table(useContext(Http.Context)!),
        Order: new Order(useContext(Http.Context)!),
        Category: new CService(useContext(Http.Context)!),
        Product: new PService(useContext(Http.Context)!),
        Check: new CheckService(useContext(Http.Context)!),
        Cost: new Cost(useContext(Http.Context)!),
        Tick: new Tick(useContext(Http.Context)!),
        Customers: new Customer(useContext(Http.Context)!),
        Couriers: new CourierService(useContext(Http.Context)!),
        Takeaway: new Takeaway(useContext(Http.Context)!),
    }

    const Fetchs = {
        Table: new Response<any>(),
        Category: new Response<any>(),
        Product: new Response<any>(),
        Check: new Response<any>(),
        Cost: new Response<any>(),
        Tick: new Response<any>(),
        Customers: new Response<any>(),
        Couriers: new Response<any>(),
        Order: {
            Create: new Response<any>(),
            Add: new Response<any>(),
            Update: new Response<any>(),
            Delete: new Response<any>(),
            Get: new Response<any>(),
        },
        Takeaway: {
            All: new Response<any>(),
        }
    };

    const { id, customerId } = useParams();

    useEffect(() => (!Fetchs.Category.data && Fetchs.Category.handle(Services.Category.get()), undefined), [Fetchs.Category.data])
    useEffect(() => Fetchs.Category.data && setCategories(Fetchs.Category.data), [Fetchs.Category.data])
    useEffect(() => ((!Fetchs.Cost.data && Fetchs.Cost.handle(Services.Cost.get()), undefined)), [Fetchs.Cost.data])
    useEffect(() => Fetchs.Cost.data && setCosts(Fetchs.Cost.data), [Fetchs.Cost.data])
    useEffect(() => ((!Fetchs.Tick.data && Fetchs.Tick.handle(Services.Tick.get()), undefined)), [Fetchs.Tick.data])
    useEffect(() => Fetchs.Tick.data && setTicks(Fetchs.Tick.data), [Fetchs.Tick.data])
    
    if (id) {
        useEffect(() => (!Fetchs.Check.data && Fetchs.Check.handle(Services.Check.get(id!)), undefined), [Fetchs.Check.data])
        useEffect(() => (!Fetchs.Table.data && Fetchs.Table.handle(Services.Table.getById(id!)), undefined), [Fetchs.Table.data])
        useEffect(() => Fetchs.Table.data && setCurrentTable(Fetchs.Table.data), [Fetchs.Table.data])
    }
    else {
        useEffect(() => (!Fetchs.Customers.data && Fetchs.Customers.handle(Services.Customers.get()), undefined), [Fetchs.Customers.data])
        useEffect(() => Fetchs.Customers.data && setCustomer(Fetchs.Customers.data.find((c: any) => c.id == customerId)), [Fetchs.Customers.data])
        useEffect(() => customer && setCurrentTable(customerToTableFormat(customer)), [customer])
        useEffect(() => (!Fetchs.Couriers.data && Fetchs.Couriers.handle(Services.Couriers.get()), undefined), [Fetchs.Couriers.data])
        useEffect(() => Fetchs.Couriers.data && setCouriers(Fetchs.Couriers.data), [Fetchs.Couriers.data])
    }

    useEffect(() => {
        const bottomButtons = localStorage.getItem("bottomButtons")
        const rightButtons = localStorage.getItem("rightButtons")
        const takeawayButtons = localStorage.getItem("takeawayButtons")
        const caseSaleButtons = localStorage.getItem("caseSaleButtons")

        let casesale_buttons = caseSaleButtons && JSON.parse(caseSaleButtons)
        let takeaway_buttons = takeawayButtons && JSON.parse(takeawayButtons)
        let bottom_buttons = bottomButtons && JSON.parse(bottomButtons)
        let right_buttons = rightButtons && JSON.parse(rightButtons)
        setRightButtons(right_buttons);
        setBottomButtons(bottom_buttons);
        setTakeawayButtons(takeaway_buttons)
        setCaseSaleButtons(casesale_buttons)
        if (id) {
            const priceChangedOrders = window.localStorage.getItem("priceChangedOrders")
            if (priceChangedOrders && window.localStorage.getItem("priceChangedOrders") != "clear") {
                let pino = JSON.parse(priceChangedOrders)
                if (pino?.length > 0) {
                    setPaidOrders(pino);
                }
            }
        }
    }, [])
    useEffect(() => {
        if (time != 0 && Fetchs.Table.data) {
            let orders = Fetchs.Table.data.orders.filter((order: any) => time <= new Date(order.createdAt).getTime())
            let check = productsInCheck.filter((pinc: any) => {
                if (orders.find((order: any) => order._id == pinc.product.orderId)) {
                    return pinc;
                }
            })
            let sum = 0;
            check?.forEach((element: any) => {
                sum += element.product.price;
            })
            setCheck(check)
        }
    }, [productsInCheck])
    useEffect(() => {
        const x = productsInCheck?.find((pc: any) => pc.checked == false)
        const y = productsInOrder?.find((po: any) => po.checked == false)
        setAllchecked(x || y ? false : true);
    }, [productsInCheck, productsInOrder])

    useEffect(() => (window.localStorage.setItem("rightButtons", JSON.stringify(rightButtons))), [rightButtons])
    useEffect(() => (window.localStorage.setItem("bottomButtons", JSON.stringify(bottomButtons))), [bottomButtons])
    useEffect(() => (window.localStorage.setItem("takeawayButtons", JSON.stringify(takeawayButtons))), [takeawayButtons])
    useEffect(() => (window.localStorage.setItem("caseSaleButtons", JSON.stringify(caseSaleButtons))), [caseSaleButtons])
    
    const getName = (id: any) => {
        if(customerId){
          let name = "";
        Fetchs?.Customers?.data?.map((customer: any) => {
          if(customer.id === id){
              name = customer?.title;
          }
        })    
        return name;
        }
    
    }

    const customerToTableFormat = (customer: any) => {
        return {
            _id: customer.id,
            busy: false,
            cancelled_orders: [],
            paid_orders: [],
            order_type: 0,
            options: [],
            discount: [],
            cover: [],
            logs: [],
            section: null,
            title: customer.title,
            branch: customer.branch,
            orders: [],
            payments: [],
            createdAt: customer.createdAt,
            updatedAt: customer.updatedAt,
            __v: customer.__v,
            log: [],
            userId: null,
            isPrint: {
                "status": false,
                "print": false
            }
        }
    }

    const handleCheckAll = (event: any) => {
        let chk = [...productsInCheck]
        chk.forEach((pc: any) => { pc.checked = event.target.checked })
        setProductsInCheck(chk)

        let order = [...productsInOrder]
        order.forEach((po: any) => { po.checked = event.target.checked })
        setProductsInOrder(order)
        setAllchecked(event.target.checked)
    }
    const handleChecked = (event: any, product: any, type: string) => {
        if (type == "current") {
            let chk = [...productsInCheck]
            chk.forEach((pc: any) => {
                if (pc.uid == product.uid) {
                    pc.checked = event.target.checked;
                    return;
                }
            })
            setProductsInCheck(chk);
        }
        else {

            let pio = [...productsInOrder]
            pio.forEach((po: any) => {
                if (po.uid == product.uid) {
                    po.checked = event.target.checked;
                    return;
                }
            })
            setProductsInOrder(pio);
        }
    }
    const handleCategoryClick = (event: any) => {
        setSelectedCourier(0)
        if (customerId) {
            setProductSearchText("")
        }
        setSelectedCategory(event.target.id);
        setCategory(event.target.id);
    }


    const categorySearcher = new FuzzySearch(
        Fetchs.Category?.data,
        ["title"],
        {
            caseSensitive: false
        })
    function handleCategorySearchChange(value: string) {
        value == undefined ? null : setCategory(value.trim());
        const result = categorySearcher.search(value.trim());
        setCategories(result);
    }


    function handleProductChange(value: string) {
        value == undefined ? null : setProductSearchText(value.trim());
    }
    const productName = (productId: any) => {
        let product = BranchContext[0]?.products.find((p: any) => p._id == productId);
        return product?.title;
    }

    const createUUID = () => {
        let dt = new Date().getTime();
        let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }

    const syncCheck = async () => {
        Fetchs.Check.handle(Services.Check.get(id!))
        Fetchs.Table.handle(Services.Table.getById(id!))
    }

    const syncTick = async () => {
        Fetchs.Tick.handle(Services.Tick.get())
    }
    const syncCost = async () => {
        Fetchs.Cost.handle(Services.Cost.get())
    }

    const deleteProduct = () => {
        let sum = totalAmount;
        let productsToBeDeleted = productsInCheck.filter(({ checked }) => checked);
        let newProductsState = productsInCheck.filter(({ checked }) => !checked);
        let newOrdersState = productsInOrder.filter((pinc: any) => !pinc.checked);
        let ordersToBeDeleted = productsInOrder.filter((pinc: any) => pinc.checked);
        if (productsToBeDeleted.length + ordersToBeDeleted.length < 1) {
            Swal.fire({
                title: t("select-delete"),
                icon: "warning"
            })
            return;
        }
        Swal.fire({ 
            title: t("delete-question"),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: t("cancel"),
            confirmButtonText: t("yes")
        }).then((result) => {
            if (result.isConfirmed) {
                productsToBeDeleted.forEach((product: any) => {
                    sum -= product.product.price
                    Services.Order.deleteProduct(product.product.orderId, id!)
                })
                ordersToBeDeleted.forEach((order:any)=>{
                    sum = sum - order.product.prices[0].price
                })
                if(Fetchs.Check.data){
                    const printData = {
                        ...Fetchs.Check.data, branch: Fetchs.Check.data.branch,
                        orders: productsToBeDeleted?.map(({ product, optionNames }) => ({
                            name: product.name,
                            quantity: product.quantity,
                            optionNames: optionNames
                        })),
                        total: productsToBeDeleted?.map(({ product }) => ({
                            amount: product.price
                        }))
                    };
                    Printer.printCheckDeleteOrderKitchenByGroup(printData)
                    Swal.fire({
                        title: t("print-product-success"),
                        icon: "success"
                    })
                }
                setProductsInCheck(newProductsState);
                Swal.fire(
                    t("delete-selected-products"),
                    `${productsToBeDeleted.length + productsInOrder.length - newOrdersState.length} ${t("product-delete")}`,
                    'success'
                )
                setTotalAmount(sum)
                setProductsInOrder(newOrdersState);
            }
        })
    }
    
    const checkout = (orders: any) => {
        let sum = 0;
        orders.forEach((pinc: any) => sum += pinc.product.price);
        setCheck(orders);
        setCurrentModal(MODAL.CHECKOUT)
        setModalOpen(true);
    }

    const splitProducts = () => {
    }
    const moveProduct = () => {
        let productsToBeMoved = productsInCheck.filter(({ checked }) => checked);
        const data = productsToBeMoved.map((product: any) => product.product.orderId)

        window.localStorage.setItem("productsToBeMoved", JSON.stringify(data));
        window.location.href = "/moveproduct/" + currentTable._id;
    }
    const mergeCheck = () => {

    }
    const nameTable = () => {

    }
    const SendOrder = async (orders: any[], firstOrders: any[], courier_id?: string) => {
        let res;
        if (!orders.length && !firstOrders.length) {
            return
        }
        if (customerId) {
            let success = true;
            const ordersMap = {
                products: orders.concat(firstOrders)?.map(({ product, priceIndex, options }) => ({
                    product: product._id,
                    quantity: product.prices[priceIndex].amount,
                    price: product.prices[priceIndex]._id,
                    options: options
                })),
                user: customerId,
                address: 0,
                courier: courier_id ? courier_id : ""
            }
            await Services.Takeaway.create(ordersMap).then(() => {
                Swal.fire({
                    title: t("order-created"),
                    icon: "success",
                    timer: 2000,
                }).then(() => {
                })
            }).catch((error) => {
                Swal.fire({
                    icon: "error",
                    title: t("error-try-again"),
                })
                success = false;
            })
            if (!success)
                return
        }
        else {
            const ordersMap = orders.concat(firstOrders)?.map(({ product, priceIndex, options }) => ({
                product: product._id,
                quantity: product.prices[priceIndex].amount,
                price: product.prices[priceIndex]._id,
                options: options
            }));

            if (Fetchs.Table.data?.busy) {
                await Services.Order.update(Fetchs.Table.data?._id, {
                    products: ordersMap
                }).then((response) => {
                    res = response;
                })
            } else {
                await Services.Order.create(Fetchs.Table.data?._id, {
                    products: ordersMap
                }).then((response) => {
                    res = response;
                })

            }
        }
        const printData = {
            ...Fetchs.Check.data, orders: orders?.map(({ product, optionNames }) => ({
                name: product.title,
                quantity: product.prices[0].amount,
                category: product.category,
                optionNames: optionNames
            })),
            firstOrders: firstOrders.map(({ product, optionNames }) => ({
                name: product.title,
                quantity: product.prices[0].amount,
                category: product.category,
                optionNames: optionNames
            })),
        };
        const customerName = getName(customerId);
        let takeawayBranchName = customer?.branchName
        const printTakeawayData = {
            ...Fetchs.Check.data, orders: orders?.map(({ product, optionNames }) => ({
                name: product.title,
                quantity: product.prices[0].amount,
                category: product.category,
                optionNames: optionNames
            })),
            firstOrders: firstOrders.map(({ product, optionNames }) => ({
                name: product.title,
                quantity: product.prices[0].amount,
                category: product.category,
                optionNames: optionNames
            })),
            customer: customerName,
            branch: takeawayBranchName || "Digigarson",
        };
        if(customerId){
            Printer.printTakeawayKitchenByGroup(printTakeawayData);
        }
        else{
            Printer.printKitchenByGroup(printData);
        }

        setProductsInOrder([])
        setProductToBeSendFirst([]);
        if (!customerId) {
            syncCheck();
        }
        window.localStorage.setItem("priceChangedOrders", "clear");
        return res;
    }
    const changePrice = () => {

        if (!productsInCheck.find((pinc: any) => pinc.checked)) {
            const message = !productsInOrder.find((pino: any) => pino.checked) ? t("select-change") : t("not-change-price");
            Swal.fire({
                title: message,
                icon: "error"
            })
            return;
        }
        setCurrentModal(MODAL.ABC);
        setModalOpen(true)
    }
    const catering = () => {

    }
    const readbarcode = () => {

    }
    const safeSaleCheckout = async () => {
        await SendOrder(productsInOrder, productToBeSendFirst)
        await Services.Check.get(id!).then((response) => {
            let temp: any[] = [];
            response?.data?.orders.map((order: any) => {
                let o = response?.data?.paid_orders.find((element: any) => order.orderId == element.id)
                if (!o || o == undefined) {
                    temp.push({ product: order, checked: false, uid: createUUID() });
                }
            });
            checkout(temp)
        })
    }
    const fastcheckout = async () => {

        Swal.fire({
            title: t("select-payment"),
            icon: "question",
            input: "select",
            inputOptions: {
                1: t("credit-card"),
                2: t("cash"),
                3: t("app_payment"),
                6: t("tick-payment"),
                7: "Sodexo",
                8: "Smart",
                9: "Winwin",
                10: "Multinet",
                11: "Setcard",
                12: "Metropol",
                13: "Edended",
            },
            showCancelButton: true
        }).then(async (result: any) => {
            if (result.dismiss == "cancel" || result.value === undefined) {
            } else {
                await SendOrder(productsInOrder, productToBeSendFirst)
                await Services.Check.get(id!).then((response) => {
                    let sum = 0;
                    response?.data?.orders.forEach((order: any) => {
                        sum += order.price;
                    })
                    const data = {
                        "orders": Array(),
                        "payments": [
                            {
                                "type": result.value,
                                "amount": sum,
                                "currency": "TL"
                            }
                        ]
                    }

                    Services.Check.pay(currentTable._id, data).then(() => {
                        Swal.fire({
                            title: t("receipt-question"),
                            icon: "question",
                            showConfirmButton: true,
                            showCancelButton: true,
                        }).then((result) => {
                            if (result.isConfirmed) {
                                Printer.printCheck({ ...Fetchs.Check.data, orders: response?.data.orders.map((order: any) => order) });
                            }

                        }).then(() => {
                            if(currentTable.safeSales){
                                window.location.href="/table/" + currentTable._id 

                            }
                            else{
                                window.location.href="/"
                            }
                        })

                    })
                })
            }
        });

    }
    const print = () => {
        Printer.printCheck(Fetchs.Check.data);
        //Printer.printKitchen(Fetchs.Check.data)
    }
    const sendfirst = () => {
        let first = productsInOrder.filter((product: any) => product.checked);
        let then = productsInOrder.filter((product: any) => !product.checked)
        setProductToBeSendFirst(first);
        setProductsInOrder(then);
    }

    const checkPerm = (permission : string) => {
        let p = false;
        Context?.User?.permissions?.forEach((perm: string)=>{
            if(perm==permission){
                p= true;
                return;
            }
        })
        return p;
    }

    const handleTab = (perm: string) => {
        
        if(checkPerm(perm)){
            switch(perm){
                case "506":
                    setCurrentModal(MODAL.COVER);
                    setModalOpen(true)
                    break;
                case "505":
                    setCurrentModal(MODAL.DISCOUNT);
                    setModalOpen(true)
                    break;
                default:
                    break;
            }
            
        }
        else{
            Swal.fire({
                icon:"error",
                title: t("not-permission")
            })
        }
    }
    const handleClick = async (functionName: string, event: any, i: number) => {
        switch (functionName) {
            case "deleteProduct":
                deleteProduct();
                break;
            case "checkout":
                if (!currentTable?.safeSales) {
                    if (!currentTable.busy) {
                        Swal.fire({
                            icon: "error",
                            title: t("nopayment-closed-table")
                        })
                        return;
                    }
                    checkout(productsInCheck);
                }
                else {
                    if (productsInOrder.length < 1) {
                        if (productsInCheck.length > 0) {
                            checkout(productsInCheck)
                        }
                        else {
                            Swal.fire({
                                icon: "warning",
                                title: t("please-add-product")
                            })
                        }
                        return;
                    }
                    safeSaleCheckout();
                }
                break;
            case "moveTable":
                if (currentTable?.safeSales) {
                    inactiveButton();
                }
                else {
                    window.location.href = "/movetable/" + id;
                }
                break;
            case "splitProducts":
                if (currentTable?.safeSales) {
                    inactiveButton();
                }
                else {
                    splitProducts();
                }
                break;
            case "moveProduct":
                if (currentTable?.safeSales) {
                    inactiveButton();
                }
                else {
                    moveProduct();
                }
                break;
            case "mergeCheck":
                if (currentTable?.safeSales) {
                    inactiveButton();
                }
                else {
                    mergeCheck();
                }
                break;
            case "sendOrder":
                if (currentTable?.safeSales) {
                    inactiveButton();
                }
                else {
                    if (!productsInOrder || productsInOrder.length < 1) {
                        Swal.fire({
                            title: t("please-add-product"),
                            icon: "warning"
                        })
                        return
                    }
                    if (customerId) {
                        setProductSearchText("")
                        setSelectedCourier(-1);
                        return
                    }
                    SendOrder(productsInOrder, productToBeSendFirst).then(() => {
                        Services.Order.print(currentTable._id!);
                    })
                    Swal.fire({
                        title: t("order-created"),
                        icon: "success",
                        timer: 2000,
                    }).then(() => {
                        if (!currentTable?.safeSales) {
                            window.location.href = "/";
                        }
                        else {
                            syncCheck();
                        }
                    })
                }
                break;
            case "nameTable":
                //FIXME: Backendi yok
                nameTable();
                inactiveButton();
                break;
            case "changePrice":
                changePrice();
                break;
            case "discount":
                handleTab("505")
                break;
            case "cover":   
                handleTab("506")
                break;
            case "catering":
                //TODO: ikram
                inactiveButton();
                catering();
                break;
            case "readbarcode":
                //TODO: bekleyebilir
                inactiveButton();
                readbarcode();
                break;
            case "fastcheckout":
                fastcheckout();
                break;
            case "print":
                if (currentTable?.safeSales) {
                    inactiveButton();
                }
                else {
                    if (productsInOrder?.length > 0) {
                        Swal.fire({
                            icon: "question",
                            title: t("not-print-question"),
                            showCancelButton: true
                        }).then((result: any) => {
                            if (result.isConfirmed) {
                                const printData = {
                                    ...Fetchs.Check.data, orders: productsInOrder?.map(({ product }) => ({
                                        id: product._id,
                                        name: product.title,
                                        price: product.prices[0].price,
                                        currency: product.prices[0].currency,
                                        quantity: product.prices[0].amount,
                                        category: product.category
                                    })),
                                    ...Fetchs.Check.data, total: productsInOrder?.map(({ product }) => ({
                                        currency: product.prices[0].currency,
                                        amount: product.prices[0].price
                                    })),
                                    ...Fetchs.Customers.data, name: customer?.title,
                                    ...Fetchs.Customers.data, address: customer?.address[0].address
                                };
                                Printer.printProductsInOrder(printData)
                                Swal.fire({
                                    title: t("print-product-success"),
                                    icon: "success"
                                })
                            }
                        })
                    } else {
                        print();
                    }
                }

                break;
            case "sendfirst":
                if (currentTable?.safeSales) {
                    inactiveButton();
                }
                else {
                    sendfirst();
                }
                break;
            default:
                inactiveButton()
                break;
        }

    }
    const inactiveButton = () => {
        Swal.fire({
            title: t("disable-feature"),
            icon: "error"
        })
    }
    const handleRightClick = (event: any, i: number, button: any, type: string) => {

        const x = event?.target?.offsetLeft;
        const y = event?.target?.offsetTop;
        setLastClickedButton(button)
        setLastClickedButtonPos({ x, y })
        setLastClickedButtonElement(event.target);
        Swal.fire({
            title: t("select-button"),
            input: 'select',
            html: `
                <div buttonId="${i}" id="colorPickButton" class="colorPickButton">
                ${t("change-color")}
                </div>
            `,
            inputOptions: customerId ? takeAwayButtonNameList : currentTable.safeSales ? caseSaleButtonNameList : buttonNameList,
            showCancelButton: true,
        }).then((result: any) => {
            if (result.dismiss == "cancel" || result.value === undefined) {
            } else {
                if (type == "bottom") {
                    let temp = JSON.parse(JSON.stringify(bottomButtons));
                    temp[i].name = result.value;
                    setBottomButtons(temp);
                }
                else {
                    if (customerId) {
                        let temp = JSON.parse(JSON.stringify(takeawayButtons));
                        temp[i].name = result.value;
                        setTakeawayButtons(temp);
                    }
                    else if (currentTable.safeSales) {
                        let temp = JSON.parse(JSON.stringify(caseSaleButtons));
                        temp[i].name = result.value;
                        setCaseSaleButtons(temp);
                    }
                    else {
                        let temp = JSON.parse(JSON.stringify(rightButtons));
                        temp[i].name = result.value;
                        setRightButtons(temp);
                    }
                }
            }
        });
        let colorPickerButton = document.getElementById("colorPickButton");
        if (colorPickerButton) {
            colorPickerButton.addEventListener("click", () => {
                Swal.close();
                setColorPickerFired(true);
            })
        }
    }
    function closeModal(): any {
        setModalOpen(false);
        if (!customerId && !currentTable.safeSales) {
            setTime(0)
            syncCheck()
            syncTick()
            syncCost()
            setCalculator(0)
            setToBePaid([]);
        }
    }
    const props = {
        currentTable, setCurrentTable,
        rightButtons, setRightButtons,
        bottomButtons, setBottomButtons,
        takeawayButtons, setTakeawayButtons,
        caseSaleButtons, setCaseSaleButtons,
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
        manuallyPaid, setManuallyPaid,
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
        costs, setCosts,
        ticks, setTicks,
        syncCheck,
        createUUID,
        closeModal,
        handleCheckAll,
        handleChecked,
        handleCategoryClick,
        handleCategorySearchChange,
        handleProductChange,

        SendOrder,
        handleClick,
        handleRightClick,
        productName,


        buttonNameList,
        BranchContext,
        Services,
        Fetchs,
        id,
        customerId
    }

    return (
        currentTable ? <>
            <Modals props={props} />
            <div style={{ position: "absolute", top: "0", width: "100%" }}>
                <Navbar props={props} />
                <div className='row'>
                    <div id="account" className='col'>
                        <Check props={props} />
                    </div>
                    <div id="products" className='col'>
                        {
                            selectedCourier != -1
                                ? <Products props={props} />
                                : <Couriers props={props} />
                        }
                    </div>
                    <div id="btnCategory" style={{ display: "block", width: "35%" }} className='col'>
                        <Category props={props} />
                    </div>
                </div>

            </div>
        </> :
            <div className='caseClosed'>{t("loading")}</div>
    )
}
