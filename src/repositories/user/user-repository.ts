import { UserModel } from "@/models/user-model";

export interface UserRepository{
    findAll(): Promise<UserModel[]>
    findByEmail(email: string): Promise<UserModel>

    //mutations
    create(email: string): Promise<UserModel>
    updateEmail(email: string, newEmail: string): Promise<UserModel>
    //sem delete no momento
}