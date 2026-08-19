'use server';

import { alertService } from "@/lib/AlertService/alert-service";
import { updateTag } from "next/cache";
import { getCurrentUser } from '@/lib/AuthService/auth-service';

export async function deleteAlertAction(id: string) {
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
    await alertService.deleteAlert(user.id, id)
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

  updateTag(`alerts:${user.id}`)
  updateTag(`alerts:${id}`)

  return{
    error: ''
  }

}
