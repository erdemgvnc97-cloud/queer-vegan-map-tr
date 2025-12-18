/* frontend/src/pages/Neden.jsx */
export default function Neden() {
  const references = [
    { text: "Badgett, M. V. L., et al. (2019). The relationship between LGBT inclusion and economic development.", link: "https://williamsinstitute.law.ucla.edu/wp-content/uploads/LGBT-Inclusion-Economic-Dev-Mar-2019.pdf" },
    { text: "Kaos GL & Kadir Has Üniversitesi. (2023). Türkiye’deki özel sektör çalışanı LGBTİ+’ların durumu.", link: "https://kaosgl.org/kitaplik/turkiye-deki-ozel-sektor-calisani-lgbti-larin-durumu-2023-arastirmasi" },
    { text: "Zengin, A. (2016). Mortal economies: Queer life and death in Istanbul.", link: "https://culanth.org/articles/811-mortal-economies-queer-life-and-death-in-istanbul" }
  ];

  return (
    <div className="page max-w-4xl mx-auto p-10 bg-white/60 backdrop-blur-lg rounded-[3rem] shadow-xl mt-10">
      <h2 className="text-4xl font-black mb-8 text-purple-700 border-b-4 border-fuchsia-200 pb-4">
        🌍 Neden Bu Harita?
      </h2>
      
      <div className="space-y-8 text-gray-800 text-lg leading-relaxed">
        <section className="bg-pink-50 p-6 rounded-3xl border-l-8 border-pink-400">
          <p className="italic font-semibold">
            "Harcanan her kuruş aynı zamanda bir ahlaki onaydır. Etik Tüketim (Ethical Consumption), tüketiciliğin bilinçli bir ahlaki eylem olduğunu hatırlatır."
          </p>
        </section>

        <p>
          Queer dostu veya dışlamacı mekanları listeleme amacımız, Queer bireylerin ekonomide ve satın almada tahmin edilenden çok daha büyük bir payı olduğu gerçeğine dayanıyor. Bu harita ile bireyleri inciten işletmelerin tercih edilmeden önce gözden geçirilmesini öneriyor; <strong>kolektif bir duruş</strong> sergiliyoruz.
        </p>

        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-6 text-gray-700 flex items-center gap-2">📚 Kaynakça & Literatür</h3>
          <ul className="space-y-4">
            {references.map((ref, index) => (
              <li key={index} className="p-4 bg-white/40 rounded-2xl hover:bg-white/80 transition-all border border-transparent hover:border-purple-200">
                <a href={ref.link} target="_blank" rel="noopener noreferrer" className="text-purple-600 font-medium block">
                  <span className="text-fuchsia-500 mr-2">[{index + 1}]</span>
                  {ref.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}