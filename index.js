const express = require("express");
const session = require("express-session");
const cors = require("cors");
const askAI = require("./googlegemize");

const path = require("path");
const fs = require("fs");

const app = express();

app.use(session({
  secret: "your-secret-key",
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 ngày
  }
}));

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const chatDir = path.join(__dirname, "chats");

// tạo thư mục chats nếu chưa có
if (!fs.existsSync(chatDir)) {
  fs.mkdirSync(chatDir);
}

// Hàm lấy path file theo session
function getChatFile(sessionId) {
  return path.join(chatDir, `${sessionId}.txt`);
}

// Hàm lưu chat
function saveChat(userMessage, aiMessage, sessionId) {

  const filePath = getChatFile(sessionId);

  // tạo file nếu chưa tồn tại
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "");
  }

  const content = `
  USER: ${userMessage}
  AI: ${aiMessage}

`;

  fs.appendFileSync(filePath, content);
}

// Tạo session chat
app.get("/chat", (req, res) => {

  const sessionId = req.sessionID;

  console.log("Session ID:", sessionId);

  const filePath = getChatFile(sessionId);

  // chỉ tạo file nếu chưa tồn tại
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "");
    console.log("Chat file created:", filePath);
  }

  res.json({
    sessionId,
    file: `${sessionId}.txt`
  });
});

// AI endpoint
app.post("/ai", async (req, res) => {

  try {

    const { prompt } = req.body;

    const sessionId = req.sessionID;

    const aiResponse = await askAI(prompt);

    saveChat(prompt, aiResponse, sessionId);

    return res.json({
      response: aiResponse
    });

  } catch (err) {

    return res.status(500).json({
      error: err.message
    });

  }

});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});