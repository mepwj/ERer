# 베이스 이미지 설정
FROM node:20-alpine

# 작업 디렉토리 설정
WORKDIR /app

# 패키지 파일 복사
COPY package*.json ./

# 프로덕션 환경에서 실제 사용하는 패키지만 설치
RUN npm install --frozen-lockfile --production

# 소스 코드 복사
COPY . .

# 포트 설정
EXPOSE 5000

# 실행 명령어 설정
CMD ["npm", "start"]