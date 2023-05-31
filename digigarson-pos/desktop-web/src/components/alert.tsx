import UString from "utilities/string"

export type Type = "primary" | "secondary" | "success" | "danger" | "warning"

export default function ({ type, props, children }: { type: Type, props?: React.HTMLAttributes<HTMLDivElement>, children: JSX.Element }): JSX.Element {
    const getBackgroundColor = (type: Type = "primary"): string => {
        switch (type) {
            case "primary": return "bg-blue-100"
            case "secondary": return "bg-gray-100"
            case "success": return "bg-green-100"
            case "danger": return "bg-red-100"
            case "warning": return "bg-yellow-100"

            default: return "bg-blue-100"
        }
    }

    const getTextColor = (type: Type = "primary"): string => {
        switch (type) {
            case "primary": return "text-blue-900"
            case "secondary": return "text-gray-900"
            case "success": return "text-green-900"
            case "danger": return "text-red-900"
            case "warning": return "text-yellow-900"

            default: return "text-blue-900"
        }
    }

    const getBorderColor = (type: Type = "primary"): string => {
        switch (type) {
            case "primary": return "border-blue-200"
            case "secondary": return "border-gray-200"
            case "success": return "border-green-200"
            case "danger": return "border-red-200"
            case "warning": return "border-yellow-200"

            default: return "border-blue-200"
        }
    }

    return (
        <div className={UString.concat_class_name(props?.className, `py-3 px-5 ${getBackgroundColor(type)} ${getTextColor(type)} rounded-md border ${getBorderColor(type)}`)} role="alert">
            {children}
        </div>
    );
}