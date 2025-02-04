import React from 'react';

const Title = ({ text1, text2 }) => {
  return (
    <div className="inline-flex gap-2 items-center mb-3">
      <p className="text-2xl text-secondary sm:text-3xl">
        {text1}{' '}
        <span className="font-bold text-text">
          {text2}
        </span>
      </p>
      <p className="w-8 bg-background sm:w-12 h-[2px]"></p>
    </div>
  );
};

export default Title;