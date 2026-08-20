import clsx from 'clsx';
import { Skeleton } from '@mui/material';

type SpinLoaderProps = {
  className?: string;
  heigth?: number;
  width?: number;
};

export function SkeletonLoader({
  heigth,
  width,
  className = '',
}: SpinLoaderProps) {
  return (
    <Skeleton
      variant='rounded'
      height={heigth}
      width={width}
      className={clsx('w-full', className)}
    />
  );
}
