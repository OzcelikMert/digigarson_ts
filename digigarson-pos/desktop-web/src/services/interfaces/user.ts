export default interface IUser {
    createdAt: Date,
    updatedAt: Date,

    exp: Date,
    iat: Date,

    permissions: Array<string>
}