import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const STYLE = `
*,*::before,*::after{cursor:none!important;box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}

@keyframes float1{0%,100%{transform:translate(0,0) scale(1);}33%{transform:translate(40px,-55px) scale(1.07);}66%{transform:translate(-18px,30px) scale(0.94);}}
@keyframes float2{0%,100%{transform:translate(0,0) scale(1);}33%{transform:translate(-50px,38px) scale(0.92);}66%{transform:translate(28px,-28px) scale(1.06);}}
@keyframes float3{0%,100%{transform:translate(0,0);}50%{transform:translate(22px,34px);}}
@keyframes holoShimmer{0%{background-position:0% 50%;}50%{background-position:100% 50%;}100%{background-position:0% 50%;}}
@keyframes fadeSlideUp{from{opacity:0;transform:translateY(22px);}to{opacity:1;transform:translateY(0);}}
@keyframes scrollPulse{0%,100%{opacity:.3;transform:translateY(0);}50%{opacity:.9;transform:translateY(8px);}}

.holo-text{
  background:linear-gradient(90deg,#ffb3c6,#c8b6ff,#9bf6ff,#caffbf,#ffd6a5,#ffb3c6);
  background-size:300% 200%;
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
  background-clip:text;animation:holoShimmer 6s ease infinite;
}
.reveal{opacity:0;transform:translateY(30px);transition:opacity .8s cubic-bezier(.16,1,.3,1),transform .8s cubic-bezier(.16,1,.3,1);}
.reveal.is-visible{opacity:1;transform:translateY(0);}
.reveal:nth-child(2){transition-delay:.08s;}
.reveal:nth-child(3){transition-delay:.16s;}
.reveal:nth-child(4){transition-delay:.24s;}
.era-card{background:#fff;border:1px solid rgba(0,0,0,.07);border-radius:3px;overflow:hidden;transition:transform .35s ease,box-shadow .35s ease;}
.era-card.is-visible:hover{transform:translateY(-8px) rotate(-.25deg);box-shadow:0 24px 48px rgba(0,0,0,.1);}
.movie-card{border-radius:3px;overflow:hidden;transition:transform .35s ease,box-shadow .35s ease;}
.movie-card.is-visible:hover{transform:translateY(-7px);box-shadow:0 22px 44px rgba(0,0,0,.25);}
.ppt-cover{transition:transform .35s ease,box-shadow .35s ease;}
.ppt-card:hover .ppt-cover{transform:translateY(-8px) rotate(.25deg);box-shadow:0 24px 48px rgba(0,0,0,.22);}
.nav-a{font-family:'Pretendard',sans-serif;font-size:11px;font-weight:300;letter-spacing:.12em;text-decoration:none;color:rgba(255,255,255,.55);transition:color .2s;}
.nav-a:hover{color:#fff;}
.tag{display:inline-block;padding:3px 10px;border:1px solid rgba(0,0,0,.12);border-radius:20px;font-family:'Pretendard',sans-serif;font-size:10px;font-weight:300;letter-spacing:.04em;color:#666;}
.dark-tag{display:inline-block;padding:3px 10px;border:1px solid rgba(255,255,255,.17);border-radius:20px;font-family:'Pretendard',sans-serif;font-size:10px;font-weight:300;color:rgba(255,255,255,.5);}
.close-btn{position:absolute;top:18px;right:20px;background:none;border:none;font-size:22px;opacity:.4;transition:opacity .2s;line-height:1;}
.close-btn:hover{opacity:.9;}
.nav-bar{padding:0 44px;}
.nav-links{display:flex;gap:26px;}
.section-pad{padding:100px 44px;}
.duo-grid{display:grid;grid-template-columns:220px 1fr;gap:80px;}
.eras-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;}
.movies-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;}
.ppt-grid{display:grid;grid-template-columns:1fr 1fr;gap:32px;}
@media(max-width:860px){
  .eras-grid{grid-template-columns:repeat(2,1fr);}
  .movies-grid{grid-template-columns:repeat(2,1fr);}
}
@media(max-width:600px){
  .nav-bar{padding:0 18px;}
  .nav-links{display:none;}
  .section-pad{padding:60px 20px;}
  .duo-grid{grid-template-columns:1fr;gap:28px;}
  .eras-grid{grid-template-columns:1fr;}
  .movies-grid{grid-template-columns:1fr;}
  .ppt-grid{grid-template-columns:1fr;gap:24px;}
}
`;

