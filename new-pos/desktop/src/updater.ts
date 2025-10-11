import app from "electron";
import crypto from "crypto";
import fs from "original-fs";
import axios from "axios";
import {version} from "../package.json"

/*const server = module.exports.server = {
    protocol: "http",
    host: "localhost",
    port: 3000
}

const checksum_file = exports.checksum_file = (path) => {
    const hash = crypto.createHash("sha256")
    return new Promise((resolve, reject) => {
        fs.createReadStream(path)
            .pipe(hash.setEncoding("hex"))
            .on("finish", () => resolve(String(hash.read()).toUpperCase()))
            .on("error", error => reject(error))
    })
}

exports.checkForUpdates = () => {
    return new Promise(resolve =>
        axios.get(`${server.protocol}://${server.host}:${server.port}`)
            .then(({ data }) =>
                checksum_file(app.getAppPath())
                    .then(hash => resolve(data.version !== version || data.hash !== hash))
                    .catch(() => resolve(false))
            )
            .catch(() => resolve(false))
    )
}

exports.downloadAsar = () => {
    return new Promise(resolve =>
        axios.get(`${server.protocol}://${server.host}:${server.port}/get-asar`, { responseType: "stream" })
            .then(({ data }) => resolve((data.pipe(fs.createWriteStream(app.getAppPath())), true)))
            .catch(() => resolve(false))
    )
}*/