import React from 'react';

const InfiniteLogoScroll = () => {
  const companies = [
    { 
      name: 'Microsoft', 
      svg: (
        <svg viewBox="0 0 23 23" className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24">
          <path fill="#f3f3f3" d="M0 0h23v23H0z"/>
          <path fill="#f35325" d="M1 1h10v10H1z"/>
          <path fill="#81bc06" d="M12 1h10v10H12z"/>
          <path fill="#05a6f0" d="M1 12h10v10H1z"/>
          <path fill="#ffba08" d="M12 12h10v10H12z"/>
        </svg>
      )
    },
    { 
      name: 'Walmart',
      svg: (
        <svg viewBox="0 0 200 200" className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20">
          <circle cx="100" cy="100" r="8" fill="#0071ce"/>
          <circle cx="100" cy="60" r="8" fill="#0071ce"/>
          <circle cx="100" cy="140" r="8" fill="#0071ce"/>
          <circle cx="60" cy="100" r="8" fill="#ffc220"/>
          <circle cx="140" cy="100" r="8" fill="#ffc220"/>
          <circle cx="73" cy="73" r="8" fill="#ffc220"/>
          <circle cx="127" cy="127" r="8" fill="#ffc220"/>
          <circle cx="127" cy="73" r="8" fill="#0071ce"/>
          <circle cx="73" cy="127" r="8" fill="#0071ce"/>
        </svg>
      )
    },
    { 
      name: 'Airbnb',
      svg: (
        <svg viewBox="0 0 1000 1000" className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24">
          <path fill="#FF5A5F" d="M499.3 736.7c-51-64-81-120.1-91-168.1-10-39-6-70 11-93 18-27 45-40 80-40s62 13 80 40c17 23 21 54 11 93-11 49-41 105-91 168.1zm362.2 43c-7 47-39 86-83 105-85 37-169.1-22-241.1-102 119.1-149.1 141.1-265.1 90-340.2-30-43-73-64-128.1-64-111 0-172.1 94-148.1 203.1 14 59 51 126.1 110 201.1-37 41-72 70-103 88-24 13-47 21-69 23-101 15-180.1-83-144.1-184.1 5-13 15-37 32-74l1-2c55-120.1 122.1-256.1 199.1-407.2l2-5 22-42c17-31 24-45 51-62 13-8 29-12 47-12 36 0 64 21 76 38 6 9 13 21 22 36l21 41 3 6c77 151.1 144.1 287.1 199.1 407.2l1 1 20 46 12 29c9.2 23.1 11.2 46.1 8.2 70.1zm46-90.1c-7-22-19-48-34-79v-1c-71-151.1-137.1-287.1-200.1-409.2l-4-6c-45-92-77-147.1-170.1-147.1-92 0-131.1 64-171.1 147.1l-3 6c-63 122.1-129.1 258.1-200.1 409.2v2l-21 46c-8 19-12 29-13 32-51 140.1 54 263.1 181.1 263.1 1 0 5 0 10-1h14c66-8 134.1-50 203.1-125.1 69 75 137.1 117.1 203.1 125.1h14c5 1 9 1 10 1 127.1.1 232.1-123 181.1-263.1z"/>
        </svg>
      )
    },
    { 
      name: 'FedEx',
      svg: (
        <svg viewBox="0 0 200 60" className="w-20 h-10 sm:w-24 sm:h-12 md:w-28 md:h-14 lg:w-32 lg:h-16">
          <text x="10" y="40" fill="#4D148C" fontFamily="Arial, sans-serif" fontSize="32" fontWeight="bold">Fed</text>
          <text x="80" y="40" fill="#FF6600" fontFamily="Arial, sans-serif" fontSize="32" fontWeight="bold">Ex</text>
        </svg>
      )
    },
    { 
      name: 'Google',
      svg: (
        <svg viewBox="0 0 272 92" className="w-16 h-6 sm:w-20 sm:h-8 md:w-24 md:h-10 lg:w-28 lg:h-12">
          <path fill="#EA4335" d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
          <path fill="#FBBC05" d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
          <path fill="#4285F4" d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z"/>
          <path fill="#34A853" d="M225 3v65h-9.5V3h9.5z"/>
          <path fill="#EA4335" d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z"/>
          <path fill="#4285F4" d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49.01z"/>
        </svg>
      )
    },
    { 
      name: 'Amazon',
      svg: (
        <svg viewBox="0 0 200 60" className="w-20 h-8 sm:w-24 sm:h-10 md:w-28 md:h-12 lg:w-32 lg:h-12">
          <text x="10" y="35" fill="#FF9900" fontFamily="Arial, sans-serif" fontSize="28" fontWeight="bold">amazon</text>
          <path fill="#FF9900" d="M140 42c-15 11-37 17-56 17-26 0-50-10-68-26-1-1 0-3 2-2 23 13 51 21 80 21 20 0 41-4 61-12 3-1 5 2 2 4"/>
          <path fill="#FF9900" d="M145 37c-2-3-13-1-18-1-1 0-2-1-1-2 9-6 23-4 25-2 2 2 0 16-8 23-1 1-2 0-2-1 2-5 5-15 3-18"/>
        </svg>
      )
    },
    { 
      name: 'Apple',
      svg: (
        <svg viewBox="0 0 814 1000" className="w-8 h-10 sm:w-10 sm:h-12 md:w-12 md:h-16 lg:w-16 lg:h-20">
          <path fill="#666" d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/>
        </svg>
      )
    },
    { 
      name: 'Meta',
      svg: (
        <svg viewBox="0 0 200 60" className="w-16 h-8 sm:w-20 sm:h-10 md:w-24 md:h-12 lg:w-28 lg:h-12">
          <text x="10" y="40" fill="#0081FB" fontFamily="Arial, sans-serif" fontSize="32" fontWeight="bold">Meta</text>
        </svg>
      )
    },
    { 
      name: 'Netflix',
      svg: (
        <svg viewBox="0 0 1024 276.742" className="w-20 h-8 sm:w-24 sm:h-10 md:w-28 md:h-12 lg:w-32 lg:h-12">
          <path fill="#E50914" d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676l-49.458-144.856v151.073c-15.404 1.621-29.457 3.783-44.051 5.945v-276.742h41.08l56.212 157.021v-157.021h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461v-255.39h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862v198.908c-14.594 0-29.188 0-43.239.539v-199.447h-44.862v-43.242h132.965l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433v-239.718h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676v-242.689h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242v-254.58h-42.43v251.338zm231.881-251.338l-54.863 131.615 54.863 145.127c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75-50.269-129.992h46.482l28.377 72.699 30.27-72.699h47.295z"/>
        </svg>
      )
    },
    { 
      name: 'Tesla',
      svg: (
        <svg viewBox="0 0 342 35" className="w-20 h-6 sm:w-24 sm:h-8 md:w-28 md:h-10 lg:w-32 lg:h-10">
          <path fill="#CC0000" d="M0 .1a9.7 9.7 0 0 0 7 7h11l.5.1v27.6h6.8V7.3L26 7h11a9.8 9.8 0 0 0 7-7H0zm238.6 0h-6.8v34.8H263a9.7 9.7 0 0 0 6-6.8h-30.3V0zm-52.3 6.8c3.6-1 6.6-3.8 7.4-6.9l-38.1.1v20.6h31.1v7.2h-24.4a13.6 13.6 0 0 0-8.7 7h39.9V13.9h-31.2v-7h24zm116.2 28h6.7v-14h24.6v14h6.7v-21h-38zM85.3 7h26a9.6 9.6 0 0 0 7.1-7H78.3a9.6 9.6 0 0 0 7 7zm0 13.8h26a9.6 9.6 0 0 0 7.1-7H78.3a9.6 9.6 0 0 0 7 7zm0 14.1h26a9.6 9.6 0 0 0 7.1-7H78.3a9.6 9.6 0 0 0 7 7zM308.5 7h26a9.6 9.6 0 0 0 7-7h-40a9.6 9.6 0 0 0 7 7z"/>
        </svg>
      )
    },
    { 
      name: 'IBM',
      svg: (
        <svg viewBox="0 0 1000 400" className="w-14 h-6 sm:w-18 sm:h-8 md:w-20 md:h-10 lg:w-24 lg:h-10">
          <path fill="#1F70C1" d="M0,0h138v69H0V0z M0,92h138v69H0V92z M0,185h138v69H0V185z M0,277h138v69H0V277z"/>
          <path fill="#1F70C1" d="M181,0h277v69H181V0z M181,92h277v69H181V92z M181,185h277v69H181V185z M181,277h277v69H181V277z"/>
          <path fill="#1F70C1" d="M500,0h139v69H500V0z M500,92h139v69H500V92z M500,185h139v69H500V185z M500,277h139v69H500V277z"/>
        </svg>
      )
    },
    { 
      name: 'Spotify',
      svg: (
        <svg viewBox="0 0 496 512" className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16">
          <path fill="#1DB954" d="M248 8C111.1 8 0 119.1 0 256s111.1 248 248 248 248-111.1 248-248S384.9 8 248 8zm100.7 364.9c-4.2 0-6.8-1.3-10.7-3.6-62.4-37.6-135-39.2-206.7-24.5-3.9 1-9 2.6-11.9 2.6-9.7 0-15.8-7.7-15.8-15.8 0-10.3 6.1-15.2 13.6-16.8 81.9-18.1 165.6-16.5 237 26.2 6.1 3.9 9.7 7.4 9.7 16.5s-7.1 15.4-15.2 15.4zm26.9-65.6c-5.2 0-8.7-2.3-12.3-4.2-62.5-37-155.7-51.9-238.6-29.4-4.8 1.3-7.4 2.6-11.9 2.6-10.7 0-19.4-8.7-19.4-19.4s5.2-17.8 15.5-20.7c27.8-7.8 56.2-13.6 97.8-13.6 64.9 0 127.6 16.1 177 45.5 8.1 4.8 11.3 11 11.3 19.7-.1 10.8-8.5 19.5-19.4 19.5zm31-76.2c-5.2 0-8.4-1.3-12.9-3.9-71.2-42.5-198.5-52.7-280.9-29.7-3.6 1-8.1 2.6-12.9 2.6-13.2 0-23.3-10.3-23.3-23.6 0-13.6 8.4-21.3 17.4-23.9 35.2-10.3 74.6-15.2 117.5-15.2 73 0 149.5 15.2 205.4 47.8 7.8 4.5 12.9 10.7 12.9 22.6 0 13.6-11 23.3-23.2 23.3z"/>
        </svg>
      )
    }
  ];

  return (
    <div className="bg-white py-8 sm:py-12 md:py-16 px-3 sm:px-4 md:px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-2 sm:mb-4 px-2">
            Trusted by companies of all sizes
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm md:text-base hidden sm:block">
            Join thousands of companies using our platform
          </p>
        </div>

        {/* Infinite Scroll Container */}
        <div className="relative">
          {/* Gradient Overlays - Smaller on mobile */}
          <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 md:w-24 lg:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 md:w-24 lg:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

          {/* Scrolling Track */}
          <div className="flex overflow-hidden">
            {/* First set of logos */}
            <div className="flex animate-scroll items-center">
              {companies.map((company, idx) => (
                <div
                  key={`first-${idx}`}
                  className="flex-shrink-0 w-20 sm:w-28 md:w-36 lg:w-48 h-12 sm:h-16 md:h-20 lg:h-24 mx-3 sm:mx-4 md:mx-6 lg:mx-8 flex items-center justify-center grayscale hover:grayscale-0 opacity-60 sm:opacity-70 hover:opacity-100 transition-all duration-300"
                  title={company.name}
                >
                  {company.svg}
                </div>
              ))}
            </div>

            {/* Duplicate set for seamless loop */}
            <div className="flex animate-scroll items-center" aria-hidden="true">
              {companies.map((company, idx) => (
                <div
                  key={`second-${idx}`}
                  className="flex-shrink-0 w-20 sm:w-28 md:w-36 lg:w-48 h-12 sm:h-16 md:h-20 lg:h-24 mx-3 sm:mx-4 md:mx-6 lg:mx-8 flex items-center justify-center grayscale hover:grayscale-0 opacity-60 sm:opacity-70 hover:opacity-100 transition-all duration-300"
                  title={company.name}
                >
                  {company.svg}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: Static Grid Alternative (Optional) */}
        {/* Uncomment this if you want a static grid on very small screens */}
        {/*
        <div className="sm:hidden grid grid-cols-3 gap-4 mt-6">
          {companies.slice(0, 6).map((company, idx) => (
            <div
              key={`mobile-${idx}`}
              className="flex items-center justify-center h-16 grayscale opacity-60"
            >
              {company.svg}
            </div>
          ))}
        </div>
        */}

        {/* Trust Indicators - Mobile Only */}
        <div className="mt-6 sm:mt-8 flex justify-center gap-4 sm:gap-8 text-center sm:hidden">
          <div>
            <p className="text-lg font-bold text-gray-900">500+</p>
            <p className="text-xs text-gray-500">Companies</p>
          </div>
          <div className="w-px bg-gray-200"></div>
          <div>
            <p className="text-lg font-bold text-gray-900">50K+</p>
            <p className="text-xs text-gray-500">Users</p>
          </div>
          <div className="w-px bg-gray-200"></div>
          <div>
            <p className="text-lg font-bold text-gray-900">99%</p>
            <p className="text-xs text-gray-500">Satisfaction</p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        .animate-scroll {
          animation: scroll 30s linear infinite;
        }

        /* Faster animation on mobile for better visual */
        @media (max-width: 640px) {
          .animate-scroll {
            animation: scroll 20s linear infinite;
          }
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }

        /* Disable hover pause on touch devices */
        @media (hover: none) {
          .animate-scroll:hover {
            animation-play-state: running;
          }
        }
      `}</style>
    </div>
  );
};

export default InfiniteLogoScroll;