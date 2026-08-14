import clsx from 'clsx';
import { useId, useState } from 'react';

type InputSelectProps = {
  labelText?: string
  options: string[];
} & React.ComponentProps<'select'>;

export function InputSelect({
  labelText,
  options,
  value,
  defaultValue,
  onChange,
  ...props
}: InputSelectProps) {
  const id = useId();
  const [selectedValue, setSelectedValue] = useState(
    defaultValue ?? options[0],
  );
  const currentValue = value ?? selectedValue;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (value === undefined) setSelectedValue(e.target.value);
    onChange?.(e);
  };

  return (
    <div className='flex flex-col gap-1'>
      {labelText && (
        <label className='text-xs capitalize text-muted font-bold' htmlFor={id}>
          {labelText}
        </label>
      )}
      
      <select
        {...props}
        className={clsx(
          'py-3.5 px-5 bg-background-sec border border-border rounded-xl text-sm text-aztec-900',
          'placeholder-slate-300',
          'disabled:bg-slate-200',
          'disabled:text-slate-400',
          'disabled:placeholder-slate-300',
          'read-only:bg-slate-100',
          props.className,
        )}
        value={currentValue}
        id={id}
        onChange={handleChange}
      >
        {options.map(op => {
            return <option key={op} value={op}>{op}</option>
        })}
      </select>
    
    </div>
  );
}
