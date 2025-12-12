"use client";

import Header from "@/components/Header";
import Link from "next/link";

export default function Home() {

  const menuItems = [
    {
      name: "점포 정보 관리",
      path: "/store-info",
      description: "점포 기본 정보 및 운영 시간 관리",
    },
    {
      name: "점포 관리",
      path: "/store-management",
      description: "점포 목록 및 상세 관리",
    },
    {
      name: "계약 관리",
      path: "/contract-management",
      description: "가맹점 계약 현황 및 관리",
    },
    {
      name: "템플릿",
      path: "/templates",
      description: "각종 템플릿 관리",
    },
    {
      name: "마스터용 메뉴 관리",
      path: "/master-menu-management",
      description: "세트 메뉴, 옵션, 카테고리 설정",
    },
    {
      name: "직원 정보 관리",
      path: "/employee-management",
      description: "직원 기본 정보 및 경력, 자격증 관리",
    },
  ];

  return (
    <>
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-8 text-gray-900">메뉴 목록</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all duration-200"
              >
                <h2 className="text-xl font-semibold mb-2 text-gray-800">
                  {item.name}
                </h2>
                <p className="text-gray-600">{item.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
