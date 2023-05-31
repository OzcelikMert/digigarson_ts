
import { useTranslation } from "react-i18next";

export default ({ props }: { props: any }) => {
        const { t, i18n } = useTranslation();
        const {
                handleClick,
                buttonNameList,
                bottomButtons,
                handleRightClick
        } = props

        return <div className="buttonBottom">
                {bottomButtons && bottomButtons.map((button: any, i: number) =>
                        <button
                                style={{ backgroundColor: button.color }}
                                onClick={(event) => handleClick(button.name, event, i)}
                                onContextMenu={(event) => handleRightClick(event, i, button, "bottom")}
                                data-toggle="modal"
                                data-target="#globalModal">{t(button.name)}
                        </button>)}
        </div>
}
