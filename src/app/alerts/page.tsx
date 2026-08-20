import { AlertInfo } from "@/components/AlertPage/AlertInfo";
import { AlertList } from "@/components/AlertPage/AlertList";
import { Container } from "@/components/Container";
import { SkeletonLoader } from "@/components/SpinLoader";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: 'Meus Alertas',
  description: 'Confira o estado de todos os seus alertas',
};


export default function AlertPage(){

    return(
        <Container className='gap-5 p-4 sm:p-6 lg:gap-7 lg:p-8'>
            <Suspense fallback={<SkeletonLoader className='min-h-[184px] lg:min-h-[98px]' />}>
                <AlertInfo/>
            </Suspense>
            <Suspense fallback={<SkeletonLoader className='min-h-[960px] lg:min-h-[490px]' />}>
                <AlertList/>
            </Suspense>
        </Container>
    )
}
