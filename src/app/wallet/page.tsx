import { Container } from "@/components/Container";
import { WalletAssets } from "@/components/WalletPage/WalletAssets";
import { WalletInfo } from "@/components/WalletPage/WalletInfo";
import { Metadata } from "next";
import { Suspense } from 'react';
import { SkeletonLoader } from '@/components/SpinLoader';

export const metadata: Metadata = {
  title: 'Minha Carteira',
  description: 'Confira seu patrimônio, ações e o estado dos seus alertas',
};

export default function WalletPage(){
    return(
        <Container>
            <Suspense fallback={<SkeletonLoader className='min-h-[379px] lg:min-h-[320px]' />}>
                <WalletInfo/>
            </Suspense>
            <Suspense fallback={<SkeletonLoader className='min-h-[924px] lg:min-h-[548px]' />}>
                <WalletAssets/>
            </Suspense>
        </Container>
    )
}
