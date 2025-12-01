import React, { useState, useEffect } from 'react';
import { Book, Search, Plus, User, CheckCircle, ShoppingBag, Tag, X, LogOut, Trash2 } from 'lucide-react';
import { db } from './firebase';
import { collection, addDoc, updateDoc, deleteDoc, onSnapshot, query, orderBy, doc } from 'firebase/firestore';

// --- Mock Data & Constants ---

const BOOK_DB = [
    { id: 1, genre: '경제/경영', title: '금리는 답을 알고 있다', author: '김유성', originalPrice: 18500 },
    { id: 2, genre: '경제/경영', title: '장하준의 경제학강의', author: '장하준', originalPrice: 22000 },
    { id: 3, genre: '경제/경영', title: '제로 투 원', author: '피터 틸', originalPrice: 18000 },
    { id: 4, genre: '경제/경영', title: '변화하는 세계질서', author: '레이 달리오', originalPrice: 38000 },
    { id: 5, genre: '경제/경영', title: '반도체 오디세이', author: '이승우', originalPrice: 25000 },
    { id: 6, genre: '경제/경영', title: '돈, 뜨겁게 사랑하고 차갑게 다루어라', author: '앙드레 코스톨라니', originalPrice: 15000 },
    { id: 7, genre: '경제/경영', title: '벤 버냉키의 21세기 통화정책', author: '벤 S. 버냉키', originalPrice: 35000 },
    { id: 8, genre: '경제/경영', title: '도시의 승리', author: '에드워드 글레이저', originalPrice: 21000 },
    { id: 9, genre: '경제/경영', title: '펀드매니저가 쓴 채권투자노트', author: '김형호', originalPrice: 15000 },
    { id: 10, genre: '경제/경영', title: '1%를 읽는 힘', author: '메르', originalPrice: 22000 },
    { id: 11, genre: '경제/경영', title: '트럼프 2.0 시대', author: '박종훈', originalPrice: 20000 },
    { id: 12, genre: '경제/경영', title: '달러 전쟁', author: '살레하 모신', originalPrice: 21000 },
    { id: 13, genre: '경제/경영', title: '메트릭 스튜디오', author: '문병로', originalPrice: 17900 },
    { id: 14, genre: '경제/경영', title: '맨큐의 경제학', author: '그레고리 맨큐', originalPrice: 49000 },
    { id: 15, genre: '경제/경영', title: '가난한 찰리의 연감', author: '찰리 멍거', originalPrice: 33000 },
    { id: 16, genre: '경제/경영', title: '결핍은 우리를 어떻게 변화시키는가', author: '센딜 멀레이너선', originalPrice: 24800 },
    { id: 17, genre: '경제/경영', title: 'How to 게임이론 플레이어, 전략, 이익', author: '가와니시 사토시', originalPrice: 15000 },
    { id: 18, genre: '과학', title: '뇌는 작아지고 싶어한다', author: '브루스 후드', originalPrice: 19800 },
    { id: 19, genre: '과학', title: '경험은 어떻게 유전자에 새겨지는가', author: '데이비드 무어', originalPrice: 29000 },
    { id: 20, genre: '과학', title: '물리의 정석: 고전 역학 편', author: '레너드 서스킨드', originalPrice: 18500 },
    { id: 21, genre: '과학', title: '부분과 전체', author: '베르너 하이젠베르크', originalPrice: 23000 },
    { id: 22, genre: '과학', title: '트랜스포머', author: '닉 레인', originalPrice: 25000 },
    { id: 23, genre: '과학', title: '인공지능과 뇌는 어떻게 생각하는가', author: '이상완', originalPrice: 18000 },
    { id: 24, genre: '과학', title: '하나의 세포로부터', author: '벤 스탠', originalPrice: 25000 },
    { id: 25, genre: '과학', title: '사이버네틱스', author: '노버트 위너', originalPrice: 33000 },
    { id: 26, genre: '과학', title: '수학자가 아닌 사람들을 위한 수학', author: '모리스 클라인', originalPrice: 36000 },
    { id: 27, genre: '기술/공학', title: '알파폴드: AI 신약개발 혁신', author: '남궁석', originalPrice: 30000 },
    { id: 28, genre: '소설', title: '참을 수 없는 존재의 가벼움', author: '밀란 쿤데라', originalPrice: 17000 },
    { id: 29, genre: '소설', title: '면도날', author: '서머싯 몸', originalPrice: 15000 },
    { id: 30, genre: '소설', title: '데미안', author: '헤르만 헤세', originalPrice: 8000 },
    { id: 31, genre: '소설', title: '삶의 한가운데', author: '루이제 린저', originalPrice: 13000 },
    { id: 32, genre: '소설', title: '나는 나를 파괴할 권리가 있다', author: '김영하', originalPrice: 12000 },
    { id: 33, genre: '소설', title: '이방인', author: '알베르 카뮈', originalPrice: 10000 },
    { id: 34, genre: '소설', title: '롤리타', author: '블라디미르 나보코프', originalPrice: 17000 },
    { id: 35, genre: '소설', title: '정체성', author: '밀란 쿤데라', originalPrice: 13000 },
    { id: 36, genre: '소설', title: '인간 실격', author: '다자이 오사무', originalPrice: 9000 },
    { id: 37, genre: '소설', title: '코뿔소', author: '외젠 이오네스코', originalPrice: 12000 },
    { id: 38, genre: '소설', title: '성', author: '프란츠 카프카', originalPrice: 13000 },
    { id: 39, genre: '소설', title: '비둘기', author: '파트리크 쥐스킨트', originalPrice: 14800 },
    { id: 40, genre: '소설', title: '그리스인 조르바', author: '니코스 카잔차키스', originalPrice: 15000 },
    { id: 41, genre: '소설', title: '낭만적 연애와 그 후의 일상', author: '알랭 드 보통', originalPrice: 17000 },
    { id: 42, genre: '시/에세이', title: '달리기를 말할 때 내가 하고 싶은 이야기', author: '무라카미 하루키', originalPrice: 14500 },
    { id: 43, genre: '예술', title: '예술이란 무엇인가', author: '톨스토이', originalPrice: 16800 },
    { id: 44, genre: '예술', title: '어쨌거나 밤은 무척 짧을 것이다', author: '유운성', originalPrice: 17000 },
    { id: 45, genre: '예술', title: '게임 : 행위성의 예술', author: 'C. 티 응우옌', originalPrice: 19000 },
    { id: 46, genre: '인문', title: '군주론', author: '니콜로 마키아벨리', originalPrice: 17000 },
    { id: 47, genre: '인문', title: '생각이 너무 많은 어른들을 위한 심리학', author: '김혜남', originalPrice: 17800 },
    { id: 48, genre: '인문', title: '니코마코스 윤리학', author: '아리스토텔레스', originalPrice: 19900 },
    { id: 49, genre: '인문', title: '자유로부터의 도피', author: '에리히 프롬', originalPrice: 16000 },
    { id: 50, genre: '인문', title: '그림자', author: '이부영', originalPrice: 22000 },
    { id: 51, genre: '인문', title: '정의란 무엇인가', author: '마이클 샌델', originalPrice: 18000 },
    { id: 52, genre: '인문', title: '빈곤 과정', author: '조문영', originalPrice: 24000 },
    { id: 53, genre: '인문', title: '미학특강', author: '이주영', originalPrice: 18000 },
    { id: 54, genre: '인문', title: '강신주의 감정수업', author: '강신주', originalPrice: 22000 },
    { id: 55, genre: '인문', title: '더 좋은 삶을 위한 철학', author: '마이클 슈어', originalPrice: 18000 },
    { id: 56, genre: '인문', title: '세계 끝의 버섯', author: '애나 로웬하웁트 칭', originalPrice: 35000 },
    { id: 57, genre: '인문', title: '도덕 원리에 관한 탐구', author: '데이비드 흄', originalPrice: 20000 },
    { id: 58, genre: '인문', title: '자유론', author: '밀', originalPrice: 8800 },
    { id: 59, genre: '인문', title: '혐오의 과학', author: '매슈 윌리엄스', originalPrice: 22000 },
    { id: 60, genre: '인문', title: '생각을 잃어버린 사회', author: '버트런드 러셀', originalPrice: 19800 },
    { id: 61, genre: '인문', title: '에로스의 종말', author: '한병철', originalPrice: 12000 },
    { id: 62, genre: '인문', title: '분석심리학 이야기', author: '이부영', originalPrice: 12000 },
    { id: 63, genre: '인문', title: '권력의 심리학', author: '브라이언 클라스', originalPrice: 20000 },
    { id: 64, genre: '인문', title: '불안 세대', author: '조너선 하이트', originalPrice: 24800 },
    { id: 65, genre: '인문', title: '기억한다는 착각', author: '차란 란가나스', originalPrice: 22000 },
    { id: 66, genre: '인문', title: '나는 왜 네 말이 힘들까?', author: '박재연', originalPrice: 16800 },
    { id: 67, genre: '인문', title: '피로사회', author: '한병철', originalPrice: 12000 },
    { id: 68, genre: '인문', title: '사랑의 기술', author: '에리히 프롬', originalPrice: 17000 },
    { id: 69, genre: '자기계발', title: '페르미 추정 두뇌 활용법', author: '도쿄대학 케이스스터디 연구회', originalPrice: 12000 },
    { id: 70, genre: '정치/사회', title: '의료 비즈니스의 시대', author: '김현아', originalPrice: 17000 },
    { id: 71, genre: '정치/사회', title: '법조문과 사례로 이해하는 의료분쟁', author: '김나경', originalPrice: 16000 },
    { id: 72, genre: '정치/사회', title: '민주주의적 자본주의의 위기', author: '카를로 로벨리', originalPrice: 38000 },
    { id: 73, genre: '정치/사회', title: '민주주의적 자본주의의 위기', author: '마틴 울프', originalPrice: 38000 },
    { id: 74, genre: '정치/사회', title: '정신병의 신화', author: '토머스 사스', originalPrice: 25000 },
    { id: 75, genre: '컴퓨터/IT', title: 'UX/UI의 10가지 심리학 법칙', author: '존 야블론스키', originalPrice: 18000 },
    { id: 76, genre: '컴퓨터/IT', title: 'CODE', author: '찰스 펫졸드', originalPrice: 35000 },
    { id: 77, genre: '컴퓨터/IT', title: '모두를 위한 양자 컴퓨터', author: '윌리엄 헐리', originalPrice: 28000 },
    { id: 78, genre: '컴퓨터/IT', title: '오늘날 우리는 컴퓨터라 부른다', author: '마틴 데이비스', originalPrice: 20000 },
];

