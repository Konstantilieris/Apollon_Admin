import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css"; // Ensure you import the styles for the carousel
import CustomArrow from "./CustomArrow";
import CustomDot from "./CustomDots";

import SubCarouselItem from "./SubCarouselItem";
const SubCategoryCarousel = ({ subCategories }: any) => {
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
      slidesToSlide: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
      slidesToSlide: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1,
    },
  };

  return (
    <div className="relative flex max-w-[300px] flex-col items-center gap-2 self-end">
      <Carousel
        ssr
        responsive={responsive}
        infinite={false}
        containerClass="container rounded-lg bg-light-700 dark:bg-dark-400  p-x-1 shadow-md shadow-white dark:shadow-dark-500 min-h-[70px] max-w-[160px]"
        itemClass="carousel-item-padding-40-px" // Use custom class for padding
        customLeftArrow={<CustomArrow direction="left" />}
        customRightArrow={<CustomArrow direction="right" />}
        showDots
        arrows
        customDot={<CustomDot />}
        renderDotsOutside
        customButtonGroup={<CustomDot />}
      >
        {subCategories.map((sub: any) => (
          <SubCarouselItem key={sub._id} sub={sub} />
        ))}
      </Carousel>
      <div className="flex flex-row">
        {subCategories.map((sub: any) => (
          <CustomDot key={sub._id} />
        ))}
      </div>
    </div>
  );
};

export default SubCategoryCarousel;
