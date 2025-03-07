const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const dbUrl = process.env.DB_URL;
    const dbUsername = process.env.DB_USERNAME;
    const dbPassword = process.env.DB_PASSWORD;

    if (!dbUrl || !dbUsername || !dbPassword) {
      throw new Error(
        "❌ DB_URL, DB_USERNAME, or DB_PASSWORD is not defined in .env"
      );
    }

    // MongoDB 연결 URI를 새로 구성합니다.
    const mongoURI = dbUrl.replace(
      "mongodb://",
      `mongodb://${dbUsername}:${encodeURIComponent(dbPassword)}@`
    );

    console.log("⏳ MongoDB 연결 시도 중..."); // 연결 시도 로그 추가

    await mongoose.connect(mongoURI);

    console.log("✅ MongoDB Connected"); // 연결 성공 시 로그
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1); // 오류 발생 시 프로세스 종료
  }
};

module.exports = connectDB;
