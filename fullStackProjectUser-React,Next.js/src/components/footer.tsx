const Footer = () => {
    return (
        <footer className="bg-[#f4e7d3] text-dark p-6 text-center mt-10 shadow-md">
            <div className="container mx-auto">
                <p className="text-lg">&copy; {new Date().getFullYear()} E-Commerce. All rights reserved.</p>
                <nav className="mt-4">
                    <ul className="flex justify-center space-x-6 font-medium">
                        <li><a href="/privacy" className="hover:text-secondary">Privacy Policy</a></li>
                        <li><a href="/terms" className="hover:text-secondary">Terms of Service</a></li>
                        <li><a href="/contact" className="hover:text-secondary">Contact Us</a></li>
                    </ul>
                </nav>
            </div>
        </footer>
    );
};

export default Footer;
