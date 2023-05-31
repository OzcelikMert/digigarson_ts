interface GlobalAuthDataDocument {
    tokens: {
        access: string,
        refresh: string,
    },
    user: {
        branchId: string,
        branchTitle: string,
        branch_custom_id: number,
        name: string,
        lastname: string,
        role: string,
        permissions: string[]
    }
}

interface GlobalAuthDataSetDocument {
    tokens?: {
        access: string,
        refresh: string,
    },
    user?: {
        branchId: string,
        branchTitle: string,
        branch_custom_id: number,
        name: string,
        lastname: string,
        role: string,
        permissions: number[]
    }
}

export {GlobalAuthDataDocument, GlobalAuthDataSetDocument}