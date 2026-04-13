import { FaInstagram, FaFacebook, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 text-white mt-20">
    
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">

        <div>
          <h2 className="text-2xl font-bold text-purple-950">ANC</h2>
          <p className="mt-4 text-gray-600">
            Aura News Center delivers real-time global news with a modern experience.
          </p>
        </div>

       
        <div>
          <h3 className="text-lg font-semibold mb-4 text-purple-950">Quick Links</h3>
          <ul className="space-y-2 text-gray-600">
            <li><a href="/" className="hover:text-purple-950">Home</a></li>
            <li><a href="/login" className="hover:text-purple-950">Login</a></li>
            <li><a href="/register" className="hover:text-purple-950">Register</a></li>
          </ul>
        </div>

       
        <div>
          <h3 className="text-lg font-semibold mb-4 text-purple-950">Support</h3>
          <ul className="space-y-2 text-gray-600">
            <li>info@anc.com</li>
            <li>support@anc.com</li>
            
          </ul>
        </div>

      
        <div>
          <h3 className="text-lg font-semibold mb-4 text-purple-950">Follow Us</h3>
            <div className="flex space-x-6 text-2xl">

    <a
      href="https://instagram.com"
      target="_blank"
      className="hover:text-pink-500 transition transform hover:scale-125 text-gray-600"
    >
      <FaInstagram />
    </a>

   
    <a
      href="https://facebook.com"
      target="_blank"
      className="hover:text-blue-500 transition transform hover:scale-125 text-gray-600"
    >
      <FaFacebook />
    </a>

    <a
      href="https://youtube.com"
      target="_blank"
      className="hover:text-red-500 transition transform hover:scale-125 text-gray-600"
    >
      <FaYoutube />
    </a>

  </div>
        </div>

      </div>

      <div className="border-t border-gray-700 text-center py-4 text-gray-500 text-sm">
        © {new Date().getFullYear()} ANC. All rights reserved.
      </div>

    </footer>
  );
};

export default Footer;