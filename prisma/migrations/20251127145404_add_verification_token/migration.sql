-- AlterTable
ALTER TABLE "user" ALTER COLUMN "username" DROP NOT NULL;

-- AlterTable
ALTER TABLE "verification" ADD COLUMN     "token" TEXT;
