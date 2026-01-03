import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-border pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">
                                T
                            </div>
                            <span className="text-xl font-bold text-foreground tracking-tight">TechHub</span>
                        </Link>
                        <p className="text-secondary text-sm leading-relaxed mb-6">
                            Your one-stop destination for premium tech gear. We bring the future to your doorstep with curated selections and top-tier service.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-secondary hover:text-primary transition-colors"><FaFacebook size={20} /></a>
                            <a href="#" className="text-secondary hover:text-primary transition-colors"><FaTwitter size={20} /></a>
                            <a href="#" className="text-secondary hover:text-primary transition-colors"><FaInstagram size={20} /></a>
                            <a href="#" className="text-secondary hover:text-primary transition-colors"><FaLinkedin size={20} /></a>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Shop</h3>
                        <ul className="space-y-3">
                            <li><Link href="/NewArrivals" className="text-secondary hover:text-primary text-sm transition-colors">New Arrivals</Link></li>
                            <li><Link href="/categories" className="text-secondary hover:text-primary text-sm transition-colors">Categories</Link></li>
                            <li><Link href="#" className="text-secondary hover:text-primary text-sm transition-colors">Best Sellers</Link></li>
                            <li><Link href="#" className="text-secondary hover:text-primary text-sm transition-colors">Deals</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Support</h3>
                        <ul className="space-y-3">
                            <li><Link href="/contact" className="text-secondary hover:text-primary text-sm transition-colors">Contact Us</Link></li>
                            <li><Link href="#" className="text-secondary hover:text-primary text-sm transition-colors">FAQs</Link></li>
                            <li><Link href="#" className="text-secondary hover:text-primary text-sm transition-colors">Shipping & Returns</Link></li>
                            <li><Link href="#" className="text-secondary hover:text-primary text-sm transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Newsletter</h3>
                        <p className="text-secondary text-sm mb-4">
                            Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
                        </p>
                        <form className="flex">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full px-4 py-2 text-sm border border-border rounded-l-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-accent"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-r-lg hover:bg-primary-dark transition-colors"
                            >
                                Join
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center bg-gray-50/50 p-4 rounded-xl">
                    <p className="text-secondary text-sm text-center md:text-left">
                        &copy; {new Date().getFullYear()} TechHub. All rights reserved.
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <span className="text-xs text-secondary-light">Designed for Excellence</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
