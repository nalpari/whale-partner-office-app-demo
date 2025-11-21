import Header from "@/components/Header";
import Select from "@/components/Select";
import Breadcrumb from "@/components/Breadcrumb";
import SearchResultToggle from "@/components/SearchResultToggle";
import Button from "@/components/Button";
import PerPageSelect from "@/components/PerPageSelect";
import TemplateCard from "@/components/TemplateCard";
import Pagination from "@/components/Pagination";

const mockData = [
  {
    number: 1,
    status: "운영",
    company: "주식회사 따름인",
    templateName: "표준 가맹점 계약서",
    registrant: "홍길동",
    registrationDate: "2025.01.01"
  },
  {
    number: 2,
    status: "운영",
    company: "주식회사 따름인",
    templateName: "표준 가맹점 계약서",
    registrant: "홍길동",
    registrationDate: "2025.01.01"
  },
  {
    number: 3,
    status: "운영",
    company: "주식회사 따름인",
    templateName: "표준 가맹점 계약서",
    registrant: "홍길동",
    registrationDate: "2025.01.01"
  },
  {
    number: 4,
    status: "운영",
    company: "주식회사 따름인",
    templateName: "표준 가맹점 계약서",
    registrant: "홍길동",
    registrationDate: "2025.01.01"
  }
];

export default function TemplatesPage() {
  return (
    <>
      <Header />
      <div className="page-container">
      <Select />
      <div className="page-body">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">계약서 템플릿 관리</h1>
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
        <SearchResultToggle count={128} />

        <div className="tables-section">
          <div className="tables-header">
            <Button variant="primary">등록</Button>
            <PerPageSelect value={50} />
          </div>

          <div className="template-list">
            <div className="template-list-cards">
              <TemplateCard data={mockData[0]} />
              <TemplateCard data={mockData[1]} isSelected isDraggable />
              <TemplateCard data={mockData[2]} />
              <TemplateCard data={mockData[3]} />
            </div>

            <div className="pagination-wrapper">
              <Pagination totalPages={5} currentPage={1} />
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
    </>
  );
}
