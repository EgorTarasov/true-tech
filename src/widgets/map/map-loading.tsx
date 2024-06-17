import { Text } from "@/components/typography/Text";
import { LoadingWrapper } from "@/components/ui/loaders/LoadingWrapper";

export const MapLoading = () => {
  return (
    <div className="w-full h-screen absolute">
      <div className="w-full h-full flex flex-col justify-center items-center">
        <Text.H2>Загружаем карту</Text.H2>
        <LoadingWrapper className="h-auto" />
      </div>
    </div>
  );
};
