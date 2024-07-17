# 🖥️ Team 재밌어요 NodeJs 트렐로 프로젝트 (팀 협업 개발도구 만들기) 

![thumbnail](https://github.com/user-attachments/assets/974904ff-6aa1-4c4e-bcfa-350b3bdb383b)

## 목차 
- 프로젝트 소개 
- 팀원 구성
- 개발 기간
- 개발 환경
- API 명세서 및 ERD 와이어 프레임
- 파일 구조
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
- API 명세서 
![image](https://github.com/user-attachments/assets/e5ebabd4-19b2-40d4-9216-96a8dc7443c4)


- ERD 
![image](https://github.com/user-attachments/assets/2d82a2de-05c7-4347-a784-27b0816d8a5f)

- 와이어프레임 
![와이어프레임 PNG](https://github.com/user-attachments/assets/afc65fcc-3df3-4467-95f8-eff0519977b4)
---
### 폴더 구조

```markdown
📦src
 ┣ 📂auth
 ┃ ┣ 📂dtos
 ┃ ┃ ┣ 📜sign-in.dto.ts
 ┃ ┃ ┗ 📜sign-up.dto.ts
 ┃ ┣ 📂interfaces
 ┃ ┃ ┗ 📜jwt-payload.interface.ts
 ┃ ┣ 📂strategies
 ┃ ┃ ┣ 📜jwt.strategy.ts
 ┃ ┃ ┗ 📜local.strategy.ts
 ┃ ┣ 📜auth.controller.spec.ts
 ┃ ┣ 📜auth.controller.ts
 ┃ ┣ 📜auth.module.ts
 ┃ ┣ 📜auth.service.spec.ts
 ┃ ┗ 📜auth.service.ts
 ┣ 📂board
 ┃ ┣ 📂dtos
 ┃ ┃ ┣ 📜create-board.dto.ts
 ┃ ┃ ┗ 📜update-board.dto.ts
 ┃ ┣ 📂entities
 ┃ ┃ ┣ 📜board-member.entity.ts
 ┃ ┃ ┗ 📜board.entity.ts
 ┃ ┣ 📜board.controller.spec.ts
 ┃ ┣ 📜board.controller.ts
 ┃ ┣ 📜board.module.ts
 ┃ ┣ 📜board.service.spec.ts
 ┃ ┗ 📜board.service.ts
 ┣ 📂card
 ┃ ┣ 📂dto
 ┃ ┃ ┣ 📜create-card-member.dto.ts
 ┃ ┃ ┣ 📜create-card.dto.ts
 ┃ ┃ ┣ 📜reorder-card.dto.ts
 ┃ ┃ ┣ 📜search-card-member.dto.ts
 ┃ ┃ ┣ 📜search-card.dto.ts
 ┃ ┃ ┗ 📜update-card.dto.ts
 ┃ ┣ 📂dummies
 ┃ ┃ ┗ 📜cards.dummy.ts
 ┃ ┣ 📂entities
 ┃ ┃ ┣ 📜card-member.entity.ts
 ┃ ┃ ┗ 📜card.entity.ts
 ┃ ┣ 📜card.controller.spec.ts
 ┃ ┣ 📜card.controller.ts
 ┃ ┣ 📜card.module.ts
 ┃ ┣ 📜card.service.spec.ts
 ┃ ┗ 📜card.service.ts
 ┣ 📂comment
 ┃ ┣ 📂dto
 ┃ ┃ ┣ 📜create-comment.dto.ts
 ┃ ┃ ┣ 📜search-comment.dto.ts
 ┃ ┃ ┗ 📜update-comment.dto.ts
 ┃ ┣ 📂entities
 ┃ ┃ ┗ 📜comment.entity.ts
 ┃ ┣ 📜comment.controller.spec.ts
 ┃ ┣ 📜comment.controller.ts
 ┃ ┣ 📜comment.module.ts
 ┃ ┣ 📜comment.service.spec.ts
 ┃ ┗ 📜comment.service.ts
 ┣ 📂configs
 ┃ ┣ 📜database.config.ts
 ┃ ┗ 📜env-validation.config.ts
 ┣ 📂email
 ┃ ┣ 📂dtos
 ┃ ┃ ┣ 📜is-valid-email.dto.ts
 ┃ ┃ ┣ 📜save-email.dto.ts
 ┃ ┃ ┗ 📜send-email.dto.ts
 ┃ ┣ 📂entities
 ┃ ┃ ┗ 📜email.entity.ts
 ┃ ┣ 📜email.controller.spec.ts
 ┃ ┣ 📜email.controller.ts
 ┃ ┣ 📜email.module.ts
 ┃ ┣ 📜email.service.spec.ts
 ┃ ┗ 📜email.service.ts
 ┣ 📂invitation
 ┃ ┣ 📂dtos
 ┃ ┃ ┣ 📜invitation-id.dto.ts
 ┃ ┃ ┣ 📜send-invitation.dto.ts
 ┃ ┃ ┗ 📜update-invitation-status.dto.ts
 ┃ ┣ 📂entities
 ┃ ┃ ┗ 📜invitation.entity.ts
 ┃ ┣ 📂types
 ┃ ┃ ┗ 📜invitation-status.type.ts
 ┃ ┣ 📜invitation.controller.spec.ts
 ┃ ┣ 📜invitation.controller.ts
 ┃ ┣ 📜invitation.module.ts
 ┃ ┣ 📜invitation.service.spec.ts
 ┃ ┗ 📜invitation.service.ts
 ┣ 📂list
 ┃ ┣ 📂dtos
 ┃ ┃ ┣ 📜create-list.dto.ts
 ┃ ┃ ┣ 📜list-id.dto.ts
 ┃ ┃ ┣ 📜reorder-list.dto.ts
 ┃ ┃ ┗ 📜update-list.dto.ts
 ┃ ┣ 📂dummies
 ┃ ┃ ┗ 📜lists.dummy.ts
 ┃ ┣ 📂entities
 ┃ ┃ ┗ 📜list.entity.ts
 ┃ ┣ 📂types
 ┃ ┃ ┗ 📜validate-list-access.type.ts
 ┃ ┣ 📜list.controller.spec.ts
 ┃ ┣ 📜list.controller.ts
 ┃ ┣ 📜list.module.ts
 ┃ ┣ 📜list.service.spec.ts
 ┃ ┗ 📜list.service.ts
 ┣ 📂user
 ┃ ┣ 📂dtos
 ┃ ┃ ┣ 📜search-user.dto.ts
 ┃ ┃ ┗ 📜update-user.dto.ts
 ┃ ┣ 📂entities
 ┃ ┃ ┗ 📜user.entity.ts
 ┃ ┣ 📜user.controller.spec.ts
 ┃ ┣ 📜user.controller.ts
 ┃ ┣ 📜user.module.ts
 ┃ ┣ 📜user.service.spec.ts
 ┃ ┗ 📜user.service.ts
 ┣ 📜app.controller.ts
 ┣ 📜app.module.ts
 ┗ 📜main.ts
 📦test
 ┣ 📜app.e2e-spec.ts
 ┗ 📜jest-e2e.json
```
---

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
    ![인증이메일보내기](https://github.com/user-attachments/assets/eea9f85f-d43b-4d71-81ce-50d3470bf08b)
    ![이메일도착사진](https://github.com/user-attachments/assets/20218b73-7a1f-4510-aa35-a0de34c6d36d)
  - 5-1-2 회원가입
  - https://github.com/ysys29/p6.teamTrello/blob/7990392a796cb7cf8c5b44ae9cf44493e8eef0f0/src/auth/auth.service.ts#L25-L78
   ![회원가입](https://github.com/user-attachments/assets/4e9d77a4-c77c-4f89-a6ea-4ebf72c34ab2)
  - 5-1-3 로그인
  - https://github.com/ysys29/p6.teamTrello/blob/cf4b883f2a7bdfaa41e134ff6e97f6415c9d5c28/src/auth/auth.service.ts#L80-L102
    ![로그인](https://github.com/user-attachments/assets/228a2789-2bbb-42cc-96a0-a9b2e27b71e9)
- **2. 유저**
  - 5-2-1 내 정보 조회
  - https://github.com/ysys29/p6.teamTrello/blob/cf4b883f2a7bdfaa41e134ff6e97f6415c9d5c28/src/user/user.service.ts#L17-L46
    ![내정보조회](https://github.com/user-attachments/assets/be42d634-5b62-4b6f-9814-3e7c18219bbb)
  - 5-2-2 사용자 검색
  - https://github.com/ysys29/p6.teamTrello/blob/cf4b883f2a7bdfaa41e134ff6e97f6415c9d5c28/src/user/user.service.ts#L48-L55
    ![사용자조회](https://github.com/user-attachments/assets/e78692d6-4364-4aad-9ea7-55efc6e14a18)
  - 5-2-3 내 정보 수정
  - https://github.com/ysys29/p6.teamTrello/blob/cf4b883f2a7bdfaa41e134ff6e97f6415c9d5c28/src/user/user.service.ts#L57-L78
    ![내정보수정](https://github.com/user-attachments/assets/6b044231-85ef-45d3-ae66-ae77b4ce81c5)
  - 5-2-4 회원 탈퇴
  - https://github.com/ysys29/p6.teamTrello/blob/cf4b883f2a7bdfaa41e134ff6e97f6415c9d5c28/src/user/user.service.ts#L80-L91
    ![내정보삭제](https://github.com/user-attachments/assets/23a17a65-3343-425f-8389-89c3d32ffa78)
- **3. 보드**
  - 5-3-1 보드 생성
  - https://github.com/ysys29/p6.teamTrello/blob/cf4b883f2a7bdfaa41e134ff6e97f6415c9d5c28/src/board/board.service.ts#L21-L35
    ![보드생성](https://github.com/user-attachments/assets/944cfd15-09ae-4d17-b269-202e6d63dc9f)
  - 5-3-2 보드 목록 검색
  - https://github.com/ysys29/p6.teamTrello/blob/cf4b883f2a7bdfaa41e134ff6e97f6415c9d5c28/src/board/board.service.ts#L189-L205
    ![보드검색](https://github.com/user-attachments/assets/5b98a850-9d54-4f40-bb0d-d3cd73e5453a)
  - 5-3-3 보드 상세 조회
  - https://github.com/ysys29/p6.teamTrello/blob/cf4b883f2a7bdfaa41e134ff6e97f6415c9d5c28/src/board/board.service.ts#L37-L82
    ![보드상세조회](https://github.com/user-attachments/assets/ddf11658-35ac-4003-b574-f66cc3bbb69e)
  - 5-3-4 보드 수정
  - https://github.com/ysys29/p6.teamTrello/blob/cf4b883f2a7bdfaa41e134ff6e97f6415c9d5c28/src/board/board.service.ts#L84-L104
    ![보드수정](https://github.com/user-attachments/assets/739f4e94-40be-4e95-aeb9-6b94648c4d76)
  - 5-3-5 보드 삭제
  - https://github.com/ysys29/p6.teamTrello/blob/cf4b883f2a7bdfaa41e134ff6e97f6415c9d5c28/src/board/board.service.ts#L106-L120
    ![보드삭제](https://github.com/user-attachments/assets/f7d1a9c0-8957-49bf-8e34-00083c72ac04)
  - 5-3-6 보드 멤버 조회
  - https://github.com/ysys29/p6.teamTrello/blob/cf4b883f2a7bdfaa41e134ff6e97f6415c9d5c28/src/board/board.service.ts#L122-L172
    ![보드멤버조회](https://github.com/user-attachments/assets/9ff96f6a-76ec-4e5c-a67d-135544609a9a)
    
- **4. 리스트**
  - 5-4-1 리스트 생성
  - https://github.com/ysys29/p6.teamTrello/blob/cf4b883f2a7bdfaa41e134ff6e97f6415c9d5c28/src/list/list.service.ts#L25-L74
   ![리스트생성](https://github.com/user-attachments/assets/6bc75df3-61b4-4c66-9836-fcbe07cad3d7)
  - 5-4-2 리스트 상세 조회
  - https://github.com/ysys29/p6.teamTrello/blob/cf4b883f2a7bdfaa41e134ff6e97f6415c9d5c28/src/list/list.service.ts#L76-L93
    ![리스트상세조회](https://github.com/user-attachments/assets/53e8df28-f24e-4113-ac9c-53fad6016d86)
  - 5-4-3 리스트 이름 수정
  - https://github.com/ysys29/p6.teamTrello/blob/cf4b883f2a7bdfaa41e134ff6e97f6415c9d5c28/src/list/list.service.ts#L95-L107
   ![리스트이름수정](https://github.com/user-attachments/assets/51a86544-3a7d-4b88-a96f-8371c350065d)
  - 5-4-4 리스트 순서 이동
  - https://github.com/ysys29/p6.teamTrello/blob/cf4b883f2a7bdfaa41e134ff6e97f6415c9d5c28/src/list/list.service.ts#L109-L179
    ![리스트순서이동](https://github.com/user-attachments/assets/ca1351c1-8ed0-4e00-afc8-9b8c19cc78aa)
  - 5-4-5 리스트 삭제
  - https://github.com/ysys29/p6.teamTrello/blob/cf4b883f2a7bdfaa41e134ff6e97f6415c9d5c28/src/list/list.service.ts#L181-L218
    ![리스트삭제](https://github.com/user-attachments/assets/57226c35-731f-4504-9f02-2dcf2e3140f7)
- **5. 카드**
  - 5-5-1 카드 생성
  - https://github.com/ysys29/p6.teamTrello/blob/cf4b883f2a7bdfaa41e134ff6e97f6415c9d5c28/src/card/card.service.ts#L23-L58
    ![카드생성](https://github.com/user-attachments/assets/8c1c753b-6878-4723-8dc8-b8c23fba989e)
  - 5-5-2 카드 조회
  - https://github.com/ysys29/p6.teamTrello/blob/cf4b883f2a7bdfaa41e134ff6e97f6415c9d5c28/src/card/card.service.ts#L60-L71
    ![카드상세조회](https://github.com/user-attachments/assets/10da11cb-5261-466b-a041-5f97d66552d3)
  - 5-5-3 카드 수정
  - https://github.com/ysys29/p6.teamTrello/blob/cf4b883f2a7bdfaa41e134ff6e97f6415c9d5c28/src/card/card.service.ts#L73-L95
    ![카드수정](https://github.com/user-attachments/assets/a93978de-6434-43ae-aa0f-a08f0bd5c0a0)
  - 5-5-4 카드 순서 변경
  - https://github.com/ysys29/p6.teamTrello/blob/cf4b883f2a7bdfaa41e134ff6e97f6415c9d5c28/src/card/card.service.ts#L108-L174
    ![카순변](https://github.com/user-attachments/assets/912ded06-c1a2-4af7-957a-3bed77531323)
  - 5-5-5 카드 삭제
  - https://github.com/ysys29/p6.teamTrello/blob/cf4b883f2a7bdfaa41e134ff6e97f6415c9d5c28/src/card/card.service.ts#L97-L106
    ![카드삭제](https://github.com/user-attachments/assets/7f000534-f519-4e6b-b0a9-53d8b5c83f88)
  - 5-5-6 카드 작업자 할당
  - https://github.com/ysys29/p6.teamTrello/blob/cf4b883f2a7bdfaa41e134ff6e97f6415c9d5c28/src/card/card.service.ts#L176-L197
    ![카드작업자할당](https://github.com/user-attachments/assets/8c5aa5aa-eb7d-4c33-a1ac-7a502e9d308c)
  - 5-5-7 카드 작업자 제거
  - https://github.com/ysys29/p6.teamTrello/blob/cf4b883f2a7bdfaa41e134ff6e97f6415c9d5c28/src/card/card.service.ts#L199-L213
    ![카드작업자삭제](https://github.com/user-attachments/assets/f330d0d8-2a26-4b4c-a604-2d43447467be)
- **6. 댓글**
  - 5-6-1 댓글 생성
  - https://github.com/ysys29/p6.teamTrello/blob/cf4b883f2a7bdfaa41e134ff6e97f6415c9d5c28/src/comment/comment.service.ts#L15-L30
    ![댓글생성](https://github.com/user-attachments/assets/11d73cc8-e33b-486a-95e1-574ea683995f)
  - 5-6-2 댓글 수정
  - https://github.com/ysys29/p6.teamTrello/blob/cf4b883f2a7bdfaa41e134ff6e97f6415c9d5c28/src/comment/comment.service.ts#L32-L52
    ![댓글수정](https://github.com/user-attachments/assets/2e58efbb-6e41-45b9-b3e8-ea8063bd960f)
  - 5-6-3 댓글 삭제
  - https://github.com/ysys29/p6.teamTrello/blob/cf4b883f2a7bdfaa41e134ff6e97f6415c9d5c28/src/comment/comment.service.ts#L53-L70
    ![댓글삭제](https://github.com/user-attachments/assets/800d61c5-2b5a-4199-8653-07c2f0e73913)
- **7. 초대**
  - 5-7-1 초대 기록 조회
  - https://github.com/ysys29/p6.teamTrello/blob/730a0ec1410a3fa100667853274cf7a7dcb6cfb7/src/invitation/invitation.service.ts#L79-L97
    ![내가받은초대목록조회](https://github.com/user-attachments/assets/f8e4ab23-bedc-4d09-a841-2c52a317da08)
  - 5-7-2 초대 상태 변경
  - https://github.com/ysys29/p6.teamTrello/blob/730a0ec1410a3fa100667853274cf7a7dcb6cfb7/src/invitation/invitation.service.ts#L99-L148
    ![초대상태변경](https://github.com/user-attachments/assets/ec6db308-9987-4f0f-b57d-ff17365de416)
  - 5-7-3 보드 초대
  - https://github.com/ysys29/p6.teamTrello/blob/730a0ec1410a3fa100667853274cf7a7dcb6cfb7/src/invitation/invitation.service.ts#L33-L77
    ![보드초대보내기](https://github.com/user-attachments/assets/9174391b-6e2d-4583-843a-7e7e8695cd25)
## 트러블 슈팅
## 어려웠던 점 및 소감
