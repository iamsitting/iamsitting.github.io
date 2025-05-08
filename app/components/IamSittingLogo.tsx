interface DevoteLogoProps {
  className?: string;
  showText?: boolean;
  variant?: 'full' | 'short' | 'icon';
}

export default function DevoteLogo({ 
  className = "", 
  showText = false,
  variant = 'full'
}: DevoteLogoProps) {
  const LogoIcon = () => (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer circle */}
      <circle
        cx="20"
        cy="20"
        r="18"
        stroke="#4CAF50"
        strokeWidth="2"
        className="dark:stroke-[#66BB6A]"
      />
      {/* Middle circle */}
      <circle
        cx="20"
        cy="20"
        r="12"
        stroke="#4CAF50"
        strokeWidth="2"
        className="dark:stroke-[#66BB6A]"
      />
      {/* Inner circle */}
      <circle
        cx="20"
        cy="20"
        r="6"
        stroke="#4CAF50"
        strokeWidth="2"
        className="dark:stroke-[#66BB6A]"
      />
      {/* Center dot */}
      <circle
        cx="20"
        cy="20"
        r="2"
        fill="#4CAF50"
        className="dark:fill-[#66BB6A]"
      />
    </svg>
  );

  if (!showText) {
    return <LogoIcon />;
  }

  return (
    <div className="flex items-center gap-2">
      <LogoIcon />
      <span className="text-xl font-semibold text-gray-900 dark:text-[#E8F5E8]">
        {variant === 'full' && 'iamsitting'}
        {variant === 'short' && 'iamsitting'}
      </span>
    </div>
  );
}

interface LogoProps {
  variant?: 'full' | 'short';
  className?: string;
}

export const IamSittingLogo = ({ variant = 'full', className = '' }: LogoProps) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex items-center">
        <span className="text-[#4CAF50] font-bold text-xl">iam</span>
        <span className="font-bold text-xl">sitting</span>
      </div>
      {variant === 'full' && 'iamsitting'}
      {variant === 'short' && 'iamsitting'}
    </div>
  );
}; 