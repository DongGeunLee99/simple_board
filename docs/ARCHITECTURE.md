# Inviz_simple_board 시스템 아키텍처

## 시스템 구성도 (요약)

```mermaid
flowchart LR
    User[사용자 브라우저]

    subgraph Frontend[React]
        Pages[Pages / Components]
        API[axios API 요청]
    end

    subgraph Backend[FastAPI]
        Main[main.py]
        Image[이미지 API]
        Post[게시판 API]
        User[회원 API]
        Like[즐겨찾기 API]
    end

    DB[(MySQL Database)]

    User --> Pages
    Pages --> API
    API --> Main
    Main --> Image
    Main --> Post
    Main --> User
    Main --> Like
    Image --> DB
    Post --> DB
    User --> DB
    Like --> DB
```

## 시스템 구성도 (상세)

```mermaid
flowchart LR
    User[사용자 브라우저]

    subgraph Frontend[React Frontend]
        Pages[Pages / Components]
        API[axios API]
        subgraph ApiModules[API 모듈]
            PostAPI[post.js]
            UserAPI[user.js]
            LikeAPI[like.js]
            DbAPI[db.js]
        end
    end

    subgraph Backend[FastAPI Backend]
        Main[main.py]
        ImageRouter[image.py]
        PostRouter[post.py]
        UserRouter[user.py]
        LikeRouter[like.py]
    end

    DB[(MySQL Database)]

    User --> Pages
    Pages --> API
    API --> PostAPI
    API --> UserAPI
    API --> LikeAPI
    PostAPI --> Main
    UserAPI --> Main
    LikeAPI --> Main
    Main --> ImageRouter
    Main --> PostRouter
    Main --> UserRouter
    Main --> LikeRouter
    ImageRouter --> DB
    PostRouter --> DB
    UserRouter --> DB
    LikeRouter --> DB
```

## 상세 아키텍처 (계층별)

```mermaid
flowchart TB
    subgraph Client[클라이언트]
        Browser[브라우저]
    end

    subgraph React[React Frontend]
        direction TB
        MainPage[Main.jsx]
        DetailPage[Detail.jsx]
        CreatePage[Create.jsx]
        SearchPage[Search.jsx]
        MyPage[MyPage.jsx]
        LoginPage[Login.jsx]
        SignUpPage[SignUp.jsx]
        UserInfoPage[UserInfoUpdate.jsx]
    end

    subgraph ApiLayer[API Layer]
        postApi[post.js]
        userApi[user.js]
        likeApi[like.js]
        dbClient[db.js]
    end

    subgraph FastAPI[FastAPI Backend]
        main[main.py]
        image[image.py]
        post[post.py]
        user[user.py]
        like[like.py]
        models[models.py]
        db[db.py]
    end

    subgraph Data[데이터]
        MySQL[(MySQL)]
        Static[static/images]
    end

    Browser --> React
    React --> ApiLayer
    ApiLayer --> main
    main --> image
    main --> post
    main --> user
    main --> like
    image --> Static
    post --> db
    user --> db
    like --> db
    db --> MySQL
```

## 백엔드 라우터 역할

| 라우터 | 파일 | 역할 |
|--------|------|------|
| image | image.py | 이미지 업로드/저장, 이미지 URL 제공 |
| post | post.py | 게시글 CRUD, 검색, 페이징, 마이페이지 목록 |
| user | user.py | 로그인, 회원가입, 회원정보 수정, 중복 확인 |
| like | like.py | 좋아요 토글, 좋아요 목록/페이징 |

## 프론트엔드 API 모듈 역할

| 모듈 | 파일 | 역할 |
|------|------|------|
| post | post.js | 게시글·검색·페이징·마이글 목록 관련 요청 |
| user | user.js | 로그인·회원가입·회원정보·비밀번호 확인·중복 확인 |
| like | like.js | 좋아요 토글·확인·목록·페이징 |
| db | db.js | axios 인스턴스(baseURL 등 공통 설정) |
