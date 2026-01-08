import bg from "../assets/image.png";


export default function BackgroundWrapper({ children }) {
  return (
    <div
      className="min-h-screen bg-fixed bg-center bg-cover flex items-center justify-center pt-24"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Content */}
      <div className="relative z-10 w-full flex justify-center">
        {children}
      </div>
    </div>
  );
}
