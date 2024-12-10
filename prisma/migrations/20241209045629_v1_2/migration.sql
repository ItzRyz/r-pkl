-- AlterTable
ALTER TABLE "trrecordinghd" ADD COLUMN     "companyid" INTEGER,
ADD COLUMN     "departmentid" INTEGER;

-- CreateTable
CREATE TABLE "msdepartment" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "companyid" INTEGER,
    "createdat" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(3),

    CONSTRAINT "msdepartment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "msdepartment" ADD CONSTRAINT "msdepartment_companyid_fkey" FOREIGN KEY ("companyid") REFERENCES "mscompany"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trrecordinghd" ADD CONSTRAINT "trrecordinghd_companyid_fkey" FOREIGN KEY ("companyid") REFERENCES "mscompany"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trrecordinghd" ADD CONSTRAINT "trrecordinghd_departmentid_fkey" FOREIGN KEY ("departmentid") REFERENCES "msdepartment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
