import PetCreationForm from "../components/PetCreationForm";

export default function Hero({ onPetCreated }) {
    return (
        <div
            className="hero min-h-[500px] bg-base-200 relative overflow-hidden"
            style={{
                backgroundImage: "url(/hero-image.png)",
                // backgroundSize: "cover",
                // backgroundPosition: "center",
            }}>

            <div className="hero-content flex-col lg:flex-row justify-between gap-12 relative z-10 w-full max-w-7xl">
                {/* Left side - Text content */}
                <div className="text-left lg:w-1/2">
                </div>

                {/* Right side - Form */}
                <div className="lg:w-1/2">
                    <div className="card bg-base-100 shadow-xl">
                        <PetCreationForm onPetCreated={onPetCreated} />
                    </div>
                </div>
            </div>
        </div>

    );
} 