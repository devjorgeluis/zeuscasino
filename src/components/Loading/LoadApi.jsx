import iconLoading from '/src/assets/svg/loading.gif';

const LoadApi = () => {
  return (
    <div className="loading-container">
      <img src={iconLoading} width={30} className="loading-icon" />
    </div>
  );
};

export default LoadApi;
