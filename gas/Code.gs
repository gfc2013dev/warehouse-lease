// ============================================================
// 광주전남식자재협동조합 물류창고 임대 랜딩페이지
// Google Apps Script 웹앱 — 상담 폼 → Google Sheets 저장 + 이메일 알림
//
// [사용 방법]  (자세한 클릭 순서는 README.md 참고)
// 1. 상담 내용을 받을 Google Sheets 파일을 하나 만든다.
// 2. 그 시트의 URL에서 SHEET_ID 부분을 복사해 아래 SHEET_ID 에 붙여넣는다.
//      예) https://docs.google.com/spreadsheets/d/【이부분이_SHEET_ID】/edit
// 3. 확장 프로그램 → Apps Script 에 이 코드를 붙여넣는다.
// 4. 배포 → 새 배포 → 유형: 웹 앱
//      - 실행 계정: 나(본인)
//      - 액세스 권한: 모든 사용자
//    → 배포 → 웹 앱 URL 복사
// 5. 복사한 URL을 index.html 의 GAS_URL 에 붙여넣는다.
// ============================================================

const SHEET_ID     = 'YOUR_GOOGLE_SHEET_ID'; // ← 여기에 시트 ID 붙여넣기
const SHEET_NAME   = '임대상담';               // 시트 탭 이름 (자동 생성됨)
const NOTIFY_EMAIL = 'gfc2013@naver.com';     // 새 상담 알림 받을 이메일 (비우면 알림 안 감)

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    saveToSheet(data);
    try { sendNotificationEmail(data); } catch (mailErr) { /* 메일 실패해도 저장은 유지 */ }
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function saveToSheet(data) {
  const ss  = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);

  // 시트 탭이 없으면 자동 생성 + 헤더 추가
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['접수시간', '기업명/담당자', '연락처', '취급품목', '요구조건']);
    sheet.getRange(1, 1, 1, 5).setFontWeight('bold').setBackground('#0F3460').setFontColor('#FFFFFF');
    sheet.setFrozenRows(1);
  }

  sheet.appendRow([
    data.timestamp || new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
    data.company || '',
    data.phone   || '',
    data.items   || '',
    data.details || '',
  ]);
}

function sendNotificationEmail(data) {
  if (!NOTIFY_EMAIL) return;
  const subject = `[물류창고 임대문의] ${data.company || ''}`;
  const body = `
새로운 물류창고 임대 상담 신청이 접수되었습니다.

━━━━━━━━━━━━━━━━━━━━━━━━
접수 시간      : ${data.timestamp}
기업명/담당자  : ${data.company}
연락처         : ${data.phone}
취급 품목      : ${data.items}
요구 조건      : ${data.details || '(미입력)'}
━━━━━━━━━━━━━━━━━━━━━━━━

전체 신청 목록:
https://docs.google.com/spreadsheets/d/${SHEET_ID}
  `.trim();

  GmailApp.sendEmail(NOTIFY_EMAIL, subject, body);
}

// 배포 후 브라우저에서 URL 접속 시 정상 작동 확인용
function doGet() {
  return ContentService
    .createTextOutput('물류창고 임대 상담 접수 웹앱 정상 작동 중')
    .setMimeType(ContentService.MimeType.TEXT);
}
