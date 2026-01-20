import { menuCategories } from "@/data/menuData";
import Header from "@/components/Header";
import CategoryCard from "@/components/CategoryCard";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative py-16 md:py-20 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-4 leading-tight">
            Our <span className="text-primary">Menu</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-xl mx-auto">
            Explore our curated selection of gourmet dishes, crafted with passion and premium ingredients
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="px-4 md:px-6 lg:px-10 pb-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {menuCategories.map((category, index) => (
              <CategoryCard 
                key={category.id} 
                category={category} 
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer Text */}
      <footer className="py-10 px-4 text-center">
        <p className="text-sm text-muted-foreground/60">
          Tap any category to explore • View items in 3D & AR
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
