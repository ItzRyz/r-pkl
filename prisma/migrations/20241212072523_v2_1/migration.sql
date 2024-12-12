/*
  Warnings:

  - You are about to drop the `trrecordingdt` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `trrecordinghd` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `trrecordingproblem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "trrecordingdt" DROP CONSTRAINT "trrecordingdt_headerid_fkey";

-- DropForeignKey
ALTER TABLE "trrecordinghd" DROP CONSTRAINT "trrecordinghd_companyid_fkey";

-- DropForeignKey
ALTER TABLE "trrecordinghd" DROP CONSTRAINT "trrecordinghd_createdby_fkey";

-- DropForeignKey
ALTER TABLE "trrecordinghd" DROP CONSTRAINT "trrecordinghd_departmentid_fkey";

-- DropForeignKey
ALTER TABLE "trrecordingproblem" DROP CONSTRAINT "trrecordingproblem_headerid_fkey";

-- DropTable
DROP TABLE "trrecordingdt";

-- DropTable
DROP TABLE "trrecordinghd";

-- DropTable
DROP TABLE "trrecordingproblem";

-- CreateTable
CREATE TABLE "trkunjungan" (
    "id" SERIAL NOT NULL,
    "transcode" TEXT NOT NULL,
    "transdate" DATE NOT NULL,
    "companyid" INTEGER,
    "departmentid" INTEGER,
    "pic" TEXT NOT NULL,
    "createdby" INTEGER NOT NULL,
    "createdat" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(3),

    CONSTRAINT "trkunjungan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trmonitoring" (
    "id" SERIAL NOT NULL,
    "kunjunganid" INTEGER NOT NULL,
    "nis" TEXT NOT NULL,
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

    CONSTRAINT "trmonitoring_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trproblem" (
    "id" SERIAL NOT NULL,
    "kunjunganid" INTEGER NOT NULL,
    "evaluasi" TEXT NOT NULL,
    "penyelesaian" TEXT NOT NULL,
    "createdat" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(3),

    CONSTRAINT "trproblem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "trkunjungan" ADD CONSTRAINT "trkunjungan_createdby_fkey" FOREIGN KEY ("createdby") REFERENCES "msuser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trkunjungan" ADD CONSTRAINT "trkunjungan_companyid_fkey" FOREIGN KEY ("companyid") REFERENCES "mscompany"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trkunjungan" ADD CONSTRAINT "trkunjungan_departmentid_fkey" FOREIGN KEY ("departmentid") REFERENCES "msdepartment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trmonitoring" ADD CONSTRAINT "trmonitoring_kunjunganid_fkey" FOREIGN KEY ("kunjunganid") REFERENCES "trkunjungan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trproblem" ADD CONSTRAINT "trproblem_kunjunganid_fkey" FOREIGN KEY ("kunjunganid") REFERENCES "trkunjungan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
