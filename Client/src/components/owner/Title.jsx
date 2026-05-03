import React from "react";

const Title = ({ title, subTitle }) => {
  return (
    <>
      <h1 className="font-medium text-3xl">{title}</h1>
      <p className="text-sm md:text-base mt-2 text-gray-500/90 max-w-156">
        {subTitle}
      </p>
    </>
  );
};

export default Title;
