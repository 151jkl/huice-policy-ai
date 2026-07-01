import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AccessibilityProvider } from '@/contexts/AccessibilityContext';
import { MainLayout } from '@/layouts/MainLayout';
import { Home } from '@/pages/Home';
import { PolicyAnalysis } from '@/pages/PolicyAnalysis';
import { Eligibility } from '@/pages/Eligibility';
import { SubsidyCalc } from '@/pages/SubsidyCalc';
import { Guide } from '@/pages/Guide';

function App() {
  return (
    <AccessibilityProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/analysis" element={<PolicyAnalysis />} />
            <Route path="/eligibility" element={<Eligibility />} />
            <Route path="/subsidy" element={<SubsidyCalc />} />
            <Route path="/guide" element={<Guide />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AccessibilityProvider>
  );
}

export default App;