const ERAS = [
  { id:"prehistoric", num:"01", title:"원시 예술", en:"Prehistoric Art", period:"~30,000 BCE",
    grad:"linear-gradient(135deg,#ffb3c6 0%,#ffd6a5 100%)",
    keys:["동굴벽화","주술적 목적","빌렌도르프의 비너스","프레스코화","다산의 염원"],
    imgs:[
      { t:"알타미라 동굴벽화", a:"선사시대 (스페인)", y:"~15,000 BCE", src:"/images/알타미라동굴벽화.webp" },
      { t:"빌렌도르프의 비너스", a:"선사시대 (오스트리아)", y:"~25,000 BCE", src:"/images/빌렌도르프의비너스.jpg" },
      { t:"캥거루에 창을 던지는 주술사", a:"선사시대 (오스트레일리아)", y:"미상", src:"/images/캥거루에창을던지는주술사.jpg" },
    ],
    memo:"'보이는 것'이 아닌 '아는 것'을 그린다 — 동물의 내장, 집 너머 내부까지 표현한다.\n\n### 알타미라 동굴벽화 (스페인, ~15,000 BCE)\n\n- 잡고 싶은 것 또는 잡은 것을 그림 (주술적 목적)\n- 재료: 태운 재 / 식물 원료 / 석기\n\n### 빌렌도르프의 비너스 (~25,000 BCE)\n\n- 다산 후에도 건강하게 살아남을 이상적 모습을 조각\n- '비너스' 앞 수식어 = 발견된 지역명\n\n### 캥거루에 창을 던지는 주술사 (오스트레일리아)\n\n- 내장까지 표현 → 풍요와 다산 염원\n\n★ 프레스코화(Fresco): 이탈리아어 '신선하다'. 석회가루+안료를 벽에 바른 후 마르기 전에만 그릴 수 있어, 하루에 작업할 분량만큼만 바름. 대표작: 시스티나 성당 천장화\n\n### cf. 템페라화 (Tempera)\n\n- 이미 마른 벽 또는 나무 위에 그림\n- 재료: 계란 노른자 + 안료\n- 빠르게 마름, 수정이 어려움",
    feel:"박물관이나 미술관에서 원시 미술을 마주하면 무심코 지나치게 되곤 했다. 무의식적으로 '잘 못 그린 그림'이라고 여겼기 때문이었을 것이다. 그런데 생각해보면 그건 펜도 붓도 없던 시대, 돌 벽에 형태를 새긴 행위였다. 보이는 것이 아닌 아는 것을 그리는 단계였다는 것. 그 한 문장이 원시 미술 전체를 관통한다."
  },
  { id:"egypt", num:"02", title:"고대 이집트", en:"Ancient Egypt", period:"3000–30 BCE",
    grad:"linear-gradient(135deg,#ffd6a5 0%,#caffbf 50%,#9bf6ff 100%)",
    keys:["정면성의 원리","사후세계","장례문화","부조","투탕카멘"],
    imgs:[
      { t:"나르메르 왕의 팔레트", a:"고대 이집트", y:"~3100 BCE", src:"/images/나르메르왕의팔레트.jpg" },
      { t:"투탕카멘 황금 마스크", a:"고대 이집트", y:"~1323 BCE", src:"/images/투탕카멘의황금마스크.jpg" },
      { t:"사자의 서", a:"고대 이집트", y:"~1300 BCE", src:"/images/사자의서.jpg" },
    ],
    memo:"사후세계를 믿어 예술이 장례문화에서 발전 — 모든 것이 영원을 위한 표현이다.\n\n★ 정면성의 원리: 가장 아름답다고 생각하는 신체 부위를 파츠별 최적의 각도로 조합. 얼굴: 측면 / 몸통: 정면 / 눈: 정면. 단순한 어색함이 아닌, 그 시대의 논리였다.\n\n### 나르메르 왕의 팔레트 (~3100 BCE)\n\n- 정면성의 원리가 잘 드러나는 대표 부조 작품\n\n### 이집트 신왕국 벽화\n\n- 물고기 → 위에서 본 모습으로 묘사\n- 나무 → 사방 정면으로 묘사\n\n### 이집트 3대 미녀\n\n- 클레오파트라\n- 네페르티티\n- 아낙수나문 (네페르티티의 딸)\n\n### 조각 용어 정리\n\n- 부조(浮彫): 파내어 형태를 돋아나게 표현\n- 환조(丸彫): 전체가 입체인 독립 조각\n- 토르소(Torso): 두부·사지 없이 몸통만 남은 조각",
    feel:"가장 아름답다고 생각하는 신체 부위들을 파츠별로 조합해 그린다는 정면성의 원리가 낯설면서도 이상하게 납득이 됐다. 보기 좋은 걸 모아서 그리면 가장 완전한 형태가 된다는 논리는, 어쩌면 지금도 어딘가에서 이어지고 있는 감각 아닐까. 이집트 예술이 사후세계와 깊게 연결되어 있다는 것도 인상적이었다. 영원을 위해 그린 미술이라는 말이 오래 남는다."
  },
  { id:"greece", num:"03", title:"그리스 예술", en:"Ancient Greece", period:"800–31 BCE",
    grad:"linear-gradient(135deg,#9bf6ff 0%,#c8b6ff 60%,#ffb3c6 100%)",
    keys:["콘트라포스토","인체 비례","니케","라오콘","도·이·코 기둥 양식"],
    imgs:[
      { t:"사모트라케의 니케", a:"기원전 2세기", y:"~190 BCE", src:"/images/사모트라케의니케.jpg" },
      { t:"라오콘 군상", a:"아게산드로스 외", y:"~40–30 BCE", src:"/images/라오콘군상.jpg" },
      { t:"헤르메스와 디오니소스", a:"프락시텔레스", y:"~340 BCE", src:"/images/헤르메스와디오니소스.jpg" },
    ],
    memo:"'고귀한 단순함, 고요한 위대함' — 인간 신체의 이상을 가장 완벽하게 표현한 시대.\n\n★ 콘트라포스토(Contrapposto): 한쪽 다리에 체중을 싣고 반대쪽에 힘을 빼 자연스러운 S자 곡선. 그리스 조각의 핵심이며 이후 서양 조각 전반에 계승됨.\n\n### 사모트라케의 니케 (~190 BCE)\n\n- 팔과 얼굴을 복원하지 않아 오히려 더 신비롭다\n- 나이키(Nike) 로고가 이 작품에서 착안됨\n\n### 라오콘 군상 (~40–30 BCE)\n\n- 삼각형 구도 → 역동적이면서도 안정적\n- 트로이 목마를 반대했다가 신들의 노여움을 사 뱀에 죽는 장면\n- 빙켈만의 심층 분석으로 유명해진 작품\n\n### 헤르메스와 디오니소스 (프락시텔레스, BC 340)\n\n- 그리스 조각의 정점으로 평가\n- 날개 달린 모자·신발: 헤르메스의 상징\n\n### 기둥 3종류\n\n- 도리아식(Doric): 단순하고 굵음, 남성적\n- 이오니아식(Ionic): 소용돌이 장식, 여성적\n- 코린트식(Corinthian): 아칸서스 잎 장식, 화려함\n\n조소(彫塑) = 조각(대리석 깎기) + 소조(흙 빚기)",
    feel:"콘트라포스토의 자연스러운 S자 곡선이 아직도 기억에 선명하다. 유럽에서 마주쳤던 수많은 조각들이 그 자세를 취하고 있었다는 걸, 수업을 듣고 나서야 알게 됐다. 인간 본연의 모습을 가장 아름답게 담고자 했던 그리스 예술. 도리아식, 이오니아식, 코린트식으로 나뉘는 기둥 양식도, 이제는 성당이나 박물관 앞에 서면 자연스럽게 떠오를 것 같다."
  },
  { id:"medieval", num:"04", title:"중세 예술", en:"Medieval Art", period:"5–15세기",
    grad:"linear-gradient(135deg,#c8b6ff 0%,#fdffb6 100%)",
    keys:["신 중심","스테인드글라스","고딕 양식","비잔틴·로마네스크","성경 전달"],
    imgs:[
      { t:"샤르트르 대성당 스테인드글라스", a:"12–13세기", y:"1194–1220", src:"/images/샤르트르대성당스테인드글라스.webp" },
      { t:"라벤나 비잔틴 모자이크", a:"비잔틴", y:"6세기", src:"/images/라벤나비잔틴모자이크.jpg" },
      { t:"노트르담 대성당 정면", a:"고딕", y:"1163–1345", src:"/images/노트르담대성당.webp" },
    ],
    memo:"창작자보다 창작물이 중요하다 — 신을 위한 예술, 예술가는 이름을 남기지 않는다.\n\n### 건축 양식의 발전\n\n- 반아치 → 직사각형(두꺼운 기둥 필요)\n- 뾰족 지붕 도입 → 하중 분산 → 벽이 얇아짐\n- 벽이 얇아지면서 → 창문 확장 가능\n- 큰 창문 → 스테인드글라스 등장 → 돔\n\n### 양식 흐름\n\n- 비잔틴(+자형 평면) → 로마네스크(†) → 고딕(첨탑) → 르네상스\n\n### 스테인드글라스\n\n- 원색으로 성경 이야기를 묘사\n- 빛이 들어올 때 퀄리티가 결정됨\n- 문맹률이 높아 그림과 빛이 성경을 전달하는 언어 역할\n\n### 샤르트르 대성당\n\n- 고딕 양식의 대표 스테인드글라스\n\n### 라벤나 비잔틴 모자이크\n\n- 6세기 이탈리아 라벤나, 초기 기독교 미술의 정수\n\n중세 예술가들은 이름을 남기지 않았다. 작품이 영광을 받는 것이 목적이었기 때문.",
    feel:"중세는 건축물 중심이었다. 위로 하중을 분산하기 위해 뾰족해질 수밖에 없던 지붕, 두꺼운 벽 대신 창문을 채운 스테인드글라스. 유럽 성당에서 봤던 그 빛들이 이 시기에 탄생했다는 걸 알게 되니 더 반갑게 느껴졌다. 문맹이 많았던 시대에 그림과 빛이 성경을 전달했다는 것, 미술이 정보를 전달하는 언어이기도 했다는 생각이 새롭게 다가왔다."
  },
  { id:"renaissance", num:"05", title:"르네상스", en:"Renaissance", period:"14–17세기",
    grad:"linear-gradient(135deg,#caffbf 0%,#fdffb6 50%,#ffd6a5 100%)",
    keys:["인간 중심","스푸마토","원근법","다빈치·미켈란젤로·라파엘로","보티첼리"],
    imgs:[
      { t:"모나리자", a:"레오나르도 다빈치", y:"1503–1519", src:"/images/모나리자.jpg" },
      { t:"최후의 만찬", a:"레오나르도 다빈치", y:"1495–1498", src:"/images/최후의만찬.jpg" },
      { t:"암굴의 성모", a:"레오나르도 다빈치", y:"1483–1486", src:"/images/암굴의성모.webp" },
      { t:"다비드", a:"미켈란젤로", y:"1501–1504", src:"/images/다비드상.jpg" },
      { t:"피에타", a:"미켈란젤로", y:"1498–1499", src:"/images/피에타.jpg" },
      { t:"시스티나 천장화", a:"미켈란젤로", y:"1508–1512", src:"/images/시스티나천장화.jpg" },
      { t:"최후의 심판", a:"미켈란젤로", y:"1536–1541", src:"/images/최후의심판.webp" },
      { t:"아테네 학당", a:"라파엘로", y:"1509–1511", src:"/images/아테네학당.webp" },
      { t:"비너스의 탄생", a:"보티첼리", y:"1484–1486", src:"/images/비너스의탄생.jpg" },
      { t:"봄 (프리마베라)", a:"보티첼리", y:"1477–1482", src:"/images/봄.jpg" },
    ],
    memo:"르네상스(Renaissance): re(다시) + naissance(태어나다) = '부활'. 신 중심 → 인간 중심. 조토가 크기 차이로 최초 원근법을 시도했다.\n\n### 레오나르도 다빈치\n\n★ 스푸마토(Sfumato): 스케치 없이 윤곽선을 명암으로 처리. 몽환적 분위기와 공간감을 연출하는 다빈치 특유의 기법.\n\n- 모나리자: 눈썹 없음 / 어디서 봐도 시선이 따라옴(스푸마토) / 황금비율(1:1.618) / 좌우 배경 원근이 다름\n- 최후의 만찬: 소실점 활용 / 예수 뒤 창문으로 빛의 아우라 / 12제자를 3명씩 4그룹 배치\n- 암굴의 성모: 삼각형 구도 → 안정감 연출\n\n### 미켈란젤로\n\n★ 명언: '돌 안에 신이 인물을 가두고 있으며, 조각가는 그것을 깨내어 꺼내줄 뿐이다.'\n\n- 다비드: 콘트라포스토 / 골리앗과 싸우기 직전 극도의 긴장 순간 포착 / 손·머리가 크게 표현\n- 피에타: 삼각형 구도 / 신의 시선으로 내려다보는 구도\n- 시스티나 성당 천장화: 율리우스 교황 의뢰 / 프레스코 기법 / 4년 완성\n- 최후의 심판: 천국(위) / 연옥(왼쪽 아래) / 지옥(오른쪽 아래)\n\n### 라파엘로\n\n- 다빈치 스푸마토 + 미켈란젤로 웅장함 흡수\n- 아테네 학당: 54명 학자 / 플라톤(=다빈치 얼굴)·아리스토텔레스가 중심 / '기하학을 모르는 자는 이 문을 들어서지 말라'\n- 헤라클레이토스 = 미켈란젤로 얼굴 / 라파엘로 본인도 오른쪽 구석에\n- 라 포르나리나('빵집 아가씨'): 연인 마르게리타 / 왼손 반지(사랑)·팔찌(순결)\n\n### 보티첼리\n\n- 디자인적 감각, 평면적이고 선명한 선의 미학, 메디치 가문 후원\n- 비너스의 탄생: 콘트라포스토 / 왼쪽=제피로스(바람) / 오른쪽=호라이 / 머리카락에 금가루 / 모델: 시모네타\n- 아프로디테 어원: 아프로스(거품) + 이름\n- 봄(Primavera): 오른쪽→왼쪽 흐름 / 제피로스→클로리스→플로라→비너스→큐피드→미의 세 여신→헤르메스",
    feel:"잊을 수 없는 시대로 남았다. 왜 르네상스가 지금도 '전성기'의 의미로 소환되는지 비로소 알게 됐다. 파리와 이탈리아에서 스쳐 지나쳤던 작품들이 여기 속해 있었고, 모르고 봤을 때도 놀랐던 것들이 알고 나니 더욱 크게 다가왔다. 스푸마토 기법 덕분에 다빈치의 그림이 왜 그렇게 오묘하게 느껴지는지 알게 됐고, 시스티나 성당 천장화도 전혀 다른 눈으로 돌아봤다. 피에타의 정교함도, 아테네 학당 속 숨겨진 구도도. 보티첼리의 비너스의 탄생도 이제는 다른 눈으로 볼 수 있을 것 같다."
  },
  { id:"baroque", num:"06", title:"바로크", en:"Baroque", period:"17세기",
    grad:"linear-gradient(135deg,#ffd6a5 0%,#ffb3c6 100%)",
    keys:["키아로스쿠로","알라프리마","빛과 어둠","극적인 감정","루벤스·렘브란트·벨라스케스"],
    imgs:[
      { t:"파리스의 심판", a:"루벤스", y:"1632–1635", src:"/images/파이스의심판.jpg" },
      { t:"야경 (야간 순찰)", a:"렘브란트", y:"1642", src:"/images/야경.jpg" },
      { t:"시녀들 (Las Meninas)", a:"벨라스케스", y:"1656", src:"/images/시녀들.jpg" },
    ],
    memo:"빛나는 색채, 풍부한 대비, 강렬한 운동감 — 카라바조가 개척한 바로크 시대.\n\n★ 키아로스쿠로(Chiaroscuro): 빛과 어둠을 극적으로 배합해 입체감과 극적 분위기를 연출. 바로크의 핵심 기법.\n\n르네상스 vs 바로크\n- 르네상스: 촉각적 / 삼각형 구도 / 정적인 안정감\n- 바로크: 회화적 / S자 구도 / 화려한 색감과 역동성\n\n### 루벤스 — 파리스의 심판 (1632–1635)\n\n- 에리스의 황금 사과 → 파리스가 아프로디테 선택 → 트로이 전쟁의 시발점\n- 이때부터 비너스의 상징이 사과가 됨\n\n### 렘브란트 — 야경 (1642)\n\n- '빛의 화가' / 키아로스쿠로를 가장 잘 활용\n- 원제: '민병대를 이끄는 반닝 코크 대장'\n- 집단 초상화였으나 강조된 인물이 달라 후원자들 불만 야기\n\n### 벨라스케스 — 시녀들 (1656)\n\n★ 알라프리마(Alla Prima): 붓 터치 몇 번으로 빠르게 완성하는 기법. 피카소가 여러 번 재해석한 '화가들의 화가'.\n\n- 마르가리타 공주 중심 구도\n- 뒷벽 거울 속 왕·왕비 = 관람자의 위치 = 벨라스케스가 그리고 있는 대상\n- 메타회화적 구성",
    feel:"루벤스의 파리스의 심판이 유독 기억에 남는다. 어렴풋이 알던 그리스로마신화의 장면이 트로이 전쟁의 시발점으로 이어지고, 비너스의 상징이 사과가 된 이유까지 알게 됐다. 렘브란트가 왜 '빛의 화가'인지도, 키아로스쿠로라는 기법의 이름과 함께 이해됐다. 벨라스케스의 시녀들에 숨겨진 메타회화적 구성은 배우고 나서도 한참 생각하게 만드는 작품이었다."
  },
  { id:"impressionism", num:"07", title:"인상주의", en:"Impressionism", period:"19세기",
    grad:"linear-gradient(135deg,#ffb3c6 0%,#c8b6ff 50%,#9bf6ff 100%)",
    keys:["밀레","마네·모네","고흐·고갱","점묘법","순간의 빛"],
    imgs:[
      { t:"별이 빛나는 밤에", a:"빈센트 반 고흐", y:"1889", src:"/images/별이빛나는밤에.jpg" },
      { t:"이삭 줍는 사람들", a:"장 프랑수아 밀레", y:"1857", src:"/images/이삭줍는사람들.jpg" },
      { t:"인상, 해돋이", a:"클로드 모네", y:"1872", src:"/images/인상해돋이.jpg" },
      { t:"풀밭 위의 점심식사", a:"에두아르 마네", y:"1863", src:"/images/풀밭위의점심식사.jpg" },
    ],
    memo:"사진기 등장 → 있는 그대로의 묘사는 사진에 밀림 → 망막에 남은 잔상과 순간의 빛을 표현하기 시작했다.\n\n### 장 프랑수아 밀레 (Millet)\n\n- 바르비종 파(Barbizon) — 자연 속 농민의 삶을 솔직하게 묘사\n- 이삭 줍는 사람들: 추수 후 남은 이삭을 줍는 가난한 여인들\n- 씨 뿌리는 사람 / 만종: 일하다 기도하는 농부 부부\n- 고흐가 가장 동경한 화가 → 여러 번 모작\n\n### 에두아르 마네 (Manet)\n\n- '인상주의의 아버지' — 전통적 살롱 미술에 반기를 들어 낙선전(落選展) 개최\n- 올랭피아: 신화 속 나체가 아닌 현실 여성을 정면으로 직시해 당시 큰 충격을 줌\n- 풀밭 위의 점심: 야외의 일상적 장면을 회화로 끌어들임\n- 외광파(Pleinairisme): 야외에서 직접 관찰하며 빛의 변화를 포착\n\n### 클로드 모네 (Monet)\n\n- '인상주의'라는 명칭의 유래: 작품 〈인상, 해돋이〉에서 비롯됨\n- 수련 연작: 빛의 변화를 포착한 말년의 대작\n- 같은 소재를 시간대·계절별로 반복해 그림 → 빛 자체가 주제\n\n### 빈센트 반 고흐 (Van Gogh)\n\n- 밀레의 영향으로 시작 / 동생 테오 지원(편지 900통·생활비)\n- 고갱과 2달 동거 → 스타일 충돌(고갱:남성적 vs 고흐:감성적) → 귀 자름 → 정신병원 입원\n- 별이 빛나는 밤에: 정신병원에서 창작\n- 자화상 많이 그린 이유: 모델비 절감\n- 붉은 포도밭: 생전에 처음 팔린 유일한 작품\n\n### 폴 고갱 (Gauguin)\n\n- 도시 문명을 떠나 타히티 이주 → 원주민과 함께 생활\n- 강렬한 원색과 원시적 형태로 문명 비판\n\n### 쇠라 — 점묘법 (Pointillism)\n\n- 원색 점만으로 채색 → 눈 안에서 혼합되어 중간색 생성",
    feel:"밀레, 마네, 모네, 고흐. 과감한 붓터치로 순간을 기록한 그들의 작품을 제대로 보고 오지 못한 게 한으로 남을 것 같다. 파리에서 마네와 모네의 작품을 봤어야 했는데, 그때는 그냥 지나쳤던 것들이 이제야 아쉽게 느껴진다. 밀레가 고흐에게 영향을 줬다는 것, 모네의 수련 연작이 빛 자체를 그린 것이라는 것. 알고 나면 전혀 다른 그림이 된다는 걸 이 수업에서 배웠다."
  },
  { id:"cezanne", num:"08", title:"세잔", en:"Paul Cézanne", period:"19세기 후반",
    grad:"linear-gradient(135deg,#ffd6a5 0%,#caffbf 60%,#fdffb6 100%)",
    keys:["다시점","원기둥·원뿔·구","형태의 해방","현대미술의 아버지","생트빅투아르 산"],
    imgs:[
      { t:"생트빅투아르 산", a:"폴 세잔", y:"1887–1890", src:"/images/생트빅투아르산.jpg" },
      { t:"카드놀이를 하는 사람들", a:"폴 세잔", y:"1894–1895", src:"/images/카드놀이하는사람들.jpg" },
      { t:"사과와 오렌지", a:"폴 세잔", y:"1895–1900", src:"/images/사과와오렌지.jpg" },
      { t:"목욕하는 여인들", a:"폴 세잔", y:"1898–1905", src:"/images/목욕하는여인들.jpg" },
      { t:"아들 폴의 초상화", a:"폴 세잔", y:"1888–1890", src:"/images/아들폴의초상화.jpg" },
    ],
    memo:"'현대미술의 아버지' — 세잔에서 형태가 해방됐고, 그 이후 모든 현대미술이 뻗어나갔다.\n\n★ 세잔의 3핵심 개념\n\n①모든 정물은 원기둥·원뿔·구로 이루어진다\n②소실점이 일치하지 않는 다시점(多視點)을 도입\n③색은 주관적 느낌대로 칠해도 된다\n\n'보이는 대로 그리지 않아도 된다' — 이 한 문장이 이후 모든 현대미술의 문을 열었다.\n\n### 생트빅투아르 산 (연작)\n\n- 같은 산을 수십 점의 연작으로 제작\n- 볼 때마다 달라지는 빛과 대기를 다시점으로 포착\n\n### 카드놀이를 하는 사람들 (1894–1895)\n\n- 다시점이 인물 표현에 적용된 작품\n- 모델이 된 농부들의 견고한 형태감\n\n### 사과와 오렌지 (1895–1900)\n\n- 테이블 소실점 불일치가 가장 뚜렷하게 드러나는 작품\n- 세잔이 왜 '사과 하나로 파리를 정복하겠다'고 했는지 이해된다\n\n### 세잔 이후의 분화\n\n- 형태의 해방 → 피카소 (큐비즘)\n- 색의 해방 → 마티스 (야수파)",
    feel:"세잔은 처음엔 좀 막막했다. 왜 이렇게 사과를 많이 그렸을까, 왜 테이블이 기울어져 보일까. 그런데 그 이유를 알고 나니, 다시점과 형태의 해방이 얼마나 혁명적인 발상이었는지 실감됐다. '보이는 대로 그리지 않아도 된다'는 말이 현대미술 전체를 이해하는 하나의 열쇠였다. 세잔에서 피카소가, 마티스가 나왔다는 것. 모든 흐름이 여기서 시작된다는 게 선명하게 보였다."
  },
  { id:"rodin", num:"09", title:"로댕", en:"Auguste Rodin", period:"19세기 후반",
    grad:"linear-gradient(135deg,#9bf6ff 0%,#caffbf 100%)",
    keys:["지옥의 문","생각하는 사람","칼레의 시민","손","카미유 클로델"],
    imgs:[
      { t:"생각하는 사람", a:"오귀스트 로댕", y:"1880–1904", src:"/images/생각하는시민.jpg" },
      { t:"칼레의 시민", a:"오귀스트 로댕", y:"1884–1895", src:"/images/칼레의시민.jpg" },
      { t:"지옥의 문", a:"오귀스트 로댕", y:"1880–1917", src:"/images/지옥의문.webp" },
    ],
    memo:"로댕이 가장 중요하게 여긴 것 — 손.\n\n### 지옥의 문 (1880–1917)\n\n- 장식미술관 입구를 위한 의뢰 작품\n- 청동 거푸집으로 복제 → 전 세계 8개 존재 (삼성 소장본 포함)\n- 단테의 신곡에서 영감\n\n### 키스\n\n- 지옥의 문 속 장면이었으나 '너무 낭만적'이라는 이유로 제외\n- 실제로는 불륜 장면을 묘사\n\n### 생각하는 사람\n\n- 단테의 두건을 쓴 인물이 지옥을 내려다보는 장면\n- 지옥의 문 꼭대기에 위치\n\n### 칼레의 시민 (1884–1895)\n\n- 백년전쟁 중 칼레 시민을 구한 6명의 이야기\n- 가장 부자인 생 피에르가 먼저 자원\n- 노블레스 오블리주의 상징\n\n### 카미유 클로델\n\n- 로댕의 예술적 동반자이자 연인\n- 로즈 뵈레: 집안을 지킨 오랜 동반자\n- 로댕 미술관에 카미유 클로델 작품도 전시됨\n\n로댕은 77세까지 장수했고, 생전에 본인의 미술관을 건립했다.",
    feel:"로댕 하면 생각하는 사람만 알고 있었다. 수업을 통해 칼레의 시민을 알게 됐고, 노블레스 오블리주가 그 작품에서 비롯된 이야기라는 것도 함께 알게 됐다. 카미유 클로델 영화는 예술가의 삶을 다른 각도로 바라보게 해줬다. 로댕이 아닌 그 영화에서 더 크게 느낀 건, 재능이 있다는 것과 인정받는다는 것이 언제나 같은 말이 아니라는 것이었다."
  },
  { id:"art-therapy", num:"10", title:"미술치료", en:"Art Therapy", period:"수업 후반",
    grad:"linear-gradient(135deg,#caffbf 0%,#fdffb6 100%)",
    keys:["심상 표현","비언어적 수단","S-HTP","LMT","정서적 안정감"],
    imgs:[],
    memo:"그림은 말보다 솔직한 언어가 될 수 있다.\n\n★ 미술치료의 7가지 장점\n\n①심상 표현 — 말로 표현하기 어려운 내면 이미지를 시각화\n②비언어적 수단 — 언어 없이 표현해 방어 기제가 감소\n③구체적 유형 자료 — 작품이 물리적 증거로 남음\n④자료의 영속성 — 반복 재해석 가능\n⑤공간성 — 공간 구성이 인지 상태를 반영\n⑥창조성 — 창작 과정 자체가 치유\n⑦정서적 안정감 — 표현을 통한 심리적 이완\n\n### 분석 기법\n\n- S-HTP(집·나무·사람 그리기): 무의식적 자아와 환경 반영\n- LMT(풍경 구성법): 풍경 속 사물 배치로 내면 분석\n- 선의 강도, 얼굴 형태, 그림자 표현, 배치 등을 읽어냄\n\n수업 초반 '그냥' 그린 그림을 나중에 분석했을 때 — 아무 생각이 없었어도 그 안에 무의식이 담겨 있었다.",
    feel:"수업 초반, 교수님이 갑자기 그림을 그리라고 하셨다. 영문도 모르고 그렸는데, 나중에 알고 보니 미술치료의 일부였다. 아무 생각 없이 그린 그림인데, 그 안에 나의 무의식이 담겨 있다는 것. 학우들과 나의 그림이 모두 달랐지만, 분석에서 비슷한 경향성이 나타나는 것도 신기했다. 그림은 말보다 솔직한 언어가 될 수 있다는 걸 처음으로 체감한 시간이었다."
  },
  { id:"modern", num:"11", title:"현대미술 개요", en:"Modern Art", period:"20세기~",
    grad:"linear-gradient(135deg,#fdffb6 0%,#ffd6a5 50%,#ffb3c6 100%)",
    keys:["구상·비구상·추상","레디메이드","표현주의","개성의 시대","예술이란 무엇인가"],
    imgs:[],
    memo:"현대미술은 '개성의 시대' — 누가 어떻게 그리느냐보다, 무엇을 선택하고 제시하느냐가 중요해졌다.\n\n### 용어 정리\n\n- 구상(具象): 구체적인 형태가 있는 작품\n- 비구상: 형태는 인식되나 획기적 방식으로 표현\n- 추상(抽象): 형태 없음, 작가의 의미를 투여\n- 레디메이드(Ready-made): 기성품을 예술로 제시\n\n★ 세잔 이후 두 갈래로 분화: 형태의 해방 → 피카소(큐비즘) / 색의 해방 → 마티스(야수파). 현대미술의 모든 흐름이 세잔에서 출발한다.\n\n### 현대미술의 주요 흐름\n\n- 큐비즘 (피카소): 형태 해체와 다시점\n- 야수파 (마티스): 색의 해방\n- 표현주의 (뭉크·칸딘스키): 내면 감정의 왜곡\n- 다다이즘 (뒤샹): 기존 예술 개념 전면 파괴\n- 초현실주의 (달리·마그리트): 무의식과 꿈의 시각화\n- 절대주의·추상표현주의: 극단의 추상\n- 팝아트 (워홀): 대중문화의 예술화\n- 비디오 아트 (백남준): 미디어가 캔버스가 되다\n\n### 기타 현대미술가\n\n- 잭슨 폴록: 액션 페인팅·드리핑 / Number 5 (2006년 1,313억 경매)\n- 마크 로스코: 대형 색면 회화로 감정 전달\n- 루초 폰타나: 캔버스를 칼로 그어 '공간주의'\n- 말레비치: 흰 캔버스 위 흰 정사각형 (절대주의)\n- 에셔: 테셀레이션 / 낮과 밤 / 그리는 손",
    feel:"현대 미술은 잘 이해하지 못하는 사람이라고만 생각하며 살아왔다. 그런데 구상, 비구상, 추상의 차이를 알고 나니, 이해가 안 됐던 게 당연했다는 생각이 들었다. 각 그림에 담긴 개성과 스토리텔링의 배경을 알게 되니 한층 가까워진 느낌이었다. 앞으로 미술관에 더 자주 가보고 싶다는 생각이 들게 만든 파트였다."
  },
  { id:"cubism", num:"12", title:"피카소와 큐비즘", en:"Picasso & Cubism", period:"20세기 초",
    grad:"linear-gradient(135deg,#c8b6ff 0%,#9bf6ff 60%,#caffbf 100%)",
    keys:["큐비즘","아비뇽의 아가씨들","게르니카","다시점","파편화"],
    imgs:[
      { t:"아비뇽의 아가씨들", a:"파블로 피카소", y:"1907", src:"/images/아비뇽의아가씨들.webp" },
      { t:"게르니카", a:"파블로 피카소", y:"1937", src:"/images/게르니카.webp" },
      { t:"우는 여인", a:"파블로 피카소", y:"1937", src:"/images/우는여인.webp" },
    ],
    memo:"스페인 3대 화가 중 한 명 — 평생 7명의 여성이 화풍 변화에 직접 영향을 미쳤다.\n\n### 화풍 변화\n\n- 청색시대: 친구의 자살 → 어둡고 차가운 색채\n- 장밋빛시대: 서커스 공연자들을 밝은 분홍빛으로\n- 아비뇽의 아가씨들: 아프리카 조각상 영향 → 큐비즘 시작\n- 큐비즘 전성기\n- 고전 복귀\n\n★ 큐비즘(Cubism): 2차원 평면에 3차원 입체를 담기 위해 대상을 다양한 시점에서 분해·재조합. 세잔의 다시점을 극단까지 밀어붙인 것.\n\n### 아비뇽의 아가씨들 (1907)\n\n- 아프리카 조각상에서 영감\n- 큐비즘 탄생의 출발점\n\n### 게르니카 (1937)\n\n- 나치 독일 공습으로 파괴된 스페인 게르니카 마을\n- 흑·백·회색만 사용 → 색이 없을 때 오히려 더 강렬한 슬픔\n\n### 피카소의 7명의 여성\n\n- 페르낭드 → 에바 → 올가 → 마리테레즈 → 도라마르(게르니카 시기) → 프랑수아즈 → 자클린\n- 각 여성과의 관계가 화풍 변화와 직결됨",
    feel:"피카소에 대해 알고 있던 건 어렸을 때부터 그림을 굉장히 잘 그리는 천재였다는 것뿐이었다. 세잔의 영향을 받아 큐비즘으로 나아갔다는 걸 알게 되니 더 흥미롭게 다가왔다. 게르니카는 흑백으로만 이루어진 그림인데도, 색보다 더 강렬하게 슬픔이 느껴진다. 피카소의 여성편력이 화풍 변화와 직결됐다는 이야기는 그냥 신기했다. 영감을 삶 전체에서 끌어온 사람이라는 생각이 들었다."
  },
  { id:"fauvism", num:"13", title:"마티스와 야수파", en:"Matisse & Fauvism", period:"20세기 초",
    grad:"linear-gradient(135deg,#ffd6a5 0%,#ffb3c6 50%,#c8b6ff 100%)",
    keys:["색의 해방","원색·보색","야수파","컷아웃","무채색 균형"],
    imgs:[
      { t:"모자를 쓴 여인", a:"앙리 마티스", y:"1905", src:"/images/모자를쓴여인.jpg" },
      { t:"루마니아식 블라우스", a:"앙리 마티스", y:"1940", src:"/images/루마니아식블라우스.jpg" },
      { t:"푸른 누드 (컷아웃)", a:"앙리 마티스", y:"1952", src:"/images/푸른누드.jpg" },
    ],
    memo:"'행복의 화가' — 1·2차 세계대전 중에도 밝고 따뜻한 장면만 그렸다.\n\n★ 야수파(Fauvism): 색의 해방 선언. 원색·보색을 대담하게 사용, 선·원근·입체감은 무시. 1905년 전시에서 '야수들의 그림'이라는 혹평을 받으며 이름이 붙었다.\n\n### 보색 전략\n\n- 보색을 많이 써도 촌스럽지 않은 이유\n- 무채색을 전략적으로 배치해 균형을 잡음\n\n### 컷아웃 (Cut-out)\n\n- 건강 악화로 붓을 잡기 어려워지자 개발한 기법\n- 미리 채색한 색종이를 오려 붙이는 방식\n- 대표작: 푸른 누드\n\n### 앙리 마티스 성당 (방스, 프랑스)\n\n- 자신을 도와준 수녀를 위해 직접 설계\n- 오전 11시 스테인드글라스로 들어오는 빛이 아름답기로 유명\n\n### 주요 작품\n\n- 모자를 쓴 여인(1905): 색으로 감정 표현하는 야수파 대표작\n- 루마니아식 블라우스(1940): 과감한 단순화와 평면성\n- 푸른 누드(1952): 컷아웃 기법의 완성",
    feel:"야수파라는 이름만 보면 거칠고 강렬한 화풍이 연상된다. 그런데 마티스는 의외로 행복을 그렸다. 전쟁의 시대에도 밝고 따뜻한 장면만 담아낸 화가. 고뇌와 고통을 승화한 작품을 많이 봐온 터라, 현대 파트에서 온기를 보여주는 마티스가 특별하게 느껴졌다. 앙리 마티스 성당은 꼭 한 번 직접 가보고 싶다."
  },
  { id:"chagall", num:"14", title:"샤갈", en:"Marc Chagall", period:"20세기",
    grad:"linear-gradient(135deg,#9bf6ff 0%,#c8b6ff 40%,#ffb3c6 100%)",
    keys:["색채의 마술사","무중력 인물","비텝스크","사랑·고향·종교","보색 대비"],
    imgs:[
      { t:"나와 마을 (Moi et le Village)", a:"마르크 샤갈", y:"1911", src:"/images/나와마을.jpg" },
      { t:"탄생일", a:"마르크 샤갈", y:"1915", src:"/images/탄생일.png" },
      { t:"이삭의 희생", a:"마르크 샤갈", y:"1966", src:"/images/이삭의희생.jpg" },
    ],
    memo:"러시아 비텝스크(유대인 마을) 출생 → 파리 → 미국(2차 세계대전 피난) → 프랑스 복귀 / 98세 장수.\n\n★ 샤갈의 시그니처: 소(牛) 자주 등장 / 무중력 인물 (기쁠 때 하늘을 떠다님) / 보색+무채색 결합. 어떤 사조에도 완전히 속하지 않은 독자적 세계.\n\n### 나와 마을 (1911)\n\n- X자 구도\n- 초록 사람 = 샤갈 자화상\n- 생명의 나무 = 번성 상징\n- 파리 에펠탑이 그림 곳곳에 숨겨져 있음\n\n### 탄생일 (1915)\n\n- 연인 벨라와 기쁨에 넘쳐 하늘을 떠오르는 장면\n- '기쁠 때 하늘을 떠다니는' 표현의 원형\n\n### 이삭의 희생 (1966)\n\n- 성경 이야기 (아브라함-이삭)에 딸 이다와의 이별을 오버랩\n- 벨라 사망 후 딸 이다의 중재로 재혼\n\n### 샤갈과 사랑\n\n- 첫 번째 아내 벨라: 예술의 뮤즈, 무중력 인물의 원천\n- 벨라 사망 후 딸 이다의 중재로 바바와 재결합",
    feel:"샤갈의 그림에선 행복이 눈에 잘 보인다. 러시아에서 파리로, 미국으로, 다시 프랑스로 이어지는 삶 속에서도 사랑과 고향, 색을 잃지 않은 화가. 처음엔 왜 '색채의 마술사'인지 몰랐는데, 배경을 알아갈수록 그가 쓰는 색들이 달리 보이기 시작했다. 어떤 사조에도 완전히 속하지 않고 자기만의 세계를 지켰다는 것, 그 자체가 샤갈의 가장 큰 특징인 것 같다."
  },
  { id:"expressionism", num:"15", title:"표현주의와 추상", en:"Expressionism & Abstraction", period:"20세기 초",
    grad:"linear-gradient(135deg,#ffb3c6 0%,#c8b6ff 100%)",
    keys:["뭉크·칸딘스키","내면 감정","절규","왜곡","음악적 회화"],
    imgs:[
      { t:"절규", a:"에드바르 뭉크", y:"1893", src:"/images/절규.jpg" },
      { t:"사춘기", a:"에드바르 뭉크", y:"1894–1895", src:"/images/사춘기.jpg" },
      { t:"구성 8 (Composition VIII)", a:"바실리 칸딘스키", y:"1923", src:"/images/구성8.jpg" },
    ],
    memo:"내면의 주관적 감정을 색채·형태의 왜곡으로 표현 — 외부 현실보다 내면 감정이 우선.\n\n### 에드바르 뭉크\n\n- 노르웨이 출신, 엄마·누나를 일찍 잃음\n- 일상에서 이명(耳鳴)을 겪음 → 내면 공포를 표현\n- 고흐를 동경\n\n### 절규 (1893)\n\n- 표현주의의 상징\n- 뒤에 친구들이 있지만 혼자 외롭다는 내면 감각\n- 소용돌이치는 하늘: 심리 상태의 시각화\n\n### 사춘기 (1894–1895)\n\n- 그림자 = 죽음의 암시로 해석\n- 마돈나: 성모임에도 관능적으로 표현 → 삶과 죽음의 이중성\n\n### 바실리 칸딘스키\n\n★ 칸딘스키의 질문: 소리를 볼 수 있다면? 색이 들린다면? → 시각과 청각의 공감각 탐구.\n\n- 독일 바우하우스에서 강의\n- 음악적 요소(음율·리듬)를 회화에 도입\n- 점·선·면으로 음악을 시각화 → '뜨거운 추상'의 선구자\n- 대표작: 구성 8 (Composition VIII, 1923)",
    feel:"표현주의 화가들에게선 어딘가 어두운 에너지가 느껴진다. 내면의 부정적인 감정을 그림으로 승화시켰다는 공통점이 있었고, 그 에너지를 간접적으로나마 느낄 수 있다는 게 미학의 매력 중 하나인 것 같다. 칸딘스키가 음악을 그림으로 옮기려 했다는 것도 인상적이었다. 점, 선, 면이 소리가 된다는 발상이."
  },
  { id:"dadaism", num:"16", title:"다다이즘", en:"Dadaism", period:"20세기 초",
    grad:"linear-gradient(135deg,#9bf6ff 0%,#caffbf 50%,#fdffb6 100%)",
    keys:["레디메이드","뒤샹의 샘","반예술","기성품이 예술","LHOOQ"],
    imgs:[
      { t:"샘 (Fountain)", a:"마르셀 뒤샹", y:"1917", src:"/images/샘.png" },
    ],
    memo:"1차 세계대전 이후 이성·전통·예술 모두에 회의 → 비합리·비이성·비예술·사회비판.\n\n★ 다다이즘(Dadaism): 기존 전통 파괴 또는 새로운 창조. '다다(Dada)'는 아무 의미 없는 단어를 이름으로 채택한 것 자체가 선언이다.\n\n### 마르셀 뒤샹 — 레디메이드(Ready-made)\n\n- 기성품에 사인만 하면 예술이 된다\n- 샘(Fountain, 1917): 소변기에 'R.Mutt'라는 가명으로 사인\n- LHOOQ: 모나리자 엽서에 콧수염을 덧그림\n- '무엇을 만드느냐'가 아닌 '무엇을 선택하느냐'가 예술\n\n### 다다이즘의 특성\n\n- 예술을 예술이 아닌 것으로 만드는 행위 자체가 예술\n- 반부르주아·반전쟁 메시지 내포\n- 언어 해체, 퍼포먼스, 콜라주 등 전위적 실험\n\n### 다다이즘의 영향\n\n- 이후 초현실주의로 이어짐\n- 뒤샹의 레디메이드 개념은 현대 개념미술의 출발점",
    feel:"여기서부터 미술과 스토리텔링이 더 가까워지는 느낌이었다. 다다이즘은 기존의 모든 전통을 뒤집고 싶다는 욕구에서 출발했다. 뒤샹이 소변기에 사인 하나를 해서 예술 작품으로 제시했다는 게 처음엔 황당하게 느껴졌지만, 그 질문 자체가 핵심이었다는 걸 알게 됐다. '무엇을 만드느냐'가 아닌 '무엇을 선택하느냐'가 예술이 될 수 있다는 것 — 그 발상이 이후 현대미술의 방향을 완전히 바꿔놓았다."
  },
  { id:"surrealism", num:"17", title:"초현실주의", en:"Surrealism", period:"20세기 초·중",
    grad:"linear-gradient(135deg,#c8b6ff 0%,#9bf6ff 50%,#caffbf 100%)",
    keys:["데페이즈망","마그리트","달리·오토마티즘","무의식","꿈과 현실의 경계"],
    imgs:[
      { t:"골콩트 (Golconde)", a:"르네 마그리트", y:"1953", src:"/images/골콩트.jpg" },
      { t:"기억의 지속", a:"살바도르 달리", y:"1931", src:"/images/기억의지속.webp" },
    ],
    memo:"꿈과 무의식을 시각화 — 프로이트의 정신분석에 영향을 받아, 이성이 아닌 무의식이 예술의 재료가 됐다.\n\n### 르네 마그리트 — 데페이즈망(Dépaysement)\n\n- 있어서는 안 될 곳에 물건을 배치 → 낯섦과 철학적 질문 유발\n- 골콩트(Golconde, 1953): 중절모 남자들이 비처럼 내리는 장면\n- 이미지의 배신: 파이프 그림 아래 'Ceci n'est pas une pipe'(이것은 파이프가 아니다)\n- 중절모 = 마그리트의 시그니처 / 구글 기념일 이미지에도 활용\n\n### 살바도르 달리\n\n★ 오토마티즘(Automatism): 이성을 개입시키지 않고 무의식이 이끄는 대로 그리는 기법.\n\n- 기억의 지속(1931): 흘러내리는 시계=시간의 유동성 / 시계 위 개미=부패와 소멸\n- 추파춥스 로고 디자인 / 종이의 집 가면 디자인에 영향\n\n### 초현실주의 기법들\n\n- 프로타주(Frottage): 질감 위에 종이를 대고 문질러 형태 발견\n- 데칼코마니(Decalcomania): 물감을 접어 대칭 형태 생성\n- 콜라주(Collage): 이질적 이미지 조합\n- 데페이즈망(Dépaysement): 이질적 요소의 낯선 배치",
    feel:"기존의 모든 전통을 뒤집는 사조들이 연달아 등장하는 게 흥미로웠고, 그 그림들을 실제로 마주하면 어떤 기분일지가 계속 궁금해졌다. 드림코어 같은 오묘함인지, 아니면 섬뜩함인지. 마그리트의 데페이즈망이나 달리의 흘러내리는 시계처럼, 있어야 할 것이 없고 있어서는 안 될 것이 있는 장면들이 계속 머릿속에 남는다. 언젠가 구겐하임이나 MoMA에서 직접 확인해보고 싶다는 생각이 들었다."
  },
  { id:"abstraction", num:"18", title:"절대주의와 추상표현주의", en:"Suprematism & Abstract Expressionism", period:"20세기",
    grad:"linear-gradient(135deg,#c8c8e8 0%,#b0c8ff 50%,#c8b6ff 100%)",
    keys:["말레비치·절대주의","폴록·액션페인팅","마크 로스코","루초 폰타나","에셔 테셀레이션"],
    imgs:[
      { t:"낮과 밤 (Day and Night)", a:"M.C. 에셔", y:"1938", src:"/images/낮과밤.webp" },
      { t:"그리는 손 (Drawing Hands)", a:"M.C. 에셔", y:"1948", src:"/images/그리는손.jpg" },
      { t:"Number 5", a:"잭슨 폴록", y:"1948", src:"/images/넘버5.jpg" },
    ],
    memo:"예술의 극단 — 아무것도 없는 것이 예술이 되고, 행위 자체가 예술이 됐다.\n\n### 말레비치 — 절대주의(Suprematism)\n\n- 흰 캔버스 위에 흰 정사각형: 순수한 감각만을 남긴 극단적 추상\n- 검은 정사각형: 아이폰·미니멀 디자인에 영향\n- '모든 구상적 이미지를 제거하면 순수한 감각이 남는다'\n\n### 잭슨 폴록 — 액션 페인팅(Action Painting)\n\n- 드리핑(Dripping): 캔버스를 바닥에 놓고 물감을 뿌리고 흘림\n- 그리는 행위 자체가 예술\n- Number 5 (1948): 2006년 경매에서 1,313억원에 낙찰\n\n### 마크 로스코 — 색면 회화(Color Field)\n\n- 대형 캔버스에 두세 가지 색만으로 감정을 전달\n- 그림 앞에 서면 색 자체에 압도되는 경험\n\n### 루초 폰타나 — 공간주의(Spatialism)\n\n- 흰 캔버스를 칼로 그어 절개 → '공간주의'\n- 2차원 캔버스에 3차원 공간을 도입\n\n### 에셔 — 테셀레이션(Tessellation)\n\n- 도형이 빈틈 없이 평면을 채우는 수학적 패턴\n- 낮과 밤: 새가 물고기로 변해가는 구도\n- 그리는 손: 서로를 그리는 두 손 — 무한 자기지시의 패러독스",
    feel:"현대미술이 어디까지 갈 수 있는지를 가장 극단적으로 보여준 파트였다. 흰 캔버스 위에 흰 정사각형을 그린 말레비치, 물감을 뿌리고 흘린 폴록, 캔버스를 칼로 그은 폰타나까지. 처음엔 이걸 예술이라고 부를 수 있는지 의문이 들었지만, 그 의문 자체가 그들이 원하는 반응이었을 것이다. 에셔의 테셀레이션은 반대로 너무 정교하고 수학적이어서 놀라웠다. 극단과 극단이 같은 시대에 공존했다는 게 인상적이었다."
  },
  { id:"popart", num:"19", title:"팝아트", en:"Pop Art", period:"20세기 후반",
    grad:"linear-gradient(135deg,#ffd6a5 0%,#ffb3c6 50%,#c8b6ff 100%)",
    keys:["앤디 워홀","리히텐슈타인","대중문화","실크스크린","팩토리"],
    imgs:[
      { t:"캠벨 수프 캔", a:"앤디 워홀", y:"1962", src:"/images/캡팰수프캔.webp" },
      { t:"마릴린 먼로", a:"앤디 워홀", y:"1964", src:"/images/마릴린먼로.webp" },
      { t:"행복한 눈물", a:"로이 리히텐슈타인", y:"1964", src:"/images/행복한눈물.webp" },
    ],
    memo:"대중문화(Popular Culture)를 예술 소재로 — 광고·만화·상업 이미지가 회화가 됐다.\n\n★ 팝아트(Pop Art): 예술의 문턱을 낮추고, 누구나 아는 이미지를 캔버스로 끌어들임. 바로 직전까지 '금기'였던 상업 이미지를 전면에 내세워 예술의 경계를 다시 물었다.\n\n### 앤디 워홀\n\n- 작업실 이름: '팩토리(Factory)' — 예술의 공장화\n- 실크스크린으로 판화 대량 생산 → 예술의 복제와 소비\n- 캠벨 수프 캔: 마트의 일상 소비재를 예술로 전환\n- 마릴린 먼로 연작: 스타 이미지의 반복과 소비를 비판\n\n### 로이 리히텐슈타인\n\n- 만화 컷을 거대한 캔버스에 그대로 옮김\n- 망점(벤 데이 도트)으로 인쇄물의 질감 재현\n\n### 팝아트의 의미\n\n- 고급 예술과 대중문화의 경계를 의도적으로 지움\n- 소비사회와 미디어를 비판하면서 동시에 찬양\n- 미술이 일상에 스며들다",
    feel:"미술이 상업과 대중 쪽으로 가까워지는 흐름이 느껴졌다. 형태, 색, 그리는 방식까지 모두 해방시킨 끝에 등장한 팝아트는, 붓을 잡는 행위마저 새롭게 재정의하고 있었다. 앤디 워홀의 캠벨 수프 캔이 예술이 된다면, 예술의 경계는 결국 어디에 있는 걸까. 그 질문이 팝아트의 가장 큰 매력이었다. 다양한 기법과 그로 탄생한 그림들에서 이전과는 다른 종류의 창의성이 느껴졌다."
  },
  { id:"paik", num:"20", title:"백남준", en:"Nam June Paik", period:"20세기 후반",
    grad:"linear-gradient(135deg,#caffbf 0%,#9bf6ff 50%,#c8b6ff 100%)",
    keys:["비디오 아트","Fluxus","다다익선","굿모닝 미스터 오웰","브라운관"],
    imgs:[
      { t:"다다익선 (多多益善)", a:"백남준", y:"1988", src:"/images/다다익선.webp" },
      { t:"굿모닝 미스터 오웰", a:"백남준", y:"1984", src:"/images/굿모닝미스터오웰.jpg" },
    ],
    memo:"'콜라주가 전통 유화를 대체하듯, 캔버스를 브라운관이 대체할 것.' — 비디오 아트의 선언\n\n### 백남준의 생애\n\n- 서울 종로 출생 → 독일 쾰른 이주\n- Fluxus 운동 참여, 존 케이지와 교류\n- 삼성 이건희 회장의 후원\n- 마지막 유작: 《엄마》\n\n### Fluxus 운동 (1960–70년대, 독일 중심)\n\n★ '모든 것은 예술이고, 누구나 할 수 있다'\n\n- 존 케이지의 《4분 33초》: 피아노 앞에 앉아 아무것도 치지 않는 침묵 퍼포먼스\n- 이 작품이 백남준에게 결정적 영향\n\n### 주요 작품\n\n- 다다익선(多多益善, 1988): 국립현대미술관 소장 / 개천절(10월 3일)을 의미하는 1,003개 브라운관 / 나선형 구조\n- 굿모닝 미스터 오웰(1984): 파리·뉴욕·서울을 인공위성으로 생중계 연결 → 백남준을 세계적으로 알린 작품\n\n### 비디오 아트의 의미\n\n- 미디어 자체를 예술 재료로\n- TV·브라운관이 캔버스가 되는 시대를 먼저 예언하고 실현",
    feel:"백남준을 통해 우리나라에서도 세계적인 거장이 나올 수 있다는 걸 보게 됐다. 브라운관이 캔버스를 대체할 것이라는 선언을 실제로 해낸 사람. 미디어를 예술 재료로 끌어들인 그 발상이 지금의 디지털 아트까지 이어지는 흐름이라는 게 실감됐다. 취향가옥2 전시에서 직접 마주하면서 그 규모에 압도됐는데, 당시에는 수업을 듣기 전이라 그 의미를 다 알지 못했다는 게 여전히 아쉽다. 현대 미술은 결국 '해방'이라는 말이 가장 잘 어울린다."
  },
];

