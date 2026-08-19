'use server';

import { addToWalletSchema } from '@/lib/StockService/validations';
import { walletService } from '@/lib/WalletService/wallet-service';
import { StockInstanceDTO } from '@/models/wallet-model';
import { getCurrentUser } from '@/lib/AuthService/auth-service';

type AddToWalletActionState = {
  formState: StockInstanceDTO;
  errors: string[];
  sucess?: true;
};

export async function AddToWalletAction(
  prevState: AddToWalletActionState,
  formData: FormData,
): Promise<AddToWalletActionState> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      formState: prevState.formState,
      errors: ['Faça login para realizar essa ação'],
    };
  }

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

  if (!result.success) {
    return {
      formState: prevState.formState,
      errors: result.error.issues.map(issue => issue.message),
    };
  }

  try {
    const stock = await walletService.addAsset(
      user.id,
      result.data.stockSymbol,
      result.data.quantity,
      result.data.referencePrice,
    );

    const submittedFormState: StockInstanceDTO = {
      ...prevState.formState,
      ...result.data,
    };

    if (stock) {
      return {
        formState: submittedFormState,
        errors: [],
        sucess: true,
      };
    }
  } catch (err) {
    return {
      formState: prevState.formState,
      errors: [
        err instanceof Error ? err.message : 'Erro ao adicionar a carteira',
      ],
    };
  }

  return {
    formState: prevState.formState,
    errors: ['Erro desconhecido'],
  };
}
