import { get, omit } from "lodash";
import { Request, Response } from "express";
import log from "../../logger";
import { createUser, updateUserPassword, validatePassword } from "../../service/user.service";
import { findAndUpdate } from "../../service/app.service";
import { UserDocument } from "../../model";

// @desc    create a new User
// @route   POST /v1/app/signup
// @access  Private
//kullanıcı girişi yapmak için kullanılan bir fonksiyon.
//kullanıcı adı ve şifre girdikten sonra eksik bilgi olması durumunda veya hatalı olma durumunda hata kodunu gösteren fonksiyon.
export async function createUserHandler(req: Request, res: Response) {
    try {
        const user = await createUser(req.body);
        return res.send(omit(user.toJSON(), "password"));
    } catch (e: any) {
        log.error(e);
        return res.status(401).send(e.message);
    }
}


// @desc    update  user
// @route   PUT /v1/app/users/update
// @access  Private
//Çalışan bilgilerini günceller branchine çalışan atar.
export async function updateUserHandler(req: Request, res: Response) {
    try {
        const userId = get(req, "user._id")
        const data = req.body
        let user = await findAndUpdate({ _id: userId }, data, { new: true })
        if (!user) return res.status(404).json({ success: false, message: "User not found." })
        return res.send(omit(user, "password"));
    } catch (e: any) {
        return res.status(400).send(e.message);
    }
}


// @desc    update  user password
// @route   PUT /v1/app/users/update/password
// @access  Private
//Çalışan bilgilerini günceller branchine çalışan atar.
export async function updateUserPasswordHandler(req: Request, res: Response) {
    try {
        const userId = get(req, "user._id")
        const email = get(req, "user.email")
        const password = get(req.body, "oldPassword")
        const data = req.body
        let user: any = await validatePassword({email: email, password: password}) as unknown as UserDocument;
        if (!user) return res.status(400).send("User not found");
        await updateUserPassword(data.newPassword, userId)
        return res.send("Password updated successfully.");
    } catch (e: any) {
        return res.status(400).send(e.message);
    }
}