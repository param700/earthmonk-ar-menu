import { Link } from "react-router-dom";
import { Category } from "@/data/menuData";

interface CategoryCardProps {
  category: Category;
  index: number;
}

const CategoryCard = ({ category, index }: CategoryCardProps) => {
  return (
    <Link
      to={`/category/${category.slug}`}
      className="category-card group block opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        {/* Background Image */}
        <img
          src={category.thumbnail}
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Gradient Overlay */}
        <div 
          className="absolute inset-0 bg-gradient-to-t from-earth-dark/80 via-earth-dark/20 to-transparent"
        />
        
        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <h3 className="font-display text-2xl text-cream mb-2 group-hover:text-terracotta-light transition-colors duration-300">
            {category.name}
          </h3>
          <p className="text-cream/80 text-sm line-clamp-2">
            {category.description}
          </p>
          <div className="mt-3 flex items-center gap-2 text-sage-light text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span>Explore Menu</span>
            <svg 
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* Item Count Badge */}
        <div className="absolute top-4 right-4 bg-cream/90 backdrop-blur-sm px-3 py-1 rounded-full">
          <span className="text-earth text-sm font-medium">{category.items.length} items</span>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
