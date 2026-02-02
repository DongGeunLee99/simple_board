import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

// axios 인스턴스 생성 (공통 설정)
const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiClient;
