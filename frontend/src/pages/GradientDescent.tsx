import React, { useState } from 'react';
import LinearRegressionContent from '../components/backprop/LinearRegressionContent';
import LogisticRegressionContent from '../components/backprop/LogisticRegressionContent';
import TheoryContent from '../components/backprop/TheoryContent';
import { Page, PageHeader } from '../components/ui/Page';
import Tabs from '../components/ui/Tabs';
import { useT } from '../i18n';

type Tab = 'theory' | 'linear' | 'logistic';

const GradientDescent: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('theory');
    const t = useT('gradient').page;

    return (
        <Page width="wide">
            <PageHeader
                page="gradient-descent"
                title={t.title}
                subtitle={t.subtitle}
                actions={
                    <Tabs<Tab>
                        label={t.title}
                        value={activeTab}
                        onChange={setActiveTab}
                        items={[
                            { id: 'theory', label: t.tabTheory, icon: 'book' },
                            { id: 'linear', label: t.tabLinear, icon: 'trendingDown' },
                            { id: 'logistic', label: t.tabLogistic, icon: 'layers' },
                        ]}
                    />
                }
            />

            {activeTab === 'theory' && <TheoryContent />}
            {activeTab === 'linear' && <LinearRegressionContent />}
            {activeTab === 'logistic' && <LogisticRegressionContent />}
        </Page>
    );
};

export default GradientDescent;
