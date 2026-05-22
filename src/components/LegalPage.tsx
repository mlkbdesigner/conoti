import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

type Section = {
  heading: string;
  body: string | string[];
};

type LegalContent = {
  slug: 'politica-de-privacidade' | 'termos-de-uso' | 'politica-de-cookies';
  title: string;
  subtitle: string;
  lastUpdated: string;
  sections: Section[];
};

export const LEGAL_PAGES: Record<string, LegalContent> = {
  'politica-de-privacidade': {
    slug: 'politica-de-privacidade',
    title: 'Política de Privacidade',
    subtitle: 'Como a Conoti coleta, usa e protege seus dados pessoais.',
    lastUpdated: '22 de maio de 2026',
    sections: [
      {
        heading: '1. Quem somos',
        body: 'A Conoti é uma agência oficial TikTok que opera TikTok Ads, TikTok Shop e TikTok Business para marcas no Brasil. Esta Política descreve como tratamos os dados pessoais que coletamos por meio do nosso site, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD).'
      },
      {
        heading: '2. Quais dados coletamos',
        body: [
          'Coletamos os seguintes dados pessoais quando você preenche nossos formulários ou interage com nosso site:',
          '• Nome completo;',
          '• E-mail corporativo;',
          '• Número de WhatsApp;',
          '• Nome da marca / empresa;',
          '• Site ou Instagram da marca;',
          '• Segmento de atuação e faturamento mensal aproximado;',
          '• Informações sobre investimento em mídia e status do TikTok Shop;',
          '• Dados de navegação (cookies, endereço IP, tipo de dispositivo, páginas visitadas) — ver Política de Cookies.'
        ]
      },
      {
        heading: '3. Para que usamos seus dados',
        body: [
          'Utilizamos seus dados pessoais para as seguintes finalidades:',
          '• Entrar em contato com você para apresentar diagnóstico inicial e proposta comercial;',
          '• Atender solicitações enviadas via formulário, WhatsApp ou e-mail;',
          '• Cumprir obrigações legais e contratuais;',
          '• Melhorar a experiência do site e de nossos serviços;',
          '• Enviar comunicações sobre serviços, novidades e materiais educativos (mediante consentimento, com opção de descadastro).'
        ]
      },
      {
        heading: '4. Base legal',
        body: 'O tratamento dos dados é fundamentado nas seguintes bases legais previstas na LGPD: execução de contrato e procedimentos preliminares (art. 7º, V), cumprimento de obrigação legal (art. 7º, II), legítimo interesse (art. 7º, IX) e consentimento (art. 7º, I), conforme o caso.'
      },
      {
        heading: '5. Compartilhamento de dados',
        body: [
          'Não vendemos seus dados. Podemos compartilhar com:',
          '• Plataformas de comunicação e CRM utilizadas internamente (ex: e-mail, WhatsApp Business, sistemas de gestão de leads);',
          '• TikTok Brasil e parceiros autorizados, quando necessário para a operação dos serviços contratados;',
          '• Autoridades públicas, quando exigido por lei.',
          'Todos os terceiros com quem compartilhamos dados são contratualmente obrigados a manter padrões de segurança e privacidade compatíveis com a LGPD.'
        ]
      },
      {
        heading: '6. Por quanto tempo armazenamos',
        body: 'Mantemos seus dados pessoais pelo tempo necessário ao cumprimento das finalidades descritas ou conforme exigido por lei. Leads inativos por mais de 24 meses podem ser anonimizados ou eliminados, salvo obrigação legal ou contratual diversa.'
      },
      {
        heading: '7. Seus direitos como titular',
        body: [
          'Você tem direito a, a qualquer momento:',
          '• Confirmar a existência de tratamento dos seus dados;',
          '• Acessar e corrigir dados incompletos, inexatos ou desatualizados;',
          '• Solicitar anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade;',
          '• Solicitar a portabilidade dos dados;',
          '• Revogar o consentimento;',
          '• Opor-se a tratamento realizado com base em legítimo interesse.',
          'Para exercer qualquer um desses direitos, envie um e-mail para timeconoti@gmail.com.'
        ]
      },
      {
        heading: '8. Segurança',
        body: 'Adotamos medidas técnicas e organizacionais para proteger seus dados contra acessos não autorizados, perda, alteração ou destruição. Apesar dos esforços, nenhum sistema é 100% seguro — comprometemo-nos a comunicar incidentes relevantes conforme exigido pela LGPD.'
      },
      {
        heading: '9. Contato e Encarregado (DPO)',
        body: 'Para dúvidas, solicitações ou reclamações relacionadas a esta Política e ao tratamento dos seus dados, entre em contato pelo e-mail timeconoti@gmail.com.'
      },
      {
        heading: '10. Alterações desta Política',
        body: 'Esta Política pode ser atualizada periodicamente. A data da última atualização está indicada no topo desta página. Recomendamos a leitura periódica para acompanhar eventuais alterações.'
      }
    ]
  },
  'termos-de-uso': {
    slug: 'termos-de-uso',
    title: 'Termos de Uso',
    subtitle: 'Regras de uso do site e dos serviços da Conoti.',
    lastUpdated: '22 de maio de 2026',
    sections: [
      {
        heading: '1. Aceitação dos termos',
        body: 'Ao acessar e utilizar o site da Conoti, você concorda integralmente com estes Termos de Uso. Caso não concorde, recomendamos que não utilize o site nem nossos serviços.'
      },
      {
        heading: '2. Sobre a Conoti',
        body: 'A Conoti é agência oficial TikTok especializada em operar TikTok Ads, TikTok Shop e TikTok Business para marcas com estoque no Brasil ou produção própria.'
      },
      {
        heading: '3. Uso do site',
        body: [
          'O site é fornecido para fins informativos e de captação de leads para serviços. Ao utilizá-lo, você se compromete a:',
          '• Fornecer informações verdadeiras nos formulários;',
          '• Não usar o site para fins ilícitos ou que violem direitos de terceiros;',
          '• Não tentar acessar áreas restritas, executar engenharia reversa ou comprometer a segurança do sistema.'
        ]
      },
      {
        heading: '4. Propriedade intelectual',
        body: 'Todo o conteúdo do site — incluindo textos, logos, imagens, vídeos, layout e código — é de propriedade da Conoti ou licenciado a ela. É proibida a reprodução, distribuição ou uso comercial sem autorização expressa.'
      },
      {
        heading: '5. Contratação de serviços',
        body: 'Os serviços anunciados no site (TikTok Ads, Shop, Business, Rede de Afiliados) são prestados mediante contrato específico, com escopo, prazo e investimento alinhados individualmente após diagnóstico inicial. As informações apresentadas no site são meramente ilustrativas e não constituem oferta vinculante.'
      },
      {
        heading: '6. Resultados e isenções',
        body: 'Os resultados mencionados no site referem-se a operações reais de clientes, mas não constituem garantia de performance futura. O desempenho em mídia paga, TikTok Shop e rede de afiliados depende de múltiplos fatores externos (algoritmo da plataforma, mercado, produto, sazonalidade) e variará entre marcas.'
      },
      {
        heading: '7. Links externos',
        body: 'O site pode conter links para sites de terceiros (TikTok, Instagram, LinkedIn, etc.). A Conoti não se responsabiliza pelo conteúdo, políticas ou práticas desses sites.'
      },
      {
        heading: '8. Limitação de responsabilidade',
        body: 'A Conoti não se responsabiliza por danos diretos, indiretos, incidentais ou consequentes decorrentes do uso ou da impossibilidade de uso do site, ressalvadas as hipóteses previstas em lei.'
      },
      {
        heading: '9. Modificações',
        body: 'Estes Termos podem ser atualizados a qualquer momento, sem aviso prévio. A versão vigente é sempre a publicada no site, com data de atualização indicada.'
      },
      {
        heading: '10. Lei aplicável e foro',
        body: 'Estes Termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da comarca da sede da Conoti para dirimir quaisquer controvérsias, com renúncia a qualquer outro, por mais privilegiado que seja.'
      },
      {
        heading: '11. Contato',
        body: 'Dúvidas sobre estes Termos podem ser enviadas para timeconoti@gmail.com.'
      }
    ]
  },
  'politica-de-cookies': {
    slug: 'politica-de-cookies',
    title: 'Política de Cookies',
    subtitle: 'Como usamos cookies e tecnologias similares no site da Conoti.',
    lastUpdated: '22 de maio de 2026',
    sections: [
      {
        heading: '1. O que são cookies',
        body: 'Cookies são pequenos arquivos de texto armazenados no seu navegador quando você visita um site. Eles permitem reconhecer o dispositivo, lembrar preferências e coletar dados de navegação para melhorar a experiência.'
      },
      {
        heading: '2. Tipos de cookies que usamos',
        body: [
          'Utilizamos as seguintes categorias de cookies:',
          '• Essenciais: necessários para o funcionamento básico do site (carregamento de páginas, formulários, segurança). Não podem ser desativados.',
          '• Analíticos: ajudam a entender como visitantes interagem com o site (páginas mais acessadas, tempo de permanência, origem do tráfego). Ex: Google Analytics.',
          '• Marketing / Publicidade: permitem rastrear conversões e mostrar anúncios relevantes em plataformas como TikTok, Meta e Google. Ex: TikTok Pixel, Meta Pixel.',
          '• Funcionalidade: lembram preferências e personalizam a experiência.'
        ]
      },
      {
        heading: '3. Cookies de terceiros',
        body: [
          'Algumas funcionalidades dependem de cookies definidos por terceiros, incluindo:',
          '• TikTok — para rastreamento de campanhas e conversões;',
          '• Google (Analytics e Ads) — para análise de tráfego e remarketing;',
          '• Meta (Facebook e Instagram) — para rastreamento e otimização de campanhas;',
          '• Vercel — para entrega e performance do site.',
          'Cada um desses serviços possui sua própria política de privacidade, à qual você está sujeito ao interagir com nossos conteúdos.'
        ]
      },
      {
        heading: '4. Como gerenciar cookies',
        body: [
          'Você pode controlar e/ou excluir cookies a qualquer momento através das configurações do seu navegador. Veja como:',
          '• Chrome: Configurações → Privacidade e segurança → Cookies;',
          '• Safari: Preferências → Privacidade;',
          '• Firefox: Configurações → Privacidade e segurança;',
          '• Edge: Configurações → Cookies e permissões de site.',
          'A desativação de cookies pode comprometer o funcionamento de algumas partes do site.'
        ]
      },
      {
        heading: '5. Bases legais',
        body: 'O uso de cookies essenciais está fundamentado no legítimo interesse para a operação do site. O uso de cookies analíticos e de marketing depende do seu consentimento, conforme a LGPD.'
      },
      {
        heading: '6. Atualizações',
        body: 'Esta Política de Cookies pode ser revisada periodicamente. Recomendamos consultá-la regularmente. A data da última atualização está indicada no topo desta página.'
      },
      {
        heading: '7. Contato',
        body: 'Dúvidas sobre cookies e tratamento de dados podem ser enviadas para timeconoti@gmail.com.'
      }
    ]
  }
};

