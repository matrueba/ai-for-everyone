import React, { useEffect, useState } from "react";
import Icon from "./ui/Icon";
import Tabs from "./ui/Tabs";
import { LANGS, useI18n, useT } from "../i18n";
import { THEMES, useTheme } from "../theme";
import type { Theme } from "../theme";
import type { PageId } from "../i18n/content-types";
import { NAV_GROUPS, PAGE_META, formatStep } from "../navigation";
import { fetchHealth } from "../api";
import styles from "./Sidebar.module.css";

interface SidebarProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  /** Off-canvas state on narrow screens; ignored on desktop where the sidebar is always shown. */
  open: boolean;
  onClose: () => void;
}

type BackendStatus = "checking" | "online" | "offline";

const HEALTH_INTERVAL_MS = 30_000;
const REPO_URL = "https://github.com";

const THEME_ICONS = { light: "sun", dark: "moon" } as const;

/** Polls `/api/health` so the status dot reflects the real backend, not a hardcoded "online". */
function useBackendStatus(): BackendStatus {
  const [status, setStatus] = useState<BackendStatus>("checking");

  useEffect(() => {
    let cancelled = false;
    const check = () =>
      fetchHealth()
        .then(() => !cancelled && setStatus("online"))
        .catch(() => !cancelled && setStatus("offline"));
    check();
    const timer = window.setInterval(check, HEALTH_INTERVAL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  return status;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate, open, onClose }) => {
  const t = useT("common");
  const { lang, setLang } = useI18n();
  const { theme, setTheme } = useTheme();
  const status = useBackendStatus();

  const statusLabel = {
    checking: t.sidebar.backendChecking,
    online: t.sidebar.backendOnline,
    offline: t.sidebar.backendOffline,
  }[status];

  const renderItem = (id: PageId) => {
    const meta = PAGE_META[id];
    const active = id === activePage;
    return (
      <li key={id}>
        <button
          type="button"
          className={styles.item}
          aria-current={active ? "page" : undefined}
          onClick={() => onNavigate(id)}
        >
          <span className={styles.itemIcon}>
            <Icon name={meta.icon} size={17} />
          </span>
          <span className={styles.itemLabel}>{t.menu[id]}</span>
          {meta.step !== undefined && <span className={styles.itemStep}>{formatStep(meta.step)}</span>}
        </button>
      </li>
    );
  };

  return (
    <aside id="app-sidebar" className={styles.sidebar} data-open={open || undefined}>
      <div className={styles.brandRow}>
        <button type="button" className={styles.brand} onClick={() => onNavigate("home")}>
          <span className={styles.logo}>
            <Icon name="sparkles" size={18} />
          </span>
          <span className={styles.brandName}>{t.appName}</span>
        </button>
        <button type="button" className={styles.closeButton} onClick={onClose} aria-label={t.nav.closeMenu}>
          <Icon name="close" size={18} />
        </button>
      </div>

      <nav className={styles.nav} aria-label={t.nav.label}>
        <ul className={styles.list}>{renderItem("home")}</ul>

        {NAV_GROUPS.map((group) => (
          <div key={group.id} className={styles.group}>
            <p className={styles.groupLabel}>{t.nav.groups[group.id]}</p>
            <ul className={styles.list}>{group.pages.map(renderItem)}</ul>
          </div>
        ))}
      </nav>

      <div className={styles.footer}>
        <div className={styles.setting}>
          <p className={styles.settingLabel}>{t.language.label}</p>
          <Tabs
            label={t.language.label}
            size="sm"
            block
            value={lang}
            onChange={setLang}
            items={LANGS.map((code) => ({ id: code, label: t.language[code] }))}
          />
        </div>

        <div className={styles.setting}>
          <p className={styles.settingLabel}>{t.theme.label}</p>
          <Tabs<Theme>
            label={t.theme.label}
            size="sm"
            block
            value={theme}
            onChange={setTheme}
            items={THEMES.map((id) => ({ id, icon: THEME_ICONS[id], label: t.theme[id] }))}
          />
        </div>

        <div className={styles.meta}>
          <span className={styles.status} data-status={status} role="status">
            <span className={styles.statusDot} aria-hidden />
            {statusLabel}
          </span>
          <a className={styles.repo} href={REPO_URL} target="_blank" rel="noreferrer" aria-label={t.footer.github}>
            <Icon name="github" size={16} />
          </a>
        </div>
        <p className={styles.copyright}>{t.footer.copyright}</p>
      </div>
    </aside>
  );
};

export default Sidebar;
