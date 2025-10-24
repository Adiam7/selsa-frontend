// src/components/product/VariantSelector.tsx

"use client";

import { ProductVariant, ProductOptionType } from "@/types/product"; // Adjust the import path as necessary
import { useState, useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface VariantSelectorProps {
  variants: ProductVariant[];
}

export function VariantSelector({ variants }: VariantSelectorProps) {
  const allOptions = useMemo(() => {
    const optionMap = new Map<number, ProductOptionType>();

    variants.forEach(variant => {
      variant.option_values.forEach(({ option_type }) => {
        optionMap.set(option_type.id, option_type);
      });
    });

    return Array.from(optionMap.values());
  }, [variants]);

  const [selectedOptions, setSelectedOptions] = useState<Record<number, string>>({});

  const handleChange = (optionTypeId: number, value: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionTypeId]: value,
    }));
  };

  return (
    <div className="space-y-4">
      {allOptions.map(optionType => {
        const values = Array.from(
          new Set(
            variants
              .flatMap(v =>
                v.option_values
                  .filter(ov => ov.option_type.id === optionType.id)
                  .map(ov => ov.value)
              )
          )
        );

        return (
          <div key={optionType.id} className="space-y-1">
            <Label>{optionType.name}</Label>
            <Select
              onValueChange={(value) => handleChange(optionType.id, value)}
              value={selectedOptions[optionType.id] || ""}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Select ${optionType.name}`} />
              </SelectTrigger>
              <SelectContent>
                {values.map(value => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      })}
    </div>
  );
}
