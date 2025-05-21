import { useState, useEffect } from "react";
import {
  ChevronUp,
  Twitter,
  Slack,
  Github,
  MessageCircle,
  Heart,
  ExternalLink
} from "lucide-react";

const FooterSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const footerSections = [
    {
      id: "resources",
      title: "Resources",
      links: ["Documentation", "Help Center", "Community", "API"]
    },
    {
      id: "legal",
      title: "Legal",
      links: ["Privacy Policy", "Terms of Service", "Cookie Policy"]
    }
  ];

  const socialLinks = [
    { name: "Twitter", icon: <Twitter size={18} className="text-blue-400" /> },
    { name: "GitHub", icon: <Github size={18} className="text-slate-600" /> },
    { name: "Slack", icon: <Slack size={18} className="text-purple-500" /> },
    { name: "Telegram", icon: <MessageCircle size={18} className="text-blue-500" /> }
  ];

  const communityPartners = ["Metamask", "Gaia", "Wagmi", "XDC"];

  const handleSectionHover = (id: string) => {
    setActiveSection(id);
  };

  const handleSectionLeave = () => {
    setActiveSection(null);
  };

  return (
    <footer className="relative border-t border-border bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-200 dark:bg-blue-900/20 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-purple-200 dark:bg-purple-900/20 rounded-full blur-3xl opacity-20"></div>
      </div>
      
      <div className="container px-4 mx-auto pt-16 pb-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 mb-12">
          {/* Column 1-2: Resources */}
          <div className="md:col-span-3">
            <div 
              className="mb-8"
              onMouseEnter={() => handleSectionHover("resources")}
              onMouseLeave={handleSectionLeave}
            >
              <h3 className="text-base font-bold mb-4 text-slate-800 dark:text-slate-200 inline-flex items-center" id="resources">
                Resources
                <div className={`ml-2 h-1 w-1 rounded-full transition-all duration-300 ${activeSection === "resources" ? "bg-blue-500" : "bg-transparent"}`}></div>
              </h3>
              <ul className="space-y-2">
                {footerSections[0].links.map((link) => (
                  <li key={link}>
                    <a 
                      href="#" 
                      className="text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center group"
                      aria-label={link}
                    >
                      <span className="w-0 group-hover:w-2 h-px bg-blue-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 3-4: Legal */}
          <div className="md:col-span-3">
            <div
              className="mb-8"
              onMouseEnter={() => handleSectionHover("legal")}
              onMouseLeave={handleSectionLeave}
            >
              <h3 className="text-base font-bold mb-4 text-slate-800 dark:text-slate-200 inline-flex items-center" id="legal">
                Legal
                <div className={`ml-2 h-1 w-1 rounded-full transition-all duration-300 ${activeSection === "legal" ? "bg-blue-500" : "bg-transparent"}`}></div>
              </h3>
              <ul className="space-y-2">
                {footerSections[1].links.map((link) => (
                  <li key={link}>
                    <a 
                      href="#" 
                      className="text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center group"
                      aria-label={link}
                    >
                      <span className="w-0 group-hover:w-2 h-px bg-blue-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 5-8: Connect */}
          <div className="md:col-span-3" 
            onMouseEnter={() => handleSectionHover("connect")}
            onMouseLeave={handleSectionLeave}
          >
            <h3 className="text-base font-bold mb-4 text-slate-800 dark:text-slate-200 inline-flex items-center" id="connect">
              Connect
              <div className={`ml-2 h-1 w-1 rounded-full transition-all duration-300 ${activeSection === "connect" ? "bg-blue-500" : "bg-transparent"}`}></div>
            </h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href="#"
                  className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 group"
                  aria-label={`Connect on ${social.name}`}
                >
                  <span className="transition-transform group-hover:scale-110">
                    {social.icon}
                  </span>
                  <span>{social.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Column 9-12: Community Partners */}
          <div className="md:col-span-3"
            onMouseEnter={() => handleSectionHover("partners")}
            onMouseLeave={handleSectionLeave}
          >
            <h3 className="text-base font-bold mb-4 text-slate-800 dark:text-slate-200 inline-flex items-center" id="partners">
              Community Partners
              <div className={`ml-2 h-1 w-1 rounded-full transition-all duration-300 ${activeSection === "partners" ? "bg-blue-500" : "bg-transparent"}`}></div>
            </h3>
            <div className="flex gap-2 mb-6">
              {communityPartners.map((partner) => (
                <a
                  key={partner}
                  href="#"
                  className="text-xs text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500/40 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm shadow-sm transition-all hover:shadow hover:translate-y-px flex items-center gap-1 group"
                  aria-label={partner}
                >
                  {partner}
                  <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-8  group transition-colors">
              <Heart size={14} className="text-pink-400 group-hover:text-pink-500 transition-colors" />
              <span>Made with love by the DeFi Community</span>
            </div>
          </div>
        </div>

       
        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row justify-center items-center pt-6 border-t border-slate-200 dark:border-slate-700/60">
          <div className="mb-4 md:mb-0 flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              © 2025 Bumblebee Finance. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className={`fixed bottom-6 right-6 h-12 w-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg z-50 transition-all duration-300 ${
          isVisible 
            ? "opacity-100 translate-y-0" 
            : "opacity-0 translate-y-12 pointer-events-none"
        } hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2`}
      >
        <ChevronUp size={20} />
      </button>
    </footer>
  );
};

export default FooterSection;