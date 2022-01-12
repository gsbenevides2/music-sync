import React from "react";

interface Props {
    minimal?: boolean
    lowerMargin?: boolean
}

export const ScreenContainer: React.FC<Props> = ({ children, minimal, lowerMargin }) => (
    <div className='flex justify-center' style={{ paddingTop: `calc(0.75rem + ${(minimal ? 28 : 90) + (lowerMargin? 4: 12)}px)`, paddingBottom: 'var(--player-height)' }}>
        {children}
    </div>
)