import 'dotenv/config'

import { db } from "../client";
import { UserModel } from '@/models/user-model';

export class PrismaUserRepository{
    async findAll(): Promise<UserModel[]>{
        const users = await db.user.findMany()

        if(!users){
            throw new Error("Erro ao buscar usuários")
        }

        return users
    } 

    async findByEmail(email: string): Promise<UserModel>{
        const user = await db.user.findUnique({
            where: {email: email}
        })

        if(!user){
            throw new Error("Erro ao busca usuário")
        }

        return user
    } 

    async create(email: string): Promise<UserModel>{
        try{
            return await db.user.create({
                data: {
                    email: email
                }
            })
        } catch(err){
            throw new Error("Email já cadastrado")
        }
    }

    async updateEmail(email: string, newEmail: string): Promise<UserModel>{
        try{
            return await db.user.update({
                where: {
                    email: email
                },
                data: {
                    email: newEmail
                }
            })
        } catch(err){
            throw new Error("Usuário não encontrado")
        }
    }
}