import { useState, useEffect } from "react";
import PetCard from "./PetCard";
import TableView from "./TableView";
import MultiSelectDropdown from "./MultiSelectDropdown";
import SearchBar from "./SearchBar";
import { Chewy } from 'next/font/google';

const chewy = Chewy({
    weight: '400',
    subsets: ['latin'],
});

export default function PetList({ pets, onStatusChange, onPriorityChange, onDelete }) {

    const [currentPage, setCurrentPage] = useState(1);
    const [isTableView, setIsTableView] = useState(false);
    const [prioritySort, setPrioritySort] = useState('none'); // 'none', 'asc', or 'desc'
    const [selectedAnimalTypes, setSelectedAnimalTypes] = useState([]);
    const [animalTypes, setAnimalTypes] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [isLoading, setIsLoading] = useState(false);
    const petsPerPage = 9;

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

    useEffect(() => {
        const refreshTypes = async () => {
            try {
                const response = await fetch("/api/animal-types");
                const data = await response.json();
                if (data.success) {
                    setAnimalTypes(data.data);

                    // Auto-select any new types not already in selectedAnimalTypes
                    const newTypeIds = data.data.map(type => type.id);
                    setSelectedAnimalTypes(prev => {
                        const merged = Array.from(new Set([...prev, ...newTypeIds]));
                        return merged;
                    });
                }
            } catch (error) {
                console.error("Error refreshing animal types:", error);
            }
        };
        refreshTypes();
    }, [pets]);

    // Search and filter pets
    const filteredPets = pets
        .filter(pet => {
            // Apply search filter
            const matchesSearch = pet.name.toLowerCase().includes(searchQuery.toLowerCase());

            // Apply status filter
            const matchesStatus = selectedStatus === 'all' || pet.status === selectedStatus;

            // Apply animal type filter for both views
            const matchesType = selectedAnimalTypes.includes(pet.animalType.id);

            return matchesSearch && matchesStatus && matchesType;
        });

    // Count the number of pets for each status
    const statusCounts = pets
        .filter(pet =>
            (selectedAnimalTypes.length === 0 || selectedAnimalTypes.includes(pet.animalType.id)) &&
            pet.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .reduce((acc, pet) => {
            acc[pet.status] = (acc[pet.status] || 0) + 1;
            return acc;
        }, {});

    const statusOptions = [
        { value: 'all', label: "All Statuses" },
        { value: 'AVAILABLE', label: `Available (${statusCounts['AVAILABLE'] || 0})` },
        { value: 'ADOPTED', label: `Adopted (${statusCounts['ADOPTED'] || 0})` },
        { value: 'IN_CARE', label: `In Care (${statusCounts['IN_CARE'] || 0})` }
    ];

    // Count the number of pets for each animal type
    const typeCounts = pets
        .filter(pet =>
            (selectedStatus === 'all' || pet.status === selectedStatus) &&
            pet.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .reduce((acc, pet) => {
            const typeId = pet.animalType.id;
            acc[typeId] = (acc[typeId] || 0) + 1;
            return acc;
        }, {});

    const animalTypesWithCounts = animalTypes.map(type => ({
        ...type,
        label: `${type.name} (${typeCounts[type.id] || 0})`,
        _filteredCount: typeCounts[type.id] || 0
    }));

    // Sort pets by priority for card view
    const sortedPets = [...filteredPets].sort((a, b) => {
        if (!isTableView && prioritySort !== 'none') {
            const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
            const diff = priorityOrder[a.priority] - priorityOrder[b.priority];
            return prioritySort === 'asc' ? diff : -diff;
        }
        return new Date(b.createdAt) - new Date(a.createdAt); // Default sort by createdAt
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

    const handleClearFilters = () => {
        setSearchQuery('');
        setSelectedStatus('all');
        setSelectedAnimalTypes(animalTypes.map(type => type.id));
        setPrioritySort('none');
        setCurrentPage(1);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {isLoading && (
                <span className="loading loading-dots loading-md"></span>
            )}
            <h2 className={`text-2xl text-center ${chewy.className}`}>Pets List <span>({filteredPets.length})</span></h2>
            <div className="flex flex-col gap-4 xl:flex-row justify-between items-center xl:items-center my-8">
                {/* search bar */}
                <SearchBar
                    value={searchQuery}
                    onChange={handleSearch}
                />
                <div className="flex max-xs:flex-col max-xs:w-full sm:flex-row items-center justify-between gap-4">
                    {/* status dropdown */}
                    <select
                        value={selectedStatus}
                        onChange={handleStatusFilter}
                        className="select select-bordered w-auto max-xs:w-full xs:select-sm lg:select-md "
                    >
                        {statusOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    {/* animal types dropdown */}
                    <MultiSelectDropdown
                        options={animalTypesWithCounts}
                        selectedValues={selectedAnimalTypes}
                        onChange={(values) => {
                            setSelectedAnimalTypes(values);
                            setCurrentPage(1);
                        }}
                    />

                    {/* priority dropdown */}
                    {!isTableView && (
                        <select
                            value={prioritySort}
                            onChange={handlePrioritySort}
                            className="select select-bordered w-auto max-xs:w-full xs:select-sm lg:select-md"
                        >
                            <option value="none">Sort by Priority</option>
                            <option value="desc">High to Low</option>
                            <option value="asc">Low to High</option>
                        </select>
                    )}

                    {/* clear filters */}
                    <button
                        className="btn btn-outline xs:btn-xs lg:btn-md max-xs:w-full"
                        onClick={handleClearFilters}
                    >
                        Clear Filters
                    </button>
                </div>

                {/* toggle table/card view */}
                <div className="form-control">
                    <label className="label cursor-pointer">
                        <span className="text-base-content mr-2 xs:text-sm lg:text-base">Table View</span>
                        <input
                            type="checkbox"
                            className="toggle xs:toggle-xs lg:toggle-md"
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
                    setIsLoading={setIsLoading}
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
                                setIsLoading={setIsLoading}
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