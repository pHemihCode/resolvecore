import { FC, ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    padded?: boolean;
    shadow?: 'sm' | 'md' | 'lg';
}

const Card: FC<CardProps> = ({
                                 children,
                                 className = '',
                                 padded = true,
                                 shadow = 'md'
                             }) => {
    const shadowClasses = {
        sm: 'shadow-sm',
        md: 'shadow',
        lg: 'shadow-lg',
    };

    const paddingClass = padded ? 'p-6 sm:p-8' : '';

    return (
        <div
            className={`
        bg-white rounded-xl border border-gray-200
        ${shadowClasses[shadow]}
        ${paddingClass}
        ${className}
      `}
        >
            {children}
        </div>
    );
};

export default Card;