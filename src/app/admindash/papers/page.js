import Papers from "@/app/components/Papers/Papers";

export default function PapersPage() {
    return (
        <div className="text-center text-gray-600">
            <h2 className="text-2xl font-semibold mb-4 playfair-display-sc-regular">
                Papers
            </h2>
            <Papers />
            <p>Feature under development. Check back soon!</p>
        </div>
    );
}