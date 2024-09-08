import React from "react";

function IntroduceBackground() {
  return (
    <div className="relative mb-10">
      {/* Background Image */}
      <img
        src="https://www.galaxycine.vn/_next/static/media/bg-icon-iphone-x.3b4bcdb7.svg"
        alt="Background Icon"
        className="w-full h-auto"
      />

      {/* Container for logo and text */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Content Container */}
        <div className="flex items-center p-4 relative">
          {/* Logo Image with Video */}
          <div className="relative ml-20">
            {/* Background Khung Iphone */}
            <img
              src="https://www.galaxycine.vn/_next/static/media/Frame-iphone-x.78ef1223.svg"
              alt="Background Khung Iphone"
              className="relative z-10 w-full h-[100%]"
            />

            {/* Video Inside Khung Iphone */}
            <video
              src="/image/demo.mp4"
              autoPlay
              loop
              muted
              className="absolute top-[0%] left-[4.8%] w-[92.2%] h-[100%] z-0 rounded-[20px]"
            />
          </div>

          {/* Text Content */}
          <div className="ml-80">
            <h2 className="text-[30px] font-bold mb-2 text-white">
              Đặt Vé Online - Không Lo Trễ Nải
            </h2>
            <p className="text-sm leading-relaxed text-white">
              Ghét đông đúc ồn ào? Lười xếp hàng mua vé? Hãy quên đi cách mua vé
              giấy truyền thống
            </p>
            <p className="text-sm leading-relaxed text-white">
              tốn thời gian hay xếp hàng lấy vé online phiền toái.
            </p>
            <div className="mt-4 flex items-end">
              <img
                src="https://www.galaxycine.vn/_next/static/media/glx-qr-code-1.218ae7da.svg"
                alt="QR Code"
                className="w-30 h-40"
              />

              <span className="text-white ml-4 italic">OR</span>

              <img
                src="https://www.galaxycine.vn/_next/static/media/icon-ios-app-store.65ed00df.svg"
                alt="iOS App Store"
                className="ml-4"
              />
              <img
                src="https://www.galaxycine.vn/_next/static/media/icon-google-app-store.f4c38402.svg"
                alt="Google Play Store"
                className="ml-2"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IntroduceBackground;
