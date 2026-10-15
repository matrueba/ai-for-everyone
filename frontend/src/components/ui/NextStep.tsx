import React from "react";
import Icon from "./Icon";
import { useT } from "../../i18n";
import type { PageId } from "../../i18n/content-types";
import { PAGE_META, PATH_ORDER, formatStep, useNavigate } from "../../navigation";
import styles from "./NextStep.module.css";

interface NextStepProps {
    /** The current page; the link points to the following stop of the learning path. */
    from: PageId;
    /** Optional lead-in shown above the link (e.g. a page's closing remark). */
    children?: React.ReactNode;
}

/** Closing card of a page that leads to the next stop of the learning path. */
const NextStep: React.FC<NextStepProps> = ({ from, children }) => {
    const common = useT("common");
    const home = useT("home");
    const navigate = useNavigate();

    const next = PATH_ORDER[PATH_ORDER.indexOf(from) + 1];
    if (!next || !navigate) return children ? <div className={styles.lead}>{children}</div> : null;

    const meta = PAGE_META[next];

    return (
        <div className={styles.wrapper}>
            {children && <div className={styles.lead}>{children}</div>}
            <button type="button" className={styles.card} onClick={() => navigate(next)}>
                <span className={styles.icon}>
                    <Icon name={meta.icon} size={22} />
                </span>
                <span className={styles.text}>
                    <span className={styles.label}>
                        {common.nav.next}
                        {meta.step !== undefined && <span className={styles.step}>{formatStep(meta.step)}</span>}
                    </span>
                    <span className={styles.title}>{common.menu[next]}</span>
                    <span className={styles.description}>{home.sections[next as Exclude<PageId, "home">]}</span>
                </span>
                <Icon name="arrowRight" size={20} className={styles.arrow} />
            </button>
        </div>
    );
};

export default NextStep;
