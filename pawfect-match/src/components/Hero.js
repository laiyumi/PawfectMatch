import PetCreationForm from "../components/PetCreationForm";

export default function Hero({ onPetCreated }) {
    return (

        <div className="hero min-h-[500px] bg-base-200 p-4">
            <div className="hero-content flex-col lg:flex-row ">
                <div className="text-center lg:text-left ">
                    <img src="/hero-image-left.png" className="max-h-[400px] lg:max-h-[800px]"></img>
                </div>
                <div className="bg-base-100 w-full max-w-md shrink-0 shadow-2xl rounded-3xl ">
                    <PetCreationForm onPetCreated={onPetCreated} />
                </div>
            </div>
        </div>

    );
} 