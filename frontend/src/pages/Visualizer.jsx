import AttentionStory from "../components/AttentionStory";
import AttentionPlayground from "../components/AttentionPlayground";

function Visualizer() {
  return (
    <div className="animate-fade-in-up grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8 items-start">
      <AttentionStory />
      <AttentionPlayground />
    </div>
  );
}

export default Visualizer;
