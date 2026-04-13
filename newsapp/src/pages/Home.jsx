import Navbar from "../components/Navbar";
import { Link } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import news1 from "../assets/news4.jpg";
import news2 from "../assets/news5.jpg";
import news3 from "../assets/news3.jpg";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Footer from "./Footer";
const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-purple-900">

      <Navbar />

      
     <Swiper
  modules={[Autoplay, Pagination, Navigation]}
  autoplay={{ delay: 3000 }}
  pagination={{ clickable: true }}
  navigation
  className="h-[92vh]"
>

 
  <SwiperSlide>
    <div
      className="h-full bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${news3})`, }}
    >
      <div className="bg-black/60 p-8 rounded-xl text-center">
        <h1 className="text-5xl font-extrabold text-white">
          Welcome to <span className="text-yellow-400">ANC</span>
        </h1>
        <p className="mt-4 text-purple-200">
          Real-time global news at your fingertips.
        </p>
      </div>
    </div>
  </SwiperSlide>

 
  <SwiperSlide>
    <div
      className="h-full bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${news2})` }}
    >
      <div className="bg-black/60 p-8 rounded-xl text-center">
        <h1 className="text-5xl font-bold text-white">
          ⚡ Breaking News Instantly
        </h1>
        <p className="mt-4 text-purple-200">
          Stay ahead with real-time updates.
        </p>
      </div>
    </div>
  </SwiperSlide>

  
  <SwiperSlide>
    <div
      className="min-h-full bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${news1})`}}
    >
      <div className="bg-black/60 p-8 rounded-xl text-center">
        <h1 className="text-5xl font-bold text-white">
          🧠 Smart Personalized Feed
        </h1>
        <p className="mt-4 text-purple-200">
          News tailored for you.
        </p>
      </div>
    </div>
  </SwiperSlide>

</Swiper>

   
      <div className="px-6 py-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl text-white shadow-xl hover:scale-105 transition">
            <h3 className="text-xl font-bold mb-2">Global Coverage</h3>
            <p className="text-purple-200">
              Worldwide news from trusted sources.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl text-white shadow-xl hover:scale-105 transition">
            <h3 className="text-xl font-bold mb-2">Real-Time</h3>
            <p className="text-purple-200">
              Breaking news as it happens.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl text-white shadow-xl hover:scale-105 transition">
            <h3 className="text-xl font-bold mb-2">Smart Feed</h3>
            <p className="text-purple-200">
              Personalized content just for you.
            </p>
          </div>

        </div>
      </div>
<Footer/>
    </div>
    

  );
};

export default Home;