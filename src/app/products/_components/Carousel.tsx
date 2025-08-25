'use client';
import Image from 'next/image';
import Link from 'next/link';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const slideData = [
  {
    src: '/carousel_images/carousel-image1.webp',
    position: 'justify-end items-end', // 우하
    title: 'KICK75',
    switch: '',
    description: 'Craft Your Perfect Keyboard',
    link: '/products/18',
    buttonStyle: 'bg-black text-background',
  },
  {
    src: '/carousel_images/carousel-image2.webp',
    position: 'justify-center items-center', // 중앙
    title: 'AIR96 V2',
    switch: '청축',
    description: 'Craft Your Perfect Keyboard',
    link: '/products/7',
    buttonStyle: 'bg-background text-black',
  },
  {
    src: '/carousel_images/carousel-image3.webp',
    position: 'justify-start items-end', // 우상
    title: 'AIR75 V2',
    switch: '적축',
    description: 'Craft Your Perfect Keyboard',
    link: '/products/6',
    buttonStyle: 'bg-black text-background',
  },
  {
    src: '/carousel_images/carousel-image4.webp',
    position: 'justify-center items-start', // 좌중
    title: 'BH65 FULL ALUMINUM',
    switch: 'Jade PRO',
    description: 'Craft Your Perfect Keyboard',
    link: '/products/11',
    buttonStyle: 'bg-background text-black',
  },
  // {
  //   src: '/carousel_images/carousel-image5.webp',
  //   position: 'justify-center items-center', // 중앙
  //   title: 'Halo65 HE',
  //   switch: '',
  //   description: 'Craft Your Perfect Keyboard',
  //   link: '/',
  //   buttonStyle: 'bg-black text-background',
  // },
  // {
  //   src: '/carousel_images/carousel-image6.webp',
  //   position: 'justify-end items-start', // 좌하
  //   title: 'AIR75 HE',
  //   switch: '',
  //   description: 'Craft Your Perfect Keyboard',
  //   link: '/',
  //   buttonStyle: 'bg-background text-black',
  // },
  {
    src: '/carousel_images/carousel-image10.webp',
    position: 'justify-center items-center', // 중앙
    title: 'Halo75 V2',
    switch: '레몬축',
    description: 'Craft Your Perfect Keyboard',
    link: '/products/14',
    buttonStyle: 'bg-black text-background',
  },
  {
    src: '/carousel_images/carousel-image12.webp',
    position: 'justify-center items-end', // 우중
    title: 'AIR60 V2',
    switch: '갈축',
    description: 'Craft Your Perfect Keyboard',
    link: '/products/2',
    buttonStyle: 'bg-black text-background',
  },
  {
    src: '/carousel_images/carousel-image8.webp',
    position: 'justify-center items-center', // 중앙
    title: 'Field75 HE',
    switch: 'Magnetic Jade',
    description: 'Craft Your Perfect Keyboard',
    link: '/products/12',
    buttonStyle: 'bg-background text-black',
  },
];

export default function Carousel() {
  return (
    <div className="swiper w-full h-full relative">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
      >
        {slideData.map((slide, i) => (
          <SwiperSlide key={i}>
            <div className="relative w-full h-[20rem] sm:h-[25rem] md:h-[30rem] ">
              <Image
                src={slide.src}
                alt={slide.title}
                className="w-full h-full object-cover object-center rounded-xl"
                fill
                sizes="(min-width: 1280px) 1280px, (min-width: 768px) 768px, 100vw"
                priority
                quality={100}
              />
              <div className="absolute inset-0 bg-black/25 rounded-xl">
                <div className="absolute inset-0 flex justify-center items-center px-6">
                  <div
                    className={`flex flex-col text-white font-bold z-10 max-w-5xl w-full
                                ${slide.position}`}
                  >
                    <p className="sr-only">Hero section title</p>
                    <div className="flex flex-row items-baseline gap-1">
                      <p className="title text-background text-4xl">{slide.title}</p>
                      <p className="title text-background text-lg">{slide.switch}</p>
                    </div>
                    <p className="contents text-background">{slide.description}</p>
                    <Link className={`${slide.buttonStyle} px-4 py-2 md:px-8 md:py-3 mt-5 rounded cursor-pointer w-fit`} href={slide.link}>
                      상세 페이지로 이동
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
