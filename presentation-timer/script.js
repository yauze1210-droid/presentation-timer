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

function renderScript(elapsed=0){
  scriptArea.innerHTML = "";

  if(script.length===0){
    scriptArea.textContent="原稿を入力してください";
    return;
  }

  const readChars = elapsed / secPerChar;
  let charCount=0;
  let idealIndex=startIndex;

  for(let i=startIndex;i<script.length;i++){
    charCount+=script[i].length;
    if(charCount>=readChars){
      idealIndex=i;
      break;
    }
  }

  script.forEach((line,index)=>{
    const div=document.createElement("div");

    const prefix=(startTime===null && index===startIndex)?"▶︎ ":"　";
    div.textContent=prefix+line;

    if(startTime!==null){
      const diff=Math.abs(index-idealIndex);
      if(diff===0){
        div.style.backgroundColor="#d8f5d0"; // 緑
        div.style.fontWeight="bold";
      } else if(diff===1){
        div.style.backgroundColor="#fff3c4"; // 黄
      } else {
        div.style.backgroundColor="#f7d6d6"; // 赤
      }
    }

    if(startTime===null){
      div.addEventListener("click",()=>{
        startIndex=index;
        renderScript();
      });
      if(index===startIndex){
        div.style.backgroundColor="#e0f0ff";
        div.style.border="1px solid #8ab6ff";
      }
    }

    scriptArea.appendChild(div);
  });
}

startBtn.addEventListener("click",()=>{
  if(startTime!==null) return;

  script=scriptInput.value.split("\n").map(l=>l.trim()).filter(l=>l!=="");
  if(script.length===0){ alert("原稿を入力してください"); return; }

  TOTAL_TIME=Number(timeInput.value);
  if(!TOTAL_TIME || TOTAL_TIME<=0){ alert("制限時間を正しく入力してください"); return; }

  const totalChars=script.reduce((s,l)=>s+l.length,0);
  secPerChar=TOTAL_TIME/totalChars;

  startTime=Date.now();
  startBtn.disabled=true;

  clearInterval(timerId);
  timerId=setInterval(()=>{
    const elapsed=(Date.now()-startTime)/1000;
    renderScript(elapsed);
    if(elapsed>=TOTAL_TIME){ clearInterval(timerId); startBtn.textContent="終了"; }
  },500);
});

renderScript();
