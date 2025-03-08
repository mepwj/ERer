# 베이스 이미지 설정
FROM node:20-alpine AS builder

# 작업 디렉토리 설정
WORKDIR /app

# 패키지 복사 및 설치 
COPY package*.json ./

# 필요한 패키지만 설치 + lockfile 강제로 버전 정확히 설치 
RUN npm install --frozen-lockfile --production

# 소스 코드 복사 
COPY . .

# Next.js 빌드 
RUN npm run build 

# 실행용 베이스 이미지 설정
FROM node:20-alpine AS runner

# 작업 디렉토리 설정
WORKDIR /app

# 빌드된 파일과 필요한 패키지만 복사 
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules

# 포트 설정
EXPOSE 3000

# 실행 명령 설정
CMD ["npm", "start"]