import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { 
  ChevronRight, MapPin, CheckCircle2, ArrowRight,
  BarChart3, Briefcase, Wrench, Lightbulb, Building2,
  Users, Zap, Shield, TrendingUp, AlertCircle, 
  Menu, X, ExternalLink, PlayCircle
} from "lucide-react";

// Scroll animation hook
function useScrollAnimation() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

// Animated counter
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const { ref, isVisible } = useScrollAnimation();

  useEffect(() => {
    if (!isVisible) return;
    
    let start = 0;
    const increment = Math.ceil(value / 30);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 30);
    
    return () => clearInterval(timer);
  }, [isVisible, value]);

  return <div ref={ref}>{count}{suffix}</div>;
}

export default function Index() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const services = [
    {
      number: "01",
      icon: BarChart3,
      title: "Quantity Surveying & Cost Management",
      description: "Rigorous financial oversight to maximize value and ensure cost certainty throughout the construction lifecycle.",
      points: ["Cost Estimating", "Budget Monitoring", "Value Engineering"]
    },
    {
      number: "02",
      icon: Briefcase,
      title: "Project Management",
      description: "Strategic leadership and structured control across every phase of construction projects from inception to completion.",
      points: ["Design Coordination", "Risk Management", "Stakeholder Management"]
    },
    {
      number: "03",
      icon: Wrench,
      title: "Construction Management",
      description: "Structured execution, site leadership, and operational control with stringent quality and safety standards.",
      points: ["Site Supervision", "Quality Assurance", "Schedule Control"]
    },
    {
      number: "04",
      icon: Lightbulb,
      title: "Technical Advisory",
      description: "Specialist technical advisory services addressing construction industry evolution and contractual complexity.",
      points: ["Technical Expertise", "Problem Solving", "Industry Standards"]
    },
    {
      number: "05",
      icon: Building2,
      title: "Turnkey Construction",
      description: "End-to-end solutions from concept to completion with single point of responsibility.",
      points: ["Design Build", "Execution", "Handover"]
    },
    {
      number: "06",
      icon: Users,
      title: "Training & Development",
      description: "Comprehensive training programs based on extensive sector experience and industry best practices.",
      points: ["Skill Development", "Industry Standards", "Career Growth"]
    },
  ];

  const features = [
    { icon: Shield, title: "Expert Team", desc: "Experienced professionals with deep sector knowledge" },
    { icon: TrendingUp, title: "Proven Track Record", desc: "50+ successful projects across East Africa" },
    { icon: Zap, title: "Cost Efficiency", desc: "Value-driven solutions without compromising quality" },
    { icon: Users, title: "Client-Centric", desc: "Personalized approach and transparent communication" },
  ];

  return (
    <div className="bg-white text-black overflow-hidden">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">TQ</span>
            </div>
            <div>
              <div className="text-lg font-bold text-black">T&W QUANTUS</div>
              <div className="text-xs text-gray-600">Construction Excellence</div>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-gray-700 hover:text-brand transition relative group">
              Services
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#about" className="text-gray-700 hover:text-brand transition relative group">
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#contact" className="text-gray-700 hover:text-brand transition relative group">
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand group-hover:w-full transition-all duration-300"></span>
            </a>
            <button className="btn-brand">Get Started</button>
          </nav>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white p-6 space-y-4 animate-slide-up">
            <a href="#services" className="block text-gray-700 hover:text-brand transition">Services</a>
            <a href="#about" className="block text-gray-700 hover:text-brand transition">About</a>
            <a href="#contact" className="block text-gray-700 hover:text-brand transition">Contact</a>
            <button className="btn-brand w-full">Get Started</button>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section ref={heroRef} className="pt-24 pb-0 overflow-hidden bg-black text-white relative min-h-screen flex items-center">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-gray-900"></div>
          
          {/* Animated gradient blobs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "4s" }}></div>
          <div className="absolute bottom-20 left-10 w-72 h-72 bg-brand/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "6s", animationDelay: "1s" }}></div>
          
          {/* Parallax grid */}
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: "linear-gradient(0deg, transparent 24%, rgba(48, 87, 90, 0.1) 25%, rgba(48, 87, 90, 0.1) 26%, transparent 27%, transparent 74%, rgba(48, 87, 90, 0.1) 75%, rgba(48, 87, 90, 0.1) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(48, 87, 90, 0.1) 25%, rgba(48, 87, 90, 0.1) 26%, transparent 27%, transparent 74%, rgba(48, 87, 90, 0.1) 75%, rgba(48, 87, 90, 0.1) 76%, transparent 77%, transparent)",
              backgroundSize: "50px 50px",
              transform: `translateY(${scrollY * 0.5}px)`,
            }}
          ></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-32 md:py-0 w-full">
          <div className="max-w-3xl">
            <div className="inline-block mb-6 px-4 py-2 rounded-full bg-brand/10 border border-brand/30 animate-slide-up" style={{ animationDuration: "0.6s" }}>
              <span className="text-sm text-brand font-semibold">🏗️ Building Excellence Since 2025</span>
            </div>
            
            <h1 className="section-title text-white mb-6 leading-tight animate-slide-up" style={{ animationDuration: "0.8s", animationDelay: "0.1s" }}>
              Transforming Construction Projects 
              <span className="text-brand block">with Precision</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed animate-slide-up" style={{ animationDuration: "0.8s", animationDelay: "0.2s" }}>
              From quantity surveying to complete project management, we deliver comprehensive construction solutions across the East African region and beyond.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDuration: "0.8s", animationDelay: "0.3s" }}>
              <button className="btn-brand group relative overflow-hidden">
                <span className="relative z-10 flex items-center">
                  Explore Our Services
                  <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition" />
                </span>
                <div className="absolute inset-0 bg-brand-light transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 z-0"></div>
              </button>
              <button className="btn-outline group">
                Schedule Consultation
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition" />
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-brand rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-brand rounded-full"></div>
          </div>
        </div>

        {/* Floating accent elements */}
        <div className="absolute top-32 right-20 w-2 h-2 bg-brand rounded-full animate-pulse"></div>
        <div className="absolute bottom-40 left-32 w-3 h-3 bg-brand/50 rounded-full animate-pulse" style={{ animationDelay: "1s" }}></div>
      </section>

      {/* Stats Section with animated counters */}
      <section className="bg-gray-50 section-padding border-t-2 border-brand relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-brand to-transparent opacity-20"></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { number: 10, label: "Years of Excellence", icon: TrendingUp },
              { number: 50, label: "Successful Projects", icon: Building2 },
              { number: 15, label: "Service Categories", icon: Briefcase },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={idx} 
                  className="text-center group hover:scale-105 transition-transform duration-300"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand/10 mb-4 group-hover:bg-brand/20 transition">
                    <Icon className="w-8 h-8 text-brand" />
                  </div>
                  <div className="text-5xl md:text-6xl font-bold text-brand mb-3">
                    <AnimatedCounter value={stat.number} suffix="+" />
                  </div>
                  <div className="text-gray-600 text-lg">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section with staggered animations */}
      <section id="services" className="section-padding bg-white relative">
        <div className="absolute top-0 left-0 w-1 h-20 bg-gradient-to-b from-brand to-transparent opacity-20"></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <div className="inline-block mb-4">
              <span className="text-sm font-bold text-brand uppercase tracking-wider">Our Services</span>
            </div>
            <h2 className="section-title text-black mb-4">
              Comprehensive Construction 
              <span className="block">Solutions</span>
            </h2>
            <div className="h-1 w-20 bg-brand rounded-full"></div>
            
            {/* Decorative line */}
            <div className="absolute top-32 left-0 h-px w-32 bg-gradient-to-r from-brand/50 to-transparent mt-8"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, idx) => {
              const Icon = service.icon;
              const { ref, isVisible } = useScrollAnimation();
              
              return (
                <div
                  key={idx}
                  ref={ref}
                  className={`group p-8 border-2 border-gray-100 rounded-lg hover:border-brand hover:shadow-2xl transition-all duration-500 overflow-hidden relative ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={{
                    transitionDelay: isVisible ? `${idx * 0.1}s` : "0s",
                  }}
                >
                  {/* Background gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                  
                  <div className="flex items-start justify-between mb-6">
                    <div className="text-5xl font-bold text-gray-200 group-hover:text-brand transition duration-300">
                      {service.number}
                    </div>
                    <Icon className="w-10 h-10 text-brand opacity-40 group-hover:opacity-100 transition duration-300 group-hover:scale-110" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-black mb-3 group-hover:text-brand transition duration-300">{service.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {service.points.map((point, pidx) => (
                      <span 
                        key={pidx} 
                        className="text-xs font-semibold text-brand bg-brand/10 px-3 py-1 rounded-full group-hover:bg-brand/20 transition"
                      >
                        {point}
                      </span>
                    ))}
                  </div>

                  {/* Animated underline on hover */}
                  <div className="absolute bottom-0 left-0 h-1 bg-brand transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </div>
              );
            })}
          </div>

          {/* CTA for all services */}
          <div className="mt-16 text-center">
            <button className="btn-brand group relative overflow-hidden">
              <span className="relative z-10 flex items-center justify-center">
                View All Services
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition" />
              </span>
              <div className="absolute inset-0 bg-brand-light transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 z-0"></div>
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Features Section */}
      <section className="section-padding bg-gray-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand/5 rounded-full blur-3xl -z-10"></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block mb-4">
                <span className="text-sm font-bold text-brand uppercase tracking-wider">Why Choose Us</span>
              </div>
              <h2 className="section-title text-black mb-8">
                Built on Integrity, <br/>
                Delivered with Excellence
              </h2>
              
              <div className="space-y-6">
                {features.map((feature, idx) => {
                  const { ref, isVisible } = useScrollAnimation();
                  const Icon = feature.icon;
                  
                  return (
                    <div 
                      key={idx}
                      ref={ref}
                      className={`flex gap-4 group transition-all duration-500 ${
                        isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                      }`}
                      style={{ transitionDelay: isVisible ? `${idx * 0.1}s` : "0s" }}
                    >
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-brand/10 group-hover:bg-brand group-hover:text-white transition-all duration-300">
                          <Icon className="w-6 h-6 text-brand group-hover:text-white transition" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-black mb-1 group-hover:text-brand transition">{feature.title}</h3>
                        <p className="text-gray-600 group-hover:text-gray-700 transition">{feature.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button className="btn-brand mt-8 group relative overflow-hidden">
                <span className="relative z-10 flex items-center">
                  Learn More About Us
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition" />
                </span>
                <div className="absolute inset-0 bg-brand-light transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 z-0"></div>
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-brand/20 to-brand/5 rounded-2xl blur-3xl"></div>
              <div className="relative bg-white rounded-2xl p-12 border-2 border-brand/20 shadow-lg">
                <div className="space-y-8">
                  {[
                    { title: "Precision", desc: "Accurate evaluation and optimal project outcomes", icon: AlertCircle },
                    { title: "Reliability", desc: "Consistent delivery of high-quality construction results", icon: Shield },
                    { title: "Impact", desc: "Measurable value creation for communities and stakeholders", icon: TrendingUp },
                  ].map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div key={idx} className="border-l-4 border-brand pl-6 hover:pl-8 transition-all duration-300 group">
                        <div className="flex items-center gap-3 mb-2">
                          <Icon className="w-5 h-5 text-brand" />
                          <h3 className="text-2xl font-bold text-black group-hover:text-brand transition">{item.title}</h3>
                        </div>
                        <p className="text-gray-600">{item.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Offices / Our Presence */}
      <section id="about" className="section-padding bg-white relative">
        <div className="absolute bottom-0 right-0 w-1 h-40 bg-gradient-to-t from-brand to-transparent opacity-20"></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <div className="inline-block mb-4">
              <span className="text-sm font-bold text-brand uppercase tracking-wider">Our Presence</span>
            </div>
            <h2 className="section-title text-black mb-4">
              Serving the East <br/>
              African Region
            </h2>
            <div className="h-1 w-20 bg-brand rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { city: "Kigali", country: "Rwanda", desc: "Our headquarters in Gasabo, serving clients across East Africa and globally.", icon: MapPin },
              { city: "East African Hub", country: "Regional", desc: "Strategic partnerships across Kenya, Uganda, Tanzania, and Burundi.", icon: Building2 },
            ].map((office, idx) => {
              const { ref, isVisible } = useScrollAnimation();
              const Icon = office.icon;
              
              return (
                <div 
                  key={idx}
                  ref={ref}
                  className={`group bg-gradient-to-br from-gray-50 to-white rounded-lg overflow-hidden border-2 border-gray-100 hover:border-brand hover:shadow-2xl transition-all duration-500 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: isVisible ? `${idx * 0.1}s` : "0s" }}
                >
                  <div className="h-40 bg-gradient-to-br from-brand/20 to-brand/5 flex items-center justify-center group-hover:from-brand/30 group-hover:to-brand/10 transition relative overflow-hidden">
                    <Icon className="w-16 h-16 text-brand/40 group-hover:text-brand/60 transition group-hover:scale-110 group-hover:-rotate-12 duration-300" />
                    
                    {/* Animated background elements */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition">
                      <div className="absolute top-2 right-2 w-1 h-1 bg-brand rounded-full animate-pulse"></div>
                      <div className="absolute bottom-4 left-4 w-1 h-1 bg-brand rounded-full animate-pulse" style={{ animationDelay: "0.5s" }}></div>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-black mb-1 group-hover:text-brand transition">{office.city}</h3>
                    <p className="text-sm text-brand font-semibold mb-4">{office.country}</p>
                    <p className="text-gray-600 mb-6 group-hover:text-gray-700 transition">{office.desc}</p>
                    <a 
                      href="mailto:twquantus2025@gmail.com" 
                      className="inline-flex items-center text-brand font-semibold hover:gap-3 transition-all duration-300 group/link"
                    >
                      Get in Touch
                      <ChevronRight className="ml-2 w-4 h-4 group-hover/link:translate-x-1 transition" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="section-padding bg-black text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDuration: "4s" }}></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand/5 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDuration: "6s", animationDelay: "1s" }}></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="section-title text-white mb-6 animate-slide-up" style={{ animationDuration: "0.6s" }}>
            Ready to Transform <br/>
            Your Project?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDuration: "0.6s", animationDelay: "0.1s" }}>
            Partner with T&W QUANTUS for comprehensive construction solutions tailored to your needs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDuration: "0.6s", animationDelay: "0.2s" }}>
            <button className="btn-brand group relative overflow-hidden">
              <span className="relative z-10 flex items-center justify-center">
                Schedule Consultation
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition" />
              </span>
              <div className="absolute inset-0 bg-brand-light transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 z-0"></div>
            </button>
            <a 
              href="mailto:twquantus2025@gmail.com" 
              className="btn-outline"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 section-padding relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/30 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 pb-12 border-b border-gray-800">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">TQ</span>
                </div>
                <div>
                  <div className="text-white font-bold text-sm">T&W QUANTUS</div>
                  <div className="text-xs text-gray-500">Excellence in Construction</div>
                </div>
              </div>
              <p className="text-sm mt-4">Transforming construction through precision, integrity, and innovation.</p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-brand" />
                Services
              </h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#services" className="hover:text-brand hover:translate-x-1 inline-flex transition-all">Quantity Surveying</a></li>
                <li><a href="#services" className="hover:text-brand hover:translate-x-1 inline-flex transition-all">Project Management</a></li>
                <li><a href="#services" className="hover:text-brand hover:translate-x-1 inline-flex transition-all">Construction Mgmt</a></li>
                <li><a href="#services" className="hover:text-brand hover:translate-x-1 inline-flex transition-all">Technical Advisory</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-brand" />
                Company
              </h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#about" className="hover:text-brand hover:translate-x-1 inline-flex transition-all">About Us</a></li>
                <li><a href="#contact" className="hover:text-brand hover:translate-x-1 inline-flex transition-all">Contact</a></li>
                <li><a href="/" className="hover:text-brand hover:translate-x-1 inline-flex transition-all">Careers</a></li>
                <li><a href="/" className="hover:text-brand hover:translate-x-1 inline-flex transition-all">Blog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand" />
                Contact
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-brand">📍</span>
                  <span>Gasabo, Kigali, Rwanda</span>
                </li>
                <li className="flex items-center gap-2 hover:text-brand transition">
                  <span>📞</span>
                  <a href="tel:+250780410570">+250 780 410 570</a>
                </li>
                <li className="flex items-center gap-2 hover:text-brand transition">
                  <span>✉️</span>
                  <a href="mailto:twquantus2025@gmail.com">twquantus2025@gmail.com</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
            <p>&copy; 2025 T&W QUANTUS LTD. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="/" className="hover:text-brand transition flex items-center gap-1">Privacy Policy <ExternalLink className="w-3 h-3" /></a>
              <a href="/" className="hover:text-brand transition flex items-center gap-1">Terms of Service <ExternalLink className="w-3 h-3" /></a>
              <a href="/" className="hover:text-brand transition flex items-center gap-1">Legal Notice <ExternalLink className="w-3 h-3" /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
