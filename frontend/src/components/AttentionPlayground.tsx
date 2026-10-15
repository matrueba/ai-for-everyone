import React, { useState, useEffect } from "react";
import { fetchAttention, fetchModelInfo } from "../api";
import AttentionLines from "./AttentionLines";
import AttentionHeatmap from "./AttentionHeatmap";
import MatrixView from "./MatrixView";
import { Card, CardHeader } from "./ui/Card";
import Button from "./ui/Button";
import Tabs from "./ui/Tabs";
import Icon from "./ui/Icon";
import { Status } from "./ui/Bits";
import { useT } from "../i18n";
import styles from "./AttentionPlayground.module.css";

type ViewMode = "lines" | "heatmap" | "matrix";

const AttentionPlayground: React.FC = () => {
  const t = useT("visualizer").playground;
  const [sentence, setSentence] = useState<string>(t.defaultSentence);
  const [attentionData, setAttentionData] = useState<any | null>(null);
  const [modelInfo, setModelInfo] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [layer, setLayer] = useState<number>(0);
  const [head, setHead] = useState<number>(0);
  const [viewMode, setViewMode] = useState<ViewMode>("lines");

  // Load model info on mount
  useEffect(() => {
    fetchModelInfo()
      .then(setModelInfo)
      .catch(() => { });
  }, []);

  const handleAnalyze = async () => {
    if (!sentence.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAttention(sentence.trim());
      setAttentionData(data);
      setLayer(0);
      setHead(0);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAnalyze();
  };

  const filterData = attentionData?.all;
  const nLayers = filterData?.attn?.length || 0;
  const nHeads = filterData?.attn?.[0]?.length || 0;

  const panelTitle = { lines: t.panelLines, heatmap: t.panelHeatmap, matrix: t.panelMatrix }[viewMode];

  const renderSelect = (id: string, label: string, value: number, count: number, onChange: (v: number) => void) => (
    <label className={styles.field} htmlFor={id}>
      <span className={styles.fieldLabel}>{label}</span>
      <span className={styles.selectWrap}>
        <select id={id} value={value} onChange={(e) => onChange(+e.target.value)} className={styles.select}>
          {Array.from({ length: count }, (_, i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
        <Icon name="chevronDown" size={14} className={styles.selectIcon} />
      </span>
    </label>
  );

  return (
    <div className={`${styles.playground} animate-in`}>
      {/* Input */}
      <Card padding="md">
        <form className={styles.inputRow} onSubmit={onSubmit}>
          <label htmlFor="sentence-input" className="visually-hidden">
            {t.inputLabel}
          </label>
          <div className={styles.inputWrap}>
            <Icon name="search" size={18} className={styles.inputIcon} />
            <input
              id="sentence-input"
              type="text"
              value={sentence}
              onChange={(e) => setSentence(e.target.value)}
              placeholder={t.placeholder}
              className={styles.input}
            />
          </div>
          <Button type="submit" size="lg" icon="zap" disabled={loading || !sentence.trim()}>
            {loading ? t.analyzing : t.analyze}
          </Button>
        </form>
        <p className={styles.inputHint}>{t.inputLabel}</p>
      </Card>

      {error && (
        <Card padding="sm" variant="outline">
          <Status kind="error" title={error} />
        </Card>
      )}

      {/* Controls — only once there is data */}
      {attentionData && (
        <Card padding="sm" className={styles.controls}>
          {renderSelect("layer-select", t.layer, layer, nLayers, setLayer)}
          {renderSelect("head-select", t.head, head, nHeads, setHead)}

          <Tabs<ViewMode>
            label={panelTitle}
            size="sm"
            value={viewMode}
            onChange={setViewMode}
            items={[
              { id: "lines", label: t.viewLines },
              { id: "heatmap", label: t.viewHeatmap },
              { id: "matrix", label: t.viewMatrix },
            ]}
          />

          {modelInfo && (
            <div className={styles.chips}>
              {[
                [t.chips.layers, modelInfo.num_layers],
                [t.chips.heads, modelInfo.num_heads],
                ["d_model", modelInfo.d_model],
                ["d_ff", modelInfo.d_ff],
              ].map(([label, value]) => (
                <span key={label} className={styles.chip}>
                  <span className={styles.chipLabel}>{label}</span>
                  <span className={styles.chipValue}>{value as string}</span>
                </span>
              ))}
            </div>
          )}
        </Card>
      )}

      {loading && (
        <Card padding="md">
          <Status kind="loading" title={t.runningForward} />
        </Card>
      )}

      {!loading && !attentionData && (
        <Card padding="md" className={styles.empty}>
          <Status kind="empty" icon="eye" title={t.emptyTitle}>
            {t.emptyBody}
          </Status>
        </Card>
      )}

      {!loading && attentionData && filterData && (
        <>
          <Card padding="none" className={styles.panel}>
            <div className={styles.panelHeader}>
              <h3 className={styles.panelTitle}>{panelTitle}</h3>
              <span className={styles.panelMeta}>{t.layerHead(layer, head)}</span>
            </div>
            <div className={styles.panelBody}>
              {viewMode === "lines" && <AttentionLines data={filterData} layer={layer} head={head} />}
              {viewMode === "heatmap" && <AttentionHeatmap data={filterData} layer={layer} head={head} />}
              {viewMode === "matrix" && <MatrixView data={filterData} layer={layer} head={head} />}
            </div>
          </Card>

          <Card padding="none" className={styles.panel}>
            <div className={styles.panelHeader}>
              <h3 className={styles.panelTitle}>{t.tokensTitle}</h3>
              <span className={styles.panelMeta}>{t.tokensCount(filterData.left_text.length)}</span>
            </div>
            <div className={styles.tokens}>
              {filterData.left_text.map((tok: string, i: number) => (
                <span key={i} className={styles.token}>
                  <span className={styles.tokenIndex}>{i}</span>
                  <span>{tok}</span>
                </span>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

export default AttentionPlayground;
