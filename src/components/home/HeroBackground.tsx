function HeroBackground() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1400 900"
      preserveAspectRatio="none"
    >
      <defs>

        <radialGradient id="heroGlowOne">
          <stop
            offset="0%"
            stopColor="#DC2626"
            stopOpacity=".13"
          />

          <stop
            offset="100%"
            stopColor="#DC2626"
            stopOpacity="0"
          />
        </radialGradient>

        <radialGradient id="heroGlowTwo">
          <stop
            offset="0%"
            stopColor="#FB7185"
            stopOpacity=".09"
          />

          <stop
            offset="100%"
            stopColor="#FB7185"
            stopOpacity="0"
          />
        </radialGradient>
      </defs>

      <circle
        cx="1120"
        cy="300"
        r="400"
        fill="url(#heroGlowOne)"
      />

      <circle
        cx="350"
        cy="700"
        r="300"
        fill="url(#heroGlowTwo)"
      />

      {/* Organic lines */}

      <path
        d="M-100 700 C200 520 300 760 570 600 C830 450 1000 520 1500 240"
        fill="none"
        stroke="#DC2626"
        strokeWidth="1"
        opacity=".12"
      />

      <path
        d="M-100 760 C180 580 320 820 600 650 C850 500 1060 560 1500 300"
        fill="none"
        stroke="#FB7185"
        strokeWidth="1"
        opacity=".07"
      />

      <path
        d="M700 0 C850 130 900 170 1100 100 C1240 50 1310 100 1500 20"
        fill="none"
        stroke="#991B1B"
        strokeWidth="1"
        opacity=".16"
      />
    </svg>
  );
}

export default HeroBackground