import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

const Slideshow = () => {
    // const slides = [
    //     {
    //         id: 1,
    //         desktopImage: ImgBanner1,
    //         mobileImage: ImgMobileBanner1
    //     },
    //     {
    //         id: 2,
    //         desktopImage: ImgBanner2,
    //         mobileImage: ImgMobileBanner2
    //     },
    //     {
    //         id: 3,
    //         desktopImage: ImgBanner3,
    //         mobileImage: ImgMobileBanner3
    //     },
    //     {
    //         id: 4,
    //         desktopImage: ImgBanner4,
    //         mobileImage: ImgMobileBanner4
    //     }
    // ];

    // return (
    //     <div className="container banner-carousel-container multiple-slides banner-grid-1" style={{ animation: '1s ease 0s 1 normal none running fadeIn' }}>
    //         <div className="carousel slide">
    //             <Swiper
    //                 modules={[Navigation, Pagination, Autoplay]}
    //                 spaceBetween={0}
    //                 slidesPerView={1}
    //                 navigation={{
    //                     nextEl: '.carousel-control-next',
    //                     prevEl: '.carousel-control-prev',
    //                 }}
    //                 pagination={{
    //                     el: '.carousel-indicators',
    //                     clickable: true,
    //                     renderBullet: function (index, className) {
    //                         return '<li class="' + className + '"></li>';
    //                     },
    //                 }}
    //                 autoplay={{
    //                     delay: 5000,
    //                     disableOnInteraction: false,
    //                 }}
    //                 loop={true}
    //                 onSwiper={(swiper) => {
    //                     setTimeout(() => {
    //                         const prevButton = document.querySelector('.carousel-control-prev');
    //                         const nextButton = document.querySelector('.carousel-control-next');
                            
    //                         if (prevButton) {
    //                             prevButton.addEventListener('click', (e) => {
    //                                 e.preventDefault();
    //                                 swiper.slidePrev();
    //                             });
    //                         }
    //                         if (nextButton) {
    //                             nextButton.addEventListener('click', (e) => {
    //                                 e.preventDefault();
    //                                 swiper.slideNext();
    //                             });
    //                         }
    //                     }, 100);
    //                 }}
    //             >
    //                 {slides.map((slide) => (
    //                     <SwiperSlide key={slide.id}>
    //                         <div className="row">
    //                             <a className="centered-banner col-12 no-button" href="#">
    //                                 <div 
    //                                     className="main-background" 
    //                                     style={{ backgroundImage: `url('${slide.desktopImage}')` }}
    //                                 ></div>
    //                                 <div 
    //                                     className="main-background mobile" 
    //                                     style={{ backgroundImage: `url('${slide.mobileImage}')` }}
    //                                 ></div>
    //                                 <div className="action-content"></div>
    //                             </a>
    //                         </div>
    //                     </SwiperSlide>
    //                 ))}
    //             </Swiper>
                
    //             <ol className="carousel-indicators"></ol>
    //             <a className="carousel-control-prev" role="button" href="#">
    //                 <span aria-hidden="true" className="carousel-control-prev-icon"></span>
    //                 <span className="sr-only">Previous</span>
    //             </a>
    //             <a className="carousel-control-next" role="button" href="#">
    //                 <span aria-hidden="true" className="carousel-control-next-icon"></span>
    //                 <span className="sr-only">Next</span>
    //             </a>
    //         </div>
    //     </div>
    // );
}

export default Slideshow;
