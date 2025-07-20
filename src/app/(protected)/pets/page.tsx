import { auth } from "@/auth";

export default async function PetsPage() {
  const session = await auth();

  const pets = [
    { id: 1, name: "Fluffy", type: "Cat", breed: "Persian", age: "3 years" },
    { id: 2, name: "Max", type: "Dog", breed: "Golden Retriever", age: "5 years" },
    { id: 3, name: "Bella", type: "Dog", breed: "Labrador", age: "2 years" },
    { id: 4, name: "Luna", type: "Cat", breed: "British Shorthair", age: "1 year" },
    { id: 5, name: "Charlie", type: "Dog", breed: "Beagle", age: "4 years" },
  ];

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">My Pets</h2>
        <p className="text-gray-600">
          Manage all your pets in one place. View their information and schedule appointments.
        </p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">Pet List</h3>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">
              Add New Pet
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pets.map((pet) => (
              <div
                key={pet.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-semibold text-gray-900">{pet.name}</h4>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {pet.type}
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Breed:</span> {pet.breed}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Age:</span> {pet.age}
                  </p>
                </div>
                <div className="mt-4 flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View Details
                  </button>
                  <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                    Schedule Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 