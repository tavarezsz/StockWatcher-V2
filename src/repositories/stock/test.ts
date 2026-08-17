import { stockRepository } from ".";

async function updateTest(){
    const stock = await stockRepository.findBySymbol("ITUB4.SA")

    if(!stock) return
    
    const updated = await stockRepository.createOrUpdate({
        ...stock,
        changePercentDay: 1.45,
        lastChange: new Date()
    })

    console.log("teste ", updated)
}

updateTest()