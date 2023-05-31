export default class UString {
    public static get space() {
        return String().padStart(1)
    }

    public static concat_class_name(class_name: string | undefined, ...args: string[]) {
        return (class_name?.concat(UString.space) || String()).concat(args.join(UString.space))
    }

    public static encode_base64(text: string): string {
        return window.btoa(String.fromCharCode(...Array.from(new TextEncoder().encode(text))));
    }

    public static decode_base64(encoded: string): string {
        return new TextDecoder().decode(new Uint8Array(Array.from(window.atob(encoded)).map(char => char.charCodeAt(Number()))));
    }

    public static broofa() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}