import Permissions from "@/app/components/Permissions/Permissions";

export default function PermissionsPage() {
    return (
        <div className="text-center text-gray-600">
            <h2 className="text-2xl font-semibold mb-4 playfair-display-sc-regular">
                Permissions
            </h2>
            <Permissions />
        </div>
    );
}