import Link from 'next/link';
import { targetProductService } from '@/lib/services/targetProduct.service';
import { techSecurePlanService } from '@/lib/services/techSecurePlan.service';

export default async function Home() {
  // 통계 데이터 fetch
  const [products, plans] = await Promise.all([
    targetProductService.findAll(),
    techSecurePlanService.findAll(),
  ]);

  const stats = [
    { label: '타겟제품군', value: products.length, color: 'blue' },
    { label: '기술확보계획', value: plans.length, color: 'green' },
    { label: '활성 메뉴', value: '5/5', color: 'purple' },
  ];

  const features = [
    {
      title: '타겟제품군 관리',
      description: '제품군별 타겟 제품을 체계적으로 관리하고 배치 일정을 추적합니다',
      icon: '📦',
      href: '/trm/target-products',
      color: 'blue',
    },
    {
      title: '기술확보계획',
      description: '기술 로드맵에 따른 확보 계획을 수립하고 관리합니다',
      icon: '🎯',
      href: '/trm/tech-secure-plans',
      color: 'green',
    },
    {
      title: '타겟제품군 라인',
      description: '제품군 라인을 정의하고 계층 구조를 관리합니다',
      icon: '📊',
      href: '/trm/target-product-lines',
      color: 'purple',
    },
    {
      title: '카테고리 시스템',
      description: '기술 카테고리의 계층 구조를 설계하고 관리합니다',
      icon: '🗂️',
      href: '/trm/category-system',
      color: 'yellow',
    },
    {
      title: '제품군-계획 매핑',
      description: '제품군과 기술계획의 관계를 연결하고 추적합니다',
      icon: '🔗',
      href: '/trm/product-line-plan-map',
      color: 'red',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">TRM</h1>
                <p className="text-xs text-gray-600">Technology Roadmap Management</p>
              </div>
            </div>
            <Link
              href="/trm/target-products"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              시작하기 →
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            기술 로드맵을
            <span className="text-blue-600"> 체계적으로</span>
            <br />
            관리하세요
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            TRM 시스템으로 타겟제품군, 기술확보계획, 제품군 매핑을 한 곳에서 관리하고
            <br />
            기술 전략을 효율적으로 실행하세요
          </p>
          <div className="flex flex-wrap gap-3 justify-center max-w-4xl mx-auto">
            <Link
              href="/trm/target-products"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-lg hover:shadow-xl"
            >
              📦 타겟제품
            </Link>
            <Link
              href="/trm/tech-secure-plans"
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-lg hover:shadow-xl"
            >
              🎯 기술확보계획
            </Link>
            <Link
              href="/trm/target-product-lines"
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold shadow-lg hover:shadow-xl"
            >
              📊 타겟제품군
            </Link>
            <Link
              href="/trm/category-system"
              className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-semibold shadow-lg hover:shadow-xl"
            >
              🗂️ 분류
            </Link>
            <Link
              href="/trm/product-line-plan-map"
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold shadow-lg hover:shadow-xl"
            >
              🔗 타겟제품군-기술확보계획 매핑
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
              <p className={`text-4xl font-bold text-${stat.color}-600`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            주요 기능
          </h2>
          <p className="text-lg text-gray-600">
            TRM 시스템의 강력한 기능들을 지금 바로 사용해보세요
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Link
              key={index}
              href={feature.href}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">{feature.icon}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {feature.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-center shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            지금 바로 시작하세요
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            체계적인 기술 로드맵 관리로 성공적인 프로젝트를 만들어보세요
          </p>
          <Link
            href="/trm/target-products"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-50 transition-colors text-lg font-semibold shadow-lg"
          >
            TRM 시스템 시작하기 →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2024 TRM Management System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}