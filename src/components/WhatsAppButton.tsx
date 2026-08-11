import React from 'react';

export const WhatsAppButton: React.FC = () => {
  const whatsappUrl = "https://wa.me/917405500454?text=Hi%20I%20want%20to%20buy%20Kriya%20product";

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-btn"
      aria-label="Chat on WhatsApp"
      title="Chat on WhatsApp"
    >
      <i className="fa-brands fa-whatsapp"></i>
    </a>
  );
};

