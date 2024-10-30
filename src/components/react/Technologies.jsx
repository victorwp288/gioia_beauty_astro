
import React, { useState, useRef, useEffect } from "react";
import tick from "../../images/tick-white.svg";
import chevronLeft from "../../images/chevron-left.svg";
import chevronRight from "../../images/chevron-right.svg";

const Technologies = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);
  const scrollContainerRef = useRef(null);

  const handleScroll = () => {
    const scrollPosition = scrollContainerRef.current.scrollLeft;
    const containerWidth = scrollContainerRef.current.offsetWidth;
    const newIndex = Math.round(scrollPosition / containerWidth);
    setCurrentIndex(newIndex);
  };

  const scrollTo = (index) => {
    const scrollContainer = scrollContainerRef.current;
    const containerWidth = scrollContainer.offsetWidth;
    scrollContainer.scrollTo({
      left: index * containerWidth,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    scrollContainer.addEventListener("scroll", handleScroll);

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const technologies = [
    {
      title: "Elettroporatore",
      description:
        "L’elettroporatore è un macchinario perfetto per trattare gli inestetismi di viso e corpo. Tramite piccoli impulsi elettrici rende le cellule più permeabili, facendo penetrare i cosmetici applicati in profondità. Perfetto per contrastare l'invecchiamento cutaneo, per pelli con rughe e macchie, per inestetismi come la perdita di tono e la cellulite.",
    },
    {
      title: "Ossigeno dermo infusione",
      description:
        "L’ossigeno dermo infusione è una tecnologia estetica che, tramite ossigeno puro in combinazione con acido iarulonico, migliora l'idratazione, rende la pelle liftata, contrasta le rughe, drena e ossigena i tessuti. Dona alla pelle un immediato effetto di compattezza, rendendola fin da subito più liscia e luminosa.",
    },
    {
      title: "Pressoterapia",
      description:
        "Attraverso compressioni e decompressioni graduali di specifici gambali, la pressoterapia simula un massaggio drenante manuale. Favorisce le naturali funzioni del corpo, il ritorno venoso e l'eliminazione di sostanze di scarto dell'organismo. È particolarmente indicata per chi soffre di ritenzione idrica, cellulite, gambe gonfie e adiposità.",
    },
  ];

  return (
    <div className="m-auto md:w-[70vw] md:py-12 py-6">
      <div className="m-auto w-[90vw] md:w-[70vw] flex flex-col gap-2 py-4 pb-6 md:gap-4 md:py-4">
        <h4 className="text-xs font-extrabold text-white">SCOPRI</h4>
        <h2 className="font-serif text-3xl font-bold tracking-tight text-white md:text-3xl">
          Le tecnologie
        </h2>
      </div>
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex snap-x snap-mandatory overflow-x-scroll no-scrollbar md:grid md:grid-cols-3 md:gap-14 md:py-0"
        >
          {technologies.map((tech, index) => (
            <div
              key={index}
              className={`snap-center text-white flex-col gap-2 flex min-w-[100vw] py-4 md:min-w-0 ${
                currentIndex === 0 && index === 0 ? "pl-6 md:pl-0" : ""
              } ${
                currentIndex === technologies.length - 1 &&
                index === technologies.length - 1
                  ? "pl-8"
                  : ""
              } ${
                currentIndex > 0 && currentIndex < technologies.length - 1
                  ? "pl-8 pr-2"
                  : ""
              }`}
            >
              <div className="flex flex-col gap-2">
                <img
                  src={tick}
                  width="26"
                  height="26"
                  alt="technology indicator"
                  className="object-contain"
                />
                <h2 className="text-lg font-semibold">{tech.title}</h2>
              </div>
              <p className="text-sm w-[90%]">{tech.description}</p>
            </div>
          ))}
        </div>
        {windowWidth < 768 && currentIndex > 0 && (
          <button
            onClick={() => scrollTo(currentIndex - 1)}
            className="absolute left-2 top-1/2 text-white rounded-full"
          >
            <img
              src={chevronLeft}
              alt="left arrow"
              className="w-6 h-6"
            />
          </button>
        )}
        {windowWidth < 768 && currentIndex < technologies.length - 1 && (
          <button
            onClick={() => scrollTo(currentIndex + 1)}
            className="absolute right-2 top-1/2 text-white rounded-full"
          >
            <img
              src={chevronRight}
              alt="right arrow"
              className="w-6 h-6"
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default Technologies;
