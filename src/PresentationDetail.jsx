import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

const PRESENTATIONS = {
  "art-therapy": {
    num:"01", title:"학우들의 그림을 미술치료로 분석하기", en:"Reading Friends' Drawings Through Art Therapy",
    count:112,
    body:"학우들의 그림을 분석하는 과정이었다. 얼굴의 형태, 선의 강도, 집·사람·나무의 배치에서 의미를 찾아냈다. 사람마다 그린 그림은 달랐지만 분석 결과에서 경향성이 나타난다는 게 신기했다. 아무 생각 없이 그린 것 같아도 그 안에 자신이 담긴다는 것. 미술이 가진 힘을 조금 다른 방식으로 알게 된 시간이었다.",
  },
  "louvre": {
    num:"02", title:"루브르 박물관의 모든 것", en:"Everything About the Louvre",
    count:56,
    body:"내가 직접 다녀왔고 큐레이션도 들어본 박물관이라 조사하는 내내 신이 났다. 어떤 역사를 거쳐 만들어졌고, 어떤 작품들로 지금 빛나고 있는지를 새롭게 이해하는 과정이었다. 다음에 다시 가게 된다면 이번 조사에서 알게 된 것들을 발판 삼아 훨씬 더 깊이 돌아볼 수 있을 것 같다.",
  },
  "modern-artists": {
    num:"03", title:"근현대 화가", en:"Modern Korean Painters",
    count:58,
    body:"이중섭, 김환기, 천경자, 김창열. 이 네 명의 화가가 모두 한국이 가장 힘들었던 시기를 함께했고, 그 아픔을 작품으로 승화시켰다는 공통점이 있었다. 근현대 한국의 다사다난함을 이들의 그림으로나마 간접 체험할 수 있다는 것, 그 자체가 이 발표의 의미였다. 다만 솔직히 준비가 부족했던 발표였어서, 지금 돌아보면 아쉬움이 많이 남는다.",
  },
  "minhwa-ukiyoe": {
    num:"04", title:"우키요에와 민화", en:"Ukiyo-e & Korean Folk Painting",
    count:90,
    body:"솔직히 가장 힘들었던 발표였다. 민화는 작자 미상에 바리에이션도 다양하고 현대까지 이어지는 살아있는 사조라 자료 찾기가 쉽지 않았다. 그럼에도 도상 안에 담긴 의미를 공부하면서, 선조들이 그림에 어떤 소망을 담았는지를 생각해볼 수 있었다.",
  },
};

const ORDER = ["art-therapy", "louvre", "modern-artists", "minhwa-ukiyoe"];

function slides(slug, count) {
  return Array.from({ length: count }, (_, i) => `/images/presentations/${slug}/${i+1}.jpg`);
}

