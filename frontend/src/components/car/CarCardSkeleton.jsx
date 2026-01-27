const CarCardSkeleton = () => {
  return (
    <div className="bg-white rounded-[18px] shadow-md overflow-hidden animate-pulse">
      <div className="h-[170px] bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 w-2/3 bg-gray-200 rounded" />
        <div className="h-3 w-1/2 bg-gray-200 rounded" />
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-gray-200 rounded-full" />
          <div className="h-6 w-20 bg-gray-200 rounded-full" />
          <div className="h-6 w-14 bg-gray-200 rounded-full" />
        </div>
        <div className="h-5 w-1/3 bg-gray-200 rounded" />
      </div>
    </div>
  );
};

export default CarCardSkeleton;