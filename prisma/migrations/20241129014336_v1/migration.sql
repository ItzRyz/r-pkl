/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `msgroup` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `msgroup` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `msgroup` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `msmenu` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `msmenu` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `msmenu` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `msmenuaccess` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `msmenuaccess` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `msmenuaccess` table. All the data in the column will be lost.
  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedat` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `userId` on the `Session` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_groupid_fkey";

-- DropForeignKey
ALTER TABLE "msmenuaccess" DROP CONSTRAINT "msmenuaccess_groupid_fkey";

-- DropForeignKey
ALTER TABLE "msmenuaccess" DROP CONSTRAINT "msmenuaccess_menuid_fkey";

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedat" TIMESTAMP(3) NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "msgroup" DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "createdat" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedat" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "msmenu" DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "createdat" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedat" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "msmenuaccess" DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "createdat" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedat" TIMESTAMP(3);

-- DropTable
DROP TABLE "Account";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "VerificationToken";

-- CreateTable
CREATE TABLE "msuser" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "groupid" INTEGER,
    "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "msuser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "msaccount" (
    "userId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "msaccount_pkey" PRIMARY KEY ("provider","providerAccountId")
);

-- CreateTable
CREATE TABLE "mssession" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mssession_pkey" PRIMARY KEY ("identifier","token")
);

-- CreateTable
CREATE TABLE "mscompany" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "createdat" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(3),

    CONSTRAINT "mscompany_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trrecordinghd" (
    "id" SERIAL NOT NULL,
    "transcode" TEXT NOT NULL,
    "transdate" DATE NOT NULL,
    "pic" TEXT NOT NULL,
    "createdby" INTEGER NOT NULL,
    "createdat" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(3),

    CONSTRAINT "trrecordinghd_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trrecordingdt" (
    "id" SERIAL NOT NULL,
    "headerid" INTEGER NOT NULL,
    "nama" TEXT NOT NULL,
    "jurnal" BOOLEAN NOT NULL,
    "apd" BOOLEAN NOT NULL,
    "rambut" BOOLEAN NOT NULL,
    "penampilan" BOOLEAN NOT NULL,
    "kinerja" BOOLEAN NOT NULL,
    "lksp" BOOLEAN NOT NULL,
    "alpha" INTEGER NOT NULL,
    "createdat" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(3),

    CONSTRAINT "trrecordingdt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trrecordingproblem" (
    "id" SERIAL NOT NULL,
    "headerid" INTEGER NOT NULL,
    "evaluasi" TEXT NOT NULL,
    "penyelesaian" TEXT NOT NULL,
    "createdat" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(3),

    CONSTRAINT "trrecordingproblem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "msuser_email_key" ON "msuser"("email");

-- AddForeignKey
ALTER TABLE "msuser" ADD CONSTRAINT "msuser_groupid_fkey" FOREIGN KEY ("groupid") REFERENCES "msgroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "msaccount" ADD CONSTRAINT "msaccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "msuser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "msuser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "msmenuaccess" ADD CONSTRAINT "msmenuaccess_menuid_fkey" FOREIGN KEY ("menuid") REFERENCES "msmenu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "msmenuaccess" ADD CONSTRAINT "msmenuaccess_groupid_fkey" FOREIGN KEY ("groupid") REFERENCES "msgroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trrecordinghd" ADD CONSTRAINT "trrecordinghd_createdby_fkey" FOREIGN KEY ("createdby") REFERENCES "msuser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trrecordingdt" ADD CONSTRAINT "trrecordingdt_headerid_fkey" FOREIGN KEY ("headerid") REFERENCES "trrecordinghd"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trrecordingproblem" ADD CONSTRAINT "trrecordingproblem_headerid_fkey" FOREIGN KEY ("headerid") REFERENCES "trrecordinghd"("id") ON DELETE CASCADE ON UPDATE CASCADE;
