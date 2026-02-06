import React, { useState, useEffect} from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getPostDetail, deletePost } from '../api/post';
import { toggleLike, checkLike } from '../api/like';
import '../styles/scrollbar.css';


const Detail = ({ postId, onClose = () => {}, movePost = () => {} }) => {
  
  const navigate = useNavigate();
  const [deleteModalIsOpen, setdeleteModalIsOpen] = useState(false);
  const userId = localStorage.getItem("key")
  const [postuserId, setPostUserId] = useState();
  const [postSub, setPostSub] = useState();
  const [postCon, setPostCon] = useState();
  const [postCreated_at, setPostCreated_at] = useState();
  const [imgPath, setImgPath] = useState();
  const [userName, setUserName] = useState();
  const [changeCnt, setChangeCnt] = useState();

  const [isImageFull, setIsImageFull] = useState(false);

  const [isFavorite, setIsFavorite] = useState(false);


  const closeDetail = () => {
    onClose(); 
  };

  const favoriteHandler = () => {
    
    if (userId){
      setIsFavorite(!isFavorite)
      toggleLike(userId, postId)
      .catch((err) => {
        console.error(err);
      });
    }else{
      alert("로그인 먼저 해주세요")
      navigate('/login')
    }
  }

  useEffect(() => {
    getPostDetail(postId)
    .then((res) => {
      setPostUserId(res[0][0])
      setPostSub(res[0][1])
      setPostCon(res[0][2])
      setPostCreated_at(res[0][3].replace('T', ' '))
      setImgPath(res[0][4])
      setUserName(res[0][5])
      setChangeCnt(res[0][6])
    })
    .catch((err) => {
      console.error(err);
    });
    if (userId){
      checkLike(userId, postId)
        .then((res) => {
          if (res === true){
            setIsFavorite(true)
          }
      })
      .catch((err) => {
        console.error(err);
      });
    }else{
      console.log("out")
    }
  },[postId]);

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

  const deleteModalHandler = () => {
    setdeleteModalIsOpen(true);
  }
  const closeModalHandler = () => {
    setdeleteModalIsOpen(false);
  }

  const deleteQueryHandler = () => {
    deletePost(postId)
      .catch((err) => {
        console.error(err);
      });
      navigate(-1)
    }

    
  return(
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
    onClick={() => closeDetail()}
  >
    {/* ← 왼쪽 버튼 */}
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        movePost([-1, postCreated_at])
      }}
      className="fixed left-6 top-1/2 -translate-y-1/2
      w-20 h-28
      flex items-center justify-center
      text-4xl font-semibold text-white
      drop-shadow-lg
      hover:scale-105 transition-transform"
    >
      ‹
    </button>

    {/* 모달 컨테이너 */}
    <div
      className="relative w-[75vw] h-[95vh] bg-white rounded-2xl shadow-2xl overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="sticky top-4 flex justify-end z-20 px-1 gap-2">
        <div className="mr-12 flex items-center gap-2 min-h-[40px] min-w-[64px]">
        {userId == postuserId && (<>
            <button
              onClick={() => navigate(`/create/${postId}`)}
              type="button"
              aria-label="수정"
              className="p-2 rounded hover:bg-gray-200"
            >
              {/* 수정 아이콘 (연필) */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-gray-700"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l2.651 2.651M6.429 14.918l-1.406 4.652 4.652-1.406 8.485-8.485-3.246-3.246-8.485 8.485z"
                />
              </svg>
            </button>

            <button
              onClick={deleteModalHandler}
              type="button"
              aria-label="삭제"
              className="p-2 rounded hover:bg-red-100"
            >
              {/* 삭제 아이콘 (휴지통) */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-red-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107
                  1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 
                  2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 
                  0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 
                  1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 
                  51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </button>
            </>)}
        </div>

        <button
          onClick={() => closeDetail()}
          type="button"
          className="absolute right-0 top-1/3 -translate-y-1/2
                    p-2 text-gray-500 hover:text-gray-700
                    text-5xl leading-none"
        >
          ×
        </button>
      </div>

      {/* 이미지 영역 */}
      <div
        className="w-full h-[70vh] bg-white flex items-center justify-center cursor-zoom-in"
        onClick={(e) => {
              e.stopPropagation()
              setIsImageFull(true)}
            }
      >
        <img
          src={imgPath}
          alt="게시글 이미지"
          className="max-w-full max-h-full object-contain"
        />
      </div>

      {/* 본문 영역 */}
      <div className="p-10">
        <div className="flex items-baseline justify-between mb-6">
          <div className="flex items-baseline gap-3">
            <h1 className="text-4xl font-bold">{postSub}</h1>
            <span className="text-2xl text-gray-500">{userName}</span>
          </div>

          <button
            type="button"
            onClick={favoriteHandler}
            className="w-10 h-10 flex items-center justify-center
                      border rounded-md hover:border-yellow-400 group"
            aria-label="즐겨찾기"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              fill={isFavorite ? "currentColor" : "none"}
              className={`w-6 h-6 ${
                isFavorite
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

        <div className="border rounded-xl p-6 min-h-[260px] text-lg leading-relaxed whitespace-pre-wrap text-left mb-10">
          {postCon}
        </div>

        <div className="flex justify-end text-base text-gray-500">
          <span>
            {postCreated_at}
            {changeCnt == 1 ? " (수정됨)" : ""}
          </span>
        </div>
      </div>
    </div>

    {/* → 오른쪽 버튼 */}
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        movePost([1, postCreated_at]); 
      }}
      className="fixed right-6 top-1/2 -translate-y-1/2
      w-16 h-28
      flex items-center justify-center
      text-4xl font-semibold text-white
      drop-shadow-lg
      hover:scale-105 transition-transform"
    >
      ›
    </button>
    {/* 이미지 전체화면 오버레이 (완전 분리) */}
    {isImageFull && (
        <div
            className="fixed inset-0 z-[9999] bg-white flex items-center justify-center cursor-zoom-out"
            onClick={(e) => {
              e.stopPropagation()
              setIsImageFull(false)}
            }
        >
            <img
                src={imgPath}
                alt="확대 이미지"
                className="max-w-full max-h-full object-contain"
            />
        </div>
    )}

    {/* 삭제 확인 모달 */}
    {deleteModalIsOpen && <DeleteModal />}
  </div>

  );
};

export default Detail;
