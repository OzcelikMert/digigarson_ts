import { get, omit, update } from "lodash";
import { Request, Response } from "express";
import {
    createBranchManager, findUser, findOneUser, countUser, updateUser, createRegionalManager,
    findBranchManagers, countBranchManagers, findOneManageUser,
    findAdminUsers, countAdminUsers, findOneAdminUser, findOneBranchCrewUser, countBranchCrewUsers,
    findBranchCrewUsers
} from "../../service/user.service";
import { findOneBranch } from "../../service/branch.service";
import log from "../../logger";
import { roles_types } from "../../statics/types";




// @desc    create a new User
// @route   POST /v1/superadmin/user
// @access  Private
//süper admin olarak görev yaptığı yeni kullanıcı ekler. ve kontrolleri sağlar.
export async function createUserHandler(req: Request, res: Response) {
    try {
        const { role, branchId } = req.body
        const permissions: number[] = roles_types[req.body.role]
        let user: any;
        if (role === "regionalmanager") {

            user = await createRegionalManager({ ...req.body, permissions });

        } else if (role === "superbranchmanager") {

            return res.sendStatus(200)
        } else if (role === "branchmanager") {
            let branch: any = await findOneBranch({ _id: branchId })
            if (!branch) return res.status(404).json({ success: false, message: "Branch not found" })
            user = await createBranchManager({ ...req.body, permissions });
        } else if (role === "branchaccounting") {
            let branch: any = await findOneBranch({ _id: branchId })
            if (!branch) return res.status(404).json({ success: false, message: "Branch not found" })
            user = await createBranchManager({ ...req.body, permissions });
        }

        return res.send(omit(user.toJSON(), "password"));
    } catch (e: any) {
        return res.status(409).send(e.message);
    }
}



// @desc    get All Users
// @route   GET /v1/superadmin/users
// @access  Private
//süper admin olarak görev yaptığı kullanıcıların hepsinin listesini gönderir.
export async function getAllUsersHandler(req: Request, res: Response) {
    const range = req.query

    try {
        let _mongoQuery = JSON.parse(get(req, "params._mongoQuery"))
        let _mongoOptions = JSON.parse(get(req, "params._mongoOptions"))
        const users = await findUser(_mongoQuery, _mongoOptions);
        const count = await countUser({});
        res.setHeader("Content-Range", `users ${range._start}-${range._end}/${count}`);
        res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count')
        res.setHeader('X-Total-Count', count)


        res.send(users.map((user) => (omit(Object.assign(user, { id: user._id }), "_id"))))
    } catch (e: any) {
        log.error(e);
        return res.status(409).send(e.message);
    }
}


// @desc    get All Users
// @route   GET /v1/superadmin/branchmanagers
// @access  Private
//Branch managers listesini dönderir.
export async function getAllBranchManagersHandler(req: Request, res: Response) {
    const range = req.query

    try {
        let _mongoQuery = JSON.parse(get(req, "params._mongoQuery"))
        let _mongoOptions = JSON.parse(get(req, "params._mongoOptions"))
        const users = await findBranchManagers(_mongoQuery, _mongoOptions);
        const count = await countBranchManagers({});
        res.setHeader("Content-Range", `branchmanages ${range._start}-${range._end}/${count}`);
        res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count')
        res.setHeader('X-Total-Count', count)



        return res.send(users.map((user) => (omit(Object.assign(user, { id: user._id }), "_id"))))
    } catch (e: any) {
        log.error(e);
        return res.status(409).send(e.message);
    }
}

// @desc    get All Adminusers
// @route   GET /v1/superadmin/admins
// @access  Private
//Admin Users listesini dönderir.
export async function getAllAdminUsersHandler(req: Request, res: Response) {
    const range = req.query

    try {
        let _mongoQuery = JSON.parse(get(req, "params._mongoQuery"))
        let _mongoOptions = JSON.parse(get(req, "params._mongoOptions"))
        const users = await findAdminUsers(_mongoQuery, _mongoOptions);
        const count = await countAdminUsers({});
        res.setHeader("Content-Range", `adminusers ${range._start}-${range._end}/${count}`);
        res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count')
        res.setHeader('X-Total-Count', count)



        return res.send(users.map((user) => (omit(Object.assign(user, { id: user._id }), "_id"))))
    } catch (e: any) {
        log.error(e);
        return res.status(409).send(e.message);
    }
}

