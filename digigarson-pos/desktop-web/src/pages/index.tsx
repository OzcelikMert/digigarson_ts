import {useEffect, useContext, useState, Component} from "react"
import { Link, useParams } from "react-router-dom"
import { Transition } from "@headlessui/react"
import { useFormik } from "formik";

import Http from "services/http"
import Case from "services/case"
import Table from "services/table"
import Section from "services/section"
import Response from "services/response"
import Authenticate from "services/authenticate"
import Order from "services/order"
import Check from "services/checks"
import CostService from 'services/cost'
import TickService from 'services/tick'

import Printer from "services/printer"
import UString from "utilities/string"
import Operations from "components/operations";
import Sections from "components/sections";
import '../styles/tables.css'
import Tables from "components/tables";
import Swal from "sweetalert2";
import '../styles/order.css'

import { useTranslation } from "react-i18next";
import Modals from "./modals";
import Branch from "services/branch";
import { MODAL } from "constants/modalTypes";

const NewCase = ({ Fetch, Service }: { Fetch: Response<any>, Service: Case }) => {
    const { t } = useTranslation();

    const formik = useFormik({
        initialValues: {
            amount: Number()
        },
        onSubmit: (values, { setSubmitting }) => {
            Fetch.handle(Service.create({
                start_balance: [ {
                        type: 1,
                        amount: values.amount,
                        currency: "TL"
                    }
                ]
            }))
        }
    })

    return <div className="Home">
        <div className="OpenCase">
            <form className="form" onSubmit={formik.handleSubmit}>
                <div className="caseClosed">{t("open-case-description")}</div>
                <input
                    type="number"
                    name="amount"
                    onChange={formik.handleChange}
                    onBlur={formik.handleChange}
                    value={formik.values.amount} />
                <button className="button" type="submit">{t("open-case")}</button>
            </form>
        </div>
    </div>
}

