import { Container } from "@/components/Container";
import { WalletAssets } from "@/components/WalletPage/WalletAssets";
import { WalletInfo } from "@/components/WalletPage/WalletInfo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Minha Carteira',
  description: 'Confira seu patrimônio, ações e o estado dos seus alertas',
};

export default function WalletPage(){
    return(
        <Container>
            <WalletInfo/>
            <WalletAssets/>
        </Container>
    )
}
