import clsx from 'clsx';
import { Skeleton } from '@mui/material';

type SpinLoaderProps = {
  className?: string;
  heigth?: number;
  width?: number
};

export function SkeletonLoader({heigth=200, width, className = '' }: SpinLoaderProps) {
  return (
    <div className={className}>
      <Skeleton height={heigth} width={width}/>
    </div>
  );
}
