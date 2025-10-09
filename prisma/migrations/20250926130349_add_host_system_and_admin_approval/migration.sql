-- CreateEnum
CREATE TYPE "public"."HostApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "public"."VenueStatus" AS ENUM ('DRAFT', 'PENDING_APPROVAL', 'PUBLISHED', 'REJECTED');

-- AlterEnum
ALTER TYPE "public"."UserRole" ADD VALUE 'HOST';

-- AlterTable
ALTER TABLE "public"."classes" ADD COLUMN     "host_id" TEXT;

-- AlterTable
ALTER TABLE "public"."events" ADD COLUMN     "host_id" TEXT;

-- AlterTable
ALTER TABLE "public"."venues" ADD COLUMN     "host_id" TEXT,
ADD COLUMN     "status" "public"."VenueStatus" NOT NULL DEFAULT 'DRAFT';

-- CreateTable
CREATE TABLE "public"."hosts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "business_name" TEXT NOT NULL,
    "business_type" TEXT NOT NULL,
    "description" TEXT,
    "experience_years" INTEGER,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_approved" BOOLEAN NOT NULL DEFAULT false,
    "application_status" "public"."HostApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "rejection_reason" TEXT,
    "approved_at" TIMESTAMP(3),
    "approved_by_user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hosts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "hosts_user_id_key" ON "public"."hosts"("user_id");

-- CreateIndex
CREATE INDEX "hosts_user_id_idx" ON "public"."hosts"("user_id");

-- CreateIndex
CREATE INDEX "hosts_is_approved_idx" ON "public"."hosts"("is_approved");

-- CreateIndex
CREATE INDEX "hosts_application_status_idx" ON "public"."hosts"("application_status");

-- CreateIndex
CREATE INDEX "hosts_country_city_idx" ON "public"."hosts"("country", "city");

-- AddForeignKey
ALTER TABLE "public"."classes" ADD CONSTRAINT "classes_host_id_fkey" FOREIGN KEY ("host_id") REFERENCES "public"."hosts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."events" ADD CONSTRAINT "events_host_id_fkey" FOREIGN KEY ("host_id") REFERENCES "public"."hosts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."venues" ADD CONSTRAINT "venues_host_id_fkey" FOREIGN KEY ("host_id") REFERENCES "public"."hosts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."hosts" ADD CONSTRAINT "hosts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."hosts" ADD CONSTRAINT "hosts_approved_by_user_id_fkey" FOREIGN KEY ("approved_by_user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
