import YahooFinance from "yahoo-finance2";

async function test() {
  const yahooFinance = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

  const results = await yahooFinance.search("Petrobras");
  const treatedResults = results?.quotes ?? [];

  // 1. Extrai todos os símbolos válidos
  const symbols = treatedResults
    .map((q) => q.symbol)
    .filter((s): s is string => Boolean(s));

  if (symbols.length > 0) {
    // 2. Faz uma única chamada HTTP para pegar as cotações de todos
    const quotes = await yahooFinance.quote(symbols);
    console.log("Quotes em lote: ", quotes);
  }
}

test();