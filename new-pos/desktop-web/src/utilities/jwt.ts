import UString from "utilities/string"

export class JsonWebToken {
    public static parse<Class>(token: string): Class {
        return JSON.parse(UString.decode_base64(token.split(".").at(1)!))
    }

    public static verifyExpireTime(time: Date | null): boolean {
        if (!time) return false;

        return !Boolean(time < new Date())
    }
}