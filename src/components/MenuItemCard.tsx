import { Link } from "react-router-dom";
import { MenuItem } from "@/data/menuData";
import { Flame, Star, Eye, Box } from "lucide-react";
import OptimizedImage from "@/components/OptimizedImage";

interface MenuItemCardProps {
  item: MenuItem;
  categorySlug: string;
  index: number;
}

const MenuItemCard = ({ item, categorySlug, index }: MenuItemCardProps) => {
  return (
    <div 
      className="menu-card opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${index * 0.08}s`, animationFillMode: 'forwards' }}
    >
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <OptimizedImage
          src={item.image}
          alt={item.name}
          className="w-full h-full"
          width={400}
          loading="lazy"
          showBlurPlaceholder={true}
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {/* Veg Badge */}
          <div className="veg-badge bg-cream" title="Vegetarian" />
          
          {item.isSpicy && (
            <div className="bg-cream/90 backdrop-blur-sm p-1.5 rounded-full" title="Spicy">
              <Flame className="w-3.5 h-3.5 text-red-500" />
            </div>
          )}
          
          {item.isPopular && (
            <div className="bg-honey/90 backdrop-blur-sm p-1.5 rounded-full" title="Popular">
              <Star className="w-3.5 h-3.5 text-cream fill-cream" />
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-display text-lg text-foreground leading-tight">
            {item.name}
          </h3>
          <span className="price-tag text-lg whitespace-nowrap">
            {item.currency}{item.price}
          </span>
        </div>
        
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
          {item.description}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link
            to={`/item/${categorySlug}/${item.slug}`}
            className="btn-secondary flex-1 text-sm py-2.5 gap-2"
          >
            <Box className="w-4 h-4" />
            View in 3D
          </Link>
          <Link
            to={`/item/${categorySlug}/${item.slug}?ar=true`}
            className="btn-primary flex-1 text-sm py-2.5 gap-2"
          >
            <Eye className="w-4 h-4" />
            View in AR
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;
