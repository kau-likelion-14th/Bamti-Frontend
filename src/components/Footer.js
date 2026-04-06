import "/Users/name/Desktop/Bamti-Frontend/src/styles/Footer.css";
import logo from "/Users/name/Desktop/Bamti-Frontend/src/assets/image/lte로고.png";

function Footer() {
  return (
    <footer className="footer">
        <div className="footer-top">
            {/* 로고 + 서비스 설명 */}
            <div className="footer-left">
            <img src={logo} alt="LTE 로고" className="footer-logo" />
            <div className="footer-title">Lion To-do Everyday</div>
        </div>
        <div className="footer-top">
            <div className="footer-desc">
            LTE는 멋쟁이사자처럼에서 개발한 투두 관리 기반의 웹 서비스 입니다.
            </div>
            </div>
        </div>

      {/* 하단 정보 */}
        <div className="footer-bottom">
            <div className="footer-row">
                <div className="footer-item">
                    <span className="label">상호명</span>
                    <span className="value">멋쟁이사자처럼</span>
                </div>
                <div className="footer-item">
                    <span className="label">대표자</span>
                    <span className="value">김승욱</span>
                </div>
                <div className="footer-item">
                    <span className="label">주소</span>
                    <span className="value">경기도 고양시 항공대학로76 항공우주센터 3층 창업카페</span>
                </div>
            </div>

            <div className="footer-row">
                <div className="footer-item">
                    <span className="label">사업자등록번호</span>
                    <span className="value">333-22-55555</span>
                </div>
                <div className="footer-item">
                    <span className="label">개인정보보호책임자</span>
                    <span className="value">김승욱</span>
                </div>
                <div className="footer-item">
                    <span className="label">이메일</span>
                    <span className="value">seunguk0925@naver.com</span>
                </div>
                <div className="footer-item">
                    <span className="label">전화번호</span>
                    <span className="value">010-9480-3992</span>
                </div>
            </div>
        </div>
    </footer>
  );
}

export default Footer;