import { ThreeDots } from 'react-loader-spinner';

const Loading = ({ size = 'medium', color = '#FEBD69' }) => {
  const sizes = {
    small: { height: 30, width: 50 },
    medium: { height: 50, width: 80 },
    large: { height: 80, width: 120 },
  };

  return (
    <div className="flex items-center justify-center">
      <ThreeDots
        height={sizes[size].height}
        width={sizes[size].width}
        radius="9"
        color={color}
        ariaLabel="loading"
        visible={true}
      />
    </div>
  );
};

export const PageLoading = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <Loading size="large" />
  </div>
);

export default Loading;

