import React, {Component} from "react";
import "./printer.css";
import Printer from "../../../../../config/global/printers/index";
import {PagePropCommonDocument} from "modules/views/pages/pageProps";

interface IGroupPrinter {
    printer: string;
    name: string;
    categories: any;
}

type PageState = {
    editPrinter: any;
    selectedPrinter: any;
    printerName: string;
    groupPrinter: IGroupPrinter;
};

type PageProps = {} & PagePropCommonDocument;

class PrinterSettings extends Component<PageProps, PageState> {
    constructor(props: any) {
        super(props);
        this.state = {
            editPrinter: {},
            selectedPrinter: "",
            printerName: Printer.Settings.CurrentSafePrinterName || "",
            groupPrinter: {
                printer: "",
                name: "",
                categories: [],
            },
        };
    }

    handleGroupPrinterInput(e: any) {
        Printer.Settings.CurrentPrinter = e.target.value;
        Printer.Settings.saveSettings(0);
    }

    handlePrinterNameInput = (e: any) => {
        this.setState({
            printerName: e.target.value,
        });
        Printer.Settings.CurrentSafePrinterName = e.target.value;
        Printer.Settings.saveSettings(0);
    }

    PrinterList({selected}: { selected: string }) {
        return Printer?.Print.Printers?.map((x: any) => (
            <option selected={x.name === selected} value={x.name}>
                {x.displayName}
            </option>
        ));
    }

    GroupPrinterList = () => {
        return Printer?.Print.Printers?.filter(
            (x: any) => !Printer.Settings.Groups.some((a) => a.printer == x.name)
        ).map((x: any) => (
            <option
                selected={x.name === this.state.groupPrinter.printer}
                value={x.name}
            >
                {x.displayName}
            </option>
        ));
    }

    findPrinterInGroup = (printerName: any) =>
        Printer.Settings.Groups.filter((_: { name: any }) => _.name === printerName)[0];

