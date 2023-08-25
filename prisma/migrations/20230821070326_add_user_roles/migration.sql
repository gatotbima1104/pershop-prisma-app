-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'KASIR');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "roles" "Role"[];
