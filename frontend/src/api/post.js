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
export const getPostList = async (pageWhere, pageNum, userId) => {
    try {
        const response = await apiClient.get('/list', {
            params: {
                pageWhere: pageWhere,
                pageNum: pageNum,
                userId: userId
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

// 검색 (즐찾)
export const searchLikePosts = async (text, userId, pageWhere, pageNum) => {
    try {
        const response = await apiClient.get('/mysqlSearchLikePost', {
            params: { 
                text: text,
                userId : userId,
                pageWhere: pageWhere,
                pageNum: pageNum
            }
        });
        return response.data;
    } catch (error) {
        console.error('검색 오류:', error);
        throw error;
    }
};
// 검색 (전체)
export const searchMyPosts = async (text, userId, pageWhere, pageNum) => {
    try {
        const response = await apiClient.get('/mysqlSearchMyPost', {
            params: { 
                text: text,
                userId : userId,
                pageWhere: pageWhere,
                pageNum: pageNum
            }
        });
        return response.data;
    } catch (error) {
        console.error('검색 오류:', error);
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

// 다음 게시글
export const nextPost = async (postCreatedAt) => {
    try {
        const response = await apiClient.get('/nextPostSelect', {
            params: { postCreatedAt: postCreatedAt }
        });
        return response.data;
    } catch (error) {
        console.error('게시글 상세 조회 오류:', error);
        throw error;
    }
};

// 이전 게시글
export const prevPost = async (postCreatedAt) => {
    try {
        const response = await apiClient.get('/prevPostSelect', {
            params: { postCreatedAt: postCreatedAt }
        });
        return response.data;
    } catch (error) {
        console.error('게시글 상세 조회 오류:', error);
        throw error;
    }
};

// 나의 다음 게시글
export const nextMyPost = async (postCreatedAt, userId) => {
    try {
        const response = await apiClient.get('/nextMyPostSelect', {
            params: { 
                postCreatedAt: postCreatedAt,
                userId: userId
            }
        });
        return response.data;
    } catch (error) {
        console.error('게시글 상세 조회 오류:', error);
        throw error;
    }
};

// 나의 이전 게시글
export const prevMyPost = async (postCreatedAt, userId) => {
    try {
        const response = await apiClient.get('/prevMyPostSelect', {
            params: { 
                postCreatedAt: postCreatedAt,
                userId: userId
            }
        });
        return response.data;
    } catch (error) {
        console.error('게시글 상세 조회 오류:', error);
        throw error;
    }
};

// 나의 즐겨찾기 다음 게시글
export const nextLikePost = async (postCreatedAt, userId) => {
    try {
        const response = await apiClient.get('/nextLikePostSelect', {
            params: { 
                postCreatedAt: postCreatedAt,
                userId: userId
            }
        });
        return response.data;
    } catch (error) {
        console.error('게시글 상세 조회 오류:', error);
        throw error;
    }
};

// 나의 즐겨찾기 이전 게시글
export const prevLikePost = async (postCreatedAt, userId) => {
    try {
        const response = await apiClient.get('/prevLikePostSelect', {
            params: { 
                postCreatedAt: postCreatedAt,
                userId: userId
            }
        });
        return response.data;
    } catch (error) {
        console.error('게시글 상세 조회 오류:', error);
        throw error;
    }
};
///////////////////////////////////////////////////////////////////////
// 다음 게시글
export const nextSearchPost = async (postCreatedAt, text) => {
    try {
        const response = await apiClient.get('/nextSearchPostSelect', {
            params: {
                postCreatedAt: postCreatedAt,
                text: text
            }
        });
        return response.data;
    } catch (error) {
        console.error('게시글 상세 조회 오류:', error);
        throw error;
    }
};

// 이전 게시글
export const prevSearchPost = async (postCreatedAt, text) => {
    try {
        const response = await apiClient.get('/prevSearchPostSelect', {
            params: {
                postCreatedAt: postCreatedAt,
                text: text
            }
        });
        return response.data;
    } catch (error) {
        console.error('게시글 상세 조회 오류:', error);
        throw error;
    }
};

// 나의 다음 게시글
export const nextSearchMyPost = async (postCreatedAt, userId, text) => {
    try {
        const response = await apiClient.get('/nextSearchMyPostSelect', {
            params: { 
                postCreatedAt: postCreatedAt,
                userId: userId,
                text: text
            }
        });
        return response.data;
    } catch (error) {
        console.error('게시글 상세 조회 오류:', error);
        throw error;
    }
};

// 나의 이전 게시글
export const prevSearchMyPost = async (postCreatedAt, userId, text) => {
    try {
        const response = await apiClient.get('/prevSearchMyPostSelect', {
            params: { 
                postCreatedAt: postCreatedAt,
                userId: userId,
                text: text
            }
        });
        return response.data;
    } catch (error) {
        console.error('게시글 상세 조회 오류:', error);
        throw error;
    }
};

// 나의 즐겨찾기 다음 게시글
export const nextSearchLikePost = async (postCreatedAt, userId, text) => {
    try {
        const response = await apiClient.get('/nextSearchLikePostSelect', {
            params: { 
                postCreatedAt: postCreatedAt,
                userId: userId,
                text: text
            }
        });
        return response.data;
    } catch (error) {
        console.error('게시글 상세 조회 오류:', error);
        throw error;
    }
};

// 나의 즐겨찾기 이전 게시글
export const prevSearchLikePost = async (postCreatedAt, userId, text) => {
    try {
        const response = await apiClient.get('/prevSearchLikePostSelect', {
            params: { 
                postCreatedAt: postCreatedAt,
                userId: userId,
                text: text
            }
        });
        return response.data;
    } catch (error) {
        console.error('게시글 상세 조회 오류:', error);
        throw error;
    }
};