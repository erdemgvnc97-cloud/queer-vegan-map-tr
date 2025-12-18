/* frontend/src/components/MapView.jsx */
// Formun bulunduğu selected kısmını bu şekilde güncelleyebilirsin:

{selected ? (
  <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl border border-fuchsia-50 mt-10 animate-in fade-in slide-in-from-bottom-5 duration-500">
    <div className="flex flex-col md:flex-row items-center gap-6 mb-10 text-center md:text-left">
      <div className="p-5 bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl text-pink-600 shadow-sm">
        <MapPin size={40} />
      </div>
      <div>
        <h3 className="text-4xl font-black bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          {selected.name}
        </h3>
        <p className="text-purple-500 font-medium tracking-wide uppercase text-sm mt-1">
          Toplulukla Deneyimini Paylaş 🌈
        </p>
      </div>
    </div>

    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
      
      {/* Queer Dostluk Kartı */}
      <div className="group p-8 bg-gradient-to-b from-purple-50 to-white rounded-[2.5rem] border border-purple-100 hover:shadow-lg transition-all duration-300">
        <h4 className="flex items-center gap-3 font-bold text-purple-700 text-xl mb-6">
          <ShieldCheck className="text-purple-500" /> Queer Güvenliği
        </h4>
        
        <div className="space-y-8">
          <label className="block">
            <div className="flex justify-between mb-2">
              <span className="font-bold text-gray-700 text-sm">Güvenli Alan Skoru</span>
              <span className="text-purple-600 font-bold">{review.queerScore}/10</span>
            </div>
            <input
              type="range" min="1" max="10"
              value={review.queerScore}
              onChange={(e) => setReview({ ...review, queerScore: e.target.value })}
              className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
          </label>

          <label className="block">
            <span className="font-bold text-gray-700 text-sm block mb-2">Ayrımcılık/Saygısızlık Gözlemi?</span>
            <select
              className="w-full p-4 bg-white border-2 border-purple-100 rounded-2xl focus:border-purple-400 outline-none transition-colors"
              value={review.queerRespect}
              onChange={(e) => setReview({ ...review, queerRespect: e.target.value })}
            >
              <option>Hayır, yaşanmadı ✨</option>
              <option>Evet, yaşandı ⚠️</option>
            </select>
          </label>
        </div>
      </div>

      {/* Vegan Seçenekler Kartı */}
      <div className="group p-8 bg-gradient-to-b from-green-50 to-white rounded-[2.5rem] border border-green-100 hover:shadow-lg transition-all duration-300">
        <h4 className="flex items-center gap-3 font-bold text-green-700 text-xl mb-6">
          <Leaf className="text-green