import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

export default ({ tables, props }: { tables: any, props: any }) => {
    const [time, setTime] = useState(Date.now());
    const { t } = useTranslation();
    const { id, type } = useParams();
    const {
        handleMoveTable,
        handleMergeCheck,
        handleMoveProduct,
        sections
    } = props;
    function getTableBusyRatio() {
        let busy = 0;
        if (tables && tables.length > 0) {
            tables.forEach((table: any) => {
                if (table.busy)
                    busy++;
            });
            return Math.floor((busy / tables.length) * 100);
        }
        return 0
    }
    useEffect(() => {
        var timer = setInterval(() => setTime(Date.now()), 60000)
        return function cleanup() {
            clearInterval(timer)
        }

    });


    const handleTableClick = (table: any) => {
        if (id) {
            if (type == "moveproduct") {
                handleMoveProduct(id, table._id)
                return;
            }
            else if (id != table._id) {
                if (table.busy) {
                    handleMergeCheck(table._id)
                    // Swal.fire({
                    //     title: "Adisyonlar birleştirildi",
                    //     icon: "success",
                    // })
                    //     .then(() => window.location.href = "/table/" + table._id)
                    return
                }
                else {
                    handleMoveTable(table._id)
                    return
                }
            }
        }
        window.location.href = "/table/" + table._id
    }
    const getColor = (table: any, time: any) => {
        if (table._id == id) {
            return "brown";
        }
        else if (table.busy) {
            if(table?.isPrint?.status){
                return "blue";
            }
            if (time - new Date(table.updatedAt).getTime() > 2700000) {
                return "orange";
            }
            return "green";
        }
        else {
            return "#485563";
        }
    }
    const getTime = (iso: any) => {
        let locale = new Date(iso).toLocaleTimeString("tr").split(":")
        return locale[0] + ":" + locale[1];
    }

    const getSectionName = (id:any)=>{
        let section = sections?.find((sec:any)=>sec._id==id);
        return section?.title;
    }

    const Table = (table:any) =>{
        table=table.table;
        if(table.safeSales){
            return null;
        }
        return (<article
            id={table._id}
            style={{ backgroundColor: getColor(table, time), left: 5, top: 5, }}
            onClick={() => handleTableClick(table)}>
            <div className='in'>
                <div className='tableTitle'>
                    <span>
                        {table.title}
                    </span>
                </div>
                <div>
                    <span>
                        {getSectionName(table.section)}
                    </span>
                </div>
                <div className='tableDate'>
                    <span>
                        {getTime(table.createdAt)}
                    </span>
                    <span>
                        {getTime(table.updatedAt)}
                    </span>
                </div>
            </div>
        </article>);
    }

    return (
        <main className="Tables">
            <div className="headerBar">
                <div>{t("occupancy")}: {getTableBusyRatio()}%</div>
                <div className="TableEdit">
                    <div onClick={() => EditTableHandler("start")}>{t("edit-tables")}</div>
                </div>
            </div>
            <section>
                {tables && tables.length > 0 ?
                    tables.map((table: any) => <Table table={table}/>) : <div className="caseClosed">{t("no-tables")}</div>
                }

            </section>
        </main>
    )
}


function EditTableHandler(arg0: string): void {
    throw new Error("Function not implemented.");
}
