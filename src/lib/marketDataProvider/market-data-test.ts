import { marketDataProvider } from ".";

async function test() {
  const result = await marketDataProvider.search("Multiplan")
  console.log("Resultado ", result)
}

test();