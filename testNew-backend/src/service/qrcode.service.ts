import QRCode from 'qrcode'

//qr kodları oluşturur.
export async function createQrCodes(branch: string, input: any) {
    const qrCodes = await Promise.all(input.payloads.map(async (item: { section: string, table: string }) => {
        await createQrCode(branch, item)
        return "Done";
    }));
    return qrCodes
}

//qr kod oluşturur.
export async function createQrCode(branch: string, item: any) {
    return new Promise<void>((resolve, reject) => {
        QRCode.toFile(`public/qrcodes/${item.table}.png`, `https://api.digigarson.net/v1/app/${branch}/${item.section}/${item.table}`, {
            color: {
                dark: '#00F',  // Blue dots
                light: '#0000' // Transparent background
            }
        }, function (err) {
            if (err) throw err
            resolve()
        })
    })

}