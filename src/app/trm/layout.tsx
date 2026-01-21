/**
 * TRM 레이아웃
 * 모든 TRM 페이지에 공통으로 적용되는 레이아웃
 */

import Link from 'next/link';
import Navigation from '@/components/trm/Navigation';

export const metadata = {
  title: 'TRM 관리 시스템',
  description: 'Technology Roadmap Management System',
};

export default function TRMLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
            <h1 className="text-2xl font-bold text-gray-900">TRM 관리 시스템</h1>
            <p className="text-sm text-gray-600">Technology Roadmap Management</p>
          </Link>
        </div>
      </header>

      {/* 네비게이션 */}
      <Navigation />

      {/* 메인 콘텐츠 */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* 푸터 */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-600">
          © 2024 TRM Management System. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
