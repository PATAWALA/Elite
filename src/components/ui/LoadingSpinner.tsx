const LoadingSpinner = ({ message = 'Chargement...' }: { message?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-gray-500">{message}</p>
    </div>
  );
};

export default LoadingSpinner;