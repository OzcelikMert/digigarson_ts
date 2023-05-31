import { MouseEvent, useEffect, useState } from "react"
import { BlockPicker, ChromePicker } from "react-color"
import "./buttonRight.css"
import { useTranslation } from "react-i18next";


export default function ColorPicker({ props }: { props: any }) {
    const {
        lastClickedButtonPos,
        lastClickedButton,
        setColorPickerFired,

        caseSaleButtons, setCaseSaleButtons,
        rightButtons, setRightButtons,
        bottomButtons, setBottomButtons,
        takeawayButtons, setTakeawayButtons,
        lastClickedButtonElement, setLastClickedButtonElement
    } = props;

    const { t, i18n } = useTranslation();
    const [currentColor, setCurrentColor] = useState(lastClickedButton.color)
    useEffect(() => {
        setRightButtons(rightButtons);
        setBottomButtons(bottomButtons);
        setTakeawayButtons(takeawayButtons)
        setCaseSaleButtons(caseSaleButtons)
    }, [currentColor])
    const handleColorChange = (color: any) => {
        setCurrentColor(color.hex)
        lastClickedButtonElement.style.background = color.hex
        lastClickedButton.color = color.hex
        window.localStorage.setItem("rightButtons", JSON.stringify(rightButtons))
        window.localStorage.setItem("bottomButtons", JSON.stringify(bottomButtons))
        window.localStorage.setItem("takeawayButtons", JSON.stringify(takeawayButtons))
        window.localStorage.setItem("caseSaleButtons", JSON.stringify(caseSaleButtons))
    }

    const handleColorPickSave = (event: any) => {
        setColorPickerFired(false)
    }
    return (
        <div>
            <div className="colorPickerWrapper"
                style={{
                    position: "absolute",
                    zIndex: "10",
                    top: lastClickedButtonPos.y + 65,
                    left: lastClickedButtonPos.x
                }}>
                <div
                    onClick={(e) => handleColorPickSave(e)}
                    style={{
                        position: "absolute",
                        color: "white",
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                        zIndex: "259",
                        border: "1px solid white",
                        width: "fit-content"
                    }}>
                    {t("submit")}
                </div>
                <BlockPicker color={currentColor} onChange={handleColorChange} />
            </div>
        </div>
    )
}
