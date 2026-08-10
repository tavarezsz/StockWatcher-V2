import { WalletItem } from "@/db/prisma/generated"

export interface WalleItemRepository{
    findById(id: string): Promise<WalletItem>
    findByUserId(userId: string): Promise<WalletItem[]>

    //mutations

    create(stock: Omit<WalletItem, "id" | "createdAt">): Promise<WalletItem>
    update(id: string, newItem: Partial<Pick<WalletItem, "quantity" | "referencePrice">>): Promise<WalletItem>
    delete(id:string): Promise<WalletItem>
}