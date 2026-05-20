# 소프트웨어적 사고 기말 프로젝트를 위한 repository입니다.

## 백엔드 연동을 위한 API 명세서
- /api/diaries (POST) : 일기 작성
- /api/diaries (GET) : 일기 가져오기
- /api/diaries/:id (PUT): 일기 수정
- /api/diaries/:id (DELETE): 일기 삭제

## 프론트엔드 localhost 키는법
- 터미널에서 frontend 폴더까지 들어간다 -> npm run dev를 입력한뒤 브라우저(ex: chrome,safari)에서 localhost:5173을 입력해주면 들어가진다
- 만약 들어가지지않는다면 문제는 다음과 같을 수도 있다
    - nodejs 미설치<br>
      ![해결 방법](https://daram-tree.tistory.com/354)
    - npm 모듈 미설치
      frontend 폴더로 터미널로 접근한다음 npm install 명령어를 입력하고 다시 수행하면 된다
