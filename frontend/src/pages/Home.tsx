import React from "react";
import Icon from "../components/ui/Icon";
import Button from "../components/ui/Button";
import { Page } from "../components/ui/Page";
import { useT } from "../i18n";
import type { PageId } from "../i18n/content-types";
import { NAV_GROUPS, PAGE_META, formatStep, useNavigate } from "../navigation";
import styles from "./Home.module.css";

/** Sections whose page is still a placeholder; their card is marked accordingly. */
const COMING_SOON: PageId[] = ["evaluation"];

const Home: React.FC = () => {
  const t = useT("home");
  const common = useT("common");
  const navigate = useNavigate();

  return (
    <Page width="content">
      <section className={styles.hero}>
        <p className={styles.eyebrow}>
          <Icon name="sparkles" size={14} />
          {t.eyebrow}
        </p>
        <h1 className={styles.title}>{t.title}</h1>
        <p className={styles.subtitle}>{t.subtitle}</p>
        <div className={styles.actions}>
          <Button size="lg" iconRight="arrowRight" onClick={() => navigate?.("history")}>
            {t.actions.start}
          </Button>
        </div>
      </section>

      <section className={styles.path} aria-labelledby="path-heading">
        <div className={styles.pathHeader}>
          <h2 id="path-heading" className={styles.pathTitle}>{t.path.heading}</h2>
          <p className={styles.pathLead}>{t.path.lead}</p>
        </div>

        {NAV_GROUPS.map((group) => (
          <div key={group.id} className={styles.group}>
            <h3 className={styles.groupLabel}>{common.nav.groups[group.id]}</h3>
            <ol className={styles.grid}>
              {group.pages.map((id) => {
                const meta = PAGE_META[id];
                const soon = COMING_SOON.includes(id);
                return (
                  <li key={id}>
                    <button
                      type="button"
                      className={styles.card}
                      data-group={group.id}
                      onClick={() => navigate?.(id)}
                    >
                      <span className={styles.cardTop}>
                        <span className={styles.cardIcon}>
                          <Icon name={meta.icon} size={20} />
                        </span>
                        {soon ? (
                          <span className={styles.soon}>{t.comingSoon}</span>
                        ) : (
                          meta.step !== undefined && <span className={styles.cardStep}>{formatStep(meta.step)}</span>
                        )}
                      </span>
                      <span className={styles.cardTitle}>{common.menu[id]}</span>
                      <span className={styles.cardBody}>{t.sections[id as Exclude<PageId, "home">]}</span>
                      <span className={styles.cardArrow}>
                        <Icon name="arrowRight" size={16} />
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        ))}
      </section>
    </Page>
  );
};

export default Home;