const STUDENT_IDS = ['19학번', '20학번', '21학번', '22학번', '23학번', '24학번', '25학번'];

// --- Utility Functions ---

const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(price);
};

// --- Components ---

const LoginScreen = ({ onLogin }) => {
    const [name, setName] = useState('');
    const [studentId, setStudentId] = useState(STUDENT_IDS[0]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            onLogin({ name, studentId });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Book className="w-8 h-8 text-blue-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">RatelBook</h1>
                    <p className="text-gray-500 mt-2">책 교환 플랫폼</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            placeholder="이름을 입력하세요"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">학번</label>
                        <div className="relative">
                            <select
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white"
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value)}
                            >
                                {STUDENT_IDS.map((id) => (
                                    <option key={id} value={id}>{id}</option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-200 shadow-md transform active:scale-[0.98]"
                    >
                        입장하기
                    </button>
                </form>
            </div>
        </div>
    );
};

const BookCard = ({ post, currentUser, onTrade, onDelete }) => {
    const isMyPost = post.author.name === currentUser.name;
    const isCompleted = post.status === 'completed';

    // Calculate display price (25% of original)
    const sellPrice = post.book.originalPrice * 0.25;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
            <div className="flex p-4 gap-4">
                <div className="flex-1 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start">
                            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full mb-1 inline-block">
                                {post.book.genre}
                            </span>
                            <span className="text-xs text-gray-400">{post.date}</span>
                        </div>
                        <h3 className="font-bold text-gray-800 line-clamp-1">{post.book.title}</h3>
                        <p className="text-sm text-gray-500">{post.book.author}</p>

                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-lg font-bold text-blue-600">{formatPrice(sellPrice)}</span>
                            <span className="text-xs text-gray-400 line-through">{formatPrice(post.book.originalPrice)}</span>
                        </div>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <User className="w-3 h-3" />
                            <span>{post.author.name} ({post.author.studentId})</span>
                        </div>
                        {post.type === 'sell' && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                {post.condition || '상태 양호'}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {!isCompleted && !isMyPost && (
                <div className="px-4 pb-4">
                    <button
                        onClick={() => onTrade(post)}
                        className={`w-full py-2.5 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2
              ${post.type === 'buy'
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-green-600 text-white hover:bg-green-700'}`}
                    >
                        {post.type === 'buy' ? (
                            <>
                                <Tag className="w-4 h-4" /> 이 책 팔게요
                            </>
                        ) : (
                            <>
                                <ShoppingBag className="w-4 h-4" /> 이 책 살게요
                            </>
                        )}
                    </button>
                </div>
            )}

            {!isCompleted && isMyPost && (
                <div className="px-4 pb-4">
                    <button
                        onClick={() => onDelete(post)}
                        className="w-full py-2.5 rounded-lg font-medium text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                        <Trash2 className="w-4 h-4" /> 삭제하기
                    </button>
                </div>
            )}

            {isCompleted && (
                <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-green-600 font-medium text-sm">
                        <CheckCircle className="w-4 h-4" />
                        거래 완료
                    </div>
                    <div className="text-xs text-gray-500">
                        {post.trader ? `with ${post.trader.name}` : ''}
                    </div>
                </div>
            )}
        </div>
    );
};

const PostModal = ({ isOpen, onClose, onSubmit }) => {
    const [type, setType] = useState('buy'); // 'buy' or 'sell'
    const [selectedBookId, setSelectedBookId] = useState('');
    const [condition, setCondition] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    if (!isOpen) return null;

    const filteredBooks = BOOK_DB.filter(book =>
        book.title.includes(searchTerm) || book.author.includes(searchTerm)
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedBookId) return;

        const book = BOOK_DB.find(b => b.id === parseInt(selectedBookId));
        const now = new Date();
        const formattedDate = `${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        onSubmit({
            type,
            book,
            condition: type === 'sell' ? condition : null,
            date: formattedDate,
        });

        // Reset
        setType('buy');
        setSelectedBookId('');
        setCondition('');
        setSearchTerm('');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="bg-white w-full max-w-md sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                    <h2 className="text-lg font-bold">새로운 거래 등록</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-6">
                    {/* Type Selection */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setType('buy')}
                            className={`p-3 rounded-xl border-2 font-bold text-sm transition-all
                ${type === 'buy' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-200 text-gray-500'}`}
                        >
                            구매 희망 (구해요)
                        </button>
                        <button
                            type="button"
                            onClick={() => setType('sell')}
                            className={`p-3 rounded-xl border-2 font-bold text-sm transition-all
                ${type === 'sell' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-200 text-gray-500'}`}
                        >
                            판매 희망 (팔아요)
                        </button>
                    </div>

                    {/* Book Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">책 선택</label>
                        <div className="relative mb-2">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="책 제목 또는 저자 검색..."
                                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto divide-y divide-gray-100">
                            {filteredBooks.map(book => (
                                <div
                                    key={book.id}
                                    onClick={() => setSelectedBookId(book.id)}
                                    className={`p-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors
                    ${selectedBookId === book.id ? 'bg-blue-50' : ''}`}
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium truncate">{book.title}</div>
                                        <div className="text-xs text-gray-500">{book.author}</div>
                                    </div>
                                    {selectedBookId === book.id && <CheckCircle className="w-4 h-4 text-blue-600" />}
                                </div>
                            ))}
                            {filteredBooks.length === 0 && (
                                <div className="p-4 text-center text-sm text-gray-500">검색 결과가 없습니다</div>
                            )}
                        </div>
                    </div>

                    {/* Condition Input (Sell only) */}
                    {type === 'sell' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                책 상태 코멘트 <span className="text-gray-400 font-normal">(선택사항)</span>
                            </label>
                            <textarea
                                placeholder="예: 밑줄 조금 있음, 표지 약간 찢어짐 등"
                                className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none h-24"
                                value={condition}
                                onChange={(e) => setCondition(e.target.value)}
                            />
                        </div>
                    )}

                    {/* Price Info */}
                    {selectedBookId && (
                        <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                            <span className="text-sm text-gray-600">거래 확정 가격 (정가의 25%)</span>
                            <span className="text-lg font-bold text-blue-600">
                                {formatPrice(BOOK_DB.find(b => b.id === parseInt(selectedBookId)).originalPrice * 0.25)}
                            </span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={!selectedBookId}
                        className="w-full bg-blue-600 disabled:bg-gray-300 text-white font-bold py-3.5 rounded-xl shadow-md active:scale-[0.98] transition-all"
                    >
                        등록하기
                    </button>
                </form>
            </div>
        </div>
    );
};

// --- Main App Component ---

function App() {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('buy'); // 'buy', 'sell', 'completed'
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Firestore State
    const [posts, setPosts] = useState([]);

    // Real-time subscription
    useEffect(() => {
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const postsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPosts(postsData);
        });
        return () => unsubscribe();
    }, []);

    // Load user from local storage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('ratelbook_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const handleLogin = (userData) => {
        setUser(userData);
        localStorage.setItem('ratelbook_user', JSON.stringify(userData));
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('ratelbook_user');
    };

    const handleCreatePost = async (postData) => {
        try {
            await addDoc(collection(db, "posts"), {
                ...postData,
                author: user,
                status: 'active',
                createdAt: new Date().toISOString()
            });
        } catch (error) {
            console.error("Error adding document: ", error);
            alert("글 등록 중 오류가 발생했습니다.");
        }
    };

    const handleTrade = async (post) => {
        if (!confirm(`${post.type === 'buy' ? '판매' : '구매'}하시겠습니까?\n\n※ 주의: 이 작업은 되돌릴 수 없습니다!`)) return;

        try {
            const postRef = doc(db, "posts", post.id);
            await updateDoc(postRef, {
                status: 'completed',
                trader: user
            });
            alert('거래가 성사되었습니다! [거래완료] 탭에서 확인하세요.');
        } catch (error) {
            console.error("Error updating document: ", error);
            alert("거래 처리 중 오류가 발생했습니다.");
        }
    };

    const handleDeletePost = async (post) => {
        if (!confirm('정말로 이 게시글을 삭제하시겠습니까?')) return;
        try {
            await deleteDoc(doc(db, "posts", post.id));
        } catch (error) {
            console.error("Error deleting document: ", error);
            alert("삭제 중 오류가 발생했습니다.");
        }
    };

    if (!user) {
        return <LoginScreen onLogin={handleLogin} />;
    }

    // Filter posts based on active tab
    const filteredPosts = posts.filter(post => {
        if (activeTab === 'completed') return post.status === 'completed';
        if (activeTab === 'buy') return post.status === 'active' && post.type === 'buy';
        if (activeTab === 'sell') return post.status === 'active' && post.type === 'sell';
        return false;
    });

    return (
        <div className="min-h-screen bg-gray-50 pb-20 sm:pb-0 relative">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10 px-4 py-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="bg-blue-600 p-1.5 rounded-lg">
                        <Book className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="font-bold text-lg text-gray-800">RatelBook</h1>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <div className="text-sm font-bold text-gray-800">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.studentId}</div>
                    </div>
                    <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-gray-600">
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* Tabs */}
            <div className="bg-white border-b border-gray-200 sticky top-[57px] z-10">
                <div className="flex max-w-3xl mx-auto">
                    <button
                        onClick={() => setActiveTab('buy')}
                        className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors
              ${activeTab === 'buy' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        구해요
                    </button>
                    <button
                        onClick={() => setActiveTab('sell')}
                        className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors
              ${activeTab === 'sell' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        팔아요
                    </button>
                    <button
                        onClick={() => setActiveTab('completed')}
                        className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors
              ${activeTab === 'completed' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        거래완료
                    </button>
                </div>
            </div>

            {/* Content */}
            <main className="max-w-3xl mx-auto p-4 space-y-4">
                {/* Google Sheet Link */}
                <a
                    href="https://docs.google.com/spreadsheets/d/1j5uoWPlVvrjccN4sk91rHF3qKzeNx1mRxdq122Bmbag/edit?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-green-50 border border-green-200 rounded-xl p-4 text-center hover:bg-green-100 transition-colors group"
                >
                    <div className="flex items-center justify-center gap-2 text-green-700 font-bold">
                        <Book className="w-5 h-5" />
                        <span>전체 책 목록 보기 (Google Sheets)</span>
                    </div>
                    <p className="text-xs text-green-600 mt-1">클릭하여 거래 가능한 책 리스트를 확인하세요</p>
                </a>

                {/* Notice */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center text-sm text-blue-800 space-y-2">
                    <p>📚 모든 책의 가격은 <strong>교보문고 정가의 25%</strong>로 일괄 책정되었습니다.</p>
                    <p>💡 거래가 성사되면 <strong>버튼을 누른 분</strong>이 상대방에게 먼저 연락해주세요! (동일한 책은 <strong>먼저 등록된 순서대로</strong> 거래해주세요)</p>
                </div>

                {filteredPosts.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <p>등록된 게시글이 없습니다.</p>
                    </div>
                ) : (
                    filteredPosts.map(post => (
                        <BookCard
                            key={post.id}
                            post={post}
                            currentUser={user}
                            onTrade={handleTrade}
                            onDelete={handleDeletePost}
                        />
                    ))
                )}
            </main>

            {/* Floating Action Button */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 z-20"
            >
                <Plus className="w-6 h-6" />
            </button>

            {/* Modal */}
            <PostModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreatePost}
            />
        </div>
    );
}

export default App;
