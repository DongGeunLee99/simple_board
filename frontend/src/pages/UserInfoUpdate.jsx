import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { getUserInfo } from '../api/user';


export const UserInfoUpdate = () => {
    // const { userId } = useParams()
    const userId = localStorage.getItem('key')

    console.log(userId)
    useEffect(() => {
        console.log(userId)
        getUserInfo(userId)
            .then((res) => {
                console.log(res)
            })
            .catch((err) => {
                console.error(err)
            });
    },[userId]);

    return (
        <div className="max-w-md mx-auto p-6 mt-20 border rounded">
            <h1 className="text-2xl font-bold mb-6 text-center">
                회원정보 수정
            </h1>
    
            {/* 비밀번호 */}
            <div className="mb-4">
                <label className="block mb-2 font-medium">
                    비밀번호
                </label>
                <input
                    type="password"
                    placeholder="새 비밀번호를 입력하세요"
                    className="w-full border rounded px-3 py-2"
                />
                <p className="mt-1 text-xs text-gray-500">
                    영문·숫자 8자 이상, 특수문자를 포함해야 합니다.
                </p>
            </div>
    
            {/* 비밀번호 확인 */}
            <div className="mb-4">
                <label className="block mb-2 font-medium">
                    비밀번호 확인
                </label>
                <input
                    type="password"
                    placeholder="비밀번호를 다시 입력하세요"
                    className="w-full border rounded px-3 py-2"
                />
            </div>
    
            {/* 닉네임 */}
            <div className="mb-4">
                <label className="block mb-2 font-medium">
                    닉네임
                </label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="닉네임을 입력하세요"
                        className="flex-1 border rounded px-3 py-2"
                    />
                    <button
                        type="button"
                        className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                        중복확인
                    </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                    닉네임은 다른 사용자에게 표시됩니다.
                </p>
            </div>
    
            {/* 이메일 */}
            <div className="mb-6">
                <label className="block mb-2 font-medium">
                    이메일
                </label>
                <input
                    type="email"
                    placeholder="example@email.com"
                    className="w-full border rounded px-3 py-2"
                />
            </div>
    
            {/* 수정 버튼 */}
            <button
                type="button"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                정보 수정
            </button>
        </div>
    );
    
}
