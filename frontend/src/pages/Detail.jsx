import React, { useState, useEffect} from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getPostDetail, deletePost } from '../api/post';
import { toggleLike, checkLike } from '../api/like';
import '../styles/scrollbar.css';


const Detail = () => {
  
  const navigate = useNavigate();
  const [deleteModalIsOpen, setdeleteModalIsOpen] = useState(false);
  const { postId } = useParams()
  const [userId, setUserToken] = useState(localStorage.getItem("key"));

  const [postuserId, setPostUserId] = useState();
  const [postSub, setPostSub] = useState();
  const [postCon, setPostCon] = useState();
  const [postCreated_at, setPostCreated_at] = useState();
  const [imgPath, setImgPath] = useState();
  const [userName, setUserName] = useState();
  const [changeCnt, setChangeCnt] = useState();

  const [isImageFull, setIsImageFull] = useState(false);

  const [isFavorite, setIsFavorite] = useState(false);

  const favoriteHandler = () => {
    if (userId){
      setIsFavorite(!isFavorite)
      toggleLike(userId, postId)
      .then((res) => {
        // console.log(res);
        // console.log(res.liked);
      })
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
            setIsFavorite(!isFavorite)
          }
      })
      .catch((err) => {
        console.error(err);
      });
    }else{
      console.log("out")
    }
  },[]);

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


    return (
      <>
          {/* 게시글 상세 모달 */}
              <div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
                  onClick={() => navigate(-1)} // 뒤로가기
              >
                  {/* 모달 컨테이너 */}
                  <div
                      className="relative w-[75vw] h-[95vh] bg-white rounded-2xl shadow-2xl overflow-y-auto"
                      onClick={(e) => e.stopPropagation()}
                  >
                    {userId == postuserId && (
                        // <div className="absolute top-4 right-4 z-20 flex gap-2">
                        <div className="sticky top-4 flex justify-end z-20 px-4 gap-2">
                            <button
                                onClick={() => navigate(`/create/${postId}`)}
                                type="button"
                                className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                            >
                                수정
                            </button>
                            <button
                                onClick={deleteModalHandler}
                                type="button"
                                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                삭제
                            </button>
                        </div>
                    )}


                      {/* 이미지 영역 (모달 안) */}
                      <div
                          className="w-full h-[70vh] bg-white flex items-center justify-center cursor-zoom-in"
                          onClick={() => setIsImageFull(true)}
                      >
                          <img
                              src={imgPath}
                              alt="게시글 이미지"
                              className="max-w-full max-h-full object-contain"
                          />
                      </div>

                      {/* 본문 영역 */}
                      <div className="p-10">
                          {/* 제목 + 작성자 */}
                          {/* <div className="flex items-baseline gap-3 mb-6">
                              <h1 className="text-4xl font-bold">
                                  {postSub}
                              </h1>
                              <span className="text-2xl text-gray-500">
                                  {userName}
                              </span>
                          </div> */}
<div className="flex items-baseline justify-between mb-6">
    {/* 좌측: 제목 + 작성자 */}
    <div className="flex items-baseline gap-3">
        <h1 className="text-4xl font-bold">
            {postSub}
        </h1>
        <span className="text-2xl text-gray-500">
            {userName}
        </span>
    </div>

    {/* 우측: 즐겨찾기 버튼 */}
    <button
        type="button"
        onClick={favoriteHandler}
        className="w-10 h-10 flex items-center justify-center
                   border rounded-md
                   hover:border-yellow-400
                   group"
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
                0 00-.182-.557L2.18 10.797a.563.563 0 01.321-.988l5.94-.462a.563.563 0 00.475-.348l2.162-5.5z"
            />
        </svg>
    </button>
</div>







                          {/* 내용 */}
                          <div className="border rounded-xl p-6 min-h-[260px] text-lg leading-relaxed whitespace-pre-wrap text-left mb-10">
                              {postCon}
                          </div>

                          {/* 날짜 (우측 하단) */}
                          <div className="flex justify-end text-base text-gray-500">
                              <span>
                                {postCreated_at}
                                {changeCnt == 1?` (수정됨)`:""}
                              </span>
                          </div>
                      </div>
                  </div>
              </div>

          {/* 이미지 전체화면 오버레이 (완전 분리) */}
          {isImageFull && (
              <div
                  className="fixed inset-0 z-[9999] bg-white flex items-center justify-center cursor-zoom-out"
                  onClick={() => setIsImageFull(false)}
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
      </>
  );

};

export default Detail;
