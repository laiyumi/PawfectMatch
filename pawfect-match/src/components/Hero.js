import PetCreationForm from "../components/PetCreationForm";

export default function Hero() {
    return (
        <div className="hero min-h-[500px] bg-base-200 relative overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20"
                style={{
                    backgroundImage: "url('/hero-pets.jpg')",
                }}
            />

            <div className="hero-content flex-col lg:flex-row justify-between gap-12 relative z-10 w-full max-w-7xl">
                {/* Left side - Text content */}
                <div className="text-left lg:w-1/2">
                    <h1 className="text-5xl font-bold mb-8">Welcome to Pawfect Match</h1>
                    <p className="text-xl">
                        Help us find loving homes for our furry friends. Add a new pet to our system and make a difference in their lives.
                    </p>
                </div>

                {/* Right side - Form */}
                <div className="lg:w-1/2">
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title justify-center mb-4">Add a New Pet</h2>
                            <PetCreationForm onPetCreated={() => window.location.reload()} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 