import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo';

export const Home = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const phoneNumber = localStorage.getItem('phoneNumber') || '';

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('phoneNumber');
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!isLoggedIn) {
    return null; 
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center relative font-sans px-6">
      
      <div className="absolute top-8 right-8 sm:top-12 sm:right-16">
        <Logo size={64} />
      </div>

    
      <div className="w-full max-w-[420px] text-center flex flex-col items-center animate-fadeIn">
        {/* Success Icon Badge */}
        <div className="w-16 h-16 bg-[#4e5bf2]/10 text-[#4e5bf2] rounded-full flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>

      
        <h1 className="text-[32px] font-bold text-gray-900 tracking-tight mb-3 font-sans">
          Welcome Back
        </h1>

        <p className="text-[15px] text-gray-400 mb-8 font-normal font-sans leading-relaxed px-4">
          You are successfully Authenticated 
        </p>

        <div className="w-full bg-gray-50/60 border border-gray-100 rounded-xl p-5 mb-8 text-left">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1 font-sans">
            Authenticated Phone
          </p>
          <p className="text-[18px] font-bold text-gray-800 font-sans">
            +91 {phoneNumber}
          </p>
        </div>

      
        <button
          onClick={handleLogout}
          className="w-full py-4 bg-[#4e5bf2] text-white hover:bg-[#3d4ae0] font-semibold text-[15px] rounded-md transition-all duration-200 shadow-sm active:scale-[0.99] font-sans cursor-pointer"
        >
          Log Out
        </button>

    
        <div className="w-full border-t border-gray-100/80 mt-16"></div>
      </div>
    </div>
  );
};

export default Home;
