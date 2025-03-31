import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function LoadingAnimation() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
            <div className="w-50 h-50">
                <DotLottieReact
                    src="/m8xcm6nw.lottie"
                    loop
                    autoplay
                />
            </div>
        </div>
    );
}