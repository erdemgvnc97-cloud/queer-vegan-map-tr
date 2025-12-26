// frontend/src/components/StatsView.jsx
import { useEffect, useState } from "react";
import { TrendingUp, Users, Heart, Leaf, DollarSign, Star, AlertCircle } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "";

export default function StatsView() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        console.log("📊 İstatistikler çekiliyor...", `${API}/api/stats`);
        const response = await fetch(`${API}/api/stats`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("✅ İstatistikler geldi:", data);
        setStats(data);
      } catch (err) {
        console.error("❌ İstatistik hatası:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xl font-semibold text-gray-700">Veriler yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center space-y-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-900">Veri Yüklenemedi</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <p className="text-xl text-gray-600">Veri bulunamadı</p>
      </div>
    );
  }

  const StatCard = ({ icon: Icon, title, value, subtitle, color, bgColor }) => (
    <div className={`${bgColor} rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 ${color} bg-opacity-10 rounded-2xl`}>
          <Icon className={color} size={28} strokeWidth={2.5} />
        </div>
        <div className="text-right">
          <div className={`text-4xl font-black ${color}`}>{value}</div>
          {subtitle && <div className="text-sm text-gray-500 mt-1">{subtitle}</div>}
        </div>
      </div>
      <h3 className="text-gray-700 font-semibold text-sm">{title}</h3>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-block">
            <div className="flex items-center justify-center gap-3 bg-white px-6 py-3 rounded-full shadow-lg">
              <TrendingUp className="text-purple-600" size={24} />
              <h1 className="text-3xl font-black text-gray-900">İstatistikler</h1>
            </div>
          </div>
          <p className="text-gray-600 text-lg">
            Topluluğun paylaştığı {stats.total} deneyimden elde edilen veriler
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Heart}
            title="Queer Saygı Ortalaması"
            value={`${stats.queerRespect}/10`}
            color="text-purple-600"
            bgColor="bg-white"
          />
          
          <StatCard
            icon={Users}
            title="Queer İstihdam Oranı"
            value={`${stats.queerEmploymentRate}%`}
            subtitle="İstihdam eden mekanlar"
            color="text-pink-600"
            bgColor="bg-white"
          />
          
          <StatCard
            icon={Leaf}
            title="Hayvan Dostu Puanı"
            value={`${stats.animalFriendly}/10`}
            color="text-green-600"
            bgColor="bg-white"
          />
          
          <StatCard
            icon={Star}
            title="Vegan Kalite"
            value={`${stats.veganQuality}/10`}
            subtitle="Ortalama kalite puanı"
            color="text-emerald-600"
            bgColor="bg-white"
          />
        </div>

        {/* Price Distribution */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="text-blue-600" size={28} />
            <h2 className="text-2xl font-bold text-gray-900">Vegan Fiyat Dağılımı</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Ucuz */}
            <div className="relative">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200 hover:border-green-400 transition-all">
                <div className="text-center space-y-3">
                  <div className="text-4xl">💰</div>
                  <div className="text-5xl font-black text-green-600">{stats.veganPriceDist.ucuz}</div>
                  <p className="text-sm font-semibold text-gray-700">Ucuz</p>
                  <div className="w-full bg-green-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-green-500 h-full rounded-full transition-all duration-1000"
                      style={{ 
                        width: `${(stats.veganPriceDist.ucuz / stats.total * 100)}%` 
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">
                    {((stats.veganPriceDist.ucuz / stats.total) * 100).toFixed(1)}% mekan
                  </p>
                </div>
              </div>
            </div>

            {/* Normal */}
            <div className="relative">
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-6 border-2 border-yellow-200 hover:border-yellow-400 transition-all">
                <div className="text-center space-y-3">
                  <div className="text-4xl">💰💰</div>
                  <div className="text-5xl font-black text-yellow-600">{stats.veganPriceDist.normal}</div>
                  <p className="text-sm font-semibold text-gray-700">Normal</p>
                  <div className="w-full bg-yellow-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-yellow-500 h-full rounded-full transition-all duration-1000"
                      style={{ 
                        width: `${(stats.veganPriceDist.normal / stats.total * 100)}%` 
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">
                    {((stats.veganPriceDist.normal / stats.total) * 100).toFixed(1)}% mekan
                  </p>
                </div>
              </div>
            </div>

            {/* Pahalı */}
            <div className="relative">
              <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 border-2 border-red-200 hover:border-red-400 transition-all">
                <div className="text-center space-y-3">
                  <div className="text-4xl">💰💰💰</div>
                  <div className="text-5xl font-black text-red-600">{stats.veganPriceDist.pahali}</div>
                  <p className="text-sm font-semibold text-gray-700">Pahalı</p>
                  <div className="w-full bg-red-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-red-500 h-full rounded-full transition-all duration-1000"
                      style={{ 
                        width: `${(stats.veganPriceDist.pahali / stats.total * 100)}%` 
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">
                    {((stats.veganPriceDist.pahali / stats.total) * 100).toFixed(1)}% mekan
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl shadow-2xl p-8 text-white">
          <div className="text-center space-y-4">
            <h3 className="text-3xl font-bold">Topluluk Gücü 💪</h3>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              {stats.total} kullanıcı deneyimi ile birlikte daha bilinçli seçimler yapıyoruz. 
              Her paylaşım, daha kapsayıcı bir dünya için bir adım! 🌈
            </p>
            <div className="flex items-center justify-center gap-8 pt-4">
              <div>
                <div className="text-4xl font-black">{stats.total}</div>
                <div className="text-sm opacity-80">Toplam Değerlendirme</div>
              </div>
              <div className="w-px h-12 bg-white/30"></div>
              <div>
                <div className="text-4xl font-black">
                  {((stats.queerRespect + stats.animalFriendly + stats.veganQuality) / 3).toFixed(1)}
                </div>
                <div className="text-sm opacity-80">Genel Ortalama</div>
              </div>
            </div>
          </div>
        </div>

        {/* Debug Info (Development only) */}
        {import.meta.env.DEV && (
          <details className="bg-gray-100 rounded-2xl p-6">
            <summary className="cursor-pointer font-semibold text-gray-700 mb-4">
              🔍 Debug Bilgisi (Sadece Development)
            </summary>
            <pre className="bg-gray-800 text-green-400 p-4 rounded-xl overflow-auto text-xs">
              {JSON.stringify(stats, null, 2)}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}