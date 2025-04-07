import PetCreationForm from "../components/PetCreationForm";

export default function Hero({ onPetCreated }) {
    return (

        <div className="hero min-h-[500px] bg-base-200 p-0 m-0">
            <div className="hero-content flex-col lg:flex-row p-0 m-0">
                <div className="text-center lg:text-left p-0 m-0">
                    <img src="/hero-image-left.png" className="max-h-[400px] lg:max-h-[500px] p-0 m-0"></img>
                </div>
                <div className="bg-base-100 w-full max-w-md shrink-0 shadow-2xl rounded-3xl ">
                    <PetCreationForm onPetCreated={onPetCreated} />
                </div>
            </div>
        </div>

    );
} 