const MOVIES = [
  { id:"troy", title:"트로이", en:"Troy", year:"2004",
    bg:"linear-gradient(160deg,#1a1a2e 0%,#16213e 60%,#0f3460 100%)",
    accent:"linear-gradient(90deg,#9bf6ff,#c8b6ff)",
    conn:["그리스 예술","트로이 전쟁","라오콘"],
    poster:"/images/트로이표지.png",
    plot:"파리스 왕자가 스파르타 왕비 헬레나를 트로이로 데려오면서 발발하는 그리스와 트로이의 전쟁. 아킬레우스와 헥토르의 대결을 중심으로, 10년에 걸친 전쟁의 비극을 담아낸 작품.",
    desc:"파리스의 심판과 이어지는 이번 영화는 어렴풋이만 알고 있던 트로이 목마를 더욱 구체화해주었다. 수업에서 이름으로만 알던 인물들이 실제로 움직이는 걸 처음 봤고, 라오콘의 고통이나 파리스의 심판이 단순한 신화가 아니라 조각과 그림으로 이어지는 흐름의 시작이었다는 걸 느낄 수 있었다.",
    feel:"신화는 언제 봐도 흥미롭다."
  },
  { id:"agony", title:"더 아고니 앤 디 엑스터시", en:"The Agony and the Ecstasy", year:"1965",
    bg:"linear-gradient(160deg,#1a1510 0%,#2a1f0a 60%,#3d2b0a 100%)",
    accent:"linear-gradient(90deg,#ffd6a5,#ffb3c6)",
    conn:["르네상스","미켈란젤로","시스티나 성당"],
    poster:"/images/아고니앤더액스터시표지.png",
    plot:"교황 율리우스 2세의 의뢰로 시스티나 성당 천장화를 그리게 된 미켈란젤로의 이야기. 예술가의 신념과 교황의 요구 사이에서 갈등하며 4년에 걸쳐 천장화를 완성해나가는 창작의 고통과 황홀을 담았다.",
    desc:"바티칸 박물관에서 처음 시스티나 천장화를 마주했을 때의 충격이 아직도 생생하다. 이 영화는 그 천장화가 어떻게 탄생했는지를 담아내고 있다. 그때의 감정을 다시 생생하게 느낄 수 있어 좋았지만, 동시에 이 영화를 보고 갔더라면 얼마나 다른 여행이었을까 하는 아쉬움도 컸다.",
    feel:"최후의 심판을 제대로 보지 못하고 온 것이 더욱 아쉽게 남는다."
  },
  { id:"camille", title:"카미유 클로델", en:"Camille Claudel", year:"1988",
    bg:"linear-gradient(160deg,#0d1a10 0%,#0a1f15 60%,#0a2d1a 100%)",
    accent:"linear-gradient(90deg,#caffbf,#9bf6ff)",
    conn:["로댕","조각","예술가의 삶"],
    poster:"/images/카미유클로델표지.png",
    plot:"천재 조각가 카미유 클로델이 로댕의 제자이자 연인으로서 독자적인 예술 세계를 개척해나가다, 시대의 편견과 관계의 벽에 부딪혀 무너져가는 과정을 담은 작품. 이자벨 아자니 주연.",
    desc:"예술가의 삶을 대리 체험하는 기분이었다. 로댕이 아닌 카미유 클로델이라는, 잘 몰랐던 예술가가 주인공이라는 것도 더욱 인상 깊었다. 재능이 있어도 시대와 관계에 의해 어긋나버리는 삶.",
    feel:"영화가 끝날 무렵엔 이 분의 이야기가 너무 안타까워서 한참 생각이 머물렀다."
  },
];

