import React from 'react';

export default function EditorialImage({ src = '/insurance-hero.jpg', alt = 'Vue de Genève et du lac Léman', caption, className = '' }) {
  return <figure className={`mfc-editorial-image ${className}`}>
    <img src={src} alt={alt} width="1280" height="800" loading="lazy" decoding="async" onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = '/insurance-hero.jpg'; }} />
    {caption && <figcaption>{caption}</figcaption>}
  </figure>;
}
