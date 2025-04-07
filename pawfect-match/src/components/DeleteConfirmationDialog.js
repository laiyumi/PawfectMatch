export default function DeleteConfirmationDialog({ isOpen, onConfirm, onCancel, petName }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4">
                <h3 className="text-lg font-bold mb-4">Delete Confirmation</h3>
                <p className="mb-6">
                    Are you sure you want to delete <span className="font-semibold">{petName}</span>? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-2">
                    <button
                        className="btn btn-ghost"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn btn-error"
                        onClick={onConfirm}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
} 