function Cursor({ x, y, big }) {
  return (
    <div style={{
      position:"fixed", left:x, top:y, zIndex:9999,
      width:big?34:15, height:big?34:15, borderRadius:"50%",
      background: big ? "transparent" : "conic-gradient(from 0deg,#ffb3c6,#c8b6ff,#9bf6ff,#caffbf,#ffd6a5,#ffb3c6)",
      border: big ? "1.5px solid rgba(200,182,255,.7)" : "none",
      transform:"translate(-50%,-50%)",
      transition:"width .22s ease,height .22s ease",
      pointerEvents:"none", opacity:.88,
    }} />
  );
}

function Header() {
  const nav = [
    ["HOME","#hero"],["들어가며","#intro"],["시대별","#eras"],
    ["영화","#movies"],["전시","#exhibition"],["발표","#ppt"],["마치며","#outro"]
  ];
  return (
    <nav className="nav-bar" style={{
      position:"fixed", top:0, left:0, right:0, zIndex:100,
      display:"flex", alignItems:"center", justifyContent:"space-between",
      height:54,
      background:"rgba(8,8,15,.82)", backdropFilter:"blur(14px)",
      borderBottom:"1px solid rgba(255,255,255,.06)",
    }}>
      <a href="#hero" data-h="1" style={{display:"flex",alignItems:"center",textDecoration:"none"}}>
        <img src="/images/logo-dark.png" alt="감성미학" style={{height:38,width:"auto",objectFit:"contain",display:"block"}} />
      </a>
      <div className="nav-links">
        {nav.map(([l,h])=>(
          <a key={h} href={h} className="nav-a" data-h="1">{l}</a>
        ))}
      </div>
    </nav>
  );
}

