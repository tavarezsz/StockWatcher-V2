import { PrismaUserRepository } from "./prisma-user-repository";
import { UserRepository } from "./user-repository";

export const userRepository: UserRepository = new PrismaUserRepository()

//TODO: mover pra um arquivo dedicado a seed
async function seed(){
    const user = await userRepository.create("edutavares.fazenda@gmail.com")

    console.log("response ", user)
}

seed()




