import React from "react";
import { Page, PageHeader } from "../components/ui/Page";
import { Card } from "../components/ui/Card";
import { Status } from "../components/ui/Bits";
import NextStep from "../components/ui/NextStep";
import { useT } from "../i18n";
import styles from "./Evaluation.module.css";

const Evaluation: React.FC = () => {
  const t = useT("evaluation");

  return (
    <Page width="content">
      <PageHeader page="evaluation" title={t.title} subtitle={t.subtitle} />

      <Card padding="lg" className={styles.placeholder}>
        <Status kind="empty" icon="flask" title={t.placeholder.title}>
          <p>{t.placeholder.body}</p>
          <span className={styles.chip}>
            <span className={styles.chipDot} aria-hidden />
            {t.placeholder.chip}
          </span>
        </Status>
      </Card>

      <NextStep from="evaluation" />
    </Page>
  );
};

export default Evaluation;
