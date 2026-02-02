import { useNavigate, useParams } from "react-router-dom";
import { getPostDetail, createPost, updatePost, updatePostWithoutImage } from '../api/post';
import { useState, useEffect, useRef } from "react";

const Create = () => {
  const navigate = useNavigate();
  
  const { postId } = useParams()
  const [postSub, setPostSub] = useState();
  const [postCon, setPostCon] = useState();
  const [imgURL, setImgURL] = useState("");
  const [imgFile, setImgFile] = useState();
  const [previewImg, setPreviewImg] = useState(null);
  
  const formData = new FormData()

  const subRef = useRef(null)
  const conRef = useRef(null)
  const imgRef = useRef(null)
  
  const postCreateAndUpdateHandler = () => {

    if (imgURL === "" && !postId){
      alert("이미지를 첨부해주세요.");
      imgRef.current?.click();
    }
    else if (postSub === undefined) {
      alert("제목을 적어주세요.")
      subRef.current?.focus();
    }
    else if (postCon === undefined) {
      alert("내용을 적어주세요.")
      conRef.current?.focus();
    } else{
      try {
        formData.append('userId',localStorage.getItem("key"))
        formData.append('subject',postSub)
        formData.append('content',postCon)
        formData.append('files',imgFile)
        formData.append('postId',postId)
      }
      catch(error){
        console.warn(error)
      }
      if (typeof imgFile != "object"){
        updatePostWithoutImage(postSub, postCon, postId)
          .then((res) => {
          })
          .catch((err) => {
          console.error(err)
          });
      }else{
        if (postId) {
          updatePost(formData)
            .then((res) => {
            })
            .catch((err) => {
              console.error(err);
            });
        } else {
          createPost(formData)
            .then((res) => {
            })
            .catch((err) => {
              console.error(err);
            });
        }
      }
      navigate('/')
    }
  }
  useEffect(() => {
    if (postId === undefined) return;

    getPostDetail(postId)
    .then((res) => {
      setPostSub(res[0][1]);
      setPostCon(res[0][2]);
      setPreviewImg(res[0][4]);
      setImgFile(res[0][4]);
    })
    .catch((err) => {
      console.error(err);
    });

  }, [postId]);

  const imgInput = (event) =>{
    setImgURL(event.target.value) // 이미지 있는지 확인
    setImgFile(event.target.files[0])

  }

  return (
    /* 🔹 모달 바깥 영역 */
    <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
        onClick={() => navigate(-1)}
    >
        {/* 🔹 모달 컨테이너 */}
        <div
            className="relative w-[75vw] h-[95vh] bg-white rounded-2xl shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
        >
            {/* 헤더 (고정) */}
            <div className="sticky top-0 z-30 bg-white border-b">
                <div className="flex items-center justify-between p-6">
                    <h1 className="text-3xl font-bold">
                        게시글 {postId ? '수정' : '작성'}
                    </h1>

                    <div className="flex gap-2">
                        <button
                            onClick={postCreateAndUpdateHandler}
                            type="button"
                            className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            {postId ? '수정' : '작성'} 완료
                        </button>

                        <button
                            onClick={() => navigate(-1)}
                            type="button"
                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                        >
                            취소
                        </button>
                    </div>
                </div>
            </div>

            {/* 이미지 영역 */}
            <div className="w-full h-[70vh] bg-gray-100 flex items-center justify-center relative overflow-hidden">
                {previewImg ? (
                    <img
                        src={previewImg}
                        alt="미리보기"
                        className="max-w-full max-h-full object-contain"
                    />
                ) : (
                    <span className="text-gray-400 text-lg font-semibold">
                        이미지 첨부
                    </span>
                )}

                <input
                    ref={imgRef}
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => {
                        imgInput(e);
                        const file = e.target.files?.[0];
                        if (file) {
                            setPreviewImg(URL.createObjectURL(file));
                        }
                    }}
                />
            </div>

            {/* 본문 */}
            <div className="p-10">
                <input
                    ref={subRef}
                    value={postSub ?? ''}
                    onChange={(e) => setPostSub(e.target.value)}
                    type="text"
                    placeholder="제목을 입력하세요"
                    className="w-full text-3xl font-bold border-b pb-4 mb-6 focus:outline-none"
                />

                <textarea
                    ref={conRef}
                    value={postCon ?? ''}
                    onChange={(e) => setPostCon(e.target.value)}
                    placeholder="내용을 입력하세요"
                    className="w-full min-h-[260px] border rounded-xl p-6 text-lg leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
        </div>
    </div>
);



};

export default Create;
