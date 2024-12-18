const express = require("express"); //express를 설치했기 때문에 가져올 수 있다.
const app = express();
const path = require("path");

// React 빌드 파일을 정적 파일로 제공
app.use(express.static(path.join(__dirname, "client/somnia_build/build")));

// 모든 기타 요청에 대해 React 앱의 index.html 반환
app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "client/somnia_build/build/", "index.html")
  );
});

app.use(express.static(path.join(__dirname, "client/somnia_build/build")));
app.get("/somnia_build", (req, res) => {
  res.sendFile(path.join(__dirname, "client/somnia_build/build/index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
