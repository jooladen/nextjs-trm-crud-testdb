'use client';

/**
 * TRM 네비게이션 컴포넌트
 * 5개 메뉴 탭을 표시하고 현재 경로를 강조합니다
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/lib/constants/routes';

interface NavItem {
  label: string;
  href: string;
  enabled: boolean;
}

const navItems: NavItem[] = [
  {
    label: '타겟제품',
    href: ROUTES.TRM.TARGET_PRODUCTS.LIST,
    enabled: true,
  },
  {
    label: '기술확보계획',
    href: ROUTES.TRM.TECH_SECURE_PLANS.LIST,
    enabled: true,
  },
  {
    label: '타겟제품군',
    href: ROUTES.TRM.TARGET_PRODUCT_LINES.LIST,
    enabled: true,
  },
  {
    label: '분류',
    href: ROUTES.TRM.CATEGORY_SYSTEM.LIST,
    enabled: true,
  },
  {
    label: '타겟제품군-기술확보계획 매핑',
    href: ROUTES.TRM.PRODUCT_LINE_PLAN_MAP.LIST,
    enabled: true,
  },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex space-x-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);

            if (!item.enabled) {
              return (
                <div
                  key={item.href}
                  className="relative px-4 py-4 text-sm font-medium text-gray-400 cursor-not-allowed"
                >
                  {item.label}
                  <span className="ml-2 text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
                    Coming Soon
                  </span>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  relative px-4 py-4 text-sm font-medium transition-colors
                  ${
                    isActive
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:border-b-2 hover:border-gray-300'
                  }
                `}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