    render(): React.ReactNode {
        return (
            <main className="printerSettings">
                <section>
                    <article>
                        <div></div>
                    </article>
                </section>
                <section>
                    <article>
                        <div>
                            <div>
                                <h3>{this.props.router.t("general-printer-setup")}</h3>
                            </div>
                            <div>
                                <label htmlFor="globalPrinter">
                                    {this.props.router.t("general-printer")}
                                </label>
                                <select
                                    onChange={(e) => this.handleGroupPrinterInput(e)}
                                    id="globalPrinter"
                                >
                                    <this.PrinterList selected={Printer.Settings.CurrentPrinter!}/>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="printerNames">
                                    {this.props.router.t("receipt-name")}
                                </label>
                                <input
                                    type="text"
                                    id="safePrinterName"
                                    onChange={this.handlePrinterNameInput}
                                    value={this.state.printerName}
                                />
                            </div>
                        </div>
                    </article>
                    <article>
                        <div>
                            <div>
                                <h3>{this.props.router.t("group-printer-setting")}</h3>
                            </div>
                            <div>
                                <span>{this.props.router.t("group-printers")}</span>
                                <select
                                    name="printer_name"
                                    id="grupPrinters"
                                    onChange={(event) =>
                                        this.setState({
                                            groupPrinter: {
                                                printer: event.target.value,
                                                name: this.state.groupPrinter.name,
                                                categories: this.state.groupPrinter.categories,
                                            },
                                        })
                                    }
                                >
                                    <option>{this.props.router.t("make-choice")}</option>
                                    <this.GroupPrinterList/>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="printerNames">
                                    {this.props.router.t("name-the-printer")}
                                </label>
                                <div className="createPrinter">
                                    <input
                                        onChange={(e) =>
                                            this.setState({
                                                groupPrinter: {
                                                    printer: this.state.groupPrinter.printer,
                                                    name: e.target.value,
                                                    categories: this.state.groupPrinter.categories,
                                                },
                                            })
                                        }
                                        type="text"
                                        name="name"
                                        id="groupPrinterName"
                                        value={this.state.groupPrinter.name}
                                    />
                                </div>
                                <button
                                    id="btnOlustur"
                                    onClick={() =>
                                        this.state.groupPrinter.printer &&
                                        (Printer.Settings.Groups.push({
                                            id: Printer.Settings.Groups.length + 1,
                                            ...this.state.groupPrinter,
                                        }),
                                            Printer.Settings.saveSettings(1),
                                            this.setState({
                                                groupPrinter: {
                                                    printer: String(),
                                                    name: String(),
                                                    categories: [],
                                                },
                                            }))
                                    }
                                >
                                    {this.props.router.t("create")}
                                </button>
                                <div className="createdPrinter">
                                    <div>
                                        <h3>{this.props.router.t("choose-group")}</h3>
                                    </div>
                                    <table className="PrinterTable">
                                        <thead>
                                        <tr>
                                            <th>{this.props.router.t("printer-groups")}</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {Printer.Settings.Groups.map((group: any) => (
                                            <tr
                                                style={{
                                                    backgroundColor:
                                                        group.name === this.state.selectedPrinter
                                                            ? "red"
                                                            : "white",
                                                }}
                                                onClick={() =>
                                                    this.setState({
                                                        selectedPrinter: group.name,
                                                    })
                                                }
                                            >
                                                <td>
                            <span className="flex flex-row px-1">
                              <div className="truncate">
                                {group.name}-{group.printer}
                              </div>
                            </span>
                                                    <button
                                                        onClick={(event) => (
                                                            event.stopPropagation(),
                                                                (Printer.Settings.Groups = Printer.Settings.Groups.filter(
                                                                    (x) => x.printer !== group.printer
                                                                )),
                                                                Printer.Settings.saveSettings(1),
                                                                window.location.reload()
                                                        )}
                                                        className="bg-red-500 px-2 ml-5"
                                                    >
                                                        x
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </article>
                    <article>
                        <div>
                            <div>
                                <h3>{this.props.router.t("product-categories")}</h3>
                            </div>
                            <div>
                                <table className="PrinterTable">
                                    <thead>
                                    <tr>
                                        <th>{this.props.router.t("category-name")}</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.props.getGlobalData.Categories.map((_: any) => {
                                        if (!this.state.selectedPrinter) return;
                                        const categorySelected =
                                            this.findPrinterInGroup(
                                                this.state.selectedPrinter
                                            ).categories.findIndex((e: any) => e === _._id) === -1
                                                ? false
                                                : true;
                                        if (categorySelected) {
                                            return (
                                                <tr
                                                    onClick={() => {
                                                        const find =
                                                            Printer.Settings.Groups[
                                                                Printer.Settings.Groups.findIndex(
                                                                    (e: { name: any }) =>
                                                                        e.name === this.state.selectedPrinter
                                                                )
                                                                ];
                                                        Printer.Settings.Groups[
                                                            Printer.Settings.Groups.findIndex(
                                                                (e: { name: any }) =>
                                                                    e.name === this.state.selectedPrinter
                                                            )
                                                            ].categories = find.categories.filter(
                                                            (x: any) => x !== _._id
                                                        );
                                                        this.setState({
                                                            editPrinter: {
                                                                ...this.state.editPrinter,
                                                                groups: Printer.Settings.Groups,
                                                            },
                                                        });
                                                        Printer.Settings.saveSettings(1);
                                                    }}
                                                    style={{
                                                        backgroundColor: categorySelected
                                                            ? "green"
                                                            : "transparent",
                                                        color: "white",
                                                    }}
                                                >
                                                    {_.title}
                                                </tr>
                                            );
                                        } else {
                                            return (
                                                <tr
                                                    onClick={() => {
                                                        Printer.Settings.Groups[
                                                            Printer.Settings.Groups.findIndex(
                                                                (e: { name: any }) =>
                                                                    e.name === this.state.selectedPrinter
                                                            )
                                                            ].categories.push(_._id);
                                                        this.setState({
                                                            editPrinter: {
                                                                ...this.state.editPrinter,
                                                                groups: Printer.Settings.Groups,
                                                            },
                                                        });
                                                        Printer.Settings.saveSettings(1);
                                                    }}
                                                >
                                                    {_.title}
                                                </tr>
                                            );
                                        }
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </article>
                </section>
            </main>
        );
    }
}

export default PrinterSettings;
