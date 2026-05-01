import { Link } from "react-router-dom";
import { ChevronRight, MapPin, CheckCircle2 } from "lucide-react";

export default function Index() {
  return (
    <div className="bg-white text-black">
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
          <nav className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-gray-700 hover:text-brand transition">Services</a>
            <a href="#about" className="text-gray-700 hover:text-brand transition">About</a>
            <a href="#contact" className="text-gray-700 hover:text-brand transition">Contact</a>
            <button className="btn-brand">Get Started</button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-0 overflow-hidden bg-black text-white relative">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-gray-900"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-32 md:py-48">
          <div className="max-w-3xl">
            <div className="inline-block mb-6 px-4 py-2 rounded-full bg-brand/10 border border-brand/30">
              <span className="text-sm text-brand font-semibold">Building Excellence Since 2025</span>
            </div>
            
            <h1 className="section-title text-white mb-6 leading-tight">
              Transforming Construction Projects 
              <span className="text-brand"> with Precision</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
              From quantity surveying to complete project management, we deliver comprehensive construction solutions across the East African region and beyond.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="btn-brand group">
                Explore Our Services
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition" />
              </button>
              <button className="btn-outline">
                Schedule Consultation
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
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 section-padding border-t-2 border-brand">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { number: "10+", label: "Years of Excellence" },
              { number: "50+", label: "Successful Projects" },
              { number: "15+", label: "Service Categories" },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-5xl md:text-6xl font-bold text-brand mb-3">{stat.number}</div>
                <div className="text-gray-600 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <div className="inline-block mb-4">
              <span className="text-sm font-bold text-brand uppercase tracking-wider">Our Services</span>
            </div>
            <h2 className="section-title text-black mb-4">
              Comprehensive Construction Solutions
            </h2>
            <div className="h-1 w-20 bg-brand rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                number: "01",
                title: "Quantity Surveying & Cost Management",
                description: "Rigorous financial oversight to maximize value and ensure cost certainty throughout the construction lifecycle.",
                points: ["Cost Estimating", "Budget Monitoring", "Value Engineering"]
              },
              {
                number: "02",
                title: "Project Management",
                description: "Strategic leadership and structured control across every phase of construction projects from inception to completion.",
                points: ["Design Coordination", "Risk Management", "Stakeholder Management"]
              },
              {
                number: "03",
                title: "Construction Management",
                description: "Structured execution, site leadership, and operational control with stringent quality and safety standards.",
                points: ["Site Supervision", "Quality Assurance", "Schedule Control"]
              },
              {
                number: "04",
                title: "Technical Advisory",
                description: "Specialist technical advisory services addressing construction industry evolution and contractual complexity.",
                points: ["Technical Expertise", "Problem Solving", "Industry Standards"]
              },
              {
                number: "05",
                title: "Turnkey Construction",
                description: "End-to-end solutions from concept to completion with single point of responsibility.",
                points: ["Design Build", "Execution", "Handover"]
              },
              {
                number: "06",
                title: "Training & Development",
                description: "Comprehensive training programs based on extensive sector experience and industry best practices.",
                points: ["Skill Development", "Industry Standards", "Career Growth"]
              },
            ].map((service, idx) => (
              <div key={idx} className="group p-8 border-2 border-gray-100 rounded-lg hover:border-brand hover:bg-gray-50 transition-all duration-300">
                <div className="text-5xl font-bold text-gray-200 mb-4 group-hover:text-brand transition">{service.number}</div>
                <h3 className="text-xl font-bold text-black mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                <div className="flex flex-wrap gap-2">
                  {service.points.map((point, pidx) => (
                    <span key={pidx} className="text-xs font-semibold text-brand bg-brand/10 px-3 py-1 rounded-full">
                      {point}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block mb-4">
                <span className="text-sm font-bold text-brand uppercase tracking-wider">Why Choose Us</span>
              </div>
              <h2 className="section-title text-black mb-8">
                Built on Integrity, Delivered with Excellence
              </h2>
              
              <div className="space-y-6">
                {[
                  { title: "Expert Team", desc: "Experienced professionals with deep sector knowledge" },
                  { title: "Proven Track Record", desc: "50+ successful projects across East Africa" },
                  { title: "Cost Efficiency", desc: "Value-driven solutions without compromising quality" },
                  { title: "Client-Centric", desc: "Personalized approach and transparent communication" },
                ].map((feature, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-brand mt-1" />
                    </div>
                    <div>
                      <h3 className="font-bold text-black mb-1">{feature.title}</h3>
                      <p className="text-gray-600">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="btn-brand mt-8">
                Learn More About Us
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-brand/20 to-brand/5 rounded-2xl blur-3xl"></div>
              <div className="relative bg-white rounded-2xl p-12 border-2 border-brand/20 shadow-lg">
                <div className="space-y-8">
                  <div className="border-l-4 border-brand pl-6">
                    <h3 className="text-2xl font-bold text-black mb-2">Precision</h3>
                    <p className="text-gray-600">Accurate evaluation and optimal project outcomes</p>
                  </div>
                  <div className="border-l-4 border-brand pl-6">
                    <h3 className="text-2xl font-bold text-black mb-2">Reliability</h3>
                    <p className="text-gray-600">Consistent delivery of high-quality construction results</p>
                  </div>
                  <div className="border-l-4 border-brand pl-6">
                    <h3 className="text-2xl font-bold text-black mb-2">Impact</h3>
                    <p className="text-gray-600">Measurable value creation for communities and stakeholders</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Offices Section */}
      <section id="about" className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <div className="inline-block mb-4">
              <span className="text-sm font-bold text-brand uppercase tracking-wider">Our Presence</span>
            </div>
            <h2 className="section-title text-black mb-4">
              Serving the East African Region
            </h2>
            <div className="h-1 w-20 bg-brand rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { city: "Kigali", country: "Rwanda", desc: "Our headquarters in Gasabo, serving clients across East Africa and globally." },
              { city: "East African Hub", country: "Regional", desc: "Strategic partnerships across Kenya, Uganda, Tanzania, and Burundi." },
            ].map((office, idx) => (
              <div key={idx} className="group bg-gradient-to-br from-gray-50 to-white rounded-lg overflow-hidden border-2 border-gray-100 hover:border-brand hover:shadow-lg transition-all duration-300">
                <div className="h-40 bg-gradient-to-br from-brand/20 to-brand/5 flex items-center justify-center group-hover:from-brand/30 group-hover:to-brand/10 transition">
                  <MapPin className="w-16 h-16 text-brand/40 group-hover:text-brand/60 transition" />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-black mb-1">{office.city}</h3>
                  <p className="text-sm text-brand font-semibold mb-4">{office.country}</p>
                  <p className="text-gray-600 mb-6">{office.desc}</p>
                  <a href="mailto:twquantus2025@gmail.com" className="inline-flex items-center text-brand font-semibold hover:gap-2 transition-all">
                    Get in Touch
                    <ChevronRight className="ml-2 w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-black text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand/10 rounded-full blur-3xl -z-10"></div>
        
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="section-title text-white mb-6">
            Ready to Transform Your Project?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Partner with T&W QUANTUS for comprehensive construction solutions tailored to your needs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-brand">
              Schedule Consultation
            </button>
            <a href="mailto:twquantus2025@gmail.com" className="btn-outline">
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 section-padding">
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
              <h4 className="text-white font-bold mb-4">Services</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#services" className="hover:text-brand transition">Quantity Surveying</a></li>
                <li><a href="#services" className="hover:text-brand transition">Project Management</a></li>
                <li><a href="#services" className="hover:text-brand transition">Construction Management</a></li>
                <li><a href="#services" className="hover:text-brand transition">Technical Advisory</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#about" className="hover:text-brand transition">About Us</a></li>
                <li><a href="#contact" className="hover:text-brand transition">Contact</a></li>
                <li><a href="/" className="hover:text-brand transition">Careers</a></li>
                <li><a href="/" className="hover:text-brand transition">Blog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-brand">📍</span>
                  <span>Gasabo, Kigali, Rwanda</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-brand">📞</span>
                  <a href="tel:+250780410570" className="hover:text-brand transition">+250 780 410 570</a>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-brand">✉️</span>
                  <a href="mailto:twquantus2025@gmail.com" className="hover:text-brand transition">twquantus2025@gmail.com</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
            <p>&copy; 2025 T&W QUANTUS LTD. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="/" className="hover:text-brand transition">Privacy Policy</a>
              <a href="/" className="hover:text-brand transition">Terms of Service</a>
              <a href="/" className="hover:text-brand transition">Legal Notice</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
