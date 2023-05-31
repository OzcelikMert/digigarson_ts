import { Request, Response } from "express";
import { get } from "lodash";
import { findOneBranch } from "../../service/branch.service";
import { findSection } from "../../service/section.service";
import { findTable } from "../../service/table.service";

// @desc    get my location
// @route   POST /v1/app/getmylocation
// @access  Public
//Bu fonksiyon ile bulunduğu konumdaki işleyişinde hata olup olmadığını kontrol ediyoruz.
//parametreden gelen brach,section ve table bulup eğer varsa  title ve _idlerini gönderiyor, yoksa hata koduna gönderiyor.
export async function getMyLocationHandler(req: Request, res: Response) {
    try {
        const branchId = get(req.params, ("branchId"));
        const tableId = get(req.params, ("tableId"));
        let branch: any = await findOneBranch({ _id: branchId });
        let table: any = await findTable({ _id: tableId });

        if (branch && table)
            return res.send({ branch: branch.title, table: table.title, tableId: table._id, branchId: branch._id })
        else
            return res.status(404).send("QR Kodu yıpranmış veya geçersiz.")

    } catch (e: any) {
        return res.sendStatus(404);
    }
}