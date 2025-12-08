import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import ImgBanner1 from "/src/assets/img/banner1.png";
import ImgBanner2 from "/src/assets/img/banner2.png";
import ImgBanner3 from "/src/assets/img/banner3.jpg";
import ImgBanner4 from "/src/assets/img/banner4.jpg";
import ImgBanner5 from "/src/assets/img/banner5.jpg";
import ImgBanner6 from "/src/assets/img/banner6.jpg";
import ImgBanner7 from "/src/assets/img/banner7.jpg";
import ImgBanner8 from "/src/assets/img/banner8.jpg";
import ImgBanner9 from "/src/assets/img/banner9.jpg";
import ImgBanner10 from "/src/assets/img/banner10.png";
import ImgBanner11 from "/src/assets/img/banner11.jpg";
import ImgBanner12 from "/src/assets/img/banner12.jpg";

const Slideshow = () => {
  const slides = [
    {
      image: ImgBanner1,
      title: "Bono del 100 % por su primer depósito",
      text: "Realice un depósito en las tres horas siguientes al registro y aumente su bono del 100 % al 150 %.",
      link: "",
      buttonText: "Obtener ahora",
    },
    {
      image: ImgBanner2,
      title: "BONO VIP DEL 100 % POR SU PRIMER DEPÓSITO",
      text: "¡Y recibirá un bono extra que se ingresará en su cuenta de bonos!",
      link: "",
      buttonText: "Obtener ahora",
    },
    {
      image: ImgBanner3,
      title: "Bono de hasta el 125 % por su segundo depósito",
      text: "¡También obtendrá hasta 125 giros gratis sin requisito de apuesta!",
      link: "",
      buttonText: "Obtener ahora",
    },
    {
      image: ImgBanner4,
      title: "Bono de hasta el 150 % por su tercer depósito",
      text: "¡También obtendrá hasta 150 giros gratis sin requisito de apuesta!",
      link: "",
      buttonText: "Obtener ahora",
    },
    {
      image: ImgBanner5,
      title: "Bono de hasta el 175 % por su cuarto depósito",
      text: "¡También obtendrá hasta 175 giros gratis sin requisito de apuesta!",
      link: "",
      buttonText: "Obtener ahora",
    },
    {
      image: ImgBanner6,
      title: "Lunes de Suerte",
      text: "¡Reciba el 100 % de su depósito en su cuenta de bonos!",
      link: "",
      buttonText: "Obtener ahora",
    },
    {
      image: ImgBanner7,
      title: "¿Está buscando códigos promocionales?",
      text: "¡Todos los martes regalamos premios garantizados!",
      link: "",
      buttonText: "Obtener ahora",
    },
    {
      image: ImgBanner8,
      title: "BONO DEL MIÉRCOLES DE HASTA 250 FS",
      text: "¡Que el miércoles resplandezca de ganancias!",
      link: "",
      buttonText: "Obtener ahora",
    },
    {
      image: ImgBanner9,
      title: "Bono por depósito del 100 % los sábados",
      text: "¡Pase el fin de semana con estilo!",
      link: "",
      buttonText: "Obtener ahora",
    },
    {
      image: ImgBanner10,
      title: "Club VIP",
      text: "Consiga un agente personal y hasta un 21 % de devolución ¡sin requisito de apuesta!",
      link: "",
      buttonText: "Obtener ahora",
    },
    {
      image: ImgBanner11,
      title: "Devolución de 1xSlots",
      text: "Apueste, acumule bonos y ¡obtenga hasta un 11 % de devolución!",
      link: "",
      buttonText: "Obtener ahora",
    },
    {
      image: ImgBanner12,
      title: "¡Bono de cumpleaños!",
      text: "¡Celébrelo con 1xSlots!",
      link: "",
      buttonText: "Más información",
    },
  ];

  return (
    <div className="slider">
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        className="swiper-container"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="swiper-slide">
            <div
              className="slider__item swiper-lazy swiper-lazy-loaded"
              style={{ backgroundImage: `url('${slide.image}')` }}
            >
              <div className="slider__layout">
                <h2 className="slider__title">{slide.title}</h2>
                <p className="slider__text">{slide.text}</p>
                <a
                  href={slide.link}
                  target="_self"
                  className="btn btn--success"
                >
                  {slide.buttonText}
                </a>
              </div>
            </div>
          </SwiperSlide>
        ))}
        <span
          className="swiper-notification"
          aria-live="assertive"
          aria-atomic="true"
        ></span>
      </Swiper>
    </div>
  );
};

export default Slideshow;
