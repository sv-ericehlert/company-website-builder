import Logo from "./Logo";

const footerLinks = {
  Platform: ["Find Work", "Hire Talent", "Browse Jobs", "Post a Job"],
  Locations: ["Los Angeles", "Miami", "New York", "London", "Ibiza", "Berlin"],
  Company: ["About Us", "Careers", "Press", "Contact"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
};

const Footer = () => {
  return (
    <footer className="py-16 bg-card border-t border-border/50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Logo className="mb-4" />
            <p className="text-muted-foreground max-w-sm mb-6">
              The premier networking platform connecting entertainment industry 
              professionals with opportunities worldwide.
            </p>
            <div className="flex gap-4">
              {["Twitter", "Instagram", "LinkedIn"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-primary/20 transition-colors"
                >
                  {social[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-display font-bold mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 STAGEVEST. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Made with passion for the entertainment industry
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
