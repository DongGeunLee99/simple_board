import React, { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { getPaging, getPostList } from '../api/post';

// 페이지 번호 컴포넌트를 호이스팅
const PageButton = ({ pageNumber, isActive, onClick }) => {
    return (
        <button
            onClick={onClick}
            type="button"
            className={`px-3 py-1 border rounded ${
                isActive
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-black hover:bg-gray-100'
            }`}
        >
            {pageNumber}
        </button>
    );
};

const Main = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [postAllData, setpostAllData] = useState([]);
    const [pageNum, setPageNum] = useState(() => {
        const viewParam = searchParams.get('view');
        return viewParam ? parseInt(viewParam, 10) : 6;
    }); // 몇 개씩 보기
    const [pageMax, setPageMax] = useState(); // 페이지 어디까지
    const [pagingNum, setPagingNum] = useState([]); // 게시글 수
    const [pagingGroupSize] = useState(5); // 한 번에 보여줄 페이지 번호 개수
    
    const [search, setSearch] = useState(); // 검색 데이터
    const [searchType, setSearchType] = useState("search"); // 기본: 제목


    // 회원 유지
    const [userRetention, setUserRetention] = useState(false);
    const [userToken, setUserToken] = useState(localStorage.getItem("key"));

    useEffect(()=>{
        
        if (userToken !== null){
            setUserRetention(true);
        }
        else{
            setUserRetention(false);
        }
    }, [userToken])
    
    const userLogOut= () => {
        localStorage.removeItem('key');
        setUserToken(null)
    }

    // URL에서 페이지 정보 읽기
    const getPageFromURL = () => {
        const pageParam = searchParams.get('page');
        
        if (searchParams.get('view') !== null){
            setPageNum(searchParams.get('view'))
        }
        const page = pageParam ? parseInt(pageParam, 10) : 1;
        return isNaN(page) || page < 1 ? 1 : page;
    };

    const [pagingState, setPagingState] = useState(() => getPageFromURL()); // 현재 페이지
    const [pagingStartPage, setPagingStartPage] = useState(1) // 페이징 그룹의 시작 페이지

    // 마지막 페이지 계산
    const getPagingEndPage = () => {
        if (!pageMax) return pagingStartPage + pagingGroupSize - 1;
        return Math.min(pagingStartPage + pagingGroupSize - 1, pageMax);
    };

    const pagingEndPage = getPagingEndPage();

    const updateURL = (page) => {
        setSearchParams({ page: page.toString(), view: pageNum.toString() }, { replace: true });
    };

    // 다음 페이징
    const pageListUp = () => {
        if (pagingEndPage < pageMax) {
            const nextStartPage = pagingEndPage + 1;
            setPagingStartPage(nextStartPage);
            setPagingState(nextStartPage);
            updateURL(nextStartPage);
        } else if (pagingState < pageMax) {
            const nextPage = Number(pagingState) + 1;
            setPagingState(nextPage);
            updateURL(nextPage);
        }
    }
    // 이전 페이징
    const pageListDown = () => {
        if (pagingStartPage > 1) {
            const prevStartPage = Math.max(1, pagingStartPage - pagingGroupSize);
            setPagingStartPage(prevStartPage);
            setPagingState(prevStartPage);
            updateURL(prevStartPage);
        } else if (pagingState > 1) {
            const prevPage = Number(pagingState) - 1;
            setPagingState(prevPage);
            updateURL(prevPage);
        }
    }

    const selectPage = (pageNumber) => {
        setPagingState(pageNumber);
        updateURL(pageNumber);
    }

    // 페이지 번호 버튼
    const pageCount = () => {
        if (!pageMax) return [];
        
        const arr = [];
        const start = pagingStartPage;
        const end = pagingEndPage;
        
        for (let index = start; index <= end; index++) {
            arr.push(
                <PageButton
                    key={index}
                    pageNumber={index}
                    isActive={pagingState === index}
                    onClick={() => selectPage(index)}
                />
            );
        }
        
        return arr;
    };

    // 페이지 정보
    useEffect(() => {
        const pageFromURL = getPageFromURL();
        const currentPage = searchParams.get('page') || '1';
        const currentView = searchParams.get('view') || '6';
        
        // URL에서 view 값을 읽어와서 pageNum 업데이트
        const viewFromURL = searchParams.get('view');
        if (viewFromURL !== null) {
            const viewNum = parseInt(viewFromURL, 10);
            if (!isNaN(viewNum) && viewNum !== pageNum) {
                setPageNum(viewNum);
            }
        }
        
        // URL에 page나 view가 없으면 둘 다 함께 설정
        if (!searchParams.get('page') || !searchParams.get('view')) {
            setSearchParams({ page: currentPage, view: currentView }, { replace: true });
            return;
        }
        
        if (pageFromURL !== pagingState) {
            setPagingState(pageFromURL);

            if (pageMax) {
                const newStartPage = Math.max(1, Math.floor((pageFromURL - 1) / pagingGroupSize) * pagingGroupSize + 1);
                setPagingStartPage(newStartPage);
            }
        }
    }, [searchParams, pageMax, pagingGroupSize]);

    useEffect(() => { // 인덱스 수
        getPaging()
        .then((res) => {
            setPagingNum(res[0])
        })
        .catch((err) => {
            console.error(err);
        });
    },[]);

    useEffect(() => { // 게시글 보여주는 수
        const pageWhere = pagingState === 1 ? 0 : (Number(pagingState) - 1) * pageNum;

        getPostList(pageWhere, pageNum)
        .then((res) => {
            setpostAllData(res)
        })
        .catch((err) => {
            console.error(err);
        });
    },[pageNum, pagingState]);

    useEffect(() => {
        if (pagingNum) {
            const maxPage = Math.ceil(pagingNum / pageNum);
            setPageMax(maxPage);
        }
    },[pagingNum, pageNum]);

    // pageMax가 변경될 때 현재 페이지가 최대 페이지를 초과하면 마지막 페이지로 이동
    useEffect(() => {
        if (pageMax && pagingState > pageMax) {
            setPagingState(pageMax);
            updateURL(pageMax);

            const newStartPage = Math.max(1, Math.floor((pageMax - 1) / pagingGroupSize) * pagingGroupSize + 1);
            setPagingStartPage(newStartPage);
        }
    }, [pageMax]);

    // 현재 페이지가 페이징을 벗어나면 페이징 업데이트
    useEffect(() => {
        if (pageMax && pagingState) {
            // 현재 페이지가 페이징 그룹 범위를 벗어난 경우
            if (pagingState < pagingStartPage) {
                // 이전
                const newStartPage = Math.max(1, Math.floor((pagingState - 1) / pagingGroupSize) * pagingGroupSize + 1);
                setPagingStartPage(newStartPage);
            } else if (pagingState > pagingEndPage) {
                // 다음
                const newStartPage = Math.floor((pagingState - 1) / pagingGroupSize) * pagingGroupSize + 1;
                setPagingStartPage(newStartPage);
            }
        }
    }, [pagingState, pageMax, pagingStartPage, pagingEndPage, pagingGroupSize]);


    const pageNumber = (event) => { // select태그 이벤트 감지
        const newPageNum = event.target.value;
        setPageNum(newPageNum);
        setSearchParams({ page: pagingState.toString(), view: newPageNum }, { replace: true });
    }


    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* <h1 className="text-2xl font-bold mb-6">게시판</h1> */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">
                    게시판
                </h1>

                {/* 인증 버튼 영역 */}
                <div className="flex gap-2">
                    {
                        userRetention
                        ?<>
                            <Link to="/mypage">
                                <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                                    마이페이지
                                </button>
                            </Link>
                            <button
                                onClick={userLogOut}
                                type="button"
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    로그아웃
                            </button>
                        </>
                        :<>
                            <Link to="/login">
                                <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                                로그인
                                </button>
                            </Link>
                            <Link to="/signup">
                                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                회원가입
                                </button>
                            </Link>
                        </>
                        
                        }
                    
                </div>
            </div>
            <div className="flex items-center justify-between mb-4">
                {/* 검색 영역 */}
                <div className="flex items-center gap-2">
                    {/* 검색 타입 선택 */}
                    <select
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}
                        className="border rounded px-2 py-2"
                    >
                        <option value="subject">제목</option>
                        <option value="writer">작성자</option>
                    </select>

                    {/* 검색어 입력 */}
                    <input
                        value={search || ""}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && search) {
                                // navigate(`/search/${searchType}/${search}`);
                                navigate(`/search/${search}`);
                            }
                        }}
                        type="text"
                        placeholder="검색어를 입력하세요"
                        className="border rounded px-3 py-2 w-64"
                    />

                    {/* 검색 버튼 */}
                    <Link to={`/search/${search}`}>
                    {/* <Link to={`/search/${searchType}/${search}`}> */}
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                        >
                            검색
                        </button>
                    </Link>
                </div>


                {/* 게시글 작성 버튼 */}
                {/* <Link to="/create"> */}
                    <button
                        onClick={() =>{
                            if (userRetention) {
                                navigate('/create')
                            }else{
                                alert("로그인 후 작성 가능합니다.")
                                navigate('/login')
                            } }
                        }
                        type="button"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                        게시글 작성
                    </button>
                {/* </Link> */}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {postAllData.map((data) => (
                    <div
                        onClick={() => {navigate(`/detail/${data[0]}`)}}
                        key={data[0]}
                        className="border rounded-xl overflow-hidden shadow-sm bg-white hover:shadow-md transition"
                    >
                        {/* 이미지 영역 */}
                        <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                            {data[0] ? (
                                <img
                                    src={data[3]}
                                    className="w-full h-full object-cover "
                                />
                            ) : (
                                <span className="text-gray-400 font-semibold">
                                    이미지 없음
                                </span>
                            )}
                        </div>

                        {/* 텍스트 영역 */}
                        <div className="p-4">
                            {/* 제목 */}
                            <h2 className="font-semibold text-base truncate mb-3">
                                {data[1]}
                            </h2>

                            {/* 하단 메타 정보 */}
                            <div className="flex items-center justify-between text-sm text-gray-500">
                                <span className="truncate">
                                    {data[4]}
                                </span>
                                <span className="whitespace-nowrap">
                                    {data[2].replace('T', ' ').substr(2,9)}
                                    {data[5] == 1?`(수정됨)`:""}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>



    
            <div className="relative mt-6 h-10">
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
                    <button
                        onClick ={pageListDown}
                        type="button"
                        className="px-3 py-1 border rounded hover:bg-gray-100"
                    >
                        이전
                    </button>
                    {pageCount()}
                    <button
                        onClick ={pageListUp}
                        type="button"
                        className="px-3 py-1 border rounded hover:bg-gray-100"
                    >
                        다음
                    </button>
                </div>
    
                <div className="absolute right-0">
                    <select 
                        value={pageNum} 
                        onChange={pageNumber}
                        className="border rounded px-3 py-2"
                    >
                        <option value="6">6</option>
                        <option value="9">9</option>
                    </select>
                </div>
            </div>
        </div>
    );
    
};


export default Main