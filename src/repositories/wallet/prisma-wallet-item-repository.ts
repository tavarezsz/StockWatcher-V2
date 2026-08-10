import { WalleItemRepository } from "./wallet-item-respository";
import { WalletItem } from "@/db/prisma/generated";
import "dotenv/config";

import { db } from "../client";

export class PrismaWalletItemRepository implements WalleItemRepository {
  async findById(id: string): Promise<WalletItem> {
    const item = await db.walletItem.findUnique({
      where: { id: id },
    });
    if (!item) {
      throw new Error("Item não encontrado");
    }

    return item;
  }
  async findByUserId(userId: string): Promise<WalletItem[]> {
    const items = await db.walletItem.findMany({
      where: { userId },
    });

    return items;
  }

  //mutations

  async create(stock: Omit<WalletItem, "id" | "createdAt">): Promise<WalletItem> {
    const item = await db.walletItem.create({
      data: { 
        ...stock,
        createdAt: new Date()
       },
    });

    if (!item) {
      throw new Error("Erro ao adicionar a carteira");
    }

    return item;
  }
  async update(
    id: string,
    newItem: Partial<Pick<WalletItem, "quantity" | "referencePrice">>,
  ): Promise<WalletItem> {
    const item = await db.walletItem.update({
      where: { id },
      data: {
        newItem,
      },
    });

    if (!item) {
      throw new Error("Erro ao atualizar item");
    }
    return item;
  }
  async delete(id: string): Promise<WalletItem>{
    try{
        return await db.walletItem.delete({where: {
            id
        }})
    } catch(err){
        throw new Error("Erro ao excluir item ")
    }
  }
}
