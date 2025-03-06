# Використовуємо офіційний образ Node.js
FROM node:18

# Встановлюємо робочу директорію
WORKDIR /app

# Копіюємо файли проекту
COPY package*.json ./
COPY . .

# Встановлюємо залежності
RUN npm install --omit=dev

# Відкриваємо порт (не обов’язково, але для ясності)
EXPOSE 3000

# Запускаємо додаток
CMD [ "npm", "start" ]

ENV PORT=3000