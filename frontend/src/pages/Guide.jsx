export default function Guide() {
  return (
    <section className="p-8 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-emerald-600">
        🥗 Vegan Beslenme Rehberi
      </h1>

      <p className="text-gray-700">
        Vegan beslenme yalnızca hayvan haklarına saygı göstermek değil, aynı zamanda gezegenimiz için
        daha sürdürülebilir bir yaşam biçimidir. İşte birkaç temel ipucu:
      </p>

      <ul className="list-disc text-left text-gray-600 pl-6 space-y-2">
        <li>Bitkisel protein kaynaklarını (nohut, mercimek, tofu, tempeh) dengeli tüket.</li>
        <li>Demir, B12 ve Omega-3 takviyelerini düzenli al.</li>
        <li>Yerel üreticileri destekle, sezonsal ürünleri tercih et.</li>
        <li>Hayvansal içerikli ürünleri tanımak için etiketleri dikkatle oku.</li>
      </ul>

      <p className="text-sm text-gray-500 italic">
        🌱 Bu rehber, bilinçli seçimlerle hem kendi sağlığını hem de doğayı korumana yardımcı olur.
      </p>
    </section>
  );
}
