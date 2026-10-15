import React from "react";
import { Card, CardHeader } from "./ui/Card";
import { Callout, StepBadge } from "./ui/Bits";
import type { Tone } from "./ui/Bits";
import Button from "./ui/Button";
import { useT } from "../i18n";
import styles from "./AttentionStory.module.css";

/** Per-section accent; the copy itself lives in the locale files. */
const SECTION_TONES: Tone[] = ["indigo", "purple", "cyan", "orange"];

interface AttentionStoryProps {
  /** Switches the page to the playground tab. */
  onTryIt?: (() => void) | undefined;
}

const AttentionStory: React.FC<AttentionStoryProps> = ({ onTryIt }) => {
  const t = useT("visualizer");
  const story = t.story;

  return (
    <Card padding="lg" className={`${styles.story} animate-in`}>
      <CardHeader title={story.heading} icon="book" />

      <ol className={styles.sections}>
        {([1, 2, 3, 4] as const).map((id, i) => {
          const tone = SECTION_TONES[i] ?? "indigo";
          return (
            <li key={id} className={styles.section} data-tone={tone}>
              <h3 className={styles.sectionTitle}>
                <StepBadge tone={tone} variant="solid" size="sm">
                  {String(id).padStart(2, "0")}
                </StepBadge>
                {story.sections[id].title}
              </h3>
              <p className={styles.body}>{story.sections[id].body}</p>
              {id === 2 && (
                <Callout tone="purple" variant="quote">
                  <p>{story.quote}</p>
                </Callout>
              )}
            </li>
          );
        })}
      </ol>

      <div className={styles.footer}>
        <p>{story.footer}</p>
        {onTryIt && (
          <Button iconRight="arrowRight" onClick={onTryIt}>
            {t.page.tabPlayground}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default AttentionStory;
