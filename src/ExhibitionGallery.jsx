import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const SECTIONS = [
  { slug:"best", title:"가장 마음에 들었던 순간들", en:"Best Shots", count:13, feature:true },
  { slug:"phrase", title:"취향가옥, 문구", en:"Words from the House", count:6 },
  { slug:"collection1", title:"컬렉션 Ⅰ", en:"Collection I", count:18 },
  { slug:"house", title:"취향가옥", en:"The House of Taste", count:17 },
  { slug:"treasure", title:"보물창고가 된 집", en:"A House Turned Treasury", count:19 },
  { slug:"beauty", title:"서로 다른 아름다움", en:"Different Kinds of Beauty", count:29 },
  { slug:"collection2", title:"컬렉션 Ⅱ", en:"Collection II", count:10 },
  { slug:"paik", title:"백남준", en:"Nam June Paik", count:5 },
  { slug:"caption", title:"작품 제목 및 설명", en:"Captions & Labels", count:11 },
  { slug:"me", title:"촬영하는 나", en:"Behind the Lens", count:2 },
  { slug:"blossom", title:"나오는 길에 찍은 벚꽃", en:"Cherry Blossoms on the Way Out", count:4 },
];

const TOTAL = SECTIONS.reduce((s,c)=>s+c.count,0);

function imgs(slug, count) {
  return Array.from({ length: count }, (_, i) => `/images/exhibition/${slug}/${i+1}.jpg`);
}

const ALL_IMAGES = SECTIONS.flatMap(sec => imgs(sec.slug, sec.count));

const STYLE = `
.collage-grid{column-count:2;column-gap:13px;}
@media(min-width:640px){.collage-grid{column-count:3;}}
@media(min-width:1024px){.collage-grid{column-count:4;}}
.collage-grid--feature{column-count:1;}
@media(min-width:640px){.collage-grid--feature{column-count:2;}}
.collage-grid img{
  width:100%;display:block;margin-bottom:13px;border-radius:3px;cursor:pointer;
  box-shadow:0 6px 18px rgba(0,0,0,.4);
  transition:transform .35s ease, box-shadow .35s ease;
}
.collage-grid img:hover{transform:scale(1.015) translateY(-3px);box-shadow:0 16px 34px rgba(0,0,0,.55);}
.eg-nav{padding:0 44px;}
.eg-hero{padding:140px 44px 70px;}
.eg-section{padding:0 44px 80px;}
.eg-footer{padding:20px 44px 100px;}
@media(max-width:600px){
  .eg-nav{padding:0 18px;}
  .eg-hero{padding:120px 18px 56px;}
  .eg-section{padding:0 18px 56px;}
  .eg-footer{padding:16px 18px 80px;}
  .collage-grid{column-count:2;column-gap:8px;}
  .collage-grid img{margin-bottom:8px;}
}
`;

