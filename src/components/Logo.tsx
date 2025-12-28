const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Sound wave icon */}
      <div className="flex items-center gap-0.5">
        {[0.4, 0.7, 1, 0.7, 0.4, 0.6, 0.9, 0.6, 0.4].map((height, i) => (
          <div
            key={i}
            className="w-[3px] rounded-full bg-foreground"
            style={{ height: `${height * 24}px` }}
          />
        ))}
      </div>
      <span className="font-display text-2xl font-bold tracking-tight">STAGEVEST</span>
    </div>
  );
};

export default Logo;
