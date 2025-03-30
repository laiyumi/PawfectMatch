import { useState, useEffect } from "react";
import PetCard from "./PetCard";
import TableView from "./TableView";
import MultiSelectDropdown from "./MultiSelectDropdown";
import SearchBar from "./SearchBar";

export default function PetList({ pets, onStatusChange, onPriorityChange, onDelete }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [isTableView, setIsTableView] = useState(false);
    const [prioritySort, setPrioritySort] = useState('none'); // 'none', 'asc', or 'desc'
    const [selectedAnimalTypes, setSelectedAnimalTypes] = useState([]);
    const [animalTypes, setAnimalTypes] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const petsPerPage = 6;

    const statusOptions = [
        { value: 'all', label: 'All Statuses' },
        { value: 'AVAILABLE', label: 'Available' },
        { value: 'ADOPTED', label: 'Adopted' },
        { value: 'IN_CARE', label: 'In Care' }
    ];

    // Fetch animal types
    useEffect(() => {
        const fetchAnimalTypes = async () => {
            try {
                const response = await fetch("/api/animal-types");
                const data = await response.json();
                if (data.success) {
                    setAnimalTypes(data.data);
                }
            } catch (error) {
                console.error("Error fetching animal types:", error);
            }
        };
        fetchAnimalTypes();
    }, []);

    // Search and filter pets
    const filteredPets = pets
        .filter(pet => {
            // Apply search filter
            const matchesSearch = pet.name.toLowerCase().includes(searchQuery.toLowerCase());

            // Apply status filter
            const matchesStatus = selectedStatus === 'all' || pet.status === selectedStatus;

            // Apply animal type filter for both views
            const matchesType = selectedAnimalTypes.length === 0 ||
                selectedAnimalTypes.includes(pet.animalType.id);

            return matchesSearch && matchesStatus && matchesType;
        });

    // Sort pets by priority if needed (only for card view)
    const sortedPets = [...filteredPets].sort((a, b) => {
        if (!isTableView && prioritySort !== 'none') {
            const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
            const diff = priorityOrder[a.priority] - priorityOrder[b.priority];
            return prioritySort === 'asc' ? diff : -diff;
        }
        return 0;
    });

    // Only paginate for card view
    const currentPets = isTableView
        ? sortedPets
        : sortedPets.slice(currentPage * petsPerPage - petsPerPage, currentPage * petsPerPage);
    const totalPages = Math.ceil(sortedPets.length / petsPerPage);

    const handlePrioritySort = (e) => {
        setPrioritySort(e.target.value);
        setCurrentPage(1); // Reset to first page when sorting changes
    };

    const handleSearch = (value) => {
        setSearchQuery(value);
        setCurrentPage(1); // Reset to first page when search changes
    };

    const handleStatusFilter = (e) => {
        setSelectedStatus(e.target.value);
        setCurrentPage(1); // Reset to first page when filter changes
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl text-center font-semibold">Pets List</h2>
            <div className="flex justify-between items-center my-8">
                <div className=" flex items-center justify-between gap-4">
                    <SearchBar
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                    <select
                        value={selectedStatus}
                        onChange={handleStatusFilter}
                        className="select select-bordered select-sm"
                    >
                        {statusOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <MultiSelectDropdown
                        options={animalTypes}
                        selectedValues={selectedAnimalTypes}
                        onChange={(values) => {
                            setSelectedAnimalTypes(values);
                            setCurrentPage(1);
                        }}
                    />
                    {!isTableView && (
                        <select
                            value={prioritySort}
                            onChange={handlePrioritySort}
                            className="select select-bordered select-sm"
                        >
                            <option value="none">Sort by Priority</option>
                            <option value="desc">High to Low</option>
                            <option value="asc">Low to High</option>
                        </select>
                    )}
                </div>
                <div className="form-control">
                    <label className="label cursor-pointer">
                        <span className="label-text mr-2">Table View</span>
                        <input
                            type="checkbox"
                            className="toggle"
                            checked={isTableView}
                            onChange={(e) => setIsTableView(e.target.checked)}
                        />
                    </label>
                </div>
            </div>

            {isTableView ? (
                <TableView
                    pets={filteredPets}
                    onStatusChange={onStatusChange}
                    onPriorityChange={onPriorityChange}
                    onDelete={onDelete}
                />
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentPets.map((pet) => (
                            <PetCard
                                key={pet.id}
                                pet={pet}
                                onStatusChange={onStatusChange}
                                onPriorityChange={onPriorityChange}
                                onDelete={onDelete}
                            />
                        ))}
                    </div>

                    {/* Pagination - only show for card view */}
                    <div className="flex justify-center mt-8 gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="btn btn-circle btn-outline"
                        >
                            ←
                        </button>
                        <span className="flex items-center px-4">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="btn btn-circle btn-outline"
                        >
                            →
                        </button>
                    </div>
                </>
            )}
        </div>
    );
} 