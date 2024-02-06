/*
  Warnings:

  - Changed the type of `role` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "createdat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" TEXT NOT NULL;

-- DropEnum
DROP TYPE "Role";
