import React, { useState, useEffect } from 'react'

import { useTranslation } from "react-i18next";

export const DateTime = () => {
    const { t } = useTranslation();

    var [date, setDate] = useState(new Date());

    useEffect(() => {
        var timer = setInterval(() => setDate(new Date()), 1000)
        return function cleanup() {
            clearInterval(timer)
        }

    });

    return (
        <div>
            <p> {t("hour")} : {date.toLocaleTimeString()}</p>
            <p> {t("date")} : {date.toLocaleDateString()}</p>

        </div>
    )
}
