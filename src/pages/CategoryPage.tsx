import { useParams, Navigate } from "react-router-dom";
import { getCategoryBySlug } from "@/data/menuData";
import Header from "@/components/Header";
import MenuItemCard from "@/components/MenuItemCard";
import { Utensils } from "lucide-react";

const CategoryPage = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const category = categorySlug ? getCategoryBySlug(categorySlug) : undefined;

  if (!category) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header showBack title={category.name} />

      {/* Category Hero */}
      <section className="relative py-6 px-4">
        <div className="container mx-auto">
          {/* Category Info */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Utensils className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-2xl md:text-3xl text-foreground">
                {category.name}
              </h1>
              <p className="text-muted-foreground text-sm">
                {category.description}
              </p>
            </div>
          </div>

          {/* Items Count Badge */}
          <div className="inline-flex items-center gap-2 bg-card px-4 py-2 rounded-full shadow-soft mb-6">
            <span className="text-sm text-muted-foreground">
              {category.items.length} {category.items.length === 1 ? 'item' : 'items'} available
            </span>
          </div>
        </div>
      </section>

      {/* Menu Items Grid */}
      <section className="px-4 pb-12">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {category.items.map((item, index) => (
              <MenuItemCard
                key={item.id}
                item={item}
                categorySlug={category.slug}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Empty State */}
      {category.items.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No items available in this category.</p>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
