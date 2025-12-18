export default function Footer() {
  return (
    <footer
      style={{
        fontSize: "0.75rem",
        padding: "20px",
        color: "#666",
        textAlign: "center",
      }}
    >
      <p>
        © {new Date().getFullYear()} Queer Vegan Map Türkiye · Kullanıcı deneyimlerine
        dayalı bir bilgilendirme platformudur.
      </p>

      <p style={{ marginTop: 8 }}>
        İçerikler kullanıcı beyanıdır. Hukuki sorumluluk kabul edilmez.
      </p>
    </footer>
  );
}
