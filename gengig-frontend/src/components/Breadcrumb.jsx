import { Link } from "react-router-dom";


export default function Breadcrumb({ items }) {
    return (
        <p className="text-xs mb-6" style={{ color: "#B2B2D2" }}>
            {items.map((item, i) => (
                <span key={i}>
                    {i > 0 && " › "}
                    {item.to ? (
                        <Link
                            to={item.to}
                            className="hover:text-[#FFC085] transition-colors">
                            {item.label}
                        </Link>
                    ) : (
                        <span style={{ color: "#FFC085" }}>{item.label}</span>
                    )}
                </span>
            ))}
        </p>
    );
}