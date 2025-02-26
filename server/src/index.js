require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

const port = process.env.PORT || 5000;

// MongoDB 연결
connectDB();

// 서버 실행
app.listen(port, () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
});
