'use server'

import { walletService } from "@/lib/WalletService/wallet-service";
import { updateTag } from "next/cache";

export async function deleteAssetAction(id: string){
     //TODO: Implementar session
      const isAuthenticated = true;
      const userId = process.env.DEV_USER_ID
    
      if (!isAuthenticated || !userId) {
        return {
          errors: ['Faça login para realizar essa ação'],
        };
      }
    
      if (!id || typeof id !== 'string') {
        return {
          error: 'Dados inválidos',
        };
      }
    
    
      try{
        await walletService.removeAsset(userId, id)
      } catch(err: unknown){
        if(err instanceof Error){
            return{
                error: err.message
            }
        }
        return{
            error: ['Erro desconhecido']
        }
      }
    
      updateTag(`wallet:${userId}`)
    
      return{
        error: ''
      }
    
}