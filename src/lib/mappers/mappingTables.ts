// 주문 상태 맵핑 정보
export const orderState = [
  { sort: 1, code: 'OS010', value: '주문 완료' },
  { sort: 2, code: 'OS020', value: '결제 완료' },
  { sort: 3, code: 'OS030', value: '배송 준비중' },
  { sort: 4, code: 'OS035', value: '배송중' },
  { sort: 5, code: 'OS040', value: '배송 완료' },
  { sort: 6, code: 'OS110', value: '반품 요청' },
  { sort: 7, code: 'OS120', value: '반품 처리중' },
  { sort: 8, code: 'OS130', value: '반품 완료' },
  { sort: 9, code: 'OS210', value: '교환 요청' },
  { sort: 10, code: 'OS220', value: '교환 처리중' },
  { sort: 11, code: 'OS230', value: '교환 완료' },
  { sort: 12, code: 'OS310', value: '환불 요청' },
  { sort: 13, code: 'OS320', value: '환불 처리중' },
  { sort: 14, code: 'OS330', value: '환불 완료' },
];

// orderState 배열 안에 있는 객체 각각의 code 값만 모아서 유니온 타입으로 정의
// type OrderStateCode = 'OS010' | 'OS020' | 'OS030' | ... 와 동일한 결과
export type OrderStateCode = (typeof orderState)[number]['code'];

// 주문 상태와 맵핑해주는 함수
export function getOrderStatusLabel(code: OrderStateCode): string {
  return orderState.find(s => s.code === code)?.value ?? '알 수 없음';
}

// 무통장입금 계좌 맵핑 정보
export const bankAccounts = [
  {
    은행명: '국민은행',
    계좌번호: '123456-01-234567',
    입금주명: '(주)올라타자',
  },
  {
    은행명: '신한은행',
    계좌번호: '110-234-567890',
    입금주명: '(주)올라타자',
  },
  {
    은행명: '우리은행',
    계좌번호: '1002-345-678901',
    입금주명: '(주)올라타자',
  },
  {
    은행명: '하나은행',
    계좌번호: '620-123456-789',
    입금주명: '(주)올라타자',
  },
  {
    은행명: '농협',
    계좌번호: '301-0123-4567-89',
    입금주명: '(주)올라타자',
  },
  {
    은행명: '카카오뱅크',
    계좌번호: '3333-01-2345678',
    입금주명: '(주)올라타자',
  },
];

// 계좌 정보와 맵핑해주는 함수
export function getAccountByBank(bankName: string) {
  const accountNumber = bankAccounts.find(b => b.은행명 === bankName)?.계좌번호 ?? '계좌 없음';
  const accountOwner = bankAccounts.find(b => b.은행명 === bankName)?.입금주명 ?? '';
  return `${accountNumber}(예금주: ${accountOwner})`;
}
