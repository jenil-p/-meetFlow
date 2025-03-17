import Rooms from "@/app/components/RoomResource/Rooms";
import Resources from "@/app/components/RoomResource/Resources";

export default function RoomsResourcesPage() {
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4 playfair-display-sc-regular">
                Rooms Resources
            </h2>
            <div className="flex space-x-4">
                <Rooms />
                <Resources />
            </div>
        </div>
    );
}