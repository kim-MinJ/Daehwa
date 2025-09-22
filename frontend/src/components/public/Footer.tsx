export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-red-400 mb-4">MovieSSG</h3>
            <p className="text-gray-400">
              영화를 사랑하는 모든 이들을 위한
            </p>
            <p className="text-gray-400 mb-4">
              스트리밍 서비스
            </p>
            <br />
            <p className="text-gray-400 text-sm">
              © 2025 MovieSSG. All rights reserved.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">고객서비스</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a  className="hover:text-white">질문은 받지 않습니다</a></li>
              <li><a  className="hover:text-white">대신</a></li>
              <li><a  className="hover:text-white">Q&A 환영</a></li>
              <li><a  className="hover:text-white">서비스 이용도 환영</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">팀원정보</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="/login" className="hover:text-white">김민재</a></li>
              <li><a href="/" className="hover:text-white">박진우</a></li>
              <li><a href="/search" className="hover:text-white">곽수영</a></li>
              <li><a href="/reviews" className="hover:text-white">임은상</a></li>
              <li><a href="/ranking" className="hover:text-white">임정수</a></li>
              <li><a href="/movies/1" className="hover:text-white">오승현 </a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">연결하기</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="/login" className="hover:text-white">로그인</a></li>
              <li><a href="/" className="hover:text-white">메인</a></li>
              <li><a href="/search" className="hover:text-white">검색</a></li>
              <li><a href="/reviews" className="hover:text-white">리뷰</a></li>
              <li><a href="/ranking" className="hover:text-white">랭킹</a></li>
              <li><a href="/movies/1" className="hover:text-white">상세</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}