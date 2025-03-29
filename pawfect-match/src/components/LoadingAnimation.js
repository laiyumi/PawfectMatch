import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function LoadingAnimation() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
            <div className="w-100 h-100">
                <DotLottieReact
                    src="/PawAnimation.lottie"
                    loop
                    autoplay
                />
            </div>
        </div>
    );
}