export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-red-400 mb-4">MovieSSG</h3>
            <p className="text-gray-400 mb-4">
              영화를 사랑하는 모든 이들을 위한 스트리밍 서비스
            </p>
            <p className="text-gray-400 text-sm">
              © 2024 MovieSSG. All rights reserved.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">고객서비스</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white">자주 묻는 질문</a></li>
              <li><a href="#" className="hover:text-white">이용 안내</a></li>
              <li><a href="#" className="hover:text-white">문의하기</a></li>
              <li><a href="#" className="hover:text-white">고객센터</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">회사정보</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white">회사소개</a></li>
              <li><a href="#" className="hover:text-white">이용약관</a></li>
              <li><a href="#" className="hover:text-white">개인정보처리방침</a></li>
              <li><a href="#" className="hover:text-white">제휴문의</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">연결하기</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white">인스타그램</a></li>
              <li><a href="#" className="hover:text-white">페이스북</a></li>
              <li><a href="#" className="hover:text-white">트위터</a></li>
              <li><a href="#" className="hover:text-white">유튜브</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}