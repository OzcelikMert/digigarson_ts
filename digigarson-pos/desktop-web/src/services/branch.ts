import React from "react"

export default class Branch {
    public static createInstance(initialValue?: any): [any, React.Dispatch<any>] {
        return React.useState<any>(initialValue)
    }

    public static Context: React.Context<[any, React.Dispatch<any>] | null> = React.createContext<[any, React.Dispatch<any>] | null>(null);
}