import SelectBox from "./common/SelectBox";

export default function Filters() {
    return (
        <div className="fixed z-50  p-8 w-4/6 h-5/6 bg-filtersBg top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <h1 className="text-3xl font-semibold text-center">Genres</h1>
            <div className="bg-white w-full h-64 mt-8">
                <SelectBox title="Simulation"/>
            </div>
        </div>
    )
}