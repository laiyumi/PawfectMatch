export default function SearchBar({ value, onChange }) {
    return (
        <div className="form-control xs:w-auto sm:max-w-[250px]">
            <div className="input-group flex place-items-center ">
                <input
                    type="text"
                    placeholder="Enter a pet name"
                    className="input input-bordered xs:input-sm lg:input-md lg:w-[250px]  "
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
                <button className="btn btn-square xs:btn-sm border-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="lg:h-5 lg:w-5 xs:w-4 xs:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
            </div>

        </div>
    );
} 