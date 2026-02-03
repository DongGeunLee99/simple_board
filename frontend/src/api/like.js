import apiClient from './axiosClient';

// 좋아요 토글
export const toggleLike = async (userId, postId) => {
    try {
        const response = await apiClient.get('/postgood', {
            params: {
                userId: userId,
                postId: postId
            }
        });
        return response.data;
    } catch (error) {
        console.error('좋아요 토글 오류:', error);
        throw error;
    }
};

// 좋아요 확인
export const checkLike = async (userId, postId) => {
    try {
        const response = await apiClient.get('/postgoodcheck', {
            params: {
                userId: userId,
                postId: postId
            }
        });
        return response.data;
    } catch (error) {
        console.error('좋아요 확인 오류:', error);
        throw error;
    }
};

// 좋아요 게시글 목록
export const getLikePostList = async (userId, pageWhere, pageNum) => {
    try {
        const response = await apiClient.get('/postgoodlist', {
            params: {
                pageWhere: pageWhere,
                pageNum: pageNum,
                userId: userId
            }
        });
        return response.data;
    } catch (error) {
        console.error('좋아요 게시글 목록 조회 오류:', error);
        throw error;
    }
};

// 좋아요 게시글 페이징 (총 개수)
export const getLikePaging = async (userId) => {
    try {
        const response = await apiClient.get('/postgoodpaging', {
            params: { userId: userId }
        });
        return response.data;
    } catch (error) {
        console.error('좋아요 페이징 조회 오류:', error);
        throw error;
    }
};
