
const Decoration = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -right-32 -top-40 h-125 w-125 rounded-full bg-primary-900/20 blur-3xl" />

      <div className="absolute right-[15%] top-20 h-32 w-32 rounded-full border border-primary-700/20" />

      <div className="absolute right-[18%] top-24 h-24 w-24 rounded-full border border-primary-600/10" />

      <svg
        className="absolute right-0 top-0 h-full w-[60%] opacity-50"
        viewBox="0 0 700 350"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="libraryWave" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#450A0A" stopOpacity="0" />
            <stop offset="55%" stopColor="#991B1B" stopOpacity=".25" />
            <stop offset="100%" stopColor="#DC2626" stopOpacity=".08" />
          </linearGradient>
        </defs>

        <path
          d="M700 0C560 60 590 125 400 145C220 165 160 245 0 330H700Z"
          fill="url(#libraryWave)"
        />

        <path
          d="M700 45C550 90 570 150 390 175C230 195 160 265 0 345"
          fill="none"
          stroke="#DC2626"
          strokeWidth="1"
          opacity=".2"
        />

        <path
          d="M700 90C550 125 570 190 410 210C250 230 180 285 0 365"
          fill="none"
          stroke="#FB7185"
          strokeWidth="1"
          opacity=".08"
        />
      </svg>
    </div>
  );
};

export default Decoration;
