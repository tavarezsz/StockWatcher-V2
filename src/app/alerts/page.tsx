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
        <Container>
            <Suspense fallback={<SkeletonLoader className='h-24' />}>
                <AlertInfo/>
            </Suspense>
            <Suspense fallback={<SkeletonLoader className='h-[30rem]' />}>
                <AlertList/>
            </Suspense>
        </Container>
    )
}
