import React from 'react';

const Title = ({ text1, text2 }) => {
  return (
    <div className="inline-flex gap-2 items-center mb-3">
      <p className="text-2xl sm:text-3xl">
        {text1}{' '}
        <span className="font-semibold text-text">
          {text2}
        </span>
      </p>
    </div>
  );
};

export default Title;