/*
  Warnings:

  - The primary key for the `mssession` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `identifier` on the `mssession` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `mssession` table. All the data in the column will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[sessionToken]` on the table `mssession` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sessionToken` to the `mssession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedat` to the `mssession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `mssession` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- AlterTable
ALTER TABLE "mssession" DROP CONSTRAINT "mssession_pkey",
DROP COLUMN "identifier",
DROP COLUMN "token",
ADD COLUMN     "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "sessionToken" TEXT NOT NULL,
ADD COLUMN     "updatedat" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Session";

-- CreateTable
CREATE TABLE "msveriftoken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "msveriftoken_pkey" PRIMARY KEY ("identifier","token")
);

-- CreateIndex
CREATE UNIQUE INDEX "mssession_sessionToken_key" ON "mssession"("sessionToken");

-- AddForeignKey
ALTER TABLE "mssession" ADD CONSTRAINT "mssession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "msuser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