function Hero() {
  const orbs = [
    {w:520,h:520,c:"rgba(255,179,198,.32)",t:"8%",l:"4%",anim:"float1 13s ease-in-out infinite",blur:22},
    {w:420,h:420,c:"rgba(200,182,255,.28)",b:"8%",r:"4%",anim:"float2 16s ease-in-out infinite",blur:22},
    {w:320,h:320,c:"rgba(155,246,255,.22)",t:"38%",r:"22%",anim:"float3 11s ease-in-out infinite",blur:16},
    {w:240,h:240,c:"rgba(202,255,191,.18)",b:"18%",l:"18%",anim:"float1 19s ease-in-out infinite reverse",blur:14},
    {w:180,h:180,c:"rgba(253,255,182,.2)",t:"22%",l:"35%",anim:"float2 8s ease-in-out infinite reverse",blur:12},
  ];
  return (
    <section id="hero" style={{minHeight:"100vh",position:"relative",overflow:"hidden",background:"#08080f",display:"flex",alignItems:"center",justifyContent:"center",padding:"100px 24px"}}>
      {orbs.map((o,i)=>(
        <div key={i} style={{
          position:"absolute", width:o.w, height:o.h, borderRadius:"50%",
          background:`radial-gradient(circle,${o.c} 0%,transparent 70%)`,
          top:o.t, bottom:o.b, left:o.l, right:o.r,
          animation:o.anim, filter:`blur(${o.blur}px)`,
        }}/>
      ))}
      <div style={{textAlign:"center",position:"relative",zIndex:1,padding:"0 24px"}}>
        <p style={{fontFamily:"'Pretendard',sans-serif",fontSize:10,fontWeight:300,letterSpacing:".3em",color:"rgba(255,255,255,.35)",marginBottom:36,animation:"fadeSlideUp .8s ease .2s both"}}>
          2026 · 감성미학 개인과제
        </p>
        <h1 style={{fontFamily:"'HsBombaram30',sans-serif",fontSize:"clamp(40px,8.5vw,100px)",fontWeight:300,lineHeight:1.3,color:"white",wordBreak:"keep-all",animation:"fadeSlideUp .8s ease .4s both"}}>
          미학이라는 이름의
        </h1>
        <h1 className="holo-text" style={{fontFamily:"'HsBombaram30',sans-serif",fontSize:"clamp(40px,8.5vw,100px)",fontWeight:300,lineHeight:1.3,marginBottom:44,wordBreak:"keep-all",animation:"fadeSlideUp .8s ease .5s both"}}>
          필기 전시장
        </h1>
        <p style={{fontFamily:"'Pretendard',sans-serif",fontSize:14,fontWeight:300,lineHeight:2.0,color:"rgba(255,255,255,.45)",maxWidth:380,margin:"0 auto 60px",animation:"fadeSlideUp .8s ease .7s both"}}>
          한 학기 동안의 수업을<br/>기억의 흐름을 따라 다시 걷습니다
        </p>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10,animation:"fadeSlideUp .8s ease .9s both"}}>
          <p style={{fontFamily:"'Pretendard',sans-serif",fontSize:10,letterSpacing:".22em",fontWeight:300,color:"rgba(255,255,255,.25)"}}>scroll</p>
          <div style={{width:1,height:44,background:"linear-gradient(to bottom,rgba(255,255,255,.3),transparent)",animation:"scrollPulse 2.2s ease infinite"}}/>
        </div>
      </div>
    </section>
  );
}