export default function ExhibitionGallery() {
  const [lightboxIdx, setLightboxIdx] = useState(null);

  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.textContent = STYLE;
    document.head.appendChild(styleEl);
    return () => document.head.removeChild(styleEl);
  }, []);

  useEffect(() => {
    if (lightboxIdx === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") setLightboxIdx(null);
      else if (e.key === "ArrowRight") setLightboxIdx(i => (i + 1) % ALL_IMAGES.length);
      else if (e.key === "ArrowLeft") setLightboxIdx(i => (i - 1 + ALL_IMAGES.length) % ALL_IMAGES.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIdx]);

  return (
    <div style={{minHeight:"100vh",background:"#08080f"}}>
      <nav className="eg-nav" style={{
        position:"fixed",top:0,left:0,right:0,zIndex:100,
        display:"flex",alignItems:"center",justifyContent:"space-between",
        height:54,
        background:"rgba(8,8,15,.82)",backdropFilter:"blur(14px)",
        borderBottom:"1px solid rgba(255,255,255,.06)",
      }}>
        <Link to="/" style={{
          fontFamily:"'Pretendard',sans-serif",fontSize:11,fontWeight:300,
          letterSpacing:".12em",color:"rgba(255,255,255,.45)",textDecoration:"none",
          display:"flex",alignItems:"center",gap:8,
        }}>
          <span style={{fontSize:14,opacity:.6}}>←</span> 메인으로 돌아가기
        </Link>
        <p style={{fontFamily:"'HsBombaram30',sans-serif",fontSize:13,fontStyle:"italic",color:"rgba(255,255,255,.2)"}}>
          Exhibition Gallery
        </p>
      </nav>

      <div className="eg-hero" style={{textAlign:"center"}}>
        <p style={{
          fontFamily:"'Pretendard',sans-serif",fontSize:10,letterSpacing:".28em",fontWeight:300,
          color:"rgba(255,255,255,.22)",marginBottom:24,
        }}>
          EXHIBITION GALLERY · 전시 사진
        </p>
        <h1 style={{
          fontFamily:"'HsBombaram30',sans-serif",
          fontSize:"clamp(36px,5vw,64px)",fontWeight:300,color:"rgba(255,255,255,.88)",
          lineHeight:1.3,marginBottom:22,
        }}>
          디뮤지엄〈취향가옥 2〉
        </h1>
        <p style={{
          fontFamily:"'Pretendard',sans-serif",fontSize:14,fontWeight:300,lineHeight:2.0,
          color:"rgba(255,255,255,.32)",maxWidth:480,margin:"0 auto",
        }}>
          "아름다움은 사물들 자체 안에 존재하는 성질이 아니다. 그것은 오직 사물들을 관찰하는 정신 안에만 존재하며,
          각각의 정신은 서로 다른 아름다움을 지각한다." 그날 눈에 담아온 {TOTAL}장의 장면들.
        </p>
      </div>

      {SECTIONS.map((sec, idx) => (
        <section key={sec.slug} className="eg-section">
          <div style={{maxWidth:1180,margin:"0 auto"}}>
            <div style={{display:"flex",alignItems:"baseline",gap:14,marginBottom:26}}>
              <span style={{fontFamily:"'HsBombaram30',sans-serif",fontSize:13,color:"rgba(200,182,255,.5)",letterSpacing:".1em"}}>
                {String(idx+1).padStart(2,"0")}
              </span>
              <h2 style={{fontFamily:"'HsBombaram30',sans-serif",fontSize:26,fontWeight:300,color:"rgba(255,255,255,.85)"}}>
                {sec.title}
              </h2>
              <span style={{fontFamily:"'Pretendard',sans-serif",fontSize:11,fontStyle:"italic",color:"rgba(255,255,255,.22)"}}>
                {sec.en}
              </span>
            </div>
            <div className={`collage-grid${sec.feature ? " collage-grid--feature" : ""}`}>
              {imgs(sec.slug, sec.count).map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt={`${sec.title} ${i+1}`}
                  loading="lazy"
                  onClick={() => setLightboxIdx(ALL_IMAGES.indexOf(src))}
                />
              ))}
            </div>
          </div>
        </section>
      ))}

      <div className="eg-footer" style={{textAlign:"center"}}>
        <Link to="/" data-h="1" style={{
          display:"inline-flex",alignItems:"center",gap:10,
          padding:"12px 24px",border:"1px solid rgba(255,255,255,.16)",borderRadius:2,
          fontFamily:"'Pretendard',sans-serif",fontSize:11,fontWeight:300,
          letterSpacing:".1em",color:"rgba(255,255,255,.5)",textDecoration:"none",
        }}>
          ← 메인으로 돌아가기
        </Link>
      </div>

      {lightboxIdx !== null && (
        <div
          onClick={() => setLightboxIdx(null)}
          style={{
            position:"fixed",inset:0,zIndex:200,background:"rgba(4,4,8,.92)",
            display:"flex",alignItems:"center",justifyContent:"center",
            padding:40,backdropFilter:"blur(6px)",
          }}
        >
          <img
            src={ALL_IMAGES[lightboxIdx]}
            alt=""
            style={{maxWidth:"100%",maxHeight:"100%",borderRadius:4,boxShadow:"0 24px 64px rgba(0,0,0,.6)"}}
          />
          <button
            onClick={(e) => { e.stopPropagation(); setLightboxIdx(i => (i - 1 + ALL_IMAGES.length) % ALL_IMAGES.length); }}
            style={{
              position:"fixed",left:20,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",
              color:"rgba(255,255,255,.6)",fontSize:36,cursor:"pointer",lineHeight:1,padding:10,
            }}
          >
            ‹
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setLightboxIdx(i => (i + 1) % ALL_IMAGES.length); }}
            style={{
              position:"fixed",right:20,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",
              color:"rgba(255,255,255,.6)",fontSize:36,cursor:"pointer",lineHeight:1,padding:10,
            }}
          >
            ›
          </button>
          <span style={{
            position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",
            fontFamily:"'Pretendard',sans-serif",fontSize:11,color:"rgba(255,255,255,.4)",
          }}>
            {lightboxIdx+1} / {ALL_IMAGES.length}
          </span>
          <a
            href={ALL_IMAGES[lightboxIdx]}
            download
            onClick={(e) => e.stopPropagation()}
            style={{
              position:"fixed",top:24,right:76,background:"rgba(255,255,255,.08)",
              border:"1px solid rgba(255,255,255,.2)",borderRadius:20,
              color:"rgba(255,255,255,.75)",fontSize:11,lineHeight:1,
              padding:"8px 16px",textDecoration:"none",
              fontFamily:"'Pretendard',sans-serif",fontWeight:300,
              display:"flex",alignItems:"center",gap:6,
            }}
          >
            ↓ 다운로드
          </a>
          <button
            onClick={() => setLightboxIdx(null)}
            style={{
              position:"fixed",top:24,right:32,background:"none",border:"none",
              color:"rgba(255,255,255,.6)",fontSize:28,cursor:"pointer",lineHeight:1,
            }}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
