'use server';

import { stockService } from '@/lib/StockService/stock-service';
import { addToWalletSchema } from '@/lib/StockService/validations';
import { walletService } from '@/lib/WalletService/wallet-service';
import { StockInstanceDTO } from '@/models/wallet-model';

type AddToWalletActionState = {
  formState: StockInstanceDTO;
  errors: string[];
  sucess?: true;
};

export async function AddToWalletAction(
  prevState: AddToWalletActionState,
  formData: FormData,
): Promise<AddToWalletActionState> {
  //TODO: Implementar autenticação
  const userId =
    process.env.DEV_USER_ID || 'b7a4ece1-f5c5-49d6-b37b-454de642fb36';

  if (!(formData instanceof FormData)) {
    return {
      formState: prevState.formState,
      errors: ['Dados inválidos'],
    };
  }

  const result = addToWalletSchema.safeParse({
    stockSymbol: formData.get('stockSymbol'),
    quantity: formData.get('quantity'),
    referencePrice: formData.get('referencePrice'),
  });

  if(!result.success){
    return{
        formState: prevState.formState,
        errors: result.error.issues.map(issue => issue.message),
    }
  }

  try{
    const stock = await walletService.addAsset(userId, result.data.stockSymbol, result.data.quantity, result.data.referencePrice)

    const submittedFormState: StockInstanceDTO = {
        ...prevState.formState,
        ...result.data,
      };

    return{
        formState: submittedFormState,
        errors: [],
        sucess: true
    }
  } catch(err){
    return {
    formState: prevState.formState,
    errors: [
          err instanceof Error ? err.message : 'Erro ao criar alerta',
        ]
  };
  }

  return {
    formState: prevState.formState,
    errors: ['Erro desconhecido'],
  };
}
