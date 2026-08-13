import { StockInstance } from "@/models/wallet-model";
import { PrismaWalletItemRepository } from "./prisma-wallet-item-repository";
import { WalleItemRepository } from "./wallet-item-respository";

export const walletItemRepository: WalleItemRepository = new PrismaWalletItemRepository


/* async function seed() {
    const stock = {
        quantity: 5,
        referencePrice: 40,
        userId: "b7a4ece1-f5c5-49d6-b37b-454de642fb36",
        stockSymbol: "ITUB4.SA"
        
    }
    const result = await walletItemRepository.create(stock)

    console.log("Result ", result)
}

seed() */