import apiClient from './axiosClient';

// 게시글 페이징 (전체 개수)
export const getPaging = async () => {
    try {
        const response = await apiClient.get('/paging');
        return response.data;
    } catch (error) {
        console.error('페이징 조회 오류:', error);
        throw error;
    }
};

// 게시글 목록 조회 (페이징)
export const getPostList = async (pageWhere, pageNum) => {
    try {
        const response = await apiClient.get('/list', {
            params: {
                pageWhere: pageWhere,
                pageNum: pageNum
            }
        });
        return response.data;
    } catch (error) {
        console.error('게시글 목록 조회 오류:', error);
        throw error;
    }
};

// 게시글 상세 조회
export const getPostDetail = async (postId) => {
    try {
        const response = await apiClient.get('/mysqlSelect', {
            params: { postId: postId }
        });
        return response.data;
    } catch (error) {
        console.error('게시글 상세 조회 오류:', error);
        throw error;
    }
};

// 게시글 작성
export const createPost = async (formData) => {
    try {
        const response = await apiClient.post('/mysqlInsert', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            transformRequest: [
                function () {
                    return formData;
                },
            ],
        });
        return response.data;
    } catch (error) {
        console.error('게시글 작성 오류:', error);
        throw error;
    }
};

// 게시글 수정 (이미지 포함)
export const updatePost = async (formData) => {
    try {
        const response = await apiClient.post('/mysqlUpdate', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            transformRequest: [
                function () {
                    return formData;
                },
            ],
        });
        return response.data;
    } catch (error) {
        console.error('게시글 수정 오류:', error);
        throw error;
    }
};

// 게시글 수정 (이미지 없음)
export const updatePostWithoutImage = async (subject, content, postId) => {
    try {
        const response = await apiClient.post('/mysqlUpdateNotImg', {
            subject: subject,
            content: content,
            postId: postId
        });
        return response.data;
    } catch (error) {
        console.error('게시글 수정 오류:', error);
        throw error;
    }
};

// 게시글 삭제
export const deletePost = async (postId) => {
    try {
        const response = await apiClient.get('/mysqlDelete', {
            params: { postId: postId }
        });
        return response.data;
    } catch (error) {
        console.error('게시글 삭제 오류:', error);
        throw error;
    }
};

// 검색 (전체)
export const searchPosts = async (text) => {
    try {
        const response = await apiClient.get('/mysqlSearch', {
            params: { text: text }
        });
        return response.data;
    } catch (error) {
        console.error('검색 오류:', error);
        throw error;
    }
};

// 검색 페이징 (총 개수)
export const getSearchPaging = async (text) => {
    try {
        const response = await apiClient.get('/mysqlSearchPaging', {
            params: { text: text }
        });
        return response.data;
    } catch (error) {
        console.error('검색 페이징 조회 오류:', error);
        throw error;
    }
};

// 검색 결과 목록 (페이징)
export const getSearchList = async (text, pageWhere, pageNum) => {
    try {
        const response = await apiClient.get('/mysqlSearchList', {
            params: {
                text: text,
                pageWhere: pageWhere,
                pageNum: pageNum
            }
        });
        return response.data;
    } catch (error) {
        console.error('검색 결과 목록 조회 오류:', error);
        throw error;
    }
};

// 마이페이지 게시글 목록
export const getMyPostList = async (userId, pageWhere, pageNum) => {
    try {
        const response = await apiClient.get('/mylist', {
            params: {
                pageWhere: pageWhere,
                pageNum: pageNum,
                userId: userId
            }
        });
        return response.data;
    } catch (error) {
        console.error('마이페이지 게시글 목록 조회 오류:', error);
        throw error;
    }
};

// 마이페이지 페이징 (총 개수)
export const getMyPaging = async (userId) => {
    try {
        const response = await apiClient.get('/mypaging', {
            params: { userId: userId }
        });
        return response.data;
    } catch (error) {
        console.error('마이페이지 페이징 조회 오류:', error);
        throw error;
    }
};
