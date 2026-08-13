'use server';

import { alertService } from "@/lib/AlertService/alert-service";
import { updateTag } from "next/cache";

export async function deleteAlertAction(id: string) {
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
    await alertService.deleteAlert(userId, id)
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

  updateTag(`alerts:${userId}`)
  updateTag(`alerts:${id}`)

  return{
    error: ''
  }

}
