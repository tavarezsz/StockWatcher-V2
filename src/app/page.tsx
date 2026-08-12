import { Container } from "@/components/Container";
import { FeaturedStocks } from "@/components/FeaturedStocks";
import { SpinLoader } from "@/components/SpinLoader";
import { StockCard } from "@/components/StockCard";
import { stockService } from "@/lib/StockService/stock-service";
import { Suspense } from "react";


export default function Home() {

  return (
    <Container>
      <Suspense fallback={<SpinLoader/>}>
        <FeaturedStocks seeAllLink="/stock" lineItems={2} maxItems={4} />
      </Suspense>
    </Container>
  );
}
