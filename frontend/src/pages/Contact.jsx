/* frontend/src/pages/Contact.jsx */
import "./Contact.css";

export default function Contact() {
  return (
    <div className="contact-page-container">
      <div className="contact-content">
        <h1 className="contact-title">CONTACT</h1>
        <p className="contact-subtitle">Get in Touch</p>
        
        <div className="contact-details">
          <p className="contact-text">
            Bir hata veya yanlış anlaşılma olduğunu düşünüyorsan benimle iletişime geçebilirsin 💌 
          </p>
          
          <a
            href="https://instagram.com/kittyhellohr"
            target="_blank"
            rel="noopener noreferrer"
            className="modern-insta-btn"
          >
            Instagram'da Ulaş 🌈 
          </a>
        </div>
      </div>

      <div className="contact-image-wrapper">
        {/* Tavşan görselini buraya ekleyeceğiz */}
        <img 
          src="/rabbit.png"
          alt="Contact Rabbit" 
          className="rabbit-img"
        />
      </div>
    </div>
  );
}