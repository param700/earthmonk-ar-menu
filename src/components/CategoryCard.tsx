import { Link } from "react-router-dom";
import { Category } from "@/data/menuData";
import { ArrowUpRight } from "lucide-react";
import OptimizedImage from "@/components/OptimizedImage";

interface CategoryCardProps {
  category: Category;
  index: number;
}

const CategoryCard = ({ category, index }: CategoryCardProps) => {
  // Determine if this category should have a label
  const showLabel = category.slug === "continental";

  return (
    <Link
      to={`/category/${category.slug}`}
      className="category-card group block opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
    >
      <div className="relative aspect-video md:h-[320px] overflow-hidden">
        {/* Background Image */}
        <OptimizedImage
          src={category.thumbnail}
          alt={category.name}
          className="category-card-image"
          width={640}
          height={320}
          loading="lazy"
          showBlurPlaceholder={true}
        />
        
        {/* Dark Gradient Overlay */}
        <div className="category-card-overlay" />
        
        {/* Optional Category Label (centered at top) */}
        {showLabel && (
          <div className="absolute top-5 left-0 right-0 text-center">
            <span className="category-label">Main Course</span>
          </div>
        )}
        
        {/* Content - Bottom Left */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
          <h3 className="font-display text-2xl md:text-3xl text-white mb-2 transition-colors duration-300">
            {category.name}
          </h3>
          <p className="text-muted-foreground text-sm md:text-base line-clamp-2 mb-2 max-w-md">
            {category.description}
          </p>
          <span className="text-primary text-sm font-normal">
            {category.items.length} items
          </span>
        </div>

        {/* Arrow Button - Bottom Right */}
        <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8">
          <div className="arrow-button">
            <ArrowUpRight className="w-5 h-5 text-white transform -rotate-0" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
