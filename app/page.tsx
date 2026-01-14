import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            디자인 학습의 새로운 시작
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Palette는 학생과 멘토를 연결하여 더 나은 디자인 학습 경험을 제공합니다.
            전문 멘토의 지도를 받아 당신의 디자인 실력을 한 단계 성장시키세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <button className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors min-w-[160px]">
                시작하기
              </button>
            </Link>
            <Link href="/gallery">
              <button className="px-8 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors min-w-[160px]">
                갤러리 둘러보기
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-4xl mb-4">👨‍🎓</div>
            <h3 className="text-xl font-semibold mb-2">학생을 위한</h3>
            <p className="text-gray-600">
              전문 멘토의 피드백을 받고, 학습 자료를 통해 빠르게 성장하세요.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-4xl mb-4">👨‍🏫</div>
            <h3 className="text-xl font-semibold mb-2">멘토를 위한</h3>
            <p className="text-gray-600">
              당신의 경험을 공유하고, 학생들의 성장을 도와주세요.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold mb-2">갤러리</h3>
            <p className="text-gray-600">
              다양한 작품을 둘러보고, 영감을 얻으세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
