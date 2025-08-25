# 온라인 키보드 타건샵 - HOLATAJA (Forked)

>이 저장소는 멋쟁이사자처럼 프론트엔드 부트캠프 13기에서 진행한 Final Team Project: **HOLATAJA** 를 기반으로 하여,  
>구조 개선 및 코드 정리, 기능 추가를 진행한 Fork 버전입니다.

## 원본 프로젝트

>프로젝트의 상세 소개, 기능, 팀 기여 내용 등의 내용은 하기 링크를 참조해주세요.  
>[원본 README](https://github.com/FRONTENDBOOTCAMP-13th/Final-15-HOLATAJA)

## 개선/변경사항 _(계속 추가될 예정)_
### 2025/08/25
- **폴더 구조 정리**
  - `components`와 `features`를 분리하여 공용 UI 컴포넌트와 도메인 전용 컴포넌트 구분
  - 도메인 전용 컴포넌트(`QuantityCount`, `ReviewCard` 등)를 `features/*/components`로 이동
  - 라우트 전용 컴포넌트는 `_components` 폴더로 통일
  - `data/functions/*`와 `data/actions/*` → `lib/api/*`, `lib/actions/*`로 이동
  - 공용 컴포넌트 폴더 `components` 하위에 `ui`, `layout` 구분 폴더 추가
- **import 규칙 통일**
  - React/Next → Third-party → Alias(@/) → Relative 순서로 정리
  - 타입은 `import type {}` 사용 일관화
- **네이밍 개선**
  - `OrderdCard.tsx` → `OrderCard.tsx` 등 오탈자 수정
  - 스토어 파일명/위치를 도메인 기반으로 변경 (`authStore.ts` → `features/auth/store.ts`)
