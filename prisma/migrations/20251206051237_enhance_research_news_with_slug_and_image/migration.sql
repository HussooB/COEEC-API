/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `ResearchProject` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `ResearchProject` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ResearchProject" ADD COLUMN     "featuredImage" TEXT,
ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ResearchProject_slug_key" ON "ResearchProject"("slug");
