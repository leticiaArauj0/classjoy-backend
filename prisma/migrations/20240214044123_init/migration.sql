-- CreateEnum
CREATE TYPE "Role" AS ENUM ('TEACHER', 'PARENTS');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "createdat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "first_name" VARCHAR(63) NOT NULL,
    "last_name" VARCHAR(63) NOT NULL,
    "email" VARCHAR(127) NOT NULL,
    "password" VARCHAR(127) NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Classroom" (
    "id" SERIAL NOT NULL,
    "createdat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "teacherId" INTEGER NOT NULL,

    CONSTRAINT "Classroom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "parentsId" INTEGER NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Classroom" ADD CONSTRAINT "Classroom_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_parentsId_fkey" FOREIGN KEY ("parentsId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
