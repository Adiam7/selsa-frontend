import React from 'react';
import { Category } from '../../../types/category';


interface Props {
  categories: Category[];
  onSelect?: (category: Category) => void;
}

export const CategoryList: React.FC<Props> = ({ categories, onSelect }) => {
  return (
    <ul>
      {categories.map((category) => (
        <li key={category.id} onClick={() => onSelect?.(category)}>
          {category.name}
        </li>
      ))}
    </ul>
  );
};
