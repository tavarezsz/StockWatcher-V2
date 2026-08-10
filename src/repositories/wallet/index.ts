import { PrismaWalletItemRepository } from "./prisma-wallet-item-repository";
import { WalleItemRepository } from "./wallet-item-respository";

export const walletItemRepository: WalleItemRepository = new PrismaWalletItemRepository