function Intro() {
  return (
    <section id="intro" className="section-pad" style={{background:"#f7f6f2",minHeight:"100vh",display:"flex",alignItems:"center"}}>
      <div className="duo-grid" style={{maxWidth:960,margin:"0 auto",width:"100%",alignItems:"start"}}>
        <div>
          <p style={{fontFamily:"'Pretendard',sans-serif",fontSize:10,letterSpacing:".22em",fontWeight:300,color:"#b0b0b0",marginBottom:16}}>INTRODUCTION</p>
          <h2 className="reveal" style={{fontFamily:"'HsBombaram30',sans-serif",fontSize:40,fontWeight:300,color:"#1a1820",lineHeight:1.25}}>들어가며</h2>
        </div>
        <div>
          <p style={{fontFamily:"'Pretendard',sans-serif",fontSize:17,fontWeight:300,lineHeight:2.15,color:"#2e2e2e",marginBottom:28}}>
            미감, 하면 어떤 생각이 드시나요. 디자인? 색? 심리? 여러 언어들이 떠오를 수 있겠지만, 결국 어떤 측면이든 나의 감성과 코드에 맞아야 비로소 와닿는다고 생각합니다.
          </p>
          <p style={{fontFamily:"'Pretendard',sans-serif",fontSize:15,fontWeight:300,lineHeight:2.05,color:"#555",marginBottom:22}}>
            그런 의미에서 저는 스스로 미감이 많이 부족한 편이라고 여겨왔습니다. 디자인이나 미술을 전문적으로 배워본 적이 없었고, 관련 전공을 지망하지도 않았으니까요. 그래서 복학 전 유럽 여행을 떠났을 때도, 수많은 예술 작품들 앞에서 제대로 된 감동을 받지 못한 채 돌아왔습니다. 알음알음 아는 지식과 GPT의 도움으로 유명한 작품 몇 개만 건드리고 온 여행이었죠.
          </p>
          <p style={{fontFamily:"'Pretendard',sans-serif",fontSize:15,fontWeight:300,lineHeight:2.05,color:"#555",marginBottom:28}}>
            그 아쉬움을 안고 맞이한 이번 학기, 전공 수업 목록에서 '감성미학'이라는 단어가 눈에 들어왔습니다. 이 과목을 들으면 미감이라는 게 조금은 생기지 않을까 싶어 신청하게 됐고, 그렇게 시작된 한 학기였습니다. 그리고 생각보다 훨씬 많은 멋진 이야기가 미학이라는 학문에 담겨 있었습니다.
          </p>
          <div style={{borderLeft:"2px solid rgba(200,182,255,.55)",paddingLeft:22}}>
            <p style={{fontFamily:"'Pretendard',sans-serif",fontSize:12,fontWeight:300,lineHeight:1.95,color:"#999"}}>
              이 페이지는 그 한 학기를 필기의 흐름대로 가볍게 정리한 개인적인 기록입니다. 공식 자료가 아니며, 사실과 다르거나 누락된 내용이 있을 수 있습니다. 가볍게 둘러봐 주세요.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function EraCard({ era, onClick }) {
  return (
    <div className="era-card reveal" data-h="1" onClick={()=>onClick(era)}>
      <div style={{height:4,background:era.grad}}/>
      <div style={{padding:"26px 22px 22px"}}>
        <p style={{fontFamily:"'HsBombaram30',sans-serif",fontSize:12,letterSpacing:".1em",color:"#c8c8c8",marginBottom:10}}>{era.num}</p>
        <h3 style={{fontFamily:"'HsBombaram30',sans-serif",fontSize:21,fontWeight:400,color:"#5c5666",marginBottom:3,lineHeight:1.4,wordBreak:"keep-all"}}>{era.title}</h3>
        <p style={{fontFamily:"'HsBombaram30',sans-serif",fontSize:12,fontStyle:"italic",color:"#b0b0b0",marginBottom:3}}>{era.en}</p>
        <p style={{fontFamily:"'Pretendard',sans-serif",fontSize:10,color:"#d0d0d0",letterSpacing:".05em",marginBottom:18}}>{era.period}</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:18}}>
          {era.keys.slice(0,3).map(k=><span key={k} className="tag">{k}</span>)}
        </div>
        <div style={{borderTop:"1px solid rgba(0,0,0,.06)",paddingTop:14,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <p style={{fontFamily:"'Pretendard',sans-serif",fontSize:11,fontWeight:300,lineHeight:1.85,color:"#999",flex:1}}>
            {era.feel.slice(0,48)}…
          </p>
          <span style={{
            fontFamily:"'Pretendard',sans-serif",fontSize:10,fontWeight:300,
            color:"#b0aac8",background:"rgba(200,182,255,.1)",
            padding:"2px 8px",borderRadius:10,marginLeft:8,whiteSpace:"nowrap",flexShrink:0,
          }}>작품 {(era.imgs||[]).length}개</span>
        </div>
      </div>
    </div>
  );
}

function ErasSection({ onCardClick }) {
  const orbs = [
    {w:480,h:480,c:"rgba(200,182,255,.18)",t:"-6%",l:"-6%",anim:"float1 17s ease-in-out infinite",blur:30},
    {w:380,h:380,c:"rgba(255,179,198,.16)",b:"-8%",r:"-4%",anim:"float2 20s ease-in-out infinite",blur:26},
    {w:260,h:260,c:"rgba(155,246,255,.14)",t:"42%",r:"30%",anim:"float3 13s ease-in-out infinite",blur:20},
  ];
  return (
    <section id="eras" className="section-pad" style={{background:"#f0eff5",position:"relative",overflow:"hidden"}}>
      {orbs.map((o,i)=>(
        <div key={i} style={{
          position:"absolute", width:o.w, height:o.h, borderRadius:"50%",
          background:`radial-gradient(circle,${o.c} 0%,transparent 70%)`,
          top:o.t, bottom:o.b, left:o.l, right:o.r,
          animation:o.anim, filter:`blur(${o.blur}px)`, pointerEvents:"none",
        }}/>
      ))}
      <div style={{maxWidth:1200,margin:"0 auto",position:"relative",zIndex:1}}>
        <div style={{marginBottom:56}}>
          <p style={{fontFamily:"'Pretendard',sans-serif",fontSize:10,letterSpacing:".22em",fontWeight:300,color:"#b0b0b0",marginBottom:14}}>TIMELINE · 시대별 필기</p>
          <h2 className="reveal" style={{fontFamily:"'HsBombaram30',sans-serif",fontSize:46,fontWeight:300,color:"#1a1820",lineHeight:1.2}}>원시에서<br/>현대까지</h2>
        </div>
        <div className="eras-grid">
          {ERAS.map(e=><EraCard key={e.id} era={e} onClick={onCardClick}/>)}
        </div>
        <p style={{marginTop:22,fontFamily:"'Pretendard',sans-serif",fontSize:11,color:"#c0c0c0",fontWeight:300}}>
          카드를 클릭하면 상세 내용이 열립니다 · 총 20개 시대 및 사조
        </p>
      </div>
    </section>
  );
}

function MovieCard({ movie, onClick }) {
  return (
    <div className="movie-card reveal" data-h="1" onClick={()=>onClick(movie)} style={{background:movie.bg}}>
      <div style={{padding:"36px 28px 30px"}}>
        <p style={{fontFamily:"'HsBombaram30',sans-serif",fontSize:12,fontStyle:"italic",letterSpacing:".06em",color:"rgba(255,255,255,.35)",marginBottom:16}}>{movie.year}</p>
        <h3 style={{fontFamily:"'HsBombaram30',sans-serif",fontSize:21,fontWeight:400,color:"white",lineHeight:1.5,marginBottom:6}}>{movie.title}</h3>
        <p style={{fontFamily:"'HsBombaram30',sans-serif",fontSize:12,fontStyle:"italic",color:"rgba(255,255,255,.35)",marginBottom:24}}>{movie.en}</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:24}}>
          {movie.conn.map(c=><span key={c} className="dark-tag">{c}</span>)}
        </div>
        <p style={{fontFamily:"'Pretendard',sans-serif",fontSize:11,fontWeight:300,lineHeight:1.9,color:"rgba(255,255,255,.45)"}}>
          {movie.feel.slice(0,55)}…
        </p>
        <div style={{marginTop:28,height:2,background:movie.accent,borderRadius:1,opacity:.55}}/>
      </div>
    </div>
  );
}

function MoviesSection({ onCardClick }) {
  const orbs = [
    {w:460,h:460,c:"rgba(155,246,255,.16)",t:"-8%",r:"-6%",anim:"float2 18s ease-in-out infinite",blur:30},
    {w:340,h:340,c:"rgba(200,182,255,.18)",b:"-6%",l:"-4%",anim:"float1 15s ease-in-out infinite reverse",blur:24},
    {w:220,h:220,c:"rgba(255,179,198,.14)",t:"45%",l:"32%",anim:"float3 12s ease-in-out infinite",blur:18},
  ];
  return (
    <section id="movies" className="section-pad" style={{background:"#0d0c14",position:"relative",overflow:"hidden"}}>
      {orbs.map((o,i)=>(
        <div key={i} style={{
          position:"absolute", width:o.w, height:o.h, borderRadius:"50%",
          background:`radial-gradient(circle,${o.c} 0%,transparent 70%)`,
          top:o.t, bottom:o.b, left:o.l, right:o.r,
          animation:o.anim, filter:`blur(${o.blur}px)`, pointerEvents:"none",
        }}/>
      ))}
      <div style={{maxWidth:1200,margin:"0 auto",position:"relative",zIndex:1}}>
        <div style={{marginBottom:56}}>
          <p style={{fontFamily:"'Pretendard',sans-serif",fontSize:10,letterSpacing:".22em",fontWeight:300,color:"rgba(255,255,255,.28)",marginBottom:14}}>FILMS · 수업에서 본 영화</p>
          <h2 className="reveal" style={{fontFamily:"'HsBombaram30',sans-serif",fontSize:46,fontWeight:300,color:"white",lineHeight:1.2}}>예술가를<br/>스크린에서 만나다</h2>
        </div>
        <div className="movies-grid">
          {MOVIES.map(m=><MovieCard key={m.id} movie={m} onClick={onCardClick}/>)}
        </div>
      </div>
    </section>
  );
}

const CIRCLED = ['①','②','③','④','⑤','⑥','⑦'];

