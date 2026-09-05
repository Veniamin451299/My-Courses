// backend/prisma/seed.js
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from '@prisma/client';
import config from '../src/config/env.js';
import bcrypt from '../src/utils/bcrypt.js';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const PASSWORD = await bcrypt.hash(config.adminPassword); // ✅ используем adminPassword из env

async function main() {
  console.log("🚀 Запуск сида через npx prisma db seed...");

  const existingAdmin = await prisma.user.findUnique({
    where: { email: config.adminEmail }
  });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: config.adminEmail,
        passwordHash: PASSWORD,
        name: "Admin",
        role: "ADMIN"
      },
    });
    console.log("✅ Администратор создан");
  }

  const category = await prisma.category.upsert({
    where: { name: "Default" },
    update: {},
    create: {
      name: "Default",
      description: "Default category for products"
    }
  });
  console.log("✅ Категория создана");

  console.log("📦 Подготовка 100 товаров...");
  const productsData = [];
  for (let i = 0; i < 100; i++) {
    productsData.push({
      name: `Product ${i}`,
      description: `Description for product ${i}`,
      price: Math.floor(Math.random() * 1000) + 100,
      stock: Math.floor(Math.random() * 50) + 1,
      images: [
        `https://picsum.photos/${i}/200/300`,
        `https://picsum.photos/${i + 100}/400/300`
      ],
      categoryId: category.id,
      isActive: Math.random() > 0.1
    });
  }

  await prisma.product.createMany({
    data: productsData
  });
  console.log("✅ 100 товаров успешно добавлено в базу!");
}

main()
  .catch((e) => {
    console.error("❌ Ошибка сида:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
    console.log("🏁 Процесс завершен!");
  });