import { useFeeling } from "@/context/FeelingContext";
import { X } from "lucide-react";
import { FeelingRecommendationSection } from "@/components/FeelingRecommendationSection";

export function GlobalFeelingModal() {
  const { triggerModal, setTriggerModal } = useFeeling();

  if (!triggerModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full relative">
        <button
          className="absolute top-2 right-2 text-gray-600"
          onClick={() => setTriggerModal(false)}
        >
          <X className="h-5 w-5" />
        </button>
        <h2 className="text-xl font-bold mb-4">추천 영화</h2>
        <FeelingRecommendationSection
          onMovieClick={(m) => {
            console.log("영화 클릭:", m);
            setTriggerModal(false);
          }}
          showFeelingButtons={false}
        />
      </div>
    </div>
  );
}