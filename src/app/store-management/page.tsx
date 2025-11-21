import Header from "@/components/Header";
import Select from "@/components/Select";
import Breadcrumb from "@/components/Breadcrumb";
import CollapsibleCard from "@/components/CollapsibleCard";

export default function StoreManagementPage() {
  const breadcrumbItems = [
    { label: "기준정보관리" },
    { label: "상품관리" },
    { label: "상품목록", active: true },
  ];

  const cardData1 = [
    {
      label: "본사/가맹점",
      values: ["주식회사 따름인", "을지로3가점"],
    },
    {
      label: "운영여부",
      values: ["운영"],
    },
    {
      label: "점포 정보",
      values: ["힘이나는커피생활 을지로3가점", "105-88-00000", "서울"],
    },
    {
      label: "연락처 정보",
      values: ["02-333-9999", "02-333-9998", "abc@abc.com"],
    },
  ];

  const cardData2 = [
    {
      label: "본사/가맹점",
      values: ["주식회사 따름인", "을지로3가점"],
    },
    {
      label: "운영여부",
      values: ["운영"],
    },
    {
      label: "점포 정보",
      values: ["힘이나는커피생활 을지로3가점", "105-88-00000", "서울"],
    },
    {
      label: "연락처 정보",
      values: ["02-333-9999", "02-333-9998", "abc@abc.com"],
    },
  ];

  const cardData3 = [
    {
      label: "본사/가맹점",
      values: ["주식회사 따름인", "을지로3가점"],
    },
    {
      label: "운영여부",
      values: ["운영"],
    },
    {
      label: "점포 정보",
      values: ["힘이나는커피생활 을지로3가점", "105-88-00000", "서울"],
    },
    {
      label: "연락처 정보",
      values: ["02-333-9999", "02-333-9998", "abc@abc.com"],
    },
  ];

  return (
    <>
      <Header />
      <div className="page-container">
        <Select />
        <div className="page-body">
          <div className="page-title-section">
            <h1 className="page-title">점포 정보 관리</h1>
            <Breadcrumb items={breadcrumbItems} />
          </div>
          <div className="page-content">
            <div className="store-management-body">
              <div className="store-management-top-actions">
                <button className="store-btn-gray" type="button">
                  삭제
                </button>
                <button className="store-btn-basic" type="button">
                  목록
                </button>
              </div>
              <div className="store-management-cards">
                <CollapsibleCard
                  title="가맹점 계약 Header 정보"
                  actions={[{ label: "수정" }]}
                  data={cardData1}
                />
                <CollapsibleCard
                  title="가맹점 계약 Header 정보"
                  actions={[{ label: "삭제" }, { label: "저장" }]}
                  data={cardData2}
                />
                <CollapsibleCard
                  title="가맹점 계약 Header 정보"
                  actions={[{ label: "수정" }, { label: "삭제" }, { label: "저장" }]}
                  data={cardData3}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
