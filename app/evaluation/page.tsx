"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs } from "@/components/ui/tabs";
import { CountUp } from "@/components/ui/count-up";
import { useEvaluation } from "@/lib/useStore";
import { SYNTHETIC_DATASET_SUMMARY } from "@/lib/evaluationDataset";

export default function EvaluationPage() {
  const { testCases, traces } = useEvaluation();
  const [activeTab, setActiveTab] = useState<string>("dataset");

  const passedCount = testCases.filter((t) => t.status === "passed").length;
  const passRate = testCases.length > 0 ? Math.round((passedCount / testCases.length) * 100) : 0;

  const tabs = [
    { id: "dataset", label: "Dataset d'Orientation", count: SYNTHETIC_DATASET_SUMMARY.profileCount },
    { id: "benchmark", label: "Tests de Garde-Fous", count: testCases.length },
    { id: "observability", label: "Observabilité & Traces Pipeline", count: traces.length },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Observabilité & Assurance Qualité System</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Évaluation & Garde-Fous d'ORIENT’IA
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Synthèse du dataset d'orientation, contrôles de cohérence et garde-fous de sécurité utilisés par ORIENT’IA.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === "dataset" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-4">
              <span className="text-xs text-slate-500 font-semibold block">Profils Synthétiques</span>
              <span className="text-2xl font-bold text-emerald-700 mt-1 block">
                <CountUp end={SYNTHETIC_DATASET_SUMMARY.profileCount} duration={1.2} />
              </span>
              <span className="text-[11px] text-slate-500">JSONL validé, CSV avec en-tête : {SYNTHETIC_DATASET_SUMMARY.csvRowsWithHeader} lignes</span>
            </Card>

            <Card className="p-4">
              <span className="text-xs text-slate-500 font-semibold block">Erreurs Bloquantes</span>
              <span className="text-2xl font-bold text-emerald-700 mt-1 block">
                <CountUp end={SYNTHETIC_DATASET_SUMMARY.blockingErrors} duration={1.2} />
              </span>
              <span className="text-[11px] text-emerald-600 font-medium">Rapport de validation : aucune erreur détectée</span>
            </Card>

            <Card className="p-4">
              <span className="text-xs text-slate-500 font-semibold block">Profils Ambigus</span>
              <span className="text-2xl font-bold text-slate-900 mt-1 block">
                <CountUp end={SYNTHETIC_DATASET_SUMMARY.ambiguousProfileRate} suffix="%" duration={1.2} />
              </span>
              <span className="text-[11px] text-slate-500">Cible méthodologique proche de 20%</span>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-sm">Contrôles de Cohérence Dataset</CardTitle>
                <CardDescription>{SYNTHETIC_DATASET_SUMMARY.validationReport}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0 space-y-2">
                {SYNTHETIC_DATASET_SUMMARY.validationChecks.map((check) => (
                  <div key={check.label} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs">
                    <span className="font-medium text-slate-800">{check.label}</span>
                    <span className="text-slate-500">{check.value}</span>
                    <Badge variant="emerald" size="sm">{check.status}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-sm">Distribution des Parcours Recommandés</CardTitle>
                <CardDescription>{SYNTHETIC_DATASET_SUMMARY.sourceJsonl}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0 space-y-2">
                {SYNTHETIC_DATASET_SUMMARY.classDistribution.map((item) => (
                  <div key={item.code} className="grid grid-cols-[56px_1fr_52px] items-center gap-2 text-xs">
                    <span className="font-bold text-slate-800">{item.code}</span>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{ width: `${item.percentage * 10}%` }}
                      />
                    </div>
                    <span className="text-right text-slate-500">{item.count}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "benchmark" && (
        <div className="space-y-6">
          {/* Summary KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-4">
              <span className="text-xs text-slate-500 font-semibold block">Taux de Réussite des Tests</span>
              <span className="text-2xl font-bold text-emerald-700 mt-1 block">
                <CountUp end={passRate} suffix="%" duration={1.2} />
              </span>
              <span className="text-[11px] text-slate-500">{passedCount} / {testCases.length} garde-fous validés</span>
            </Card>

            <Card className="p-4">
              <span className="text-xs text-slate-500 font-semibold block">Latence Moyenne Tests</span>
              <span className="text-2xl font-bold text-slate-900 mt-1 block">
                <CountUp
                  end={Math.round(testCases.reduce((sum, tc) => sum + tc.latencyMs, 0) / Math.max(testCases.length, 1))}
                  suffix="ms"
                  duration={1.4}
                />
              </span>
              <span className="text-[11px] text-slate-500">D'après les cas de test enregistrés</span>
            </Card>

            <Card className="p-4">
              <span className="text-xs text-slate-500 font-semibold block">Contrôles Dataset</span>
              <span className="text-2xl font-bold text-emerald-700 mt-1 block">
                {SYNTHETIC_DATASET_SUMMARY.blockingErrors}
              </span>
              <span className="text-[11px] text-slate-500">erreur bloquante détectée</span>
            </Card>
          </div>

          {/* Test Cases Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Scénarios de Test Exécutés
              </h3>
              <span className="text-xs text-slate-500">{testCases.length} scénarios au total</span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {testCases.map((tc) => (
                <div key={tc.id} className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="emerald" size="sm">
                        Cas #{tc.id} • {tc.category}
                      </Badge>
                      <span className="text-[11px] text-slate-400 font-mono">{tc.latencyMs}ms</span>
                    </div>

                    <p className="font-semibold text-slate-900">{tc.questionOrPrompt}</p>
                    <p className="text-[11px] text-slate-500"><strong>Attendu :</strong> {tc.expectedBehavior}</p>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <Badge variant={tc.status === "passed" ? "emerald" : "rose"}>
                      {tc.status === "passed" ? "Validé ✓" : "Échoué"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "observability" && (
        <div className="space-y-6">
          {traces.length === 0 && (
            <Card className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200 shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Aucune trace pipeline réelle enregistrée</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Les traces apparaissent après une question envoyée depuis l'assistant ORIENT'IA.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {traces.map((trace) => (
            <Card key={trace.id} className="p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="emerald">{trace.id}</Badge>
                  <span className="text-xs text-slate-500 font-mono">
                    {new Date(trace.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded">
                  Durée totale : {trace.totalDurationMs}ms
                </span>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-700 block">Question Utilisateur :</span>
                <p className="text-xs text-slate-900 font-medium bg-slate-50 p-3 rounded border border-slate-200">
                  {trace.userQuery}
                </p>
              </div>

              {/* Pipeline Execution Steps */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-2">
                <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-200 space-y-1">
                  <span className="font-bold text-emerald-900 block">Outils Exécutés</span>
                  {trace.toolExecutions.map((t) => (
                    <div key={t.id} className="text-[11px] text-emerald-950 font-mono">
                      ✓ {t.displayName} ({t.executionTime})
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-900 block">Documents RAG Récupérés</span>
                  {trace.retrievedDocuments.map((doc, idx) => (
                    <div key={idx} className="text-[11px] text-slate-600 truncate">
                      • {doc.title} (Score: {doc.score})
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-900 block">Sortie Prédiction ML</span>
                  <p className="text-[11px] text-slate-600 font-mono">{trace.mlOutput}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-700 block mb-1">Réponse Finale Produite :</span>
                <p className="text-xs text-slate-800 bg-emerald-50/30 p-3 rounded border border-emerald-100 leading-relaxed font-medium">
                  {trace.finalResponseSnippet}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
