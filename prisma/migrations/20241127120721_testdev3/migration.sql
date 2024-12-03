-- AlterTable
ALTER TABLE "User" ADD COLUMN     "groupid" INTEGER;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_groupid_fkey" FOREIGN KEY ("groupid") REFERENCES "msgroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;
