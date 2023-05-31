const crypto = require("crypto");
const fs = require("original-fs")

module.exports.checksum_file = (path) => {
    const hash = crypto.createHash("sha256")
    return new Promise((resolve, reject) => {
        fs.createReadStream(path)
            .pipe(hash.setEncoding("hex"))
            .on("finish", () => resolve(hash.read()))
            .on("error", error => reject(error))
    })
}