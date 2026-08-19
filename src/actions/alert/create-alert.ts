'use server';

import { AlertModel } from '@/models/alert-model';
import { createAlertSchema } from '@/lib/AlertService/validations';
import { alertService } from '@/lib/AlertService/alert-service';
import { getCurrentUser } from '@/lib/AuthService/auth-service';

type CreateAlertActionState = {
  formState: AlertModel;
  errors: string[];
  sucess?: true;
};

export async function createAlertAction(
  prevState: CreateAlertActionState,
  formData: FormData,
): Promise<CreateAlertActionState> {
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
    user.id,
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
