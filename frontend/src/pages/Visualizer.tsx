import React, { useState } from "react";
import AttentionStory from "../components/AttentionStory";
import AttentionPlayground from "../components/AttentionPlayground";
import { Page, PageHeader } from "../components/ui/Page";
import Tabs from "../components/ui/Tabs";
import { useT } from "../i18n";

type Tab = "theory" | "playground";

const Visualizer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("theory");
  const t = useT("visualizer").page;

  return (
    <Page width="content">
      <PageHeader
        page="visualizer"
        title={t.title}
        subtitle={t.subtitle}
        actions={
          <Tabs<Tab>
            label={t.title}
            value={activeTab}
            onChange={setActiveTab}
            items={[
              { id: "theory", label: t.tabTheory, icon: "book" },
              { id: "playground", label: t.tabPlayground, icon: "zap" },
            ]}
          />
        }
      />

      {activeTab === "theory" ? (
        <AttentionStory onTryIt={() => setActiveTab("playground")} />
      ) : (
        <AttentionPlayground />
      )}
    </Page>
  );
};

export default Visualizer;
