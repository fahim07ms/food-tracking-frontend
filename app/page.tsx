"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  UtensilsCrossed,
  Leaf,
  TrendingDown,
  Database,
  ScanLine,
  Heart,
  Users,
  BarChart3,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Apple,
  FishIcon,
  WheatIcon,
} from "lucide-react";

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/20 to-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 animate-fade-in-left">
              <Image
                src="/logo.png"
                alt="Poriman Logo"
                width={50}
                height={50}
                className="rounded-full"
              />
              <span className="text-2xl font-bold text-primary">Poriman</span>
            </div>
            <div className="flex items-center gap-4 animate-fade-in-right">
              <Link
                href="/login"
                className="px-6 py-2 text-foreground hover:text-primary transition-colors font-medium"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-6 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all hover:scale-105 font-medium shadow-lg"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-full mb-6 border border-secondary">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-secondary-foreground">
                SDG 2 & SDG 12 Powered Platform
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary-foreground to-primary bg-clip-text text-transparent leading-tight">
              Smart Food Management
              <br />
              for a Sustainable Future
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Track, manage, and optimize your food consumption with AI-powered
              insights. Reduce waste, save money, and contribute to Zero Hunger
              goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/dashboard"
                className="group px-8 py-4 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all hover:scale-105 font-semibold shadow-2xl flex items-center gap-2 text-lg"
              >
                Access Dashboard
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/register"
                className="px-8 py-4 bg-secondary text-secondary-foreground rounded-full hover:bg-secondary/80 transition-all hover:scale-105 font-semibold shadow-lg text-lg"
              >
                Start Free Trial
              </Link>
            </div>
          </div>

          {/* Floating Food Icons Animation */}
          <div className="relative mt-20 h-64">
            <div className="absolute top-0 left-1/4 animate-float">
              <Apple className="w-16 h-16 text-primary/30" />
            </div>
            <div className="absolute top-20 right-1/4 animate-float animation-delay-2000">
              <FishIcon className="w-14 h-14 text-secondary-foreground/30" />
            </div>
            <div className="absolute bottom-10 left-1/3 animate-float animation-delay-1000">
              <WheatIcon className="w-12 h-12 text-primary/40" />
            </div>
            <div className="absolute top-10 right-1/3 animate-bounce-slow">
              <UtensilsCrossed className="w-20 h-20 text-primary/20" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 bg-card/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Powerful Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage your food efficiently and sustainably
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <FeatureCard
              icon={<ShieldCheck className="w-8 h-8" />}
              title="Smart Authentication"
              description="Secure user registration and login with comprehensive profile management for individuals and families"
              delay="0"
            />

            {/* Feature 2 */}
            <FeatureCard
              icon={<Users className="w-8 h-8" />}
              title="Profile Management"
              description="Track household size, dietary preferences, budget range, and consumption patterns all in one place"
              delay="100"
            />

            {/* Feature 3 */}
            <FeatureCard
              icon={<UtensilsCrossed className="w-8 h-8" />}
              title="Daily Food Logging"
              description="Easily log your daily food consumption with smart categorization and quantity tracking"
              delay="200"
            />

            {/* Feature 4 */}
            <FeatureCard
              icon={<Database className="w-8 h-8" />}
              title="Smart Inventory"
              description="Manage your food inventory with expiration tracking, quantity monitoring, and automated alerts"
              delay="300"
            />

            {/* Feature 5 */}
            <FeatureCard
              icon={<ScanLine className="w-8 h-8" />}
              title="Receipt Scanning"
              description="Upload and scan receipts or food labels to automatically add items to your inventory"
              delay="400"
            />

            {/* Feature 6 */}
            <FeatureCard
              icon={<TrendingDown className="w-8 h-8" />}
              title="Waste Reduction"
              description="Get intelligent recommendations to minimize food waste and maximize usage efficiency"
              delay="500"
            />

            {/* Feature 7 */}
            <FeatureCard
              icon={<BarChart3 className="w-8 h-8" />}
              title="Consumption Analytics"
              description="View detailed summaries and insights about your food consumption patterns and trends"
              delay="600"
            />

            {/* Feature 8 */}
            <FeatureCard
              icon={<Leaf className="w-8 h-8" />}
              title="Sustainability Tips"
              description="Access curated resources on waste reduction, nutrition, and sustainable practices"
              delay="700"
            />

            {/* Feature 9 */}
            <FeatureCard
              icon={<Heart className="w-8 h-8" />}
              title="Budget-Friendly"
              description="Plan nutritious meals within your budget and track spending on food items"
              delay="800"
            />
          </div>
        </div>
      </section>

      {/* SDG Impact Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left">
              <h2 className="text-4xl font-bold mb-6 text-foreground">
                Contributing to Global Goals
              </h2>
              <div className="space-y-6">
                <ImpactCard
                  number="2"
                  title="Zero Hunger"
                  description="Improve food security and nutrition access for individuals and communities through smart tracking and planning"
                />
                <ImpactCard
                  number="12"
                  title="Responsible Consumption"
                  description="Reduce waste and promote sustainable practices through mindful food tracking and management"
                />
              </div>
            </div>
            <div className="relative animate-slide-in-right">
              <div className="bg-gradient-to-br from-primary/20 to-secondary/30 rounded-3xl p-12 backdrop-blur-sm border border-border">
                <div className="grid grid-cols-2 gap-8 text-center">
                  <StatCard number="30%" label="Less Food Waste" />
                  <StatCard number="25%" label="Budget Savings" />
                  <StatCard number="50+" label="Recipes Available" />
                  <StatCard number="100+" label="Sustainability Tips" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 bg-card/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Create Your Profile"
              description="Sign up and set your household details, dietary preferences, and budget goals"
            />
            <StepCard
              number="2"
              title="Track Your Food"
              description="Log daily consumption, manage inventory, and scan receipts for automatic entry"
            />
            <StepCard
              number="3"
              title="Get Insights"
              description="Receive personalized recommendations, track waste reduction, and achieve your goals"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-gradient-to-r from-primary to-secondary-foreground rounded-3xl p-12 text-center shadow-2xl animate-pulse-slow">
            <h2 className="text-4xl font-bold mb-4 text-primary-foreground">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8">
              Join thousands of users making a difference in food sustainability
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-background text-foreground rounded-full hover:bg-background/90 transition-all hover:scale-105 font-semibold shadow-lg text-lg"
            >
              Get Started for Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Poriman Logo"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="text-xl font-bold text-primary">Poriman</span>
            </div>
            <p className="text-muted-foreground text-center">
              © 2025 Poriman. Empowering sustainable food management.
            </p>
            <div className="flex gap-6">
              <Link
                href="/dashboard"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/resources"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Resources
              </Link>
              <Link
                href="/login"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Feature Card Component
function FeatureCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: string;
}) {
  return (
    <div
      className="group p-6 bg-card rounded-2xl border border-border hover:border-primary/50 transition-all hover:shadow-xl hover:-translate-y-2 cursor-pointer animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-primary">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-foreground">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

// Impact Card Component
function ImpactCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-16 h-16 bg-primary rounded-xl flex items-center justify-center text-2xl font-bold text-primary-foreground">
        {number}
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2 text-foreground">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="animate-scale-in">
      <div className="text-4xl font-bold text-primary mb-2">{number}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

// Step Card Component
function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="relative">
      <div className="bg-card rounded-2xl p-8 border border-border hover:shadow-xl transition-all hover:-translate-y-2">
        <div className="absolute -top-6 left-8 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-xl font-bold text-primary-foreground shadow-lg">
          {number}
        </div>
        <h3 className="text-xl font-semibold mb-3 mt-4 text-foreground">
          {title}
        </h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
