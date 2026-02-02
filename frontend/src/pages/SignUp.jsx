import React, { useState, useEffect, useRef } from 'react'
import { getUserInfo, signup as signupApi, userUpdate, checkUserId as checkUserIdApi, checkUserName as checkUserNameApi, pwCheck } from '../api/user';
import { useBlocker, useNavigate, useParams } from 'react-router-dom'

export const Signup = () => {
    const [userIdData, setUserIdData] = useState("");
    const [userPwData, setUserPwData] = useState("");
    const [userOldPwData, setUserOldPwData] = useState("");
    const [userPwCheckData, setUserPwCheckData] = useState("");
    const [userNameData, setUserNameData] = useState("");
    const [userBirthdayData, setUserBirthdayData] = useState();
    const [userEmailData, setUserEmailData] = useState();
    
    const [idFlag, setIdFlag] = useState(false);
    const [nameFlag, setNameFlag] = useState(false);
    
    const [validateUserId, setValidateUserId] = useState();
    const [validateUserPw, setValidateUserPw] = useState();
    const [validateUserPwCheck, setValidateUserPwCheck] = useState();
    const [validateUserName, setValidateUserName] = useState();
    const [validateUserEmail, setValidateUserEmail] = useState();
    
    const [pwBlurred, setPwBlurred] = useState(false);
    const [pwCheckBlurred, setPwCheckBlurred] = useState(false);
    const [emailBlurred, setEmailBlurred] = useState(false);

    const idFlagRef = useRef(null);
    const pwFlagRef = useRef(null);
    const pwCheckFlagRef = useRef(null);
    const nameFlagRef = useRef(null);
    const birthdayFlagRef = useRef(null);
    const emailFlagRef = useRef(null);
    
    const navigate = useNavigate()
    
    
    const { userId } = useParams()
    
    const [infoUserPwDataUpdateFlag, setInfoUserPwDataUpdateFlag] = useState(false);
    const [infoUserBirthdayDataUpdateFlag, setInfoUserBirthdayDataUpdateFlag] = useState(false);
    const [infoUserNameDataUpdateFlag, setInfoUserNameDataUpdateFlag] = useState(false);
    const [infoUserEmailDataUpdateFlag, setInfoUserEmailDataUpdateFlag] = useState(false);
    const [userInfoUpdateModalIsOpen, setUserInfoUpdateModalIsOpen] = useState(false);

    // useBlocker(() => {
    //     test()
    // })
    // const test = () =>{
    //     // console.log("in test")
    //     localStorage.removeItem("pwcheck");
    // }


    // useEffect(() => {
    //     const legal = localStorage.getItem("pwcheck");
    //     if (!legal){
    //         alert("정상적인 접근이 아닙니다!\n돌아가시오!")
    //         navigate(-1)
    //     }else{
    //         // console.log("환영~")
    //     }
    // },[]);
    
    
    
    useEffect(() => {
        if (userId){
            getUserInfo(userId)
                .then((res) => {
                    setUserIdData(res[1])
                    setUserPwData(res[2])
                    setUserNameData(res[4])
                    setUserBirthdayData(res[3])
                    setUserEmailData(res[5])
                    setIdFlag(true)
                })
                .catch((err) => {
                    console.error(err)
                });
        }
    },[userId]);
    
    
    
    const signupInsert = () => {

        if (idFlag && !validateUserPw && !validateUserPwCheck && userBirthdayData && !validateUserName && !validateUserEmail) {

            const arr = [];
            arr.push(userId,
                userPwData,
                userBirthdayData,
                userNameData,
                userEmailData)
                
            if (userId){
                userUpdate({
                    userId,
                    userPwData,
                    userBirthdayData,
                    userNameData,
                    userEmailData
                })
                    .then((res) => {
                        alert("회원 수정 완료")
                        navigate('/mypage')
                    })
                    .catch((err) => {
                        console.error(err)
                    });
            }else{
                signupApi({
                    userIdData,
                    userPwData,
                    userBirthdayData,
                    userNameData,
                    userEmailData
                })
                    .then((res) => {
                        alert("회원가입 완료\n로그인 페이지로 이동합니다.")
                        navigate('/login')
                    })
                    .catch((err) => {
                        console.error(err)
                    });
            }
            
        } else{
            
            if(!idFlag) {
                console.log(idFlag)
                alert("아이디를 다시 한번 확인해 주세요")
                idFlagRef.current?.focus();
            }
            else if(validateUserPw) {
                alert("패스워드를 다시 한번 확인해 주세요")
                pwFlagRef.current?.focus();
            }
            else if(validateUserPwCheck) {
                console.log(validateUserPwCheck, !userBirthdayData, validateUserName)
                alert("패스워드를 다시 한번 확인해 주세요")
                pwCheckFlagRef.current?.focus();
            }
            else if(!userBirthdayData) {
                alert("생년월일을 다시 한번 확인해 주세요")
                birthdayFlagRef.current?.focus();
            }
            else if(validateUserName || validateUserName === undefined) {
                alert("닉네임을 다시 한번 확인해 주세요")
                nameFlagRef.current?.focus();
            }
            else if(validateUserEmail) {
                alert("이메일을 다시 한번 확인해 주세요")
                emailFlagRef.current?.focus();
            }
        }
    }

    useEffect(() => { // 이메일 조합 확인
        let regExp = /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/i;
        if (!setEmailBlurred) return;

        if (regExp.test(userEmailData)) {	
            setValidateUserEmail(false)
        } else{
            setValidateUserEmail(true)
        }
    },[userEmailData, emailBlurred])

    const idCheck = () => { // id가 영숫자 + 6자 이상인지 확인
        // validateUserId가 false일 경우 조합이 올바른 것이다.

        let regExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9]{6,}$/;
        
        if (regExp.test(userIdData)) {	
            setValidateUserId(false)

            checkUserIdApi(userIdData)
            .then((res) => {
                if (!res.exists){
                    setValidateUserId(false)
                    setIdFlag(true)
                }
            })
            .catch((err) => {
                console.error(err);
            });
        } else{
            setValidateUserId(true)
        }
    }
    const userPwCheckHandler = () => {
        setUserOldPwData("")
        setUserInfoUpdateModalIsOpen(true);
        setValidateUserPwCheck(false)
    }
    const closePwModalHandler = () => {
        setUserInfoUpdateModalIsOpen(false);
    }
    const pwQueryHandler = () => {
        console.log("userOldPwData", userOldPwData)
        console.log("userId", userId)
        console.log("userPwData", userPwData)
        pwCheck(userId, userOldPwData)
            .then((res) => {
                if (res === true){
                    signupInsert()
                }else{
                    alert(res)
                }
            })
            .catch((err) => {
                console.error(err)
            });
    }
    useEffect(() => { // 비밀번호 조합 확인
        let regExp = /^(?=.*?[A-Za-z])(?=.*?[0-9])(?=.*?[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
        if (!setPwBlurred) return;


        if (regExp.test(userPwData)) {	
            setValidateUserPw(false)
        } else{
            setValidateUserPw(true)
        }
    },[userPwData, pwBlurred])
    
    useEffect(() => { // 비밀번호 체크
        if (!setPwBlurred) return;
        if (userPwCheckData == userPwData && !validateUserPw && userPwData){
            setValidateUserPwCheck(false)
        }else{
            console.log("validateUserPwCheck", validateUserPwCheck)
            setValidateUserPwCheck(true)
        }
    },[userPwCheckData, pwCheckBlurred])

    const nameCheck = () => { // 닉네임 중복 확인
        if (userNameData === undefined)
            return alert("닉네임을 입력해주세요")
        checkUserNameApi(userNameData)
        .then((res) => {
            if (!res.exists){
                setValidateUserName(false)
                setNameFlag(true)
            }else{
                setValidateUserName(true)
            }
        })
        .catch((err) => {
            console.error(err);
        });
    }


    return (
    
    <div className="max-w-md mx-auto p-6 mt-20 border rounded">
        {/* <h1 className="text-2xl font-bold mb-6 text-center">
            {userId?"회원 정보 수정":"회원가입"}
        </h1> */}
<div className="relative mb-6">
    <h1 className="text-2xl font-bold text-center">
        {userId ? "회원 정보 수정" : "회원가입"}
    </h1>

    <button
    onClick={() => {navigate(-1)}}
    type="button"
    className="absolute right-0 top-1/3 -translate-y-1/2
               p-2 text-gray-500 hover:text-gray-700
               text-5xl leading-none"
    >
        ×
    </button>
</div>

        {/* 아이디 */}
        <div className="mb-4">
            <div className="relative flex items-center justify-center mb-2">
                <span className="block mb-2 font-medium">
                    아이디 <span className="text-red-500">*</span>
                </span>
                <span className="absolute right-0 text-xs text-red-500">* 필수</span>
            </div>
            {userId
            ?<>
            <div className="flex gap-2">
                <strong className="flex-1 border rounded px-3 py-2 text-left">
                    {userIdData}
                </strong>
            </div>
            </>
            :<>
            <div className="flex gap-2">
                <input
                    ref={idFlagRef}
                    value={userIdData??""}
                    onChange={(e) => setUserIdData(e.target.value)}
                    type="text"
                    placeholder="아이디를 입력하세요"
                    className="flex-1 border rounded px-3 py-2"
                    readOnly={idFlag}
                />
                <button
                    onClick={idCheck}
                    type="button"
                    className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                    중복확인
                </button>
            </div>
            <p className={`mt-1 text-xs ${
                idFlag === true && validateUserId===false
                ? ' text-green-500'
                :validateUserId===false && idFlag === false
                    ?' text-red-500'
                    :validateUserId===true && idFlag === false
                    ?' text-red-500'
                    :' text-gray-500'
            }`}>
                {idFlag === true && validateUserId===false
                    ?"사용 가능한 아이디입니다."
                    :validateUserId===false && idFlag === false
                    ?"중복된 아이디 입니다."
                    :"8자 이상, 영어와 숫자를 조합해 주세요."
                }
            </p>
            </>}
        </div>

        {/* 비밀번호 */}
        <div className="mb-4">
            <label className="block mb-2 font-medium">
                비밀번호 <span className="text-red-500">*</span>
            </label>

            {userId && !infoUserPwDataUpdateFlag
            ?<div className="flex gap-2">
            <input
                readOnly={true}
                value={userPwData}
                type="password"
                className="flex-1 border rounded px-3 py-2 text-gray-700 text-left"
            />
            <button
                onClick={()=>{setInfoUserPwDataUpdateFlag(true)}}
                type="button"
                className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
                수정
            </button>
            </div>
            :<>
            <input
                ref={pwFlagRef}
                value={userPwData??""}
                onChange={(e) => setUserPwData(e.target.value)}
                onBlur={() => setPwBlurred(true)}
                type="password"
                placeholder="비밀번호를 입력하세요"
                className="w-full border rounded px-3 py-2"
            />
            <p className={`mt-1 text-xs ${
                !pwBlurred
                ? 'text-gray-500'
                :validateUserPw
                    ?' text-red-500'
                    :' text-green-500'
            }`}>
                영문·숫자 8자 이상, 특수문자를 포함해야 합니다.
            </p>
            </>}
        </div>
        {userId && !infoUserPwDataUpdateFlag
            ?<></>:
        <div className="mb-4">
            <label className="block mb-2 font-medium">
                비밀번호 확인 <span className="text-red-500">*</span>
            </label>
            <input
                ref={pwCheckFlagRef}
                value={userPwCheckData??""}
                onChange={(e) => setUserPwCheckData(e.target.value)}
                onBlur={() => setPwCheckBlurred(true)}
                type="password"
                placeholder="비밀번호를 입력하세요"
                className="w-full border rounded px-3 py-2"
            />
            <p className={`mt-1 text-xs ${
                !pwCheckBlurred
                ? 'text-gray-500'
                :
                userPwCheckData == userPwData && !validateUserPw
                    ?'text-green-500'
                    :'text-red-500'
            }`}>
                {
                !pwCheckBlurred
                ? ''
                :
                userPwCheckData == userPwData && !validateUserPw
                    ?'비밀번호가 일치합니다'
                    :'비밀번호가 일치하지 않습니다'
                }
            </p>
        </div>
        }

        {/* 생년월일 */}
        <div className="mb-4">
            <label className="block mb-2 font-medium">
                생년월일 <span className="text-red-500">*</span>
            </label>
            {userId && !infoUserBirthdayDataUpdateFlag
            ?<div className="flex gap-2">
                <strong className="flex-1 border rounded px-3 py-2 text-gray-700 text-left">
                    {userBirthdayData}
                </strong>
                <button
                    onClick={()=>{setInfoUserBirthdayDataUpdateFlag(true)}}
                    type="button"
                    className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                    수정
                </button>
            </div>
            :
            <input
                ref={birthdayFlagRef}
                value={userBirthdayData}
                onChange={(e) => setUserBirthdayData(e.target.value)}
                type="date"
                className="w-full border rounded px-3 py-2"
            />
            }
        </div>

        {/* 닉네임 */}
        <div className="mb-4">
            <label className="block mb-2 font-medium">
                닉네임 <span className="text-red-500">*</span>
            </label>
            {userId && !infoUserNameDataUpdateFlag
            ?<div className="flex gap-2">
            <strong className="flex-1 border rounded px-3 py-2 text-gray-700 text-left">
                {userNameData}
            </strong>
            <button
                onClick={()=>{setInfoUserNameDataUpdateFlag(true)}}
                type="button"
                className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
                수정
            </button>
        </div>
            :<>

            <div className="flex gap-2">
                <input
                    ref={nameFlagRef}
                    value={userNameData??""}
                    onChange={(e) => setUserNameData(e.target.value)}
                    type="text"
                    readOnly={nameFlag}
                    placeholder="닉네임을 입력하세요"
                    className="flex-1 border rounded px-3 py-2"
                />
                <button
                    onClick={nameCheck}
                    type="button"
                    className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                    중복확인
                </button>
            </div>
            <p
            className={`mt-1 text-xs ${
                validateUserName === undefined
                ? 'text-white'
                : validateUserName
                ? 'text-red-500'
                : 'text-green-500'
                }`}
                >
            {validateUserName === undefined
                ? '닉네임을 입력해주세요.'
                : validateUserName
                ? '중복된 닉네임 입니다.'
                : '사용 가능한 닉네임입니다.'}
            </p>
            </>}
        </div>



        {/* 이메일 */}
        <div className="mb-4">
            <label className="block mb-2 font-medium">
                이메일 <span className="text-red-500">*</span>
            </label>
            {userId && !infoUserEmailDataUpdateFlag
            ?<div className="flex gap-2">
            <strong className="flex-1 border rounded px-3 py-2 text-gray-700 text-left">
                {userEmailData}
            </strong>
            <button
                onClick={()=>{setInfoUserEmailDataUpdateFlag(true)}}
                type="button"
                className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
                수정
            </button>
            </div>
            :
            <>
            <input
                ref={emailFlagRef}
                value={userEmailData??""}
                onChange={(e) => setUserEmailData(e.target.value)}
                onBlur={() => setEmailBlurred(true)}
                type="email"
                placeholder="example@email.com"
                className="w-full border rounded px-3 py-2"
            />
            <p className={`mt-1 text-xs ${
                !emailBlurred
                ? 'text-white'
                :validateUserEmail
                    ?' text-red-500'
                    :' text-white'
            }`}>
                이메일 형식이 유효하지 않습니다.
            </p>
            </>}
        </div>

        <button
            type="button"
            onClick={userId? userPwCheckHandler : signupInsert}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
            {userId?"수정 완료":"회원가입"}
            
        </button>
        {/* 회원 정보 수정 모달 */}
        <div 
        className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] ${userInfoUpdateModalIsOpen ? 'block':'hidden' }`}
        >
        <div 
            className="bg-white rounded p-6 w-80"
        >
            <h2 className="text-lg font-bold mb-4">비밀번호 확인</h2>
            <input
                value={userOldPwData??""}
                onChange={(e) => setUserOldPwData(e.target.value)}
                type="password"
                placeholder="변경 전 비밀번호를 입력하세요"
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
        </div>


    </div>
);

}
export default Signup;