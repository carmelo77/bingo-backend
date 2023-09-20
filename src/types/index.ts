export interface IUserModel {
    name: string
    lastname: string
    email: string
    password?: string
    phone: string
    document: string
    role?: IRoleModel
    from?: number
    to?: number
}

export interface IRoleModel {
    name: string
}

export interface IBingoCardModel {
    number_table: number
    values: any
    isSkip: Boolean
}

export interface ITypeCardWinnerModel {
    name: string
}

export interface IBingoNumberModel {
    number: number
}

export const TYPES = {
    UserRepository: Symbol("UserRepository"),
    RoleRepository: Symbol("RoleRepository"),
    AuthAdminMiddleware: Symbol("AuthAdminMiddleware"),
    AuthMiddleware: Symbol("AuthMiddleware"),
    TypeCardWinnerRepository: Symbol("TypeCardWinnerRepository"),
    BingoCardRepository: Symbol("BingoCardRepository"),
    MatchRepository: Symbol("MatchRepository"),
    BingoNumberRepository: Symbol("BingoNumberRepository"),
    WinnerRepository: Symbol("WinnerRepository"),
}