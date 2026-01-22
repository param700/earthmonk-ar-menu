import { useParams, useSearchParams, Navigate, Link } from "react-router-dom";
import { getItemBySlug, getCategoryBySlug } from "@/data/menuData";
import Header from "@/components/Header";
import ModelViewer from "@/components/ModelViewer";
import OptimizedImage from "@/components/OptimizedImage";
import { Flame, Star, Leaf, ChevronRight } from "lucide-react";
import { getImageUrl } from "@/lib/cloudinary";

const ItemDetailPage = () => {
  const { categorySlug, itemSlug } = useParams<{ categorySlug: string; itemSlug: string }>();
  const [searchParams] = useSearchParams();
  const startInAr = searchParams.get('ar') === 'true';
  
  const category = categorySlug ? getCategoryBySlug(categorySlug) : undefined;
  const item = categorySlug && itemSlug ? getItemBySlug(categorySlug, itemSlug) : undefined;

  if (!category || !item) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header showBack title={item.name} />

      <main className="pb-12">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/home" className="hover:text-foreground transition-colors">Menu</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to={`/category/${category.slug}`} className="hover:text-foreground transition-colors">
              {category.name}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">{item.name}</span>
          </nav>
        </div>

        {/* 3D Model Viewer */}
        {item.model3D && (
          <section className="container mx-auto px-4 mb-6">
            <ModelViewer
              modelSrc={item.model3D}
              arSrc={item.modelAR}
              itemName={item.name}
              posterImage={getImageUrl(item.image, { width: 800 })}
              startInAr={startInAr}
            />
          </section>
        )}

        {/* Item Image (if no 3D model) */}
        {!item.model3D && (
          <section className="container mx-auto px-4 mb-6">
            <div className="rounded-2xl overflow-hidden shadow-medium">
              <OptimizedImage
                src={item.image}
                alt={item.name}
                className="w-full aspect-video"
                width={800}
                loading="eager"
              />
            </div>
          </section>
        )}

        {/* Item Details */}
        <section className="container mx-auto px-4">
          <div className="bg-card rounded-2xl shadow-soft p-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="font-display text-2xl md:text-3xl text-primary mb-2">
                  {item.name}
                </h1>
                <div className="flex items-center gap-3">
                  {/* Badges */}
                  <div className="flex items-center gap-1.5 text-forest">
                    <div className="veg-badge scale-90" />
                    <span className="text-sm font-medium">Vegetarian</span>
                  </div>
                  {item.isSpicy && (
                    <div className="flex items-center gap-1 text-red-500">
                      <Flame className="w-4 h-4" />
                      <span className="text-sm font-medium">Spicy</span>
                    </div>
                  )}
                  {item.isPopular && (
                    <div className="flex items-center gap-1 text-honey">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium">Popular</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Price */}
              <div className="text-right">
                <span className="price-tag text-3xl">
                  {item.currency}{item.price}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed mb-6">
              {item.description}
            </p>

            {/* Ingredients */}
            <div>
              <h3 className="font-display text-lg text-foreground mb-3 flex items-center gap-2">
                <Leaf className="w-5 h-5 text-sage" />
                Ingredients
              </h3>
              <div className="flex flex-wrap gap-2">
                {item.ingredients.map((ingredient, index) => (
                  <span
                    key={index}
                    className="bg-sage/10 text-sage-dark px-3 py-1.5 rounded-full text-sm font-medium"
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* More from this Category */}
        <section className="container mx-auto px-4 mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl text-foreground">
              More from {category.name}
            </h2>
            <Link 
              to={`/category/${category.slug}`}
              className="text-sage text-sm font-medium hover:text-sage-dark transition-colors"
            >
              View All
            </Link>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {category.items
              .filter(i => i.id !== item.id)
              .slice(0, 4)
              .map((relatedItem) => (
                <Link
                  key={relatedItem.id}
                  to={`/item/${category.slug}/${relatedItem.slug}`}
                  className="flex-shrink-0 w-40"
                >
                  <div className="bg-card rounded-xl overflow-hidden shadow-soft hover:shadow-medium transition-shadow">
                    <OptimizedImage
                      src={relatedItem.image}
                      alt={relatedItem.name}
                      className="w-full aspect-square"
                      width={160}
                      loading="lazy"
                    />
                    <div className="p-3">
                      <h4 className="font-medium text-sm text-foreground line-clamp-1">
                        {relatedItem.name}
                      </h4>
                      <span className="text-accent text-sm font-medium">
                        {relatedItem.currency}{relatedItem.price}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ItemDetailPage;
