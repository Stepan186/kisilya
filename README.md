# kisilya

1.Создайте .env файл в папке backend
2.В .env файле создайте переменные (SECRET_KEY, SALT), например: (SECRET_KEY=hard, SALT=$2b$10$P3eW.p7MauNOiba8qa6l5O)
3.В терминале наберите команду docker-compose up -d
4.В терминале выполнить команду docker exec -it "Название контейнера" npx mikro-orm migration:up

Swagger(http://localhost:8000/swagger/)
