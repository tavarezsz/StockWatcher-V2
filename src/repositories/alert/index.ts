import { AlertRepository } from "./alert-repository";
import { PrismaAlertRepository } from "./prisma-alert-repository";

export const alertRespository: AlertRepository = new PrismaAlertRepository()

//TODO: mover para arquivo de seed
async function seed(){
    const alert = await alertRespository.create('PETR4.SA', 'b7a4ece1-f5c5-49d6-b37b-454de642fb36', 40, "value", "above")

    console.log("Resultado ", alert)
}

seed()