export default function () {
    const Context = useContext(Authenticate.Context)
    const BranchContext = useContext(Branch.Context)

    const [costs, setCosts] = useState<any[]>([])
    const [ticks, setTicks] = useState<any[]>([])
    const [sections, setSections] = useState<any[]>();
    const [currentSection, selectedSection] = useState<string>("all");
    const [modalOpen, setModalOpen] = useState(false);
    const [currentModal, setCurrentModal] = useState<any>(MODAL.PRINTER_SETTING);
    const [tables, setTables] = useState<any[]>([]);
    const [checkID, setCheckID] = useState<string>();
    const [allTables, setAllTables] = useState<any[]>();
    const [myCase, setMyCase] = useState<any>();
    const [table, setTable] = useState<any>();
    const [oldCheckUser, setOldCheckUser] = useState();
    const [caseSale, setCaseSale] = useState<any>();

    const Services = {
        Cost: new CostService(useContext(Http.Context)!)
    }

    const TService = new Table(useContext(Http.Context)!);
    const CService = new Case(useContext(Http.Context)!);
    const SService = new Section(useContext(Http.Context)!);
    const OService = new Order(useContext(Http.Context)!);
    const CheckService = new Check(useContext(Http.Context)!);

    const ServiceTick = new TickService(useContext(Http.Context)!);

    const Fetchs = {
        Check: new Response<any>(),
        Product: new Response<any>(),
        AllTable: new Response<any>(),
        Table: new Response<any>(),
        Cost: new Response<any>(),
        Tick: new Response<any>(),
        Case: {
            Get: new Response<any>(),
            Create: new Response<any>(),
            Close: new Response<any>()
        },
        Section: new Response<any[]>(),
        Order: {
            Create: new Response<any>(),
            Add: new Response<any>(),
            Update: new Response<any>(),
            Delete: new Response<any>(),
            Get: new Response<any>(),
        }
    }

    const { t } = useTranslation();

    useEffect(() => (!Fetchs.Case.Get.data && Fetchs.Case.Get.handle(CService.get()), undefined), [Fetchs.Case.Get.data])

    useEffect(() => Fetchs.Case.Create.data && Fetchs.Case.Get.reset(), [Fetchs.Case.Create.data])
    useEffect(() => Fetchs.Case.Create.data && Fetchs.Case.Create.reset(), [Fetchs.Case.Close.data])
    useEffect(() => Fetchs.Case.Get.data && setMyCase(Fetchs.Case.Get.data), [Fetchs.Case.Get.data])

    useEffect(() => (!Fetchs.Section.data && Fetchs.Section.handle(SService.get()), undefined), [Fetchs.Section.data])
    useEffect(() => Fetchs.Section.data && setSections(Fetchs.Section.data), [Fetchs.Section.data])

    useEffect(() => (!Fetchs.AllTable.data && Fetchs.AllTable.handle(TService.get()), undefined), [])
    useEffect(() => Fetchs.AllTable.data && setAllTables(Fetchs.AllTable.data), [Fetchs.AllTable.data])

    useEffect(() => (!Fetchs.Cost.data && Fetchs.Cost.handle(Services.Cost.get()), undefined), [Fetchs.Cost.data])
    useEffect(() => Fetchs.Cost.data && setCosts(Fetchs.Cost.data), [Fetchs.Cost.data])

    useEffect(() => (!Fetchs.Tick.data && Fetchs.Tick.handle(ServiceTick.get()), undefined), [Fetchs.Tick.data])
    useEffect(() => Fetchs.Tick.data && setTicks(Fetchs.Tick.data), [Fetchs.Tick.data])
    useEffect(() => {

        setInterval(() => {
            Fetchs.AllTable.handle(TService.get());
        }, 5000);
    }, [])
    useEffect(() => {
        if (currentSection == "all") {
            setTables(allTables!)
        }
        else {
            const tableList = allTables?.filter((table: any) => table.section == currentSection);
            setTables(tableList!)
        }
    }, [currentSection, allTables])

    useEffect(() => {
        if (allTables) {
            allTables?.forEach((table: any) => {
                if(table.safeSales){
                    setCaseSale(table);
                }
                if (!table.busy) {
                    return;
                }
                let brancName = getBranchName(table._id);
                if (table?.isPrint?.print) {
                    CheckService.get(table.id)
                        .then((result: any) => Printer.printCheck(result.data))
                        .then(() => TService.setPrint(table._id))
                }
                let orders = table?.orders?.filter((order: any) => !order.isPrint)
                if (orders.length > 0) {
                    const printData = {
                        table: table.title,
                        branch: brancName,
                        orders: orders?.map((order: any) => ({
                            name: order.productName,
                            quantity: order.quantity,
                            category: getCategory(order.productId)
                        }))
                    };
                    Printer.printKitchenByGroup(printData);
                    OService.print(table._id);
                }
            });

        }
    }, [allTables])

    const createUUID = () => {
        let dt = new Date().getTime();
        let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }

    const getBranchName = (tableID: string) => {
        Fetchs.Check.handle(CheckService.get(tableID))
        return Fetchs.Check?.data?.branch;
    }

    const getCategory = (productId: string) => {
        let category = "";
        if (BranchContext) {
            BranchContext[0]?.products?.forEach((product: any) => {
                if (product._id == productId) {
                    category = product.category;
                    return;
                }
            })
        }
        return category;
    }

    if (!Fetchs.Case.Create.data) {
        if (Fetchs.Case.Close.data || Fetchs.Case.Get.error?.response?.status === 404)
            return <NewCase Fetch={Fetchs.Case.Create} Service={CService} />
    }


    const Balance = (Fetchs.Case.Get.data?.balance as any[])?.filter(price => price.currency === "TL").map<number>(price => price.amount)
    const { id } = useParams();

    const checkForOpenTable = () => {
        let retunValue = false;
        allTables?.forEach((table: any) => {
            if (table.busy) {
                retunValue = true;
                return
            }
        })
        return retunValue;
    }

    function caseHandler() {
        t("close-case-description")
        const message = checkForOpenTable() ? t("there-are-open-tables") + "." + t("close-case-description") : t("close-case-description");
        Swal.fire({
            title: `${message}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: t("yes"),
            cancelButtonText: t("cancel")
        }).then((result) => {
            if (result.isConfirmed) {
                if (myCase[0].balance.length > 0) {
                    printReport("Z");
                    Fetchs.Case.Close.handle(CService.close());
                    Swal.fire({
                        title: t("case-closed"),
                        icon: "success"
                    })
                }
                else {

                    Swal.fire({
                        title:  t("report-warning"),
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: t("yes"),
                        cancelButtonText: t("cancel")
                    }).then((result: any) => {
                        if (result.isConfirmed) {
                            Fetchs.Case.Close.handle(CService.close());
                            Swal.fire({
                                title: t("case-closed"),
                                icon: "success"
                            })
                        }
                    })
                }
            }
        })
    }

    const handleMoveTable = (tableId: any) => {
        const data = {
            "from": id,
            "target": tableId
        }
        TService.transfer(data)
            .then(() => {
                Swal.fire({
                    title: t("table-moved"),
                    icon: "success",
                })
                    .then(() => window.location.href = "/")
            })
            .catch(() => {
                Swal.fire({
                    title: t("auth-err"),
                    icon: "error",
                })
                    .then(() => window.location.href = "/")
            })


    }

    const handleMoveProduct = (currentTable: any, targetTable: any) => {
        let productsToBeMoved = JSON.parse(window.localStorage.getItem("productsToBeMoved")!);
        if (productsToBeMoved) {
            const data = {
                orderIds: productsToBeMoved
            }
            OService.move(currentTable, targetTable, data)
                .then((response: any) => {
                    Swal.fire({
                        title:  t("products-moved"),
                        icon: "success"
                    }).then(() => window.location.href = "/")
                })
                .catch(() => {
                    Swal.fire({
                        title: t("auth-err"),
                        icon: "error"
                    }).then(() => window.location.href = "/")
                })
        }

    }

    const handleMergeCheck = (tableID: any) => {
        Swal.fire({
            title: t("empty-table"),
            icon: "error"
        })
    }
    const handleModal = (modalType: any) => {
        setCurrentModal(modalType)
        setModalOpen(true);
    }
    const closeModal = () => {
        setModalOpen(false);
    }

    const handleUpdateOldCheck = (checkID: string) => {
        setCheckID(checkID)
        setCurrentModal(MODAL.UPDATE_OLD_CHECK)
    }
    const printReport = (type: string) => {
        if (myCase[0].balance.length > 0) {
            CService.getZReport(myCase[0]?._id).then((response: any) => {
                Printer.printReport(response.data, type);
            })
            return;
        }
        Swal.fire({
            icon: "info",
            title: t("not-report")
        })
    }
    const props = {
        modalOpen, closeModal,
        oldCheckUser, setOldCheckUser,
        currentModal, setCurrentModal,
        caseSale, setCaseSale,
        Context,
        checkID, setCheckID,
        handleModal,
        myCase, setMyCase,
        allTables, setAllTables,
        table, setTable,
        handleUpdateOldCheck, createUUID,
        costs, setCosts,
        ticks, setTicks,
        sections,
        handleMoveTable,
        handleMergeCheck,
        handleMoveProduct,
        caseHandler,
        printReport,
        Services
    }
    return <>
        <div className="Home">
            {modalOpen && <Modals props={props} />}
            <div className="TableAndSections">
                <Tables tables={tables} props={props} />
                <Sections section={currentSection} sections={sections} setSection={(id: any) => selectedSection(id)} />
            </div>
            <Operations props={props} />
        </div>
    </>
}