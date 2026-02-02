import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getMyPaging, getMyPostList, deletePost } from '../api/post';
import { getLikePaging, getLikePostList } from '../api/like';
import { pwCheck } from '../api/user';

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
    const [postAllData, setpostAllData] = useState([]);
    const [deleteModalIsOpen, setdeleteModalIsOpen] = useState(false);
    const [userInfoUpdateModalIsOpen, setUserInfoUpdateModalIsOpen] = useState(false);
    const [postId, setPostId] = useState();
    const [deleteFlag, setDeleteFlag] = useState(false);

    // URL에서 탭 정보 읽기 (my | like)
    const getTabFromURL = () => {
        const tab = searchParams.get('tab');
        return tab === 'like' ? 'like' : 'my';
    };
    const [postState, setPostState] = useState(() => getTabFromURL());
    const [userPwCheck, setUserPwCheck] = useState(false);
    const [userPwData, setUserPwData] = useState("");
    const pwRef = useRef();
    
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
        setSearchParams(
            { page: page.toString(), view: pageNum.toString(), tab: postState },
            { replace: true }
        );
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
        setPostState("my")
    }
    const likePostList = () => {
        setPostState("like")
    }

    // 탭(나의/즐겨찾기) 변경 시 1페이지로 리셋
    useEffect(() => {
        setPagingState(1);
        setPagingStartPage(1);
        updateURL(1);
    }, [postState]);

    const userPwCheckHandler = () => {
        setUserPwData("")
        setUserInfoUpdateModalIsOpen(true);
    }
    const closePwModalHandler = () => {
        setUserInfoUpdateModalIsOpen(false);
    }
    const pwQueryHandler = () => {
        pwCheck(userId, userPwData)
            .then((res) => {
                if (res === true){
                    localStorage.setItem("pwcheck", "ok");
                    navigate(-1)
                }else{
                    alert(res)
                }
            })
            .catch((err) => {
                console.error(err)
            });
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


    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* 상단 헤더 */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">
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
                    <input
                        type="text"
                        placeholder="내 게시글 검색"
                        className="border rounded px-3 py-2 w-64"
                    />
                    <button
                        type="button"
                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
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
                            // 수정 로직 연결
                            // userPwCheckHandler()
                            // {()=>{navigate('/create')}}
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
                        onClick={() => {navigate(`/detail/${data[0]}`)}}
                        key={data[0]}
                        className="relative border rounded-xl overflow-hidden shadow-sm bg-white hover:shadow-md transition"
                    >
                        {/* 게시글 수정 / 삭제 버튼 (우상단) - 내 게시글에서만 */}
                        {postState === "my" && (
                            <div className="absolute top-2 right-2 z-10 flex gap-1">
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setPostId(data[0])
                                        navigate(`/create/${data[0]}`);
                                    }}
                                    className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
                                >
                                    수정
                                </button>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setPostId(data[0])
                                        setdeleteModalIsOpen(true);
                                    }}
                                    className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    삭제
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

                {/* 삭제 모달 */}
                {deleteModalIsOpen && <DeleteModal />}

                {/* 회원 정보 수정 모달 */}
                {/* <div 
                className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] ${userInfoUpdateModalIsOpen ? 'block':'hidden' }`}
                >
                <div 
                    className="bg-white rounded p-6 w-80"
                >
                    <h2 className="text-lg font-bold mb-4">비밀번호 확인</h2>
                    <input
                        value={userPwData??""}
                        onChange={(e) => setUserPwData(e.target.value)}
                        type="password"
                        placeholder="비밀번호를 입력하세요"
                        className="w-full border rounded px-3 py-2 mb-4"
                    />
            
                    <div className="flex justify-end gap-2">
                    <button className="px-4 py-2 bg-gray-300 rounded" onClick={closePwModalHandler}>
                        취소
                    </button>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={pwQueryHandler}>
                        확인
                    </button>
                    </div>
                </div>
                </div> */}
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
        </div>
    );
    
}

export default MyPage