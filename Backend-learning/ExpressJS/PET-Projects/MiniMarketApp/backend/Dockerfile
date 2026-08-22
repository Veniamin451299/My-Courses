# path: backend/Dockerfile
# 1. От какого базового образа строим контейнер
FROM node:20-alpine
# 2. Рабочая папка внутри контейнера
WORKDIR /app
# 3. Копируем package.json, чтобы установить зависимости
COPY package*.json ./
# 4. Устанавливаем зависимости (без dev-пакетов для эконома)
RUN npm ci --only=production
# 5. Копируем весь код кроме файла .dockerignore
COPY . .
# 6. Генерируем Prisma CLient
RUN npx prisma generate
# 7. Указываем порт
EXPOSE 3000
# 8. Команда для запуска
CMD ["node", "src/server.js"]