export function LegalPage({ slug }: { slug: keyof typeof LEGAL_PAGES }) {
  const content = LEGAL_PAGES[slug];

  if (!content) return null;

  return (
    <div className="min-h-screen bg-[#0C0E1D] font-sans text-slate-300 selection:bg-purple-500/30 selection:text-white overflow-x-hidden">
      {/* Subtle ambient glow */}
      <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute top-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-purple-900/15 blur-[120px]" />
        <div className="absolute bottom-[10%] left-[-5%] h-[400px] w-[400px] rounded-full bg-blue-900/10 blur-[100px]" />
      </div>

      {/* Header */}
      <header className="relative z-50 w-full pt-6 px-6">
        <nav className="mx-auto max-w-5xl rounded-full border border-white/10 flex items-center justify-between px-8 py-3" aria-label="Navegação">
          <a href="/" className="flex items-center group">
            <img src="/logo-conoti.png" alt="Conoti" className="h-4 w-auto opacity-90 group-hover:opacity-100 transition-opacity duration-200" />
          </a>
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft size={16} />
            Voltar ao site
          </a>
        </nav>
      </header>

      <main className="relative z-10 mx-auto max-w-3xl px-6 lg:px-8 py-16 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-bold text-purple-400 uppercase tracking-[0.2em] mb-4">Legal</p>
          <h1 className="font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl leading-[1.1] mb-4">
            {content.title}
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed mb-3">
            {content.subtitle}
          </p>
          <p className="text-xs font-medium text-slate-600 uppercase tracking-widest">
            Última atualização: {content.lastUpdated}
          </p>
        </motion.div>

        <div className="mt-16 space-y-12">
          {content.sections.map((section, i) => (
            <motion.section
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <h2 className="font-heading text-xl font-bold text-white mb-4">{section.heading}</h2>
              {Array.isArray(section.body) ? (
                <div className="space-y-2 text-slate-400 leading-relaxed">
                  {section.body.map((line, j) => (
                    <p key={j} className={line.startsWith('•') ? 'pl-4' : ''}>{line}</p>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 leading-relaxed">{section.body}</p>
              )}
            </motion.section>
          ))}
        </div>

        <div className="mt-20 pt-10 border-t border-white/5">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors duration-200"
          >
            <ArrowLeft size={16} />
            Voltar ao site
          </a>
        </div>
      </main>

      <footer className="relative border-t border-white/5 py-10 mt-20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-xs font-medium text-slate-600 tracking-wide">
            &copy; 2026 Conoti. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