export default function PresentationDetail() {
  const { slug } = useParams();
  const data = PRESENTATIONS[slug];
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setLightbox(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!data) {
    return (
      <div style={{minHeight:"100vh",background:"#f0eff5",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
        <p style={{fontFamily:"'Pretendard',sans-serif",fontSize:14,color:"#999",marginBottom:20}}>존재하지 않는 발표입니다.</p>
        <Link to="/" style={{fontFamily:"'Pretendard',sans-serif",fontSize:12,color:"#7860b8"}}>← 메인으로 돌아가기</Link>
      </div>
    );
  }

  const idx = ORDER.indexOf(slug);
  const prevSlug = ORDER[(idx - 1 + ORDER.length) % ORDER.length];
  const nextSlug = ORDER[(idx + 1) % ORDER.length];

  return (
    <div style={{minHeight:"100vh",background:"#f0eff5",display:"flex",flexDirection:"column"}}>
      <nav style={{
        position:"fixed",top:0,left:0,right:0,zIndex:100,
        display:"flex",alignItems:"center",justifyContent:"space-between",
        padding:"0 44px",height:54,
        background:"rgba(240,239,245,.92)",backdropFilter:"blur(14px)",
        borderBottom:"1px solid rgba(0,0,0,.06)",
      }}>
        <Link to="/" style={{
          fontFamily:"'Pretendard',sans-serif",fontSize:11,fontWeight:300,
          letterSpacing:".12em",color:"rgba(0,0,0,.35)",textDecoration:"none",
          display:"flex",alignItems:"center",gap:8,
        }}>
          <span style={{fontSize:14,opacity:.5}}>←</span> 메인으로 돌아가기
        </Link>
        <p style={{fontFamily:"'HsBombaram30',sans-serif",fontSize:13,fontStyle:"italic",color:"rgba(0,0,0,.2)"}}>
          Presentations · {data.num}/04
        </p>
      </nav>

      <div style={{padding:"140px 44px 60px",textAlign:"center"}}>
        <p style={{
          fontFamily:"'Pretendard',sans-serif",fontSize:10,letterSpacing:".28em",fontWeight:300,
          color:"#b0b0b0",marginBottom:22,
        }}>
          PRESENTATION {data.num} · 발표 자료
        </p>
        <h1 style={{
          fontFamily:"'HsBombaram30',sans-serif",
          fontSize:"clamp(32px,4.6vw,56px)",fontWeight:300,color:"#1a1820",
          lineHeight:1.35,marginBottom:14,
        }}>
          {data.title}
        </h1>
        <p style={{fontFamily:"'Pretendard',sans-serif",fontSize:13,fontStyle:"italic",color:"#c0bcd0",marginBottom:30}}>
          {data.en}
        </p>
        <p style={{
          fontFamily:"'Pretendard',sans-serif",fontSize:15,fontWeight:300,lineHeight:2.0,
          color:"#666",maxWidth:560,margin:"0 auto",
        }}>
          {data.body}
        </p>
      </div>

      <div style={{padding:"0 44px 90px",flex:1}}>
        <div style={{
          maxWidth:880,margin:"0 auto",
          display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",gap:18,
        }}>
          {slides(slug, data.count).map((src, i) => (
            <div key={src} style={{position:"relative"}}>
              <img
                src={src}
                alt={`${data.title} 슬라이드 ${i+1}`}
                loading="lazy"
                onClick={() => setLightbox(src)}
                style={{
                  width:"100%",display:"block",borderRadius:3,cursor:"pointer",
                  boxShadow:"0 4px 16px rgba(0,0,0,.1)",
                  border:"1px solid rgba(0,0,0,.06)",
                  transition:"transform .25s ease, box-shadow .25s ease",
                }}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 10px 26px rgba(0,0,0,.16)";}}
                onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,.1)";}}
              />
              <span style={{
                position:"absolute",bottom:8,right:8,
                fontFamily:"'Pretendard',sans-serif",fontSize:10,fontWeight:300,
                color:"rgba(255,255,255,.85)",background:"rgba(0,0,0,.35)",
                padding:"2px 7px",borderRadius:10,
              }}>
                {i+1} / {data.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{padding:"0 44px 100px",display:"flex",justifyContent:"center",gap:14}}>
        <Link to={`/presentation/${prevSlug}`} style={{
          fontFamily:"'Pretendard',sans-serif",fontSize:11,fontWeight:300,letterSpacing:".08em",
          color:"#888",textDecoration:"none",padding:"12px 22px",border:"1px solid rgba(0,0,0,.12)",borderRadius:2,
        }}>
          ← 이전 발표
        </Link>
        <Link to="/" style={{
          fontFamily:"'Pretendard',sans-serif",fontSize:11,fontWeight:300,letterSpacing:".08em",
          color:"#888",textDecoration:"none",padding:"12px 22px",border:"1px solid rgba(0,0,0,.12)",borderRadius:2,
        }}>
          메인으로
        </Link>
        <Link to={`/presentation/${nextSlug}`} style={{
          fontFamily:"'Pretendard',sans-serif",fontSize:11,fontWeight:300,letterSpacing:".08em",
          color:"#888",textDecoration:"none",padding:"12px 22px",border:"1px solid rgba(0,0,0,.12)",borderRadius:2,
        }}>
          다음 발표 →
        </Link>
      </div>

      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position:"fixed",inset:0,zIndex:200,background:"rgba(10,10,14,.9)",
            display:"flex",alignItems:"center",justifyContent:"center",
            padding:40,backdropFilter:"blur(6px)",
          }}
        >
          <img
            src={lightbox}
            alt=""
            style={{maxWidth:"100%",maxHeight:"100%",borderRadius:4,boxShadow:"0 24px 64px rgba(0,0,0,.5)"}}
          />
          <button
            onClick={() => setLightbox(null)}
            style={{
              position:"fixed",top:24,right:32,background:"none",border:"none",
              color:"rgba(255,255,255,.7)",fontSize:28,cursor:"pointer",lineHeight:1,
            }}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
