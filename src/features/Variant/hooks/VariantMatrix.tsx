import React from "react";
import { Variant } from "@/hooks/useVariantSelector";
import "./VariantMatrix.css";

interface VariantMatrixProps {
  variants: Variant[];
  selectedColor: string | null;
  selectedSize: string | null;
  onSelect: (color: string, size: string) => void;
}

export const VariantMatrix: React.FC<VariantMatrixProps> = ({
  variants,
  selectedColor,
  selectedSize,
  onSelect,
}) => {
  const colors = Array.from(new Set(variants.map(v => v.color).filter(Boolean))) as string[];
  const sizes = Array.from(new Set(variants.map(v => v.size).filter(Boolean))) as string[];

  const orderMap: Record<string, number> = { XS: 1, S: 2, M: 3, L: 4, XL: 5, XXL: 6, XXXL: 7 };
  sizes.sort((a, b) => (orderMap[a] ?? 99) - (orderMap[b] ?? 99));

  const variantMap = new Map<string, Variant>();
  for (const v of variants) {
    variantMap.set(`${v.color ?? ""}::${v.size ?? ""}`, v);
  }

  // 🟢 Helper: determine stock status
  const getStockStatus = (v?: Variant) => {
    if (!v || !v.is_available) return { label: "Out of Stock", color: "red", emoji: "🔴" };
    if (v.stock_level === undefined) return { label: "In Stock", color: "green", emoji: "🟢" };

    if (v.stock_level > 10) return { label: "In Stock", color: "green", emoji: "🟢" };
    if (v.stock_level > 0) return { label: "Low Stock", color: "orange", emoji: "🟠" };
    return { label: "Out of Stock", color: "red", emoji: "🔴" };
  };

  return (
    <div className="variant-matrix">
      <div className="matrix-header">
        <div className="matrix-cell header-cell">Color / Size</div>
        {sizes.map(size => (
          <div key={size} className="matrix-cell header-cell">
            {size}
          </div>
        ))}
      </div>

      {colors.map(color => (
        <div key={color} className="matrix-row">
          <div className="matrix-cell color-label">{color}</div>
          {sizes.map(size => {
            const variant = variantMap.get(`${color}::${size}`);
            const selected = selectedColor === color && selectedSize === size;
            const stock = getStockStatus(variant);

            return (
              <button
                key={`${color}-${size}`}
                className={`matrix-cell variant-cell 
                  ${selected ? "selected" : ""}`}
                disabled={!variant?.is_available}
                onClick={() => variant?.is_available && onSelect(color, size)}
                aria-label={`${color} ${size} ${stock.label}`}
                title={`${stock.emoji} ${stock.label}`}
              >
                <span className={`stock-dot ${stock.color}`} aria-hidden="true" />
                <span className="stock-text">{stock.emoji}</span>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};
