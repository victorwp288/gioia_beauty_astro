/* src/components/Gallery.jsx */
import React, { useState } from "react";

const imagesWithDescriptions = [
  { src: "/images/reception1.jpg", description: "Reception" },
  { src: "/images/reception2.jpg", description: "Reception" },
  { src: "/images/reception3.jpg", description: "Reception" },
  { src: "/images/reception4.jpg", description: "" },
  { src: "/images/mirror1.jpg", description: "" },
  { src: "/images/mirror2.jpg", description: "" },
  { src: "/images/pressoterapia1.jpg", description: "Pressoterapia" },
  { src: "/images/massaggi1.jpg", description: "" },
  { src: "/images/ossigeno.jpg", description: "Ossigeno Dermo Infusione" },
  { src: "/images/bagnoturco1.jpg", description: "Bagno turco" },
  { src: "/images/bed.jpg", description: "" },
  { src: "/images/rituali1.jpg", description: "Rituale Himalaya" },
];

function GalleryClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openModal = (index) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden"; // Prevent background scrolling
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto"; // Restore scrolling
  };

  const prevImage = () => {
    setCurrentIndex(
      (currentIndex - 1 + imagesWithDescriptions.length) %
        imagesWithDescriptions.length
    );
  };

  const nextImage = () => {
    setCurrentIndex((currentIndex + 1) % imagesWithDescriptions.length);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowLeft") prevImage();
    if (e.key === "ArrowRight") nextImage();
  };

  React.useEffect(() => {
    if (isModalOpen) {
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.removeEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  return (
    <div className="relative">
      {/* Gallery Grid */}
      <div className="animate-fadeIn grid grid-cols-1 gap-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 pt-4">
        {imagesWithDescriptions.map((image, index) => (
          <div key={index} className="overflow-hidden">
            <img
              src={image.src}
              alt={image.description || `Image ${index + 1}`}
              className="object-cover w-full h-64 cursor-pointer transform transition-transform duration-200 hover:scale-105"
              onClick={() => openModal(index)}
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
          onClick={closeModal}
        >
          <div
            className="relative bg-transparent"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-white text-3xl font-bold focus:outline-none"
              onClick={closeModal}
              aria-label="Close Modal"
            >
              &times;
            </button>

            {/* Previous Button */}
            <button
              className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white text-2xl font-bold focus:outline-none"
              onClick={prevImage}
              aria-label="Previous Image"
            >
              &#8592;
            </button>

            {/* Next Button */}
            <button
              className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white text-2xl font-bold focus:outline-none"
              onClick={nextImage}
              aria-label="Next Image"
            >
              &#8594;
            </button>

            {/* Image and Description */}
            <div className="flex flex-col items-center">
              <img
                src={imagesWithDescriptions[currentIndex].src}
                alt={
                  imagesWithDescriptions[currentIndex].description ||
                  `Image ${currentIndex + 1}`
                }
                className="max-h-screen object-contain"
              />
              <p className="mt-2 text-white text-lg font-semibold">
                {imagesWithDescriptions[currentIndex].description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GalleryClient;
