require("dotenv/config");

const { PrismaClient } = require("../generated/prisma");
const { PrismaPg } = require("@prisma/adapter-pg");

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required.");
}

const prisma = new PrismaClient({
    adapter: new PrismaPg(process.env.DATABASE_URL)
});

module.exports = prisma;
