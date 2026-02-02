import React, { useState, useEffect, useContext} from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { login as loginApi } from '../api/user';

export const Login = () => {
    const [userIdData, setUserIdData] = useState("");
    const [userPwData, setUserPwData] = useState("");


    const navigate = useNavigate()

    const loginCheck = () => {
        loginApi(userIdData, userPwData)
            .then((res) => {
                if (res && res.user){
                    localStorage.setItem("key", res.user[0]);
                    navigate('/')
                }
            })
            .catch((err) => {
                console.error(err)
                alert("아이디, 비밀번호를 다시 확인해주세요")
            });
    }

    return (
            <div className="max-w-md mx-auto p-6 mt-20 border rounded">
                <h1 className="text-2xl font-bold mb-6 text-center">
                    로그인
                </h1>
        
                <div className="mb-4">
                    <label className="block mb-2 font-medium">
                        아이디
                    </label>
                    <input
                        value={userIdData??""}
                        onChange={(e) => setUserIdData(e.target.value)}
                        type="text"
                        placeholder="아이디를 입력하세요"
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
        
                <div className="mb-6">
                    <label className="block mb-2 font-medium">
                        비밀번호
                    </label>
                    <input
                        value={userPwData??""}
                        onChange={(e) => setUserPwData(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                loginCheck()
                            }
                        }}
                        type="password"
                        placeholder="비밀번호를 입력하세요"
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
        
                <button
                    onClick={loginCheck}
                    type="button"
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    로그인
                </button>
        
                <div className="flex justify-center mt-4 text-sm">
                    <span className="mr-2">계정이 없으신가요?</span>
                    <Link to="/signup">
                    <span className="text-blue-600 cursor-pointer">
                        회원가입
                    </span>
                    </Link>
                </div>
            </div>
    );
    
}
export default Login;