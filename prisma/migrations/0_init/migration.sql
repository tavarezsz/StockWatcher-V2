-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "public"."AlertStatus" AS ENUM ('ativo', 'disparado', 'pausado');

-- CreateEnum
CREATE TYPE "public"."TargetCondition" AS ENUM ('above', 'below');

-- CreateEnum
CREATE TYPE "public"."TargetValueType" AS ENUM ('value', 'variationDay');

-- CreateTable
CREATE TABLE "public"."Alert" (
    "id" TEXT NOT NULL,
    "status" "public"."AlertStatus" NOT NULL DEFAULT 'ativo',
    "targetValue" DOUBLE PRECISION NOT NULL,
    "targetValueType" "public"."TargetValueType" NOT NULL,
    "targetCondition" "public"."TargetCondition" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "stockSymbol" TEXT NOT NULL,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Stock" (
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "openPrice" DOUBLE PRECISION NOT NULL,
    "changePercentDay" DOUBLE PRECISION NOT NULL,
    "dayHigh" DOUBLE PRECISION NOT NULL,
    "dayLow" DOUBLE PRECISION NOT NULL,
    "dividendYield" DOUBLE PRECISION NOT NULL,
    "priceToBook" DOUBLE PRECISION,
    "peRatio" DOUBLE PRECISION,
    "lastChange" TIMESTAMP(3),

    CONSTRAINT "Stock_pkey" PRIMARY KEY ("symbol")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WalletItem" (
    "id" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "referencePrice" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "stockSymbol" TEXT NOT NULL,

    CONSTRAINT "WalletItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Alert_status_idx" ON "public"."Alert"("status" ASC);

-- CreateIndex
CREATE INDEX "Alert_stockSymbol_idx" ON "public"."Alert"("stockSymbol" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email" ASC);

-- CreateIndex
CREATE INDEX "WalletItem_userId_stockSymbol_idx" ON "public"."WalletItem"("userId" ASC, "stockSymbol" ASC);

-- AddForeignKey
ALTER TABLE "public"."Alert" ADD CONSTRAINT "Alert_stockSymbol_fkey" FOREIGN KEY ("stockSymbol") REFERENCES "public"."Stock"("symbol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Alert" ADD CONSTRAINT "Alert_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WalletItem" ADD CONSTRAINT "WalletItem_stockSymbol_fkey" FOREIGN KEY ("stockSymbol") REFERENCES "public"."Stock"("symbol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WalletItem" ADD CONSTRAINT "WalletItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