// @desc    get User By Id
// @route   GET /v1/superadmin/users/:userId
// @access  Private
//süper admin olarak görev yaptığı parametreden gelen userId gönderir.
export async function getUserHandler(req: Request, res: Response) {
    try {
        const userId = get(req, "params.userId");
        let user = await findOneUser({ _id: userId });
        user = Object.assign(user, { id: userId });
        res.send(user)
    } catch (e: any) {
        log.error(e);
        return res.status(409).send(e.message);
    }
}
// @desc    get User By Id
// @route   GET /v1/superadmin/branchmanagers/:id
// @access  Private
//süper admin olarak görev yaptığı parametreden gelen userId gönderir.
export async function getAdminUserHandler(req: Request, res: Response) {
    try {
        const id = get(req, "params.id");
        let user = await findOneAdminUser({ _id: id });
        user = Object.assign(user, { id });
        return res.send(user)
    } catch (e: any) {
        log.error(e);
        return res.status(409).send(e.message);
    }
}

// @desc    get User By Id
// @route   GET /v1/superadmin/branchmanagers/:id
// @access  Private
//süper admin olarak görev yaptığı parametreden gelen userId gönderir.
export async function getBranchManageHandler(req: Request, res: Response) {
    try {
        const id = get(req, "params.id");
        let user = await findOneManageUser({ _id: id });
        user = Object.assign(user, { id });
        return res.send(user)
    } catch (e: any) {
        log.error(e);
        return res.status(409).send(e.message);
    }
}

// @desc    get User By Id
// @route   GET /v1/superadmin/admins/:id
// @access  Private
//admin userini getirir
export async function getAdminUsersHandler(req: Request, res: Response) {
    try {
        const id = get(req, "params.id");
        let user = await findAdminUsers({ _id: id });
        user = Object.assign(user, { id });
        return res.send(user)
    } catch (e: any) {
        log.error(e);
        return res.status(409).send(e.message);
    }
}


// @desc    get All Users
// @route   GET /v1/superadmin/users
// @access  Private
//süper admin olarak görev yaptığı kullanıcıların hepsinin listesini gönderir.
export async function getAllBranchCrewUsersHandler(req: Request, res: Response) {
    const range = req.query

    try {
        let _mongoQuery = JSON.parse(get(req, "params._mongoQuery"))
        let _mongoOptions = JSON.parse(get(req, "params._mongoOptions"))
        const users = await findBranchCrewUsers(_mongoQuery, _mongoOptions);
        const count = await countBranchCrewUsers(_mongoQuery);
        res.setHeader("Content-Range", `users ${range._start}-${range._end}/${count}`);
        res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count')
        res.setHeader('X-Total-Count', count)



        res.send(users.map((user) => (omit(Object.assign(user, { id: user._id }), "_id"))))
    } catch (e: any) {
        log.error(e);
        return res.status(409).send(e.message);
    }
}

// @desc    get User By Id
// @route   GET /v1/superadmin/users/:userId
// @access  Private
//süper admin olarak görev yaptığı parametreden gelen userId gönderir.
export async function getBranchCrewUserHandler(req: Request, res: Response) {
    try {
        const id = get(req, "params.id");
        let user = await findOneBranchCrewUser({ _id: id });
        user = Object.assign(user, { id });
        return res.send(user)
    } catch (e: any) {
        log.error(e);
        return res.status(409).send(e.message);
    }
}

// @desc    add user permission
// @route   POST /v1/superadmin/adduserpermmission
// @access  Private
//süper admin olarak görev yapan kullanıcı erişim izni ekler.
export async function addPermission(req: Request, res: Response) {
    try {
        const userId = get(req.body, "userId");
        const permission = get(req.body, "permission");
        let user = await findOneUser({ _id: userId });
        if (user) {
            user = await updateUser(permission, userId);
            return res.send(user);
        } else
            return res.status(404).send("User is not found.");
    } catch (e: any) {
        return res.status(404).send(e.message);
    }
}