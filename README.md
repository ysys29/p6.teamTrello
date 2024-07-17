# 🖥️ Team 재밌어요 NodeJs 트렐로 프로젝트 (팀 협업 개발도구 만들기) 

![thumbnail](https://github.com/user-attachments/assets/974904ff-6aa1-4c4e-bcfa-350b3bdb383b)

## 목차 
- 프로젝트 소개 
- 팀원 구성
- 개발 기간
- 개발 환경
- API 명세서 및 ERD 와이어 프레임
- 역할 분담
- 주요 기능 및 설명
- 트러블 슈팅
- 소감

---
## 프로젝트 소개
- 프로젝트 이름 : 트렐로(Trello) 프로젝트 
- 내용 : NestJs를 이용한 팀 협업 개발도구 만들기
- 구분 : 팀 프로젝트
- GitHub : https://github.com/ysys29/p6.teamTrello
- 시연 영상 : 
- 배포 : 
--- 
## 팀원 구성
- 팀장 : 이강산 [@KangSanLee24](https://github.com/KangSanLee24)
- 팀원 : 이연서 [@ysys29](https://github.com/ysys29)
- 팀원 : 이성운 [@SW-64](https://github.com/SW-64)
- 팀원 : 나지윤 [@jiyoon-na](github.com/jiyoon-na)
- 팀원 : 유승엽 [@seungyeopyoo](https://github.com/seungyeopyoo)

##  개발 기간
2024.07.11 ~ 2024.07.17
--- 
##  개발 환경
- 운영체제 : Window/Mac
- FrontEnd : X
- BackEnd : TypeScript, NestJs, MySQL(TypeORM)
- Tool : Visual Studio Code, Insomnia, DBeaver, Swagger
- Publish :
---
## API 명세서 및 ERD 와이어 프레임
- API 명세서 : https://www.notion.so/teamsparta/c16935989d154f318c0b56091822d84f

- ERD : https://www.erdcloud.com/d/NQKHhEdS9LDiMjH2X

- 와이어프레임 : 

##  역할 분담
- **이강산**
  - 인증이메일 발송
  - 회원가입
  - 로그인
  - 내 정보 조회
  - 사용자 검색
  - 내 정보 수정
  - 회원 탈퇴
- **이연서**
  - 초대 기록 조회
  - 초대 상태 변경
  - 보드 초대
  - 리스트 생성
  - 리스트 상세 조회
  - 리스트 이름 수정
  - 리스트 순서 이동
  - 리스트 삭제
- **이성운**
  - 카드 생성
  - 카드 조회
  - 카드 수정
  - 카드 순서 변경
  - 카드 삭제
  - 카드 작업자 할당
  - 카드 작업자 제거
- **나지윤**
  - 댓글 생성
  - 댓글 수정
  - 댓글 삭제
- **유승엽**
  - 보드 생성
  - 보드 목록 검색
  - 보드 상세 조회
  - 보드 수정
  - 보드 삭제
  - 보드 멤버 조회  

## 주요 기능 및 설명
- **1. 인증**
  - 5-1-1 인증이메일 발송
  - https://github.com/ysys29/p6.teamTrello/blob/7990392a796cb7cf8c5b44ae9cf44493e8eef0f0/src/email/email.service.ts#L28-L84
  - 5-1-2 회원가입
  - https://github.com/ysys29/p6.teamTrello/blob/7990392a796cb7cf8c5b44ae9cf44493e8eef0f0/src/auth/auth.service.ts#L25-L78
  - 5-1-3 로그인
  - https://github.com/ysys29/p6.teamTrello/blob/cf4b883f2a7bdfaa41e134ff6e97f6415c9d5c28/src/auth/auth.service.ts#L80-L102
- **2. 유저**
  - 5-2-1 내 정보 조회
  - https://github.com/ysys29/p6.teamTrello/blob/cf4b883f2a7bdfaa41e134ff6e97f6415c9d5c28/src/user/user.service.ts#L17-L46
  - 5-2-2 사용자 검색
  - https://github.com/ysys29/p6.teamTrello/blob/cf4b883f2a7bdfaa41e134ff6e97f6415c9d5c28/src/user/user.service.ts#L48-L55
  - 5-2-3 내 정보 수정
  - https://github.com/ysys29/p6.teamTrello/blob/cf4b883f2a7bdfaa41e134ff6e97f6415c9d5c28/src/user/user.service.ts#L57-L78
  - 5-2-4 회원 탈퇴
  - https://github.com/ysys29/p6.teamTrello/blob/cf4b883f2a7bdfaa41e134ff6e97f6415c9d5c28/src/user/user.service.ts#L80-L91
- **3. 보드**
  - 5-3-1 보드 생성
  - https://github.com/ysys29/p6.teamTrello/blob/cf4b883f2a7bdfaa41e134ff6e97f6415c9d5c28/src/board/board.service.ts#L21-L35
  - 5-3-2 보드 목록 검색
  - https://github.com/ysys29/p6.teamTrello/blob/cf4b883f2a7bdfaa41e134ff6e97f6415c9d5c28/src/board/board.service.ts#L189-L205
  - 5-3-3 보드 상세 조회
  - https://github.com/ysys29/p6.teamTrello/blob/cf4b883f2a7bdfaa41e134ff6e97f6415c9d5c28/src/board/board.service.ts#L37-L82
  - 5-3-4 보드 수정
  - https://github.com/ysys29/p6.teamTrello/blob/cf4b883f2a7bdfaa41e134ff6e97f6415c9d5c28/src/board/board.service.ts#L84-L104
  - 5-3-5 보드 삭제
  - https://github.com/ysys29/p6.teamTrello/blob/cf4b883f2a7bdfaa41e134ff6e97f6415c9d5c28/src/board/board.service.ts#L106-L120
  - 5-3-6 보드 멤버 조회
  - https://github.com/ysys29/p6.teamTrello/blob/cf4b883f2a7bdfaa41e134ff6e97f6415c9d5c28/src/board/board.service.ts#L122-L172
    
- **4. 리스트**
  - 5-4-1 리스트 생성
  - https://github.com/ysys29/p6.teamTrello/blob/cf4b883f2a7bdfaa41e134ff6e97f6415c9d5c28/src/list/list.service.ts#L25-L74
  - 5-4-2 리스트 상세 조회
  - https://github.com/ysys29/p6.teamTrello/blob/cf4b883f2a7bdfaa41e134ff6e97f6415c9d5c28/src/list/list.service.ts#L76-L93
  - 5-4-3 리스트 이름 수정
  - https://github.com/ysys29/p6.teamTrello/blob/cf4b883f2a7bdfaa41e134ff6e97f6415c9d5c28/src/list/list.service.ts#L95-L107
  - 5-4-4 리스트 순서 이동
  - https://github.com/ysys29/p6.teamTrello/blob/cf4b883f2a7bdfaa41e134ff6e97f6415c9d5c28/src/list/list.service.ts#L109-L179
  - 5-4-5 리스트 삭제
  - https://github.com/ysys29/p6.teamTrello/blob/cf4b883f2a7bdfaa41e134ff6e97f6415c9d5c28/src/list/list.service.ts#L181-L218
- **5. 카드**
  - 5-5-1 카드 생성
  - https://github.com/ysys29/p6.teamTrello/blob/cf4b883f2a7bdfaa41e134ff6e97f6415c9d5c28/src/card/card.service.ts#L23-L58
  - 5-5-2 카드 조회
  - https://github.com/ysys29/p6.teamTrello/blob/cf4b883f2a7bdfaa41e134ff6e97f6415c9d5c28/src/card/card.service.ts#L60-L71
  - 5-5-3 카드 수정
  - https://github.com/ysys29/p6.teamTrello/blob/cf4b883f2a7bdfaa41e134ff6e97f6415c9d5c28/src/card/card.service.ts#L73-L95
  - 5-5-4 카드 순서 변경
  - https://github.com/ysys29/p6.teamTrello/blob/cf4b883f2a7bdfaa41e134ff6e97f6415c9d5c28/src/card/card.service.ts#L108-L174
  - 5-5-5 카드 삭제
  - https://github.com/ysys29/p6.teamTrello/blob/cf4b883f2a7bdfaa41e134ff6e97f6415c9d5c28/src/card/card.service.ts#L97-L106
  - 5-5-6 카드 작업자 할당
  - https://github.com/ysys29/p6.teamTrello/blob/cf4b883f2a7bdfaa41e134ff6e97f6415c9d5c28/src/card/card.service.ts#L176-L197
  - 5-5-7 카드 작업자 제거
  - https://github.com/ysys29/p6.teamTrello/blob/cf4b883f2a7bdfaa41e134ff6e97f6415c9d5c28/src/card/card.service.ts#L199-L213
- **6. 댓글**
  - 5-6-1 댓글 생성
  - https://github.com/ysys29/p6.teamTrello/blob/cf4b883f2a7bdfaa41e134ff6e97f6415c9d5c28/src/comment/comment.service.ts#L15-L30
  - 5-6-2 댓글 수정
  - https://github.com/ysys29/p6.teamTrello/blob/cf4b883f2a7bdfaa41e134ff6e97f6415c9d5c28/src/comment/comment.service.ts#L32-L52
  - 5-6-3 댓글 삭제
  - https://github.com/ysys29/p6.teamTrello/blob/cf4b883f2a7bdfaa41e134ff6e97f6415c9d5c28/src/comment/comment.service.ts#L53-L70
- **7. 초대**
  - 5-7-1 초대 기록 조회
  - https://github.com/ysys29/p6.teamTrello/blob/730a0ec1410a3fa100667853274cf7a7dcb6cfb7/src/invitation/invitation.service.ts#L79-L97
  - 5-7-2 초대 상태 변경
  - https://github.com/ysys29/p6.teamTrello/blob/730a0ec1410a3fa100667853274cf7a7dcb6cfb7/src/invitation/invitation.service.ts#L99-L148
  - 5-7-3 보드 초대
  - https://github.com/ysys29/p6.teamTrello/blob/730a0ec1410a3fa100667853274cf7a7dcb6cfb7/src/invitation/invitation.service.ts#L33-L77
## 트러블 슈팅
## 어려웠던 점 및 소감
