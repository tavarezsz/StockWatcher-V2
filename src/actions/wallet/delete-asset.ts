'use server'

import { walletService } from "@/lib/WalletService/wallet-service";
import { updateTag } from "next/cache";
import { getCurrentUser } from '@/lib/AuthService/auth-service';

export async function deleteAssetAction(id: string){
      const user = await getCurrentUser();

      if (!user) {
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
        await walletService.removeAsset(user.id, id)
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
    
      updateTag(`wallet:${user.id}`)
    
      return{
        error: ''
      }
    
}
