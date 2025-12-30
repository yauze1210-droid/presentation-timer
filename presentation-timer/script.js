let TOTAL_TIME = 0;
let startTime = null;
let timerId = null;

let script = [];
let secPerChar = 0;

const scriptArea = document.getElementById("script-area");
const startBtn = document.getElementById("start-btn");
const timeInput = document.getElementById("time-input");
const scriptInput = document.getElementById("script-input");

let startIndex = 0;

// ===== 描画 =====
function renderScript(elapsed = 0) {
  scriptArea.innerHTML = "";

  if (script.length === 0) {
    scriptArea.textContent = "原稿を入力してください";
    return;
  }

  // --- 各行の開始文字位置を計算 ---
  let lineCharPositions = [];
  let sum = 0;
  for (let i = 0; i < script.length; i++) {
    lineCharPositions.push(sum);
    sum += script[i].length;
  }

  // --- 今読んでいる文字数 ---
  const readChars = elapsed / secPerChar;

  script.forEach((text, index) => {
    const line = document.createElement("div");

    // ▶表示（開始前のみ）
    const prefix =
      (startTime === null && index === startIndex) ? "▶︎ " : "　";
    line.textContent = prefix + text;

    // ===== 背景色（文字距離ベース）=====
    if (startTime !== null) {
      const lineCharPos = lineCharPositions[index];
      const diffChars = Math.abs(lineCharPos - readChars);

      if (diffChars <= 30) {
        // 現在読んでいる塊
        line.style.backgroundColor = "#d8f5d0"; // 緑
        line.style.fontWeight = "bold";
      } else if (diffChars <= 120) {
        // 少し先・少し遅れ
        line.style.backgroundColor = "#fff3c4"; // 黄
      } else {
        // それ以外
        line.style.backgroundColor = "#f7d6d6"; // 赤
      }
    }

    // ===== 開始前のみクリック可能 =====
    if (startTime === null) {
      line.addEventListener("click", () => {
        startIndex = index;
        renderScript();
      });

      if (index === startIndex) {
        line.style.backgroundColor = "#e0f0ff";
        line.style.border = "1px solid #8ab6ff";
      }
    }

    scriptArea.appendChild(line);
  });
}

// ===== 開始ボタン =====
startBtn.addEventListener("click", () => {
  if (startTime !== null) return;

  // 原稿取得
  script = scriptInput.value
    .split("\n")
    .map(line => line.trim())
    .filter(line => line !== "");

  if (script.length === 0) {
    alert("原稿を入力してください");
    return;
  }

  // 制限時間取得
  TOTAL_TIME = Number(timeInput.value);
  if (!TOTAL_TIME || TOTAL_TIME <= 0) {
    alert("制限時間を正しく入力してください");
    return;
  }

  // 総文字数
  const totalChars = script.reduce(
    (sum, line) => sum + line.length,
    0
  );

  // 1文字あたりの秒数
  secPerChar = TOTAL_TIME / totalChars;

  startTime = Date.now();
  startBtn.disabled = true;

  timerId = setInterval(() => {
    const elapsed = (Date.now() - startTime) / 1000;
    renderScript(elapsed);

    if (elapsed >= TOTAL_TIME) {
      clearInterval(timerId);
      startBtn.textContent = "終了";
    }
  }, 500);
});

// 初期表示
renderScript();
