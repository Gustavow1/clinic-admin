-- CreateTable
CREATE TABLE "patients" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "email" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documentIds" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,

    CONSTRAINT "documentIds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "phoneNumbers" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,

    CONSTRAINT "phoneNumbers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logs" (
    "id" TEXT NOT NULL,
    "requestTime" TIMESTAMP(3) NOT NULL,
    "responseTime" TIMESTAMP(3) NOT NULL,
    "method" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "statusCode" INTEGER NOT NULL,
    "userAgent" TEXT,
    "body" JSONB NOT NULL,
    "params" JSONB NOT NULL,
    "query" JSONB NOT NULL,

    CONSTRAINT "logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "documentIds_number_key" ON "documentIds"("number");

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentIds" ADD CONSTRAINT "documentIds_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "phoneNumbers" ADD CONSTRAINT "phoneNumbers_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
