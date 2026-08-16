import clsx from 'clsx';
import { useId, useState } from 'react';

type InputTextProps = {
  labelText?: string;
} & React.ComponentProps<'input'>;

export function InputText({
  labelText = '',
  ...props
}: InputTextProps) {
  const id = useId();

  return (
    <div className='flex flex-col gap-1'>
      {labelText && (
        <label className='text-xs capitalize text-muted font-bold' htmlFor={id}>
          {labelText}
        </label>
      )}
      
      <input
        {...props}
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
        id={id}
      />
    </div>
  );
}
