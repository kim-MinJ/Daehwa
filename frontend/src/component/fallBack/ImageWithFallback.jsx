import React, { useState } from 'react';

export function ImageWithFallback({ src, alt, className, style, fallbackSrc = "https://via.placeholder.com/200x300?text=No+Image", ...rest }) {
  const [didError, setDidError] = useState(false);

  const handleError = () => setDidError(true);

  if (didError) {
    return (
      <div className={`image-error ${className ?? ''}`} style={style}>
        <img src={fallbackSrc} alt="Error loading image" {...rest} />
      </div>
    );
  }

  return <img src={src} alt={alt} className={className} style={style} onError={handleError} {...rest} />;
}

export default ImageWithFallback;
