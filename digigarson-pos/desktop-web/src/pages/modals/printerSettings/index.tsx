import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react"
import "./printer.css";
import Printer from "services/printer"
import { useContext } from "react"
import Branch from "services/branch";

export default () => {
    const { t, i18n } = useTranslation();
    const BranchContext = useContext(Branch.Context)!;

    const { ipcRenderer } = window.require("electron")
    const [editPrinter, setEditPrinter] = useState<any>();
    const [selectedPrinter, setSelectedPrinter] = useState<any>()
    const [groupPrinterInput, setGroupPrinterInput] = useState({
        name: "",
        printer_name: "",
        categories: []
    })

    const categoryList: any[] = BranchContext[0]?.categories
    const PrinterConfig: any[] = []
    const currentSelectedSafePrinter: any = { printer_name: "deneme", name: "name" }

    const [printerName, setPrinterName] = useState<string>(Printer.CurrentSafePrinterName || String());
    const [groupPrinter, setGroupPrinter] = useState<{ printer: string, name: string, categories: any[] }>({ printer: String(), name: String(), categories: [] });

    const handleGroupPrinterInput = (e: any) => {
        Printer.CurrentPrinter = e.target.value
        Printer.saveSettings(0);
    }

    const handlePrinterNameInput = (e: any) => {
        setPrinterName(e.target.value);
        Printer.CurrentSafePrinterName = e.target.value
        Printer.saveSettings(0);
    }

    const handleSave = () => {

    }

    const isPrinterSelected = (printerName: any) => currentSelectedSafePrinter.printer_name === printerName

    const PrinterList = ({ selected }: { selected: string }) => {
        return Printer?.Printers?.map((x: any) => <option selected={x.name === selected} value={x.name}>
            {x.displayName}
        </option>)
    }

    const GroupPrinterList = () => {
        return Printer?.Printers?.filter((x: any) => !Printer.Groups.some(a => a.printer == x.name)).map((x: any) => <option selected={x.name === groupPrinter.printer} value={x.name}>
            {x.displayName}
        </option>)
    }

    const addGroupPrinter = () => {

    }

    const findPrinterInGroup = (printerName: any) => Printer.Groups.filter((_: { name: any; }) => _.name === printerName)[0]

    return (
        <main className="printerSettings">
            <section>
                <article>
                    <div> </div>
                </article>
            </section>
            <section>
                <article>
                    <div>
                        <div><h3>{t("general-printer-setup")}</h3></div>
                        <div>
                            <label htmlFor="globalPrinter">{t("general-printer")}</label>
                            <select onChange={(e) => handleGroupPrinterInput(e)} id="globalPrinter">
                                <PrinterList selected={Printer.CurrentPrinter!} />
                            </select>
                        </div>
                        <div>
                            <label htmlFor="printerNames">{t("receipt-name")}</label>
                            <input type="text" id="safePrinterName" onChange={handlePrinterNameInput} value={printerName} />
                        </div>
                    </div>
                </article>
                <article>
                    <div>
                        <div><h3>{t("group-printer-setting")}</h3></div>
                        <div>
                            <span>{t("group-printers")}</span>
                            <select name="printer_name" id="grupPrinters" onChange={(event) => setGroupPrinter({ printer: event.target.value, name: groupPrinter.name, categories: groupPrinter.categories })}>
                                <option>{t("make-choice")}</option>
                                <GroupPrinterList />
                            </select>
                        </div>
                        <div>
                            <label htmlFor="printerNames">{t("name-the-printer")}</label>
                            <div className="createPrinter">
                                <input
                                    onChange={e => setGroupPrinter({ printer: groupPrinter.printer, name: e.target.value, categories: groupPrinter.categories })}
                                    type="text" name="name" id="groupPrinterName" value={groupPrinter.name}
                                />
                            </div>
                            <button
                                id="btnOlustur"
                                onClick={() => groupPrinter.printer && (Printer.Groups.push({ id: Printer.Groups.length + 1, ...groupPrinter }), Printer.saveSettings(1), setGroupPrinter({ printer: String(), name: String(), categories: [] }))}>
                                {t("create")}
                            </button>
                            <div className="createdPrinter">
                                <div><h3>{t("choose-group")}</h3></div>
                                <table className="PrinterTable">
                                    <thead>
                                        <tr>
                                            <th>{t("printer-groups")}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            Printer.Groups.map((group: any) =>
                                                <tr
                                                    style={{ backgroundColor: group.name === selectedPrinter ? "red" : "white" }}
                                                    onClick={() => setSelectedPrinter(group.name)}>
                                                    <td>
                                                        <span className="flex flex-row px-1">
                                                            <div className="truncate">{group.name}-{group.printer}</div>
                                                        </span>
                                                        <button onClick={(event) => (event.stopPropagation(), Printer.Groups = Printer.Groups.filter(x => x.printer !== group.printer), Printer.saveSettings(1), window.location.reload())} className="bg-red-500 px-2 ml-5">x</button>
                                                    </td>
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </article>
                <article>
                    <div>
                        <div><h3>{t("product-categories")}</h3></div>
                        <div>
                            <table className="PrinterTable">
                                <thead>
                                    <tr>
                                        <th>{t("category-name")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        BranchContext[0]?.categories.map((_: any) => {
                                            if (!selectedPrinter) return
                                            const categorySelected =
                                                (findPrinterInGroup(selectedPrinter).categories.findIndex((e: any) => e === _._id) === -1) ? false : true
                                            if (categorySelected) {
                                                return <tr
                                                    onClick={() => {
                                                        const find = Printer.Groups[Printer.Groups.findIndex((e: { name: any; }) => e.name === selectedPrinter)]
                                                        Printer.Groups[Printer.Groups.findIndex((e: { name: any; }) => e.name === selectedPrinter)].categories = find.categories
                                                            .filter((x: any) => x !== _._id);
                                                        setEditPrinter({
                                                            ...editPrinter,
                                                            groups: Printer.Groups
                                                        })
                                                        Printer.saveSettings(1);
                                                    }}
                                                    style={{
                                                        backgroundColor: categorySelected ? "green" : "transparent",
                                                        color: "white"
                                                    }}>
                                                    {_.title}
                                                </tr>
                                            } else {
                                                return (
                                                    <tr
                                                        onClick={() => {
                                                            Printer.Groups[Printer.Groups.findIndex((e: { name: any; }) => e.name === selectedPrinter)].categories.push(_._id)
                                                            setEditPrinter({
                                                                ...editPrinter,
                                                                groups: Printer.Groups
                                                            })
                                                            Printer.saveSettings(1);
                                                        }}
                                                    >
                                                        {_.title}
                                                    </tr>
                                                )
                                            }
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </article>
            </section>
        </main>
    )
}

