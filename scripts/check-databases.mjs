import "dotenv/config";
import pg from "pg";

const { Client } = pg;

for (const database of ["template1", "stockwatcher"]) {
  const url = new URL(process.env.DATABASE_URL);
  url.pathname = `/${database}`;

  const client = new Client({
    connectionString: url.toString(),
  });

  try {
    await client.connect();

    const counts = await client.query(`
      SELECT
        current_database() AS database,
        (SELECT COUNT(*) FROM "User") AS users,
        (SELECT COUNT(*) FROM "WalletItem") AS wallet_items,
        (SELECT COUNT(*) FROM "Stock") AS stocks,
        (SELECT COUNT(*) FROM "Alert") AS alerts
    `);

    const wallets = await client.query(`
      SELECT "userId", COUNT(*) AS items
      FROM "WalletItem"
      GROUP BY "userId"
    `);

    console.log(counts.rows[0]);
    console.log("Carteiras:", wallets.rows);
  } catch (error) {
    console.error(`Erro em ${database}:`, error.message);
  } finally {
    await client.end();
  }
}