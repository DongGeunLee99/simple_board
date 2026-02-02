import React from 'react'
import { Link, useParams, useNavigate, useSearchParams } from "react-router-dom";
import { getSearchPaging, getSearchList } from '../api/post';
import { useState, useEffect } from "react";

// 페이지 번호 컴포넌트
const PageButton = ({ pageNumber, isActive, onClick }) => {
    return (
        <button
            onClick={onClick}
            type="button"
            className={`px-3 py-1 border rounded ${isActive
                ? 'bg-blue-600 text-white'
                : 'bg-white text-black hover:bg-gray-100'
                }`}
        >
            {pageNumber}
        </button>
    );
};


export const Search = () => {
    const [postAllData, setpostAllData] = useState([])
    const [search, setSearch] = useState() // 검색 데이터
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams();

    const { text } = useParams()

    const [pageNum, setPageNum] = useState(() => {
        const viewParam = searchParams.get('view');
        return viewParam ? parseInt(viewParam, 10) : 6;
    }); // 몇 개씩 보기
    const [pageMax, setPageMax] = useState(); // 페이지 어디까지
    const [pagingNum, setPagingNum] = useState(); // 게시글 수
    const [pagingGroupSize] = useState(5); // 한 번에 보여줄 페이지 번호 개수

    // URL에서 페이지 정보 읽기
    const getPageFromURL = () => {
        const pageParam = searchParams.get('page');
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

    useEffect(() => {
        // URL에 page/view가 없으면 둘 다 함께 설정
        const currentPage = searchParams.get('page') || '1';
        const currentView = searchParams.get('view') || '6';
        if (!searchParams.get('page') || !searchParams.get('view')) {
            setSearchParams({ page: currentPage, view: currentView }, { replace: true });
        }

        // text가 바뀌면 1페이지부터
        setPagingState(1);
        setPagingStartPage(1);
        updateURL(1);
    }, [text]);

    // URL의 view 값 반영
    useEffect(() => {
        const viewFromURL = searchParams.get('view');
        if (viewFromURL !== null) {
            const viewNum = parseInt(viewFromURL, 10);
            if (!isNaN(viewNum) && viewNum !== pageNum) {
                setPageNum(viewNum);
            }
        }

        const pageFromURL = getPageFromURL();
        if (pageFromURL !== pagingState) {
            setPagingState(pageFromURL);

            if (pageMax) {
                const newStartPage = Math.max(1, Math.floor((pageFromURL - 1) / pagingGroupSize) * pagingGroupSize + 1);
                setPagingStartPage(newStartPage);
            }
        }
    }, [searchParams, pageMax, pagingGroupSize]);

    // 검색 결과 전체 개수
    useEffect(() => {
        getSearchPaging(text)
            .then((res) => {
                setPagingNum(res?.[0]?.[0] ?? 0);
            })
            .catch((err) => {
                console.error(err);
            });
    },[text]);

    // 페이지당 데이터 조회
    useEffect(() => {
        const pageWhere = pagingState === 1 ? 0 : (Number(pagingState) - 1) * pageNum;

        getSearchList(text, pageWhere, pageNum)
            .then((res) => {
                setpostAllData(res)
            })
            .catch((err) => {
                console.error(err);
            });
    }, [text, pageNum, pagingState]);

    useEffect(() => {
        if (pagingNum !== undefined) {
            const maxPage = Math.ceil(pagingNum / pageNum) || 1;
            setPageMax(maxPage);
        }
    }, [pagingNum, pageNum]);

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
            if (pagingState < pagingStartPage) {
                const newStartPage = Math.max(1, Math.floor((pagingState - 1) / pagingGroupSize) * pagingGroupSize + 1);
                setPagingStartPage(newStartPage);
            } else if (pagingState > pagingEndPage) {
                const newStartPage = Math.floor((pagingState - 1) / pagingGroupSize) * pagingGroupSize + 1;
                setPagingStartPage(newStartPage);
            }
        }
    }, [pagingState, pageMax, pagingStartPage, pagingEndPage, pagingGroupSize]);

    const sqlSearch = () => {
        if (!search) return;
        navigate(`/search/${search}`);
    }

    const pageNumber = (event) => { // select태그 이벤트 감지
        const newPageNum = event.target.value;
        setPageNum(newPageNum);
        setSearchParams({ page: pagingState.toString(), view: newPageNum }, { replace: true });
    }
return (
    <div className="max-w-4xl mx-auto p-6">
        {/* 제목 */}
        <h1 className="text-2xl font-bold mb-6">
            게시판
        </h1>

        {/* 검색 + 버튼 영역 */}
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            
                            sqlSearch()
                        }
                    }}
                    type="text"
                    placeholder="검색어를 입력하세요"
                    className="border rounded px-3 py-2 w-64"
                />
                <button
                    onClick={sqlSearch}
                    type="button"
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                    검색
                </button>
            </div>

            {/* 오른쪽 버튼 그룹 */}
            <div className="flex items-center gap-2">
                <Link to="/">
                    <button
                        type="button"
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
                    >
                        홈으로
                    </button>
                </Link>

                <Link to="/create">
                    <button
                        type="button"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                        게시글 작성
                    </button>
                </Link>
            </div>
        </div>

        {/* 데이터 없음 처리 */}
        {postAllData.length === 0 ? (
            <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                    데이터가 존재하지 않습니다
                </p>
            </div>
        ) : (
            /* 갤러리형 게시판 */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {postAllData.map((data) => (
                    <div
                        onClick={() => {navigate(`/detail/${data[0]}`)}}
                        key={data[0]}
                        className="border rounded-xl overflow-hidden shadow-sm bg-white hover:shadow-md transition"
                    >
                        {/* 이미지 영역 */}
                        <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                            {data[3] ? (
                                <img
                                    src={data[3]}
                                    alt="게시글 이미지"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-gray-400 font-semibold">
                                    이미지 없음
                                </span>
                            )}
                        </div>

                        {/* 텍스트 영역 */}
                        <div className="p-4">
                            <h2 className="font-semibold text-base truncate mb-3">
                                {data[1]}
                            </h2>

                            <div className="flex items-center justify-between text-sm text-gray-500">
                                <span className="truncate">
                                    {data[4]}
                                </span>
                                <span className="whitespace-nowrap">
                                    {data[2].replace('T', ' ')}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {/* 페이징 + 보기 갯수 */}
        <div className="relative mt-6 h-10">
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
                <button
                    onClick={pageListDown}
                    type="button"
                    className="px-3 py-1 border rounded hover:bg-gray-100"
                >
                    이전
                </button>
                {pageCount()}
                <button
                    onClick={pageListUp}
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

}
export default Search;