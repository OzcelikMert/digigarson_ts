import { get, omit } from "lodash";
import { Request, Response } from "express";
import { findBranchCrewUsers, countBranchCrewUsers, findOneBranchCrewUser, setCrewMemberPermissions, createCrewMember, crewMemberfindAndUpdate, deleteCrewMember } from "../../service/user.service";
import { findOneBranch } from "../../service/branch.service";
import log from "../../logger";
import { roles_types } from "../../statics/types";




// @desc    create a new crew user
// @route   POST /v1/manager/members
// @access  Private
//Manager branchine çalışan atar.
export async function createBranchUserHandler(req: Request, res: Response) {
    try {
        const { role } = req.body
        const branchId = get(req, "user.branchId")
        const permissions: number[] = roles_types[req.body.role]
        let branch: any = await findOneBranch({ _id: branchId })
        if (!branch) return res.status(404).json({ success: false, message: "Branch not found" })
        await req.body.permissions?.map((e: any) =>{
        permissions.push(e)
        })
        let user = await createCrewMember({ ...req.body, permissions, branchId, branch_custom_id: branch.custom_id });
        return res.send(omit(user.toJSON(), "password"));
    } catch (e: any) {
        return res.status(409).send({ success: false, message: "This password already using." });
    }
}

// @desc    update  crew user
// @route   PUT /v1/manager/members/:memberId
// @access  Private
//Çalışan bilgilerini günceller branchine çalışan atar.
export async function updateBranchCrewUserHandler(req: Request, res: Response) {
    try {
        const branchId = get(req, "user.branchId")
        const memberId = get(req, "params.crewMemberUserId")
    
        let user = await findOneBranchCrewUser({ _id: memberId, branchId });
 
        if (!user) return res.status(404).json({ success: false, message: "Crew member not found." })

        user = await crewMemberfindAndUpdate({ _id: memberId }, req.body)
        return res.send(omit(user, "password"));
    } catch (e: any) {
        return res.status(409).send({ success: false, message: "This password is in use." });
    }
}
// @desc    Delete Crew User by Id
// @route   DEL /v1/manager/members/:memberId
// @access  Private
//manager olarak görev yapan branch içerisinde bir crew memberi siler
export async function deleteBranchCrewUserHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");



    const memberId = get(req.params, "crewMemberUserId");

    let user = await findOneBranchCrewUser({ _id: memberId, branchId });

    if (!user) return res.status(404).json({ success: false, message: "Crew member not found." })


    await deleteCrewMember({ _id: memberId })
    return res.sendStatus(200)

}


// @desc    get All Users
// @route   GET /v1/manager/users
// @access  Private
//manager olarak görev yaptığı kullanıcıların hepsinin listesini gönderir.
export async function getBranchCrewUsersHandler(req: Request, res: Response) {
    const range = req.query

    try {
        const branchId = get(req, "user.branchId")
        let _mongoQuery = JSON.parse(get(req, "params._mongoQuery"))
        let _mongoOptions = JSON.parse(get(req, "params._mongoOptions"))
        const users = await findBranchCrewUsers({ branchId, ..._mongoQuery }, _mongoOptions);
        const count = await countBranchCrewUsers({ branchId, ..._mongoQuery });
        res.setHeader("Content-Range", `branchcrewusers ${range._start}-${range._end}/${count}`);
        res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count')
        res.setHeader('X-Total-Count', count)

        res.send(users.map((user) => (omit(Object.assign(user, { id: user._id }), "_id"))))
    } catch (e: any) {
        log.error(e);
        return res.status(409).send(e.message);
    }
}


// @desc    get User By Id
// @route   GET /v1/manager/users/:userId
// @access  Private
//manager olarak görev yaptığı parametreden gelen userId gönderir.
export async function getBranchCrewUserHandler(req: Request, res: Response) {
    try {
        const branchId = get(req, "user.branchId")

        const crewMemberUserId = get(req, "params.crewMemberUserId");
        let user = await findOneBranchCrewUser({ branchId, _id: crewMemberUserId });
        user = Object.assign(user, { id: crewMemberUserId });
        res.send(user)
    } catch (e: any) {
        log.error(e);
        return res.status(409).send(e.message);
    }
}

// @desc    add user permission
// @route   POST /v1/manager/members/:crewMemberUserId/setPermissions
// @access  Private
//manager olarak görev yapan kullanıcı erişim izni ekler.
export async function setCrewMemberUserPermissions(req: Request, res: Response) {
    try {
        const branchId = get(req, "user.branchId")
        const crewMemberUserId = get(req.params, "crewMemberUserId");
        const permissions = get(req.body, "permissions");

        let user = await findOneBranchCrewUser({ _id: crewMemberUserId, branchId });
        if (user) {
            user = await setCrewMemberPermissions(crewMemberUserId, permissions);
            return res.send(user);
        } else
            return res.status(404).send("User is not found.");
    } catch (e: any) {
        return res.status(404).send(e.message);
    }
}
