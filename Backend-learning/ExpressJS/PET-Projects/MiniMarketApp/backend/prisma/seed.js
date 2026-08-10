// backend/prisma/seed.js
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { PrismaClient } from '@prisma/client'; 

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🚀 Запуск сида через npx prisma db seed...");

  const existingAdmin = await prisma.user.findUnique({
    where: { email: "admin@mail.com" }
  });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: "admin@mail.com",
        passwordHash: "$2b$10$EPY9b0U/f36ySgIex74scO5i8Ue0zD9gW8zEfe8W9a08tP7w9uQ3q",
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
        `https://picsum.photos{i}/200/300`,
        `https://picsum.photos{i + 100}/400/300`
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
