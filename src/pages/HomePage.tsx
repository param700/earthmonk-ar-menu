import { menuCategories } from "@/data/menuData";
import Header from "@/components/Header";
import CategoryCard from "@/components/CategoryCard";
import { Leaf } from "lucide-react";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative py-8 md:py-12 px-4">
        <div className="container mx-auto text-center">
          {/* Decorative Leaf */}
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-sage/10 flex items-center justify-center">
              <Leaf className="w-6 h-6 text-sage" />
            </div>
          </div>

          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-3">
            Our <span className="text-primary">Menu</span>
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Explore our selection of vegetarian delights inspired by Italian, Thai, and Continental cuisines
          </p>
        </div>

        {/* Botanical Decorations */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none">
          <svg viewBox="0 0 100 100" fill="currentColor" className="text-forest w-full h-full">
            <path d="M50 0 C60 20 80 30 100 50 C80 70 60 80 50 100 C40 80 20 70 0 50 C20 30 40 20 50 0" />
          </svg>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-6 px-4 pb-12">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
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

      {/* Footer */}
      <footer className="bg-earth text-cream py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex justify-center mb-4">
            <div className="w-10 h-10 rounded-full bg-sage/20 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-sage" />
            </div>
          </div>
          <h3 className="font-display text-xl mb-2">The House of Earthmonk</h3>
          <p className="text-cream/60 text-sm mb-4">
            Nature's Kitchen • Anand & Vadodara
          </p>
          <div className="flex justify-center gap-6 text-sm text-cream/50">
            <span>Italian</span>
            <span>•</span>
            <span>Thai</span>
            <span>•</span>
            <span>Continental</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
