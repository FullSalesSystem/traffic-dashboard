'use client';

import { KPIData, FunnelData } from '@/types/campaign';
import { Lightbulb, AlertTriangle, TrendingUp, Target, MousePointer, ShoppingCart, CreditCard } from 'lucide-react';

interface Suggestion {
  type: 'warning' | 'improvement' | 'success';
  icon: React.ReactNode;
  title: string;
  description: string;
  metric: string;
  action: string;
}

interface SuggestionsProps {
  kpis: KPIData;
  funnel: FunnelData;
}

export function Suggestions({ kpis, funnel }: SuggestionsProps) {
  const suggestions: Suggestion[] = [];

  // Análise do CTR (Click-Through Rate)
  if (kpis.avgCTR < 1) {
    suggestions.push({
      type: 'warning',
      icon: <MousePointer className="w-5 h-5" />,
      title: 'CTR Baixo',
      description: 'Seu CTR está abaixo de 1%, indicando que os anúncios não estão atraindo cliques.',
      metric: `CTR atual: ${kpis.avgCTR.toFixed(2)}%`,
      action: 'Teste novos criativos com ganchos mais fortes nos primeiros 3 segundos. Use thumbnails com rostos e texto chamativo.',
    });
  } else if (kpis.avgCTR >= 2) {
    suggestions.push({
      type: 'success',
      icon: <MousePointer className="w-5 h-5" />,
      title: 'CTR Excelente',
      description: 'Seus anúncios estão gerando bom engajamento.',
      metric: `CTR atual: ${kpis.avgCTR.toFixed(2)}%`,
      action: 'Mantenha a estratégia atual de criativos e escale os anúncios com melhor performance.',
    });
  }

  // Análise da Taxa de Carregamento (Load Rate)
  if (kpis.loadRate < 70) {
    suggestions.push({
      type: 'warning',
      icon: <Target className="w-5 h-5" />,
      title: 'Taxa de Carregamento Baixa',
      description: 'Muitos cliques não chegam na página de vendas. Possível problema de velocidade ou redirecionamento.',
      metric: `Taxa atual: ${kpis.loadRate.toFixed(1)}%`,
      action: 'Otimize a velocidade da landing page (comprima imagens, use CDN). Verifique se o link do anúncio está correto.',
    });
  } else if (kpis.loadRate >= 85) {
    suggestions.push({
      type: 'success',
      icon: <Target className="w-5 h-5" />,
      title: 'Boa Taxa de Carregamento',
      description: 'A maioria dos cliques chega na página de vendas.',
      metric: `Taxa atual: ${kpis.loadRate.toFixed(1)}%`,
      action: 'Continue monitorando. Considere testes A/B na landing page para melhorar conversões.',
    });
  }

  // Análise da Taxa de Checkout
  if (kpis.checkoutRate < 5) {
    suggestions.push({
      type: 'warning',
      icon: <ShoppingCart className="w-5 h-5" />,
      title: 'Baixa Iniciação de Checkout',
      description: 'Poucos visitantes iniciam o checkout. A página de vendas pode não estar convencendo.',
      metric: `Taxa atual: ${kpis.checkoutRate.toFixed(2)}%`,
      action: 'Melhore a copy da VSL/página. Adicione provas sociais, depoimentos e garantias visíveis. Teste diferentes ofertas.',
    });
  } else if (kpis.checkoutRate >= 10) {
    suggestions.push({
      type: 'success',
      icon: <ShoppingCart className="w-5 h-5" />,
      title: 'Boa Taxa de Checkout',
      description: 'A página está convertendo bem para checkout.',
      metric: `Taxa atual: ${kpis.checkoutRate.toFixed(2)}%`,
      action: 'Foque em otimizar a página de checkout para aumentar a conversão final.',
    });
  }

  // Análise da Taxa de Conversão (Checkout → Compra)
  if (kpis.conversionRate < 30) {
    suggestions.push({
      type: 'warning',
      icon: <CreditCard className="w-5 h-5" />,
      title: 'Abandono de Checkout Alto',
      description: 'Muitos usuários iniciam mas não finalizam a compra.',
      metric: `Taxa de conversão: ${kpis.conversionRate.toFixed(1)}%`,
      action: 'Simplifique o checkout, ofereça múltiplas formas de pagamento, adicione selos de segurança e urgência.',
    });
  } else if (kpis.conversionRate >= 50) {
    suggestions.push({
      type: 'success',
      icon: <CreditCard className="w-5 h-5" />,
      title: 'Excelente Conversão no Checkout',
      description: 'A maioria dos checkouts se converte em vendas.',
      metric: `Taxa de conversão: ${kpis.conversionRate.toFixed(1)}%`,
      action: 'Checkout está otimizado. Foque em trazer mais tráfego qualificado.',
    });
  }

  // Análise do ROAS
  if (kpis.roas < 1) {
    suggestions.push({
      type: 'warning',
      icon: <TrendingUp className="w-5 h-5" />,
      title: 'ROAS Negativo',
      description: 'Você está gastando mais do que está retornando.',
      metric: `ROAS atual: ${kpis.roas.toFixed(2)}`,
      action: 'Pause campanhas com pior performance. Analise quais criativos e públicos têm melhor retorno e foque neles.',
    });
  } else if (kpis.roas >= 2) {
    suggestions.push({
      type: 'success',
      icon: <TrendingUp className="w-5 h-5" />,
      title: 'ROAS Positivo',
      description: 'Sua operação está lucrativa.',
      metric: `ROAS atual: ${kpis.roas.toFixed(2)}`,
      action: 'Escale gradualmente as campanhas de melhor performance. Teste novos públicos similares.',
    });
  }

  // Análise do CPC
  if (kpis.avgCPC > 3) {
    suggestions.push({
      type: 'improvement',
      icon: <AlertTriangle className="w-5 h-5" />,
      title: 'CPC Elevado',
      description: 'O custo por clique está alto, impactando o custo de aquisição.',
      metric: `CPC atual: R$ ${kpis.avgCPC.toFixed(2)}`,
      action: 'Teste públicos mais amplos, melhore a relevância dos anúncios e teste posicionamentos automáticos.',
    });
  }

  // Se não houver problemas críticos, adicionar dica geral
  if (suggestions.length === 0 || suggestions.every(s => s.type === 'success')) {
    suggestions.push({
      type: 'improvement',
      icon: <Lightbulb className="w-5 h-5" />,
      title: 'Continue Otimizando',
      description: 'Suas métricas estão saudáveis. Foque em escalar.',
      metric: 'Performance geral: Boa',
      action: 'Faça testes A/B constantes em criativos e copies. Monitore diariamente para identificar mudanças.',
    });
  }

  const getTypeStyles = (type: Suggestion['type']) => {
    switch (type) {
      case 'warning':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400';
      case 'improvement':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400';
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400';
    }
  };

  const getIconBg = (type: Suggestion['type']) => {
    switch (type) {
      case 'warning':
        return 'bg-red-500';
      case 'improvement':
        return 'bg-yellow-500';
      case 'success':
        return 'bg-green-500';
    }
  };

  // Ordenar: warnings primeiro, depois improvements, depois success
  const sortedSuggestions = suggestions.sort((a, b) => {
    const order = { warning: 0, improvement: 1, success: 2 };
    return order[a.type] - order[b.type];
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-purple-500 rounded-lg">
          <Lightbulb className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
          Sugestões de Otimização
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {sortedSuggestions.slice(0, 6).map((suggestion, index) => (
          <div
            key={index}
            className={`rounded-lg p-4 border ${getTypeStyles(suggestion.type)}`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${getIconBg(suggestion.type)} text-white flex-shrink-0`}>
                {suggestion.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                  <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
                    {suggestion.title}
                  </h4>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 w-fit">
                    {suggestion.metric}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {suggestion.description}
                </p>
                <p className="text-xs font-medium mt-2 text-gray-800 dark:text-gray-200">
                  💡 {suggestion.action}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
