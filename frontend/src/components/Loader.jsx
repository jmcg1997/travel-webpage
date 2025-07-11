// Loader component for showing a spinning animation while loading
export default function Loader({
  size = 10, // default size (controls the spinner dimensions)
  color = "text-indigo-500", // default color (Tailwind CSS class)
  slow = true // use slow spinning animation by default
}) {
  // Map size numbers to Tailwind width and height classes
  const sizeClasses = {
    4: "w-4 h-4",
    6: "w-6 h-6",
    8: "w-8 h-8",
    10: "w-10 h-10",
    12: "w-12 h-12"
  };

  return (
    <div
      role="status"
      aria-label="Loading..."
      className="flex justify-center items-center py-10"
    >
      <div
        className={`${sizeClasses[size] || "w-10 h-10"} border-4 border-current border-t-transparent rounded-full ${
          slow ? "animate-spin-slow" : "animate-spin"
        } ${color}`}
      ></div>
    </div>
  );
}
