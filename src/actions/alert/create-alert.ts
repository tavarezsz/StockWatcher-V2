'use server';

import { AlertModel } from '@/models/alert-model';
import { createAlertSchema } from '@/lib/AlertService/validations';
import { alertService } from '@/lib/AlertService/alert-service';

type CreateAlertActionState = {
  formState: AlertModel;
  errors: string[];
  sucess?: true;
};

export async function createAlertAction(
  prevState: CreateAlertActionState,
  formData: FormData,
): Promise<CreateAlertActionState> {
  //TODO: implementar autenticação
  const isAuthenticated = true;
  const userId = process.env.DEV_USER_ID || 'b7a4ece1-f5c5-49d6-b37b-454de642fb36'

  if (!(formData instanceof FormData)) {
    return {
      formState: prevState.formState,
      errors: ['Dados inválidos'],
    };
  }

  const result = createAlertSchema.safeParse({
    stockSymbol: formData.get('stockSymbol'),
    targetValue: formData.get('targetValue'),
    targetValueType: formData.get('targetValueType'),
    targetCondition: formData.get('targetCondition'),
  });

  if (!result.success) {
    return {
      formState: prevState.formState,
      errors: result.error.issues.map(issue => issue.message),
    };
  }

  const submittedFormState: AlertModel = {
    ...prevState.formState,
    ...result.data,
  };

  try{
    await alertService.createAlert(
    result.data.stockSymbol,
    userId,
    result.data.targetValue,
    result.data.targetValueType,
    result.data.targetCondition,
    );
    return{
        formState: submittedFormState,
        errors: [],
        sucess: true
    }
  } catch(err){
    return{
        formState: submittedFormState,
        errors: [
          err instanceof Error ? err.message : 'Erro ao criar alerta',
        ]
    }
  }
}
