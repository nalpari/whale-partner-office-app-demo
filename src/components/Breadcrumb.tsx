interface BreadcrumbItem {
  label: string;
  active?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <div className="breadcrumb">
      {items.map((item, index) => (
        <div key={index} className="breadcrumb-wrapper">
          <div className={item.active ? "breadcrumb-item-active" : "breadcrumb-item"}>
            {item.label}
          </div>
          {index < items.length - 1 && (
            <svg className="breadcrumb-separator" width="5" height="8" viewBox="0 0 5 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.5 7.5L4 4L0.5 0.5" stroke="#999999" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}
