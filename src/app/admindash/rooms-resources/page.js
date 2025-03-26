import Rooms from "@/app/components/RoomResource/Rooms";
import Resources from "@/app/components/RoomResource/Resources";

export default function RoomsResourcesPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4 playfair-display-sc-regular">
        Rooms & Resources
      </h2>
      <div className="flex flex-col h-[calc(100vh-200px)] lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
        <div className="w-full h-full overflow-auto lg:w-1/2">
          <Rooms />
        </div>
        <div className="w-full h-full overflow-auto lg:w-1/2">
          <Resources />
        </div>
      </div>
    </div>
  );
}