# Полезные команды для работы с докером
```text
# Запуск в фоне
docker-compose up -d

# Просмотр логов
docker-compose logs -f api

# Пересборка после изменений
docker-compose up -d --build

# Остановка
docker-compose down

# Войти в контейнер
docker-compose exec api sh

# Проверить базу из контейнера
docker-compose exec api npx prisma studio
```