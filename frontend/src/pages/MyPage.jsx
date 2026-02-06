import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getMyPaging, getMyPostList, deletePost, nextMyPost, prevMyPost, nextLikePost, prevLikePost } from '../api/post';
import { getLikePaging, getLikePostList } from '../api/like';
import Detail from './Detail';
import { toggleLike, checkLike } from '../api/like';

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

const MyPage = () => {
    const userId = localStorage.getItem('key')

    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchType, setSearchType] = useState('my');
    const [postAllData, setpostAllData] = useState([]);
    const [deleteModalIsOpen, setdeleteModalIsOpen] = useState(false);
    const [postId, setPostId] = useState();
    const [deleteFlag, setDeleteFlag] = useState(false);
    const [selectType, setSelectType] = useState('all');
    
    const nextFlag = useRef(false);
    const prevFlag = useRef(false);
    const [moveData, setMoveData] = useState([]);
    useEffect(()=>{
        try {
            console.log(postAllData[0][0] , postId)
            if (nextFlag.current == true && moveData[0]>0){
                const nextPage = pagingState + 1;
                setPagingState(nextPage);
                setSearchParams({ page: String(nextPage), view: String(pageNum), tab: searchType }, { replace: true });
                nextFlag.current = false;
            } else if (prevFlag.current == true && moveData[0]<0){
                const prevPage = Math.max(1, pagingState - 1);
                setPagingState(prevPage);
                setSearchParams({ page: String(prevPage), view: String(pageNum), tab: searchType }, { replace: true });
                prevFlag.current = false;
            }
            if (postAllData[(postAllData.length)-1][0] == postId){
                nextFlag.current = true;
            } else if (postAllData[(postAllData.length)-1][0] !== postId){
                nextFlag.current = false;
            }
            if (postAllData[0][0] == postId){
                prevFlag.current = true;
            } else if (postAllData[0][0] !== postId){
                prevFlag.current = false;
            }
        } catch (error) {
            // console.log("ㅜㅜ : ", error)
        }
    },[postId])

    const movePost = (data) =>{
        setMoveData(data)
        if(data[0]>0){
            (searchType == 'like'
            ?nextLikePost(data[1], userId)
            :nextMyPost(data[1], userId))
            .then((res) => {
                if(res){
                    setPostId(res[0])
                }else{
                    alert("끝입니다.")
                }
            })
            .catch((err) => console.error(err));
        }else{
            (searchType == 'like'
            ?prevLikePost(data[1], userId)
            :prevMyPost(data[1], userId))
            .then((res) => {
                if(res){
                    setPostId(res[0])
                }else{
                    alert("끝입니다.")
                }
            })
            .catch((err) => console.error(err));
        }
    }


    const moveDetail = () =>{
        if(postId){
            // console.log("moveDetail", postId)
            return (
                <Detail postId={postId} onClose={closeDetail} movePost={movePost} />
            )
        } else{
            return (
                <></>
            )            
        }
    }

    const closeDetail = () => {
        setPostId(null);
    };

    const goToDetail = (postId) =>{
        setPostId(postId)
    }

    const [search, setSearch] = useState() 
    // URL에서 탭 정보 읽기 (my | like)
    const getTabFromURL = () => {
        const tab = searchParams.get('tab');
        const tabValue = tab === 'like' ? 'like' : 'my';
        setSearchType(tabValue);
        return tabValue;
    };
    const [postState, setPostState] = useState(() => getTabFromURL());
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
    const sqlSearch = () => {
        if (!search) return;
        navigate(`/search/${search}/${selectType}`);
    }
    const updateURL = (page) => {
        setSearchParams(
            { page: page.toString(), view: pageNum.toString(), tab: postState },
            { replace: true }
        );
    };
    const selectTypeHandler = (event) => {
        setSelectType(event.target.value);
        console.log(event.target.value)
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



    const myPostList = () => {
        setPostState("my");
        setSearchType("my");
        setPagingState(1);
        setPagingStartPage(1);
        setSearchParams({ page: '1', view: String(pageNum), tab: 'my' }, { replace: true });
    }
    const likePostList = () => {
        setPostState("like");
        setSearchType("like");
        setPagingState(1);
        setPagingStartPage(1);
        setSearchParams({ page: '1', view: String(pageNum), tab: 'like' }, { replace: true });
    }



    const userLogOut= () => {
        localStorage.removeItem('key');
        navigate('/')
    }

    const DeleteModal = () => {
        return (
            <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]"
            onClick={closeModalHandler}
            >
            <div 
                className="bg-white rounded p-6 w-80"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-lg font-bold mb-4">삭제 확인</h2>
                <p className="mb-6">정말로 삭제하시겠습니까?</p>
        
                <div className="flex justify-end gap-2">
                <button className="px-4 py-2 bg-gray-300 rounded" onClick={closeModalHandler}>
                    취소
                </button>
                <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={deleteQueryHandler}>
                    삭제
                </button>
                </div>
            </div>
            </div>
        );
    };
    
    const closeModalHandler = () => {
        setdeleteModalIsOpen(false);
    }
    const deleteQueryHandler = () => {
        deletePost(postId)
        .catch((err) => {
            console.error(err);
        });
        setdeleteModalIsOpen(false);
        setDeleteFlag(true);
        }

    // URL에 page/view가 없으면 둘 다 함께 설정 + URL의 view 값 반영
    useEffect(() => {
        const currentPage = searchParams.get('page') || '1';
        const currentView = searchParams.get('view') || '6';
        const currentTab = searchParams.get('tab') || 'my';
        if (!searchParams.get('page') || !searchParams.get('view') || !searchParams.get('tab')) {
            setSearchParams({ page: currentPage, view: currentView, tab: currentTab }, { replace: true });
        }

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

        const tabFromURL = getTabFromURL();
        if (tabFromURL !== postState) {
            setPostState(tabFromURL);
        }
    }, [searchParams, pageMax, pagingGroupSize]);

    // 마이페이지 전체 개수
    useEffect(() => {
        if (!userId) return;

        if (postState === "like") {
            getLikePaging(userId)
                .then((res) => setPagingNum(res?.[0]?.[0] ?? 0))
                .catch((err) => console.error(err));
        } else {
            getMyPaging(userId)
                .then((res) => setPagingNum(res?.[0]?.[0] ?? 0))
                .catch((err) => console.error(err));
        }
    }, [userId, deleteFlag, postState]);

    // 페이지당 데이터 조회
    useEffect(() => {
        if (!userId) return;

        const pageWhere = pagingState === 1 ? 0 : (Number(pagingState) - 1) * pageNum;

        try {
            if (postState === "like") {
                getLikePostList(userId, pageWhere, pageNum)
                    .then((res) => setpostAllData(res))
                    .catch((err) => console.error(err));
            } else {
                getMyPostList(userId, pageWhere, pageNum)
                    .then((res) => setpostAllData(res))
                    .catch((err) => console.error(err));
            }
        }
        catch (error) {
            console.warn(error)
        }

        if (deleteFlag) setDeleteFlag(false);
    }, [userId, pageNum, pagingState, deleteFlag, postState]);

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

    const pageNumber = (event) => { // select태그 이벤트 감지
        const newPageNum = event.target.value;
        setPageNum(newPageNum);
        setSearchParams({ page: pagingState.toString(), view: newPageNum, tab: postState }, { replace: true });
    }

    const favoriteHandler = (postIdToToggle) => {
        console.log(postIdToToggle)
        const id = postIdToToggle ?? postId;
        if (!id) return;
        if (userId) {
            toggleLike(userId, id)
            .catch((err) => {
                console.error(err);
            });
        } else {
            alert("로그인 먼저 해주세요");
            navigate('/login');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* 상단 헤더 */}
            <div className="flex items-center justify-between mb-6">
                <h1 
                onClick={()=>{navigate('/')}}
                className="text-2xl font-bold"
                >
                    마이페이지
                </h1>
    
                {/* 상단 오른쪽 버튼 */}
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={()=>{navigate('/')}}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                        홈으로
                    </button>
                    <button
                        type="button"
                        onClick={userLogOut}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        로그아웃
                    </button>
                </div>
            </div>
    
    
            {/* 검색 + 액션 버튼 라인 */}
            <div className="flex items-center justify-between mb-6">
                {/* 검색 영역 */}
                <div className="flex items-center gap-2">

                    <select
                        onChange={selectTypeHandler}
                        className="h-10 px-2 border border-gray-200 rounded bg-white text-sm cursor-pointer focus:outline-none focus:ring-1 focus:ring-gray-300"
                    >
                        <option value="all">전체</option>
                        <option value="like">즐겨찾기</option>
                        <option value="mine">나의 게시글</option>
                    </select>

                    <input
                        value={search || ""}
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
    
                {/* 검색 라인 오른쪽 버튼 */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            navigate(`signup/${userId}`)
                        }}
                        type="button"
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                        정보수정
                    </button>
                    <button
                        onClick={()=>{navigate('/create')}}
                        type="button"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        게시글 작성
                    </button>
                </div>
            </div>

            {/* 게시글 유형 선택 버튼 */}
            <div className="mb-6">
                <div className="flex w-full max-w-md border rounded-full overflow-hidden">
                    <button
                        onClick={myPostList}
                        type="button"
                        className={`flex-1 px-4 py-2 text-sm font-medium text-center
                            ${postState==="my"? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}
                            `}
                        >
                        나의 게시글
                    </button>
                    <button
                        onClick={likePostList}
                        type="button"
                        className={`flex-1 px-4 py-2 text-sm font-medium text-center
                            ${postState==="like"? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}
                            `}
                    >
                        즐겨찾기 게시글
                    </button>
                </div>
            </div>

    
            {/* 갤러리형 게시판 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {postAllData.map((data) => (
                    <div
                        onClick={() => {goToDetail(data[0])}}
                        key={data[0]}
                        className="relative border rounded-xl overflow-hidden shadow-sm bg-white hover:shadow-md transition"
                    >
                        {/* 게시글 수정 / 삭제 버튼 (우상단) - 내 게시글에서만 */}
                        {postState === "my" && (
                        <div className="absolute top-2 right-2 z-10 flex gap-1 items-center">
                            <button
                            type="button"
                            aria-label="수정"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setPostId(data[0]);
                                navigate(`/create/${data[0]}`);
                            }}
                            className="p-1.5 rounded bg-gray-200 hover:bg-gray-300"
                            >
                            {/* 수정 아이콘 (solid) */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-4 h-4 text-gray-800"
                            >
                                <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a4.5 4.5 0 00-1.06 1.697l-1.306 4.35a.75.75 0 00.928.928l4.35-1.306a4.5 4.5 0 001.697-1.06l8.4-8.4z" />
                            </svg>
                            </button>

                            <button
                            type="button"
                            aria-label="삭제"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setPostId(data[0]);
                                setdeleteModalIsOpen(true);
                            }}
                            className="p-1.5 rounded bg-red-100 hover:bg-red-200"
                            >
                            {/* 삭제 아이콘 (solid) */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-4 h-4 text-red-600"
                            >
                                <path d="M6.375 3A1.875 1.875 0 018.25 1.125h7.5A1.875 1.875 0 0117.625 3H22.5a.75.75 0 010 1.5h-1.06l-.812 14.217A2.25 2.25 0 0118.385 21.75H5.615a2.25 2.25 0 01-2.243-2.033L2.56 4.5H1.5a.75.75 0 010-1.5h4.875zm2.25 0h6.75v-.375a.375.375 0 00-.375-.375h-6a.375.375 0 00-.375.375V3zm9.64 1.5H5.735l.797 13.972a.75.75 0 00.748.678h9.44a.75.75 0 00.748-.678L18.265 4.5z" />
                            </svg>
                            </button>
                        </div>
                        )}


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
                        {/* <div className="p-4">
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
                    </div> */}

                                            {/* 텍스트 영역 */}
                                            <div className="p-4">
                            {/* 제목 */}
                            <div className="flex items-center mb-3 w-full">
                            {/* 왼쪽 더미 영역 → 제목을 시각적 중앙에 맞추기 위한 보정 */}
                            <div className="w-10 h-10" />

                            <h2 className="font-semibold text-base truncate flex-1 text-center leading-10">
                                {data[1]}
                            </h2>

                            <button
                                type="button"
                                onClick={(e)=>{
                                    e.stopPropagation();
                                    favoriteHandler(data[0]);
                                }}
                                className="w-7 h-7 flex items-center justify-center
                                        border rounded-md hover:border-yellow-400 group"
                                aria-label="즐겨찾기"
                            >
                                <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                fill={data[6]==1 ? "currentColor" : "none"}
                                className={`w-6 h-6 ${
                                    data[6]==1
                                    ? "text-yellow-400"
                                    : "text-gray-400 group-hover:text-yellow-400"
                                }`}
                                >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M11.48 3.499a.562.562 0 011.04 0l2.162 5.5a.563.563 0
                                    00.475.348l5.94.462a.563.563 0 01.321.988l-4.518 3.916a.563.563
                                    0 00-.182.557l1.378 5.78a.562.562 0 01-.84.61l-5.08-3.065a.563.563
                                    0 00-.586 0l-5.08 3.065a.562.562 0 01-.84-.61l1.378-5.78a.563.563
                                    0 00-.182-.557L2.18 10.797a.563.563 0 01.321-.988l5.94-.462a.563.563
                                    0 00.475-.348l2.162-5.5z"
                                />
                                </svg>
                            </button>
                            </div>

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

                {/* 삭제 모달 */}
                {deleteModalIsOpen && <DeleteModal />}
            </div>

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
            {moveDetail()}
        </div>
    );
    
}

export default MyPage