import { stockRepository } from "./stock"
import { marketDataProvider } from "@/lib/marketDataProvider"
import { walletItemRepository } from "./wallet"
import { WalletService } from "@/lib/WalletService/wallet-service"

async function generateSeed(){
    //const result = await marketDataProvider.findBySymbol("PETR4.SA")

/*     const walletItem = await walletItemRepository.create({
        quantity: 10,
        referencePrice: 38.49,
        stockSymbol: "PETR4.SA",
        userId: process.env.DEV_USER_ID || "b7a4ece1-f5c5-49d6-b37b-454de642fb36"
    }) */

    //const allItems = await walletItemRepository.findByUserId(process.env.DEV_USER_ID || "b7a4ece1-f5c5-49d6-b37b-454de642fb36")

    const service = new WalletService()

    const walletTest = await service.getWallet("b7a4ece1-f5c5-49d6-b37b-454de642fb36")
    console.log("resultado ", walletTest)
}

generateSeed()