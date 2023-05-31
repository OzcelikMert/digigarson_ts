import { Outlet } from "react-router-dom";

export default function () {
    const { ipcRenderer } = window.require("electron");

    return <>
        <div className="flex items-center bg-ebony text-white pl-2 z-20 drag">
            <div className="text-sm">Digigarson POS</div>
            <div className="flex items-center ml-auto no-drag">
                <button onClick={() => ipcRenderer.send("minimize")} className="p-2 hover:bg-white hover:bg-opacity-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
                    </svg>
                </button>
                <button onClick={() => ipcRenderer.send("exit")} className="bg-red-500 hover:bg-red-600 p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
        <Outlet />
    </>
}