export default function Footer() {
  return (
    <footer className="w-full p-4 mx-auto text-sm bg-white label-s text-secondary sm:p-6">
      <div className="items-center justify-center sm:flex sm:flex-col">
        <p className="text-center">
          @2025 LikeLion FrontEnd Bootcamp 13th Hola TAJA!
          <br className="sm:hidden" /> All rights reserved.
        </p>
        <p className="px-2 mb-1 text-center break-all sm:px-4">
          ※ 본 사이트는 학습 목적으로 만들어진 쇼핑몰로,
          <br className="sm:hidden" /> 실제 결제 및 배송이 이루어지지 않습니다.
        </p>
        <p className="px-2 text-center text-darkgray sm:px-4">※ Special Thanks to 엔인원 (Official NuPhy Distributor in Korea) & NuPhy</p>
      </div>
    </footer>
  );
}
