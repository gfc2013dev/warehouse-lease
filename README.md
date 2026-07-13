# 광주전남식자재협동조합 물류창고 임대 랜딩페이지

광주·전남 1,400평 직영 물류창고 임대 안내 페이지입니다.
정적(static) 웹페이지로, GitHub + Netlify 로 배포하고 상담 폼은 Google Sheets 로 저장됩니다.

## 파일 구성
- `index.html` — 랜딩페이지 본체 (HTML/CSS/JS 한 파일)
- `gas/Code.gs` — 상담 폼을 Google Sheets 로 저장하는 Google Apps Script 코드
- `netlify.toml` — Netlify 배포 설정

## 상담 폼 → 구글시트 연동 방법
1. 구글 계정으로 [Google Sheets](https://sheets.new) 새 파일 생성 → 이름 지정
2. 주소창 URL 에서 시트 ID 복사
   `https://docs.google.com/spreadsheets/d/【이_부분이_시트ID】/edit`
3. 시트 상단 메뉴 **확장 프로그램 → Apps Script**
4. 편집기 내용을 모두 지우고 `gas/Code.gs` 내용을 붙여넣기
5. `SHEET_ID` 값을 2번에서 복사한 시트 ID 로 교체 → 저장(💾)
6. 우측 상단 **배포 → 새 배포 → 유형: 웹 앱**
   - 실행 계정: **나(본인)**
   - 액세스 권한: **모든 사용자**
   - **배포** 클릭 → 권한 승인 → **웹 앱 URL** 복사
7. `index.html` 의 `const GAS_URL = "..."` 부분에 6번 URL 붙여넣기
8. 변경사항 커밋 → GitHub push → Netlify 자동 재배포

## 배포 (Netlify)
Netlify → Add new site → Import an existing project → GitHub → 이 저장소 선택 → Deploy.
(별도 빌드 설정 불필요 — 정적 사이트)
