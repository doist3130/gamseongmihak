import { Link } from "react-router-dom";

export default function PresentationDetail() {
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
          Presentations
        </p>
      </nav>

      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"100px 44px"}}>
        <p style={{
          fontFamily:"'Pretendard',sans-serif",fontSize:10,letterSpacing:".28em",fontWeight:300,
          color:"#b0b0b0",marginBottom:24,
        }}>
          PRESENTATIONS · 발표 자료
        </p>
        <h1 style={{
          fontFamily:"'HsBombaram30',sans-serif",
          fontSize:"clamp(36px,5vw,64px)",fontWeight:300,color:"#1a1820",
          textAlign:"center",lineHeight:1.3,marginBottom:20,
        }}>
          네 번의 발표,<br/>그 기록들
        </h1>
        <p style={{
          fontFamily:"'Pretendard',sans-serif",fontSize:14,fontWeight:300,lineHeight:2.0,
          color:"#aaa",textAlign:"center",maxWidth:400,marginBottom:60,
        }}>
          각 발표의 PPT 자료와 상세 내용을 이곳에 정리할 예정입니다.
        </p>

        <div style={{
          border:"1px dashed rgba(0,0,0,.1)",borderRadius:3,
          padding:"60px 80px",textAlign:"center",maxWidth:600,width:"100%",
        }}>
          <div style={{
            width:48,height:48,borderRadius:"50%",
            border:"1px dashed rgba(200,182,255,.5)",
            display:"flex",alignItems:"center",justifyContent:"center",
            margin:"0 auto 20px",
          }}>
            <span style={{fontSize:20,color:"rgba(200,182,255,.5)"}}>+</span>
          </div>
          <p style={{fontFamily:"'Pretendard',sans-serif",fontSize:11,fontWeight:300,color:"#ccc",letterSpacing:".06em"}}>
            발표 자료를 추가할 예정
          </p>
        </div>
      </div>
    </div>
  );
}
