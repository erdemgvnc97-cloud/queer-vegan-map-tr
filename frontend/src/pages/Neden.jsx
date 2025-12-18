/* frontend/src/pages/Neden.jsx */
import { BookOpen, Quote } from "lucide-react";

export default function Neden() {
  const references = [
    { text: "Badgett, M. V. L., DeFelice, C. J., & Park, A. R. (2019). The relationship between LGBT inclusion and economic development: Macro-level evidence. Williams Institute, UCLA School of Law.", link: "https://williamsinstitute.law.ucla.edu/wp-content/uploads/LGBT-Inclusion-Economic-Dev-Mar-2019.pdf" },
    { text: "Drucker, P. (2015). Warped: Gay norms and queer anti-capitalism. Brill.", link: "https://brill.com/display/title/18029" },
    { text: "Eng, D. L. (2002). Queer liberalism. Social Text, 20(3), 1–34.", link: "https://doi.org/10.1215/01642472-20-3_72-1" },
    { text: "Kaos GL & Kadir Has Üniversitesi. (2023). Türkiye’deki özel sektör çalışanı LGBTİ+’ların durumu 2023 araştırması. Kaos GL Derneği Yayınları.", link: "https://kaosgl.org/kitaplik/turkiye-deki-ozel-sektor-calisani-lgbti-larin-durumu-2023-arastirmasi" },
    { text: "Rao, R. (2015). Global homocapitalism. Radical Philosophy, 194, 38–49.", link: "https://www.radicalphilosophy.com/article/global-homocapitalism" },
    { text: "World Bank. (2014). The economic cost of stigma and the exclusion of LGBT people: A case study of India. World Bank Group.", link: "https://openknowledge.worldbank.org/handle/10986/17593" },
    { text: "Zengin, A. (2016). Mortal economies: Queer life and death in Istanbul. Cultural Anthropology.", link: "https://culanth.org/articles/811-mortal-economies-queer-life-and-death-in-istanbul" }
  ];

  return (
    <div className="min-h-screen py-16 px-4 md:py-24 bg-[#fffcf9]">
      <div className="max-w-4xl mx-auto space-y-24">
        
        {/* Ana İçerik */}
        <article className="text-left space-y-12">
          <div className="space-y-8">
            <p className="text-2xl md:text-3xl font-medium text-gray-900 leading-snug tracking-tight">
              Queer saygılı/dışlamacı mekanları kullanıcı deneyimine göre listeleme ve bu konuda bilgi sahibi etme/bilgilendirme amacımız, Queer bireylerin geniş bir alanda tüketici özne olmaları ve bu tüketiciliğin bilinçli bir şekilde yapılmasının önermesine dayanıyor.
            </p>

            <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-light">
              'The Relationship between LGBT(+,I,A) inclusion and Economic Development' çalışması ve birçok benzer çalışma, Queer bireylerin ekonomide ve satın almada, tahmin edilenden çok daha fazla payı olduğunu ortaya koyar. Queer ya da vegan bireyleri inciten, zarar görmesine sebep olan işletme ve oluşumların, tercih edilmeden önce bir kez daha gözden geçirilmesi gerektiğini düşünüyor; bu doğrultuda kolektif bir duruş sergileyerek 'etik tüketimi' öneriyoruz.
            </p>
          </div>

          {/* Etik Tüketim Vurgusu */}
          <div className="bg-white p-10 md:p-14 rounded-[3rem] shadow-2xl shadow-purple-100/40 border border-purple-50 relative overflow-hidden group">
            <Quote className="absolute -right-4 -bottom-4 text-purple-50 size-40 -z-0 opacity-50 transition-transform group-hover:scale-110 duration-700" />
            <div className="relative z-10 space-y-4">
              <h4 className="text-xs font-black uppercase tracking-[0.4em] text-purple-400">Etik Tüketim (Ethical Consumption):</h4>
              <p className="text-2xl md:text-4xl font-black text-gray-900 tracking-tighter leading-tight italic">
                Harcanan her kuruşun aynı zamanda bir ahlaki onay olduğunu hatırlatır.
              </p>
            </div>
          </div>
        </article>

        {/* İngilizce Versiyon */}
        <article className="text-left space-y-10 pt-10 border-t border-gray-100">
          <p className="text-lg text-gray-500 font-medium leading-relaxed italic">
            Our objective in listing queer-friendly or exclusionary spaces based on user experience, and in providing information and awareness on this matter, is rooted in the premise that Queer individuals are consumer subjects across a broad spectrum and that this consumption should be practiced consciously. The study titled 'The Relationship between LGBT(+,I,A) Inclusion and Economic Development,' along with many similar research papers, reveals that Queer individuals hold a significantly larger share in the economy and purchasing power than previously estimated. We believe that businesses and organizations that cause harm or distress to Queer or vegan individuals should be reconsidered before being chosen as a consumer preference; accordingly, we advocate for 'ethical consumption' by leveraging our collective power.
          </p>
          <p className="text-xl font-bold text-gray-800 tracking-tight">
            Ethical Consumption reminds us that every penny spent is, at the same time, a moral endorsement.
          </p>
        </article>

        {/* Kaynakça */}
        <section className="pt-20 space-y-12">
          <div className="flex items-center gap-6">
            <h3 className="text-xs font-black uppercase tracking-[0.5em] text-gray-400 flex items-center gap-3">
              <BookOpen size={16} /> Queer Ekonomi ve Sermaye Hareketleri Kaynakça
            </h3>
            <div className="h-px flex-1 bg-gray-100"></div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {references.map((ref, index) => (
              <a 
                key={index}
                href={ref.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group flex gap-8 items-start p-6 rounded-3xl hover:bg-white transition-all duration-500 hover:shadow-xl hover:shadow-purple-50"
              >
                <span className="text-[10px] font-black text-purple-200 mt-1 border-b border-purple-100 pb-1">0{index + 1}</span>
                <p className="text-sm md:text-base text-gray-400 group-hover:text-gray-700 leading-relaxed font-medium transition-colors">
                  {ref.text}
                </p>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}