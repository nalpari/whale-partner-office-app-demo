import Header from "@/components/Header";
import StoreSelect from "@/components/StoreSelect";
import Breadcrumb from "@/components/Breadcrumb";
import StoreInfoCard from "@/components/StoreInfoCard";
import OperatingHoursCard from "@/components/OperatingHoursCard";

export default function StoreInfoPage() {
  return (
    <main>
      <Header />
      <div className="page-container">
        <div className="page-body">
          <div className="page-header">
            <StoreSelect value="(상담중) 동해에서잡아온- BIM1234" />
            <div className="page-title-section">
              <h1 className="page-title">점포 정보 관리</h1>
              <Breadcrumb 
                items={[
                  { label: "기준정보관리" },
                  { label: "상품관리" },
                  { label: "상품목록", active: true }
                ]}
              />
            </div>
          </div>

          <div className="page-content">
            <div className="store-management-body">
              <div className="store-management-cards">
                <StoreInfoCard />
                <OperatingHoursCard />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