function MemoBlock({ text }) {
  const blocks = text.split('\n\n');
  return (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      {blocks.map((block, bi) => {
        if (!block.trim()) return null;
        const lines = block.split('\n').filter(l => l.trim());
        if (!lines.length) return null;

        // ### 섹션 헤더
        if (lines[0].startsWith('### ')) {
          return (
            <div key={bi} style={{display:"flex",alignItems:"center",gap:9,marginTop:bi>0?8:0}}>
              <div style={{width:3,height:16,background:"linear-gradient(180deg,#c8b6ff,#9bf6ff)",borderRadius:2,flexShrink:0}}/>
              <span style={{fontFamily:"'Pretendard',sans-serif",fontSize:11.5,fontWeight:600,letterSpacing:".07em",color:"#7860b8"}}>
                {lines[0].slice(4)}
              </span>
            </div>
          );
        }

        // ★ 핵심 개념
        if (lines[0].startsWith('★ ')) {
          return (
            <div key={bi} style={{background:"rgba(200,182,255,.08)",borderRadius:4,padding:"11px 15px",borderLeft:"2.5px solid rgba(200,182,255,.55)"}}>
              <span style={{fontFamily:"'Pretendard',sans-serif",fontSize:10,fontWeight:600,color:"#9b80e0",letterSpacing:".06em",display:"block",marginBottom:6}}>★ 핵심 개념</span>
              {lines.map((l, li) => (
                <p key={li} style={{fontFamily:"'Pretendard',sans-serif",fontSize:13,fontWeight:300,lineHeight:1.9,color:"#333",margin:li>0?"5px 0 0":0}}>
                  {li === 0 ? l.slice(2) : l}
                </p>
              ))}
            </div>
          );
        }

        // 불릿 리스트 (모든 줄이 "- "로 시작)
        if (lines.every(l => l.startsWith('- '))) {
          return (
            <div key={bi} style={{display:"flex",flexDirection:"column",gap:5}}>
              {lines.map((l, li) => (
                <div key={li} style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                  <span style={{color:"#c8b6ff",fontFamily:"'HsBombaram30',sans-serif",fontSize:17,lineHeight:1.35,flexShrink:0,marginTop:0}}>·</span>
                  <p style={{fontFamily:"'Pretendard',sans-serif",fontSize:13,fontWeight:300,lineHeight:1.85,color:"#444",margin:0}}>{l.slice(2)}</p>
                </div>
              ))}
            </div>
          );
        }

        // 번호 목록 ①②③
        if (CIRCLED.some(n => block.includes(n))) {
          const firstIdx = Math.min(...CIRCLED.map(n => block.includes(n) ? block.indexOf(n) : Infinity));
          const intro = firstIdx > 0 ? block.slice(0, firstIdx).trim() : null;
          const rest = block.slice(firstIdx);
          const parts = rest.split(/([①②③④⑤⑥⑦])/);
          const items = [];
          let cur = null;
          parts.forEach(p => {
            if (CIRCLED.includes(p)) { if (cur) items.push(cur); cur = {num:p,text:""}; }
            else if (cur) cur.text += p;
          });
          if (cur) items.push(cur);
          return (
            <div key={bi}>
              {intro && <p style={{fontFamily:"'Pretendard',sans-serif",fontSize:13,fontWeight:300,lineHeight:1.9,color:"#444",marginBottom:10}}>{intro}</p>}
              <div style={{display:"flex",flexDirection:"column",gap:7}}>
                {items.map((it, ii) => (
                  <div key={ii} style={{display:"flex",gap:10,alignItems:"baseline"}}>
                    <span style={{fontFamily:"'Pretendard',sans-serif",fontSize:12,color:"#b0a0d0",flexShrink:0,fontWeight:500}}>{it.num}</span>
                    <p style={{fontFamily:"'Pretendard',sans-serif",fontSize:13,fontWeight:300,lineHeight:1.85,color:"#555",margin:0}}>{it.text.trim()}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        }

        // 레이블 — 본문 (짧은 레이블, 한 줄)
        const di = block.indexOf(' — ');
        if (di > 0 && di < 22 && lines.length === 1) {
          const label = block.slice(0, di);
          const body  = block.slice(di + 3);
          return (
            <div key={bi} style={{borderLeft:"2px solid rgba(200,182,255,.45)",paddingLeft:14}}>
              <span style={{fontFamily:"'Pretendard',sans-serif",fontSize:10,fontWeight:500,letterSpacing:".07em",color:"#a090c8",display:"block",marginBottom:5}}>
                {label}
              </span>
              <p style={{fontFamily:"'Pretendard',sans-serif",fontSize:13,fontWeight:300,lineHeight:1.95,color:"#444",margin:0}}>{body}</p>
            </div>
          );
        }

        // 일반 단락
        return (
          <p key={bi} style={{fontFamily:"'Pretendard',sans-serif",fontSize:13,fontWeight:300,lineHeight:2.0,color:"#444",margin:0}}>{block}</p>
        );
      })}
    </div>
  );
}

function Modal({ item, type, onClose }) {
  const isEra = type === "era";
  const [lightbox, setLightbox] = useState(null);
  useEffect(()=>{
    const fn = e => {
      if (e.key === "Escape") lightbox ? setLightbox(null) : onClose();
    };
    window.addEventListener("keydown",fn);
    return ()=>window.removeEventListener("keydown",fn);
  },[onClose, lightbox]);
  return (
    <>
    {lightbox && (
      <div onClick={()=>setLightbox(null)} style={{
        position:"fixed",inset:0,zIndex:2000,
        background:"rgba(0,0,0,.93)",backdropFilter:"blur(8px)",
        display:"flex",alignItems:"center",justifyContent:"center",
        padding:"60px 40px 80px",
      }}>
        <button onClick={()=>setLightbox(null)} data-h="1" style={{
          position:"absolute",top:20,right:24,
          background:"none",border:"none",fontSize:26,
          color:"rgba(255,255,255,.5)",lineHeight:1,
        }}>✕</button>
        <img src={lightbox.src} alt={lightbox.t} onClick={e=>e.stopPropagation()} style={{
          maxWidth:"100%",maxHeight:"100%",objectFit:"contain",borderRadius:2,
          boxShadow:"0 30px 80px rgba(0,0,0,.6)",
        }}/>
        <div style={{position:"absolute",bottom:24,left:0,right:0,textAlign:"center"}}>
          <p style={{fontFamily:"'Pretendard',sans-serif",fontSize:13,color:"rgba(255,255,255,.5)"}}>
            {lightbox.t}
          </p>
          <p style={{fontFamily:"'HsBombaram30',sans-serif",fontSize:12,fontStyle:"italic",color:"rgba(255,255,255,.3)",marginTop:4}}>
            {lightbox.a} · {lightbox.y}
          </p>
        </div>
      </div>
    )}
    <div onClick={onClose} style={{
      position:"fixed",inset:0,zIndex:1000,
      background:"rgba(0,0,0,.78)",backdropFilter:"blur(10px)",
      display:"flex",alignItems:"center",justifyContent:"center",padding:40,
    }}>
      <div onClick={e=>e.stopPropagation()} style={{
        background: isEra ? "#fff" : "#0e0d18",
        borderRadius:3, maxWidth:720, width:"100%",
        maxHeight:"80vh", overflowY:"auto", position:"relative",
      }}>
        <div style={{height:4, background: isEra ? item.grad : item.accent}}/>
        <div style={{padding:"34px 38px 38px"}}>
          <button onClick={onClose} className="close-btn" data-h="1"
            style={{color: isEra ? "#aaa" : "rgba(255,255,255,.4)"}}>✕</button>
          {isEra ? (
            <>
              <p style={{fontFamily:"'HsBombaram30',sans-serif",fontSize:13,color:"#c8c8c8",marginBottom:8,letterSpacing:".08em"}}>{item.num} · {item.en} · {item.period}</p>
              <h2 style={{fontFamily:"'HsBombaram30',sans-serif",fontSize:30,fontWeight:400,color:"#5c5666",marginBottom:22,wordBreak:"keep-all"}}>{item.title}</h2>
              <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:26}}>
                {item.keys.map(k=><span key={k} className="tag">{k}</span>)}
              </div>
              <div style={{marginBottom:24}}>
                <p style={{fontFamily:"'Pretendard',sans-serif",fontSize:10,letterSpacing:".18em",color:"#bbb",marginBottom:14}}>
                  기억에 남는 작품 ({(item.imgs||[]).length}개)
                </p>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:10}}>
                  {(item.imgs||[]).map((img,i)=>(
                    <div key={i} data-h="1" onClick={()=>img.src && setLightbox(img)}
                      style={{border:"1px solid rgba(0,0,0,.07)",borderRadius:2,overflow:"hidden",
                        transition:"transform .18s ease,box-shadow .18s ease",
                        ...(img.src ? {cursor:"pointer"} : {}),
                      }}
                      onMouseEnter={e=>{ if(img.src){ e.currentTarget.style.transform="scale(1.03)"; e.currentTarget.style.boxShadow="0 6px 20px rgba(0,0,0,.12)"; }}}
                      onMouseLeave={e=>{ e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=""; }}
                    >
                      {img.src ? (
                        <img src={img.src} alt={img.t} style={{width:"100%",height:86,objectFit:"cover",display:"block"}} />
                      ) : (
                        <div style={{
                          height:86, background:item.grad, opacity:.55,
                          display:"flex",alignItems:"center",justifyContent:"center",
                        }}>
                          <span style={{fontFamily:"'HsBombaram30',sans-serif",fontSize:22,color:"rgba(255,255,255,.6)"}}>⊹</span>
                        </div>
                      )}
                      <div style={{padding:"8px 10px 10px"}}>
                        <p style={{fontFamily:"'Pretendard',sans-serif",fontSize:12,fontWeight:400,color:"#1a1820",lineHeight:1.4,marginBottom:2}}>{img.t}</p>
                        <p style={{fontFamily:"'HsBombaram30',sans-serif",fontSize:11,fontStyle:"italic",color:"#aaa"}}>{img.a}</p>
                        <p style={{fontFamily:"'Pretendard',sans-serif",fontSize:10,color:"#ccc",marginTop:1}}>{img.y}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{borderTop:"1px solid rgba(0,0,0,.07)",paddingTop:22,marginBottom:20}}>
                <p style={{fontFamily:"'Pretendard',sans-serif",fontSize:10,letterSpacing:".18em",color:"#bbb",marginBottom:16}}>내 필기의 포인트</p>
                <MemoBlock text={item.memo} />
              </div>
              <div style={{background:"rgba(200,182,255,.07)",padding:"18px 22px",borderRadius:2,borderLeft:"2px solid rgba(200,182,255,.4)"}}>
                <p style={{fontFamily:"'Pretendard',sans-serif",fontSize:10,letterSpacing:".18em",color:"#bbb",marginBottom:10}}>느낀 점</p>
                <p style={{fontFamily:"'Pretendard',sans-serif",fontSize:14,fontWeight:300,lineHeight:2.05,color:"#666",fontStyle:"italic"}}>"{item.feel}"</p>
              </div>
            </>
          ) : (
            <>
              <div style={{display:"flex",gap:22,marginBottom:22,alignItems:"flex-start"}}>
                {item.poster && (
                  <img src={item.poster} alt={item.title} style={{
                    width:110,flexShrink:0,borderRadius:3,
                    boxShadow:"0 8px 24px rgba(0,0,0,.5)",objectFit:"cover",
                    aspectRatio:"2/3",
                  }}/>
                )}
                <div style={{flex:1,minWidth:0}}>
                  <p style={{fontFamily:"'HsBombaram30',sans-serif",fontSize:13,fontStyle:"italic",color:"rgba(255,255,255,.3)",marginBottom:8}}>{item.year} · {item.en}</p>
                  <h2 style={{fontFamily:"'HsBombaram30',sans-serif",fontSize:26,fontWeight:400,color:"white",marginBottom:16,lineHeight:1.5,wordBreak:"keep-all"}}>{item.title}</h2>
                  <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:16}}>
                    {item.conn.map(c=><span key={c} className="dark-tag">{c}</span>)}
                  </div>
                  {item.plot && (
                    <div>
                      <p style={{fontFamily:"'Pretendard',sans-serif",fontSize:10,letterSpacing:".18em",color:"rgba(255,255,255,.3)",marginBottom:8}}>줄거리</p>
                      <p style={{fontFamily:"'Pretendard',sans-serif",fontSize:13,fontWeight:300,lineHeight:1.95,color:"rgba(255,255,255,.5)"}}>{item.plot}</p>
                    </div>
                  )}
                </div>
              </div>
              <div style={{marginBottom:20}}>
                <p style={{fontFamily:"'Pretendard',sans-serif",fontSize:10,letterSpacing:".18em",color:"rgba(255,255,255,.3)",marginBottom:12}}>느낀 점</p>
                <p style={{fontFamily:"'Pretendard',sans-serif",fontSize:15,fontWeight:300,lineHeight:2.05,color:"rgba(255,255,255,.65)"}}>{item.desc}</p>
              </div>
              <div style={{background:"rgba(255,255,255,.04)",padding:"18px 22px",borderRadius:2,borderLeft:"2px solid rgba(200,182,255,.3)"}}>
                <p style={{fontFamily:"'Pretendard',sans-serif",fontSize:14,fontWeight:300,lineHeight:2.05,color:"rgba(255,255,255,.5)",fontStyle:"italic"}}>"{item.feel}"</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

export default function App() {
  const [pos, setPos] = useState({ x:-200, y:-200 });
  const [big, setBig] = useState(false);
  const [modal, setModal] = useState(null);

  useEffect(()=>{
    const styleEl = document.createElement("style");
    styleEl.textContent = STYLE;
    document.head.appendChild(styleEl);
    const onMove = e => setPos({ x:e.clientX, y:e.clientY });
    const onOver = e => setBig(!!e.target.closest("[data-h]"));
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);

    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold:0.15, rootMargin:"0px 0px -40px 0px" });
    const revealEls = document.querySelectorAll(".reveal");
    revealEls.forEach(el=>io.observe(el));

    return ()=>{
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      io.disconnect();
      if (document.head.contains(styleEl)) document.head.removeChild(styleEl);
    };
  },[]);

  return (
    <div style={{minHeight:"100vh",background:"#08080f"}}>
      <Cursor x={pos.x} y={pos.y} big={big} />
      <Header />
      <main>
        <Hero />
        <Intro />
        <ErasSection onCardClick={era=>setModal({item:era,type:"era"})} />
        <MoviesSection onCardClick={mv=>setModal({item:mv,type:"movie"})} />
        <section id="exhibition" className="section-pad" style={{background:"#f7f6f2"}}>
          <div className="duo-grid" style={{maxWidth:960,margin:"0 auto",alignItems:"center"}}>
            <div>
              <p style={{fontFamily:"'Pretendard',sans-serif",fontSize:10,letterSpacing:".22em",fontWeight:300,color:"#b0b0b0",marginBottom:16}}>EXHIBITION · 전시</p>
              <h2 className="reveal" style={{fontFamily:"'HsBombaram30',sans-serif",fontSize:36,fontWeight:300,color:"#1a1820",lineHeight:1.3}}>디뮤지엄<br/>〈취향가옥2〉</h2>
              <img src="/images/취향가옥2포스터.jpg" alt="취향가옥2 포스터" style={{width:"100%",marginTop:24,borderRadius:2,boxShadow:"0 8px 28px rgba(0,0,0,.13)",display:"block"}}/>
            </div>
            <div>
              <p style={{fontFamily:"'HsBombaram30',sans-serif",fontSize:18,fontWeight:300,lineHeight:1.8,color:"#7860b8",marginBottom:26,fontStyle:"italic"}}>
                "아름다움은 사물들 자체 안에 존재하는 성질이 아니다. 그것은 오직 사물들을 관찰하는 정신 안에만 존재하며, 각각의 정신은 서로 다른 아름다움을 지각한다."
              </p>
              <p style={{fontFamily:"'Pretendard',sans-serif",fontSize:16,fontWeight:300,lineHeight:2.1,color:"#2e2e2e",marginBottom:22}}>
                수업의 일환으로 다 함께 방문한 전시였다. 예상보다 훨씬 신선한 경험이었는데, 미술 작품이 가구처럼 공간 안에서 기능할 수 있다는 것을 처음으로 체감한 전시였기 때문이다.
              </p>
              <p style={{fontFamily:"'Pretendard',sans-serif",fontSize:15,fontWeight:300,lineHeight:2.05,color:"#555",marginBottom:22}}>
                정교하게 설계된 조명 작품은 처음엔 그냥 조명인 줄 알았다가, 큐레이터 선생님의 설명과 함께 작품으로 보이게 됐다. 에폭시 재료로 만들어진 의자도, 집에 놓고 싶다는 생각이 들 만큼 감각적이었다. 백남준 선생님의 작품도 볼 수 있었는데, 당시에는 수업을 듣기 전이라 그 의미를 제대로 알지 못한 채 그냥 신기한 설치 작품으로만 느끼고 지나쳐버렸다. 나중에 수업에서 배우고 나서야, 그 작품 앞에서 좀 더 오래 서 있었어야 했다는 아쉬움이 남았다.
              </p>
              <div style={{borderLeft:"2px solid rgba(200,182,255,.55)",paddingLeft:22}}>
                <p style={{fontFamily:"'Pretendard',sans-serif",fontSize:14,fontWeight:300,lineHeight:2.0,color:"#888",fontStyle:"italic"}}>
                  확실히 미술관은 큐레이터와 함께 봐야 한다는 걸 처음으로 실감한 날이었다. 설명이 들어오는 순간 보이는 것들이 달라졌다.
                </p>
              </div>
              <div style={{marginTop:32}}>
                <Link to="/exhibition-gallery" data-h="1" style={{
                  display:"inline-flex",alignItems:"center",gap:10,
                  padding:"12px 24px",border:"1px solid rgba(0,0,0,.14)",borderRadius:2,
                  fontFamily:"'Pretendard',sans-serif",fontSize:11,fontWeight:300,
                  letterSpacing:".1em",color:"#555",textDecoration:"none",
                  background:"transparent",transition:"all .2s",
                }}
                  onMouseEnter={e=>{e.currentTarget.style.background="rgba(200,182,255,.1)";e.currentTarget.style.borderColor="rgba(200,182,255,.5)";e.currentTarget.style.color="#7860b8";}}
                  onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.borderColor="rgba(0,0,0,.14)";e.currentTarget.style.color="#555";}}
                >
                  전시회 사진 페이지 바로가기 →
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section id="ppt" className="section-pad" style={{background:"#f0eff5"}}>
          <div style={{maxWidth:960,margin:"0 auto"}}>
            <div style={{marginBottom:56}}>
              <p style={{fontFamily:"'Pretendard',sans-serif",fontSize:10,letterSpacing:".22em",fontWeight:300,color:"#b0b0b0",marginBottom:14}}>PRESENTATIONS · 팀 발표</p>
              <h2 className="reveal" style={{fontFamily:"'HsBombaram30',sans-serif",fontSize:46,fontWeight:300,color:"#1a1820",lineHeight:1.2}}>네 번의<br/>발표</h2>
            </div>
            <div className="ppt-grid">
              {[
                { num:"01", slug:"art-therapy", title:"학우들의 그림을 미술치료로 분석하기", cover:"/images/미술치료표지.png", body:"학우들의 그림을 분석하는 과정이었다. 얼굴의 형태, 선의 강도, 집·사람·나무의 배치에서 의미를 찾아냈다. 사람마다 그린 그림은 달랐지만 분석 결과에서 경향성이 나타난다는 게 신기했다. 아무 생각 없이 그린 것 같아도 그 안에 자신이 담긴다는 것. 미술이 가진 힘을 조금 다른 방식으로 알게 된 시간이었다." },
                { num:"02", slug:"louvre", title:"루브르 박물관의 모든 것", cover:"/images/루브르표지.png", body:"내가 직접 다녀왔고 큐레이션도 들어본 박물관이라 조사하는 내내 신이 났다. 어떤 역사를 거쳐 만들어졌고, 어떤 작품들로 지금 빛나고 있는지를 새롭게 이해하는 과정이었다. 다음에 다시 가게 된다면 이번 조사에서 알게 된 것들을 발판 삼아 훨씬 더 깊이 돌아볼 수 있을 것 같다." },
                { num:"03", slug:"modern-artists", title:"근현대 화가", cover:"/images/근현대미술작가표지.png", body:"이중섭, 김환기, 천경자, 김창열. 이 네 명의 화가가 모두 한국이 가장 힘들었던 시기를 함께했고, 그 아픔을 작품으로 승화시켰다는 공통점이 있었다. 근현대 한국의 다사다난함을 이들의 그림으로나마 간접 체험할 수 있다는 것, 그 자체가 이 발표의 의미였다. 다만 솔직히 준비가 부족했던 발표였어서, 지금 돌아보면 아쉬움이 많이 남는다." },
                { num:"04", slug:"minhwa-ukiyoe", title:"우키요에와 민화", cover:"/images/우키요에민화표지.png", body:"솔직히 가장 힘들었던 발표였다. 민화는 작자 미상에 바리에이션도 다양하고 현대까지 이어지는 살아있는 사조라 자료 찾기가 쉽지 않았다. 그럼에도 도상 안에 담긴 의미를 공부하면서, 선조들이 그림에 어떤 소망을 담았는지를 생각해볼 수 있었다. 교수님의 작품 또한 조사할 수 있어 감사한 기회였다고 생각한다." },
              ].map(p=>(
                <Link key={p.num} to={`/presentation/${p.slug}`} data-h="1" className="ppt-card reveal" style={{borderTop:"1px solid rgba(0,0,0,.08)",paddingTop:24,textDecoration:"none",display:"block"}}>
                  {p.cover && (
                    <img className="ppt-cover" src={p.cover} alt={p.title} style={{width:"100%",height:170,objectFit:"cover",objectPosition:"center top",borderRadius:2,marginBottom:18,display:"block",boxShadow:"0 4px 16px rgba(0,0,0,.1)"}}/>
                  )}
                  <p style={{fontFamily:"'HsBombaram30',sans-serif",fontSize:12,color:"#c8c8c8",marginBottom:8,letterSpacing:".08em"}}>{p.num}</p>
                  <h3 style={{fontFamily:"'Pretendard',sans-serif",fontSize:16,fontWeight:400,color:"#1a1820",marginBottom:14,lineHeight:1.5}}>{p.title}</h3>
                  <p style={{fontFamily:"'Pretendard',sans-serif",fontSize:13,fontWeight:300,lineHeight:2.0,color:"#666",marginBottom:14}}>{p.body}</p>
                  <p style={{fontFamily:"'Pretendard',sans-serif",fontSize:11,fontWeight:300,letterSpacing:".06em",color:"#b0aac8"}}>발표 자료 보기 →</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
        <section id="outro" className="section-pad" style={{background:"#08080f"}}>
          <div style={{maxWidth:780,margin:"0 auto"}}>
            <p style={{fontFamily:"'Pretendard',sans-serif",fontSize:10,letterSpacing:".22em",color:"rgba(255,255,255,.3)",marginBottom:28}}>OUTRO · 마치며</p>
            <h2 className="holo-text" style={{fontFamily:"'HsBombaram30',sans-serif",fontSize:"clamp(32px,5vw,64px)",fontWeight:300,lineHeight:1.35,marginBottom:52,textAlign:"center"}}>
              한 학기를 지나며<br/>미술 앞에서 멈추는 방식이<br/>조금 달라졌습니다
            </h2>
            <div style={{display:"flex",flexDirection:"column",gap:20}}>
              <p style={{fontFamily:"'Pretendard',sans-serif",fontSize:15,fontWeight:300,lineHeight:2.1,color:"rgba(255,255,255,.55)"}}>
                사실 이 과목을 처음 선택할 때까지만 해도 이렇게까지 많은 내용을 배우게 될 거라곤 상상하지 못했습니다. 학점을 거의 다 채운 4학년 1학기, 전공 학점이 조금 남아 반쯤 가볍게 시작하게 된 감성미학이었는데, 지금은 이 과목을 선택한 게 그 어떤 선택보다 잘한 일 중 하나라고 생각합니다.
              </p>
              <p style={{fontFamily:"'Pretendard',sans-serif",fontSize:15,fontWeight:300,lineHeight:2.1,color:"rgba(255,255,255,.55)"}}>
                '예쁘다'는 느낌 앞에서 이제는 자연스럽게 '왜 이렇게 그렸을까'라는 질문이 따라옵니다. 유럽에서 스쳐왔던 작품들이 지금 다시 떠오르면서, 알고 보면 더 깊이 느껴진다는 걸 뒤늦게 실감하고 있습니다. 이미 지나가버린 여행이 더 아쉽게 느껴지는 건, 그만큼 이 수업이 남긴 게 많다는 뜻인 것 같습니다.
              </p>
              <p style={{fontFamily:"'Pretendard',sans-serif",fontSize:15,fontWeight:300,lineHeight:2.1,color:"rgba(255,255,255,.55)"}}>
                함께 이번 학기를 보낸 학우 여러분, 정말 고생하셨습니다. 앞으로 감성미학을 수강하실 분들은 기대하셔도 좋을 것 같습니다. 한 학기 동안 잘 이끌어주신 원혜영 교수님께도 진심으로 감사드립니다.
              </p>
            </div>
            <div style={{marginTop:56,paddingTop:32,borderTop:"1px solid rgba(255,255,255,.07)",textAlign:"center"}}>
              <p style={{fontFamily:"'Pretendard',sans-serif",fontSize:11,fontWeight:300,color:"rgba(255,255,255,.2)",lineHeight:1.9}}>
                이 페이지는 공식 자료가 아닙니다.<br/>개인적인 사견과 기억에 의존한 내용이 포함되어 있으며, 감성미학 수업 전체나 미술사 전체를 대변하지 않습니다.
              </p>
            </div>
          </div>
        </section>
      </main>
      {modal && <Modal {...modal} onClose={()=>setModal(null)}/>}
    </div>
  );
}
