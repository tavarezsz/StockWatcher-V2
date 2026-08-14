import { formatPrice, formatVariation } from '@/utils/formatters';
import clsx from 'clsx';
import { useId, useState } from 'react';

type InputTextProps = {
  labelText?: string;
  format?: 'currency' | 'percentage';
  initialValue?: number;
  onValueChange?: (value: number) => void;
} & Omit<React.ComponentProps<'input'>, 'onChange' | 'type' | 'value'>;

export function InputCurrency({
  labelText = '',
  format = 'currency',
  initialValue = 0,
  name,
  onValueChange,
  ...props
}: InputTextProps) {
  const id = useId();
  const formatValue = (value: number) =>
    format === 'currency'
      ? formatPrice(value)
      : `${formatVariation(value)}%`;

  const [numericValue, setNumericValue] = useState(initialValue);
  const [displayValue, setDisplayValue] = useState(() =>
    initialValue ? formatValue(initialValue) : '',
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanValue = e.target.value.replace(/\D/g, '');

    if (!cleanValue) {
      setDisplayValue('');
      setNumericValue(0);
      onValueChange?.(0);
      return;
    }

    const floatValue = Number(cleanValue) / 100;

    setDisplayValue(formatValue(floatValue));
    setNumericValue(floatValue);
    onValueChange?.(floatValue);
  };

  return (
    <div className='flex flex-col gap-1'>
      {labelText && (
        <label className='text-xs capitalize text-muted font-bold' htmlFor={id}>
          {labelText}
        </label>
      )}
      
      <input
        {...props}
        type='text'
        inputMode='decimal'
        className={clsx(
          'py-3.5 px-5 bg-background-sec border border-border rounded-xl text-sm text-aztec-900',
          'placeholder-slate-300',
          'disabled:bg-slate-200',
          'disabled:text-slate-400',
          'disabled:placeholder-slate-300',
          'read-only:bg-slate-100',
          props.className,
        )}
        value={displayValue}
        onChange={handleChange}
        placeholder={format === 'currency' ? 'R$ 0,00' : '0,00%'}
        id={id}
      />
      {name && <input type='hidden' name={name} value={numericValue} />}
    </div>
  );
}
