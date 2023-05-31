import React, { useState, useEffect } from 'react';
import "../check.css"
import { BlockPicker } from 'react-color';
import Swal from 'sweetalert2'
import "./buttonRight.css"
import ColorPicker from './colorPicker';
import { useTranslation } from "react-i18next";

export default ({ props }: { props: any }) => {

    const { t, i18n } = useTranslation();
    const {
        handleClick,
        rightButtons,
        buttonNameList,
        handleRightClick,
        colorPickerFired,
        customerId,
        takeawayButtons,
        caseSaleButtons,
        currentTable
    } = props;
    const [buttons, setButtons] = useState<any[]>([])

    useEffect(() => setButtons(customerId ? takeawayButtons : currentTable.safeSales ? caseSaleButtons : rightButtons), [rightButtons, takeawayButtons, caseSaleButtons])
    return (
        <div className="rightButtons">
            {colorPickerFired && <ColorPicker props={props} />}
            {buttons &&
                buttons?.map((button: any, i: number) =>
                    <button
                        style={{ backgroundColor: button.color }}
                        onClick={(event) => handleClick(button.name, event, i)}
                        onContextMenu={(event) => handleRightClick(event, i, button, "right")}
                        data-toggle="modal"
                        data-target="#globalModal">{t(button.name)}
                    </button>)}
        </div>
    )
}