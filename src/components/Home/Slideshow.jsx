import { useOutletContext } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './Slideshow.css';

import ImgBanner1 from "/src/assets/img/banner-1.png";
import ImgBanner2 from "/src/assets/img/banner-2.png";
import ImgBanner3 from "/src/assets/img/banner-3.png";
import ImgBanner4 from "/src/assets/img/banner-4.png";
import ImgBanner5 from "/src/assets/img/banner-5.png";
import ImgBanner6 from "/src/assets/img/banner-6.jpg";
import ImgBanner7 from "/src/assets/img/banner-7.png";
import ImgMobileBanner1 from "/src/assets/img/banner-1-mob.jpeg";
import ImgMobileBanner2 from "/src/assets/img/banner-2-mob.jpeg";
import ImgMobileBanner3 from "/src/assets/img/banner-3-mob.jpeg";
import ImgMobileBanner4 from "/src/assets/img/banner-4-mob.jpeg";


const Slideshow = () => {
  const { isMobile } = useOutletContext();
  const slides = isMobile ? [
    { id: 0, image: ImgMobileBanner1 },
    { id: 1, image: ImgMobileBanner2 },
    { id: 2, image: ImgMobileBanner3 },
    { id: 3, image: ImgMobileBanner4 }
  ] : [
    { id: 0, image: ImgBanner1 },
    { id: 1, image: ImgBanner2 },
    { id: 2, image: ImgBanner3 },
    { id: 3, image: ImgBanner4 },
    { id: 4, image: ImgBanner5 },
    { id: 5, image: ImgBanner6 },
    { id: 6, image: ImgBanner7 }
  ];

  return (
    <div className="home_slider">
      {/* Swiper Container */}
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          el: '.swiper-pagination',
          clickable: true,
        }}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        className="banners-swiper"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <img
              src={slide.image}
              alt={`Banner ${slide.id + 1}`}
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                objectFit: 'cover',
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Pagination Dots (below slider) */}
      <div className="swiper-pagination"></div>
    </div>
  );
};

export default Slideshow;