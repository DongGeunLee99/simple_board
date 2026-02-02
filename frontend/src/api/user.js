import apiClient from './db';

// 유저 정보 조회
export const getUserInfo = async (userId) => {
    try {
        const response = await apiClient.post('/mysqlUserInfo', {
            userId: userId
        });
        return response.data;
    } catch (error) {
        console.error('유저 정보 조회 오류:', error);
        throw error;
    }
};

// 로그인
export const login = async (userIdData, userPwData) => {
    try {
        const response = await apiClient.post('/login', {
            userIdData: userIdData,
            userPwData: userPwData
        });
        return response.data;
    } catch (error) {
        console.error('로그인 오류:', error);
        throw error;
    }
};

// 회원가입
export const signup = async (data) => {
    try {
        const response = await apiClient.post('/signup', {
            userIdData: data.userIdData,
            userPwData: data.userPwData,
            userBirthdayData: data.userBirthdayData,
            userNameData: data.userNameData,
            userEmailData: data.userEmailData
        });
        return response.data;
    } catch (error) {
        console.error('회원가입 오류:', error);
        throw error;
    }
};

// 회원정보 수정
export const userUpdate = async (data) => {
    try {
        const response = await apiClient.post('/userUpdate', {
            userId: data.userId,
            userPwData: data.userPwData,
            userBirthdayData: data.userBirthdayData,
            userNameData: data.userNameData,
            userEmailData: data.userEmailData
        });
        return response.data;
    } catch (error) {
        console.error('회원정보 수정 오류:', error);
        throw error;
    }
};

// 비밀번호 확인
export const pwCheck = async (userId, userPw) => {
    try {
        const response = await apiClient.post('/mysqlPwCheck', {
            userId: userId,
            userPw: userPw
        });
        return response.data;
    } catch (error) {
        console.error('비밀번호 확인 오류:', error);
        throw error;
    }
};

// 아이디 중복 확인
export const checkUserId = async (userId) => {
    try {
        const response = await apiClient.get('/checkUserId', {
            params: { userId: userId }
        });
        return response.data;
    } catch (error) {
        console.error('아이디 중복 확인 오류:', error);
        throw error;
    }
};

// 닉네임 중복 확인
export const checkUserName = async (userName) => {
    try {
        const response = await apiClient.get('/checkUserName', {
            params: { userName: userName }
        });
        return response.data;
    } catch (error) {
        console.error('닉네임 중복 확인 오류:', error);
        throw error;
    }
};
