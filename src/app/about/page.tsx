import type { Metadata } from 'next';
import Link from 'next/link';
import {
  BellRingIcon,
  ChartNoAxesCombinedIcon,
  ChartPieIcon,
  ChevronRightIcon,
  CircleAlertIcon,
  SearchIcon,
  SettingsIcon,
  type LucideIcon,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sobre',
  description:
    'Conheça o StockWatcher e acompanhe sua carteira de ações em um só lugar.',
};

const steps = [
  {
    icon: SearchIcon,
    title: 'Encontre suas ações',
    description: 'Consulte preços, variação diária e indicadores de ativos da B3.',
  },
  {
    icon: ChartPieIcon,
    title: 'Monte sua carteira',
    description: 'Registre posições e acompanhe patrimônio, resultado e distribuição.',
  },
  {
    icon: BellRingIcon,
    title: 'Configure alertas',
    description: 'Receba notificações quando preço ou variação atingir sua condição.',
  },
];

export default function AboutPage() {
  return (
    <div className='min-h-screen bg-background-sec'>
      <header className='border-b border-border bg-white'>
        <div className='mx-auto flex max-w-6xl items-center justify-between px-6 py-5'>
          <Link href='/about' className='text-xl font-bold text-primary'>
            StockWatcher
          </Link>
          <Link
            href='/login'
            className='rounded-lg border border-border px-4 py-2 text-sm font-semibold text-primary transition hover:border-green-600 hover:text-green-700'
          >
            Entrar
          </Link>
        </div>
      </header>

      <main>
        <section className='mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28'>
          <div>
            <span className='mb-5 inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700'>
              Sua carteira, mais clara
            </span>
            <h1 className='max-w-xl text-4xl font-black leading-tight text-primary sm:text-5xl'>
              Acompanhe seus investimentos sem perder o que importa.
            </h1>
            <p className='mt-6 max-w-xl text-lg leading-8 text-gray-500'>
              O StockWatcher reúne posições, desempenho, cotações e alertas em
              uma experiência simples para acompanhar sua carteira de ações.
            </p>
            <div className='mt-8 flex flex-wrap gap-3'>
              <Link
                href='/login'
                className='inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-700'
              >
                Criar minha conta
                <ChevronRightIcon size={17} />
              </Link>
              <Link
                href='/login'
                className='rounded-lg border border-border bg-white px-5 py-3 text-sm font-bold text-primary transition hover:border-green-600 hover:text-green-700'
              >
                Já tenho uma conta
              </Link>
            </div>
          </div>

          <div className='rounded-3xl border border-border bg-white p-7 shadow-sm'>
            <div className='mb-8 flex items-center gap-3'>
              <span className='flex size-11 items-center justify-center rounded-xl bg-green-100 text-green-700'>
                <ChartNoAxesCombinedIcon size={22} />
              </span>
              <div>
                <p className='font-bold text-primary'>Visão consolidada</p>
                <p className='text-sm text-gray-500'>Informações para o dia a dia</p>
              </div>
            </div>

            <div className='grid gap-4 sm:grid-cols-2'>
              <PreviewMetric label='Patrimônio' value='R$ 24.580,40' />
              <PreviewMetric label='Resultado total' value='+ R$ 1.840,20' positive />
              <PreviewMetric label='Ativos monitorados' value='8 ativos' />
              <PreviewMetric label='Alertas ativos' value='4 alertas' />
            </div>
          </div>
        </section>

        <section className='border-y border-border bg-white'>
          <div className='mx-auto max-w-6xl px-6 py-16'>
            <div className='mb-10 max-w-2xl'>
              <p className='text-sm font-bold uppercase tracking-wide text-green-600'>
                Como funciona
              </p>
              <h2 className='mt-2 text-3xl font-bold text-primary'>
                Comece em poucos passos
              </h2>
            </div>

            <div className='grid gap-5 md:grid-cols-3'>
              {steps.map(({ icon: Icon, title, description }, index) => (
                <article
                  key={title}
                  className='rounded-2xl border border-border bg-neutral-50 p-6'
                >
                  <div className='mb-5 flex items-center justify-between'>
                    <span className='flex size-10 items-center justify-center rounded-lg bg-green-100 text-green-700'>
                      <Icon size={20} />
                    </span>
                    <span className='text-sm font-bold text-primary'>
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className='font-bold text-primary'>{title}</h3>
                  <p className='mt-2 text-sm leading-6 text-gray-500'>
                    {description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className='mx-auto max-w-6xl px-6 pt-16'>
          <div className='grid gap-8 rounded-2xl border border-border bg-white p-7 md:grid-cols-[0.8fr_1.2fr] md:p-9'>
            <div>
              <span className='mb-5 flex size-11 items-center justify-center rounded-xl bg-green-100 text-green-700'>
                <BellRingIcon size={22} />
              </span>
              <p className='text-sm font-bold uppercase tracking-wide text-green-600'>
                Notificações
              </p>
              <h2 className='mt-2 text-2xl font-bold text-primary'>
                Não perca seus alertas
              </h2>
              <p className='mt-3 text-sm leading-6 text-gray-500'>
                Para receber avisos mesmo sem o StockWatcher aberto, permita as
                notificações quando o navegador solicitar.
              </p>
            </div>

            <div className='grid gap-4'>
              <HelpItem
                icon={BellRingIcon}
                title='Habilite no navegador'
                description='Use o botão de notificações no menu e aceite a permissão exibida pelo navegador.'
              />
              <HelpItem
                icon={SettingsIcon}
                title='Confira o sistema operacional'
                description='Verifique se as notificações do navegador estão permitidas nas configurações do Windows, macOS ou celular.'
              />
              <HelpItem
                icon={CircleAlertIcon}
                title='Revise possíveis bloqueios'
                description='Modo Não Perturbe, Assistente de Foco e bloqueios específicos do site podem impedir que o aviso apareça.'
              />
            </div>
          </div>
        </section>

        <section className='mx-auto max-w-6xl px-6 py-16'>
          <div className='flex flex-col items-start justify-between gap-6 rounded-2xl bg-primary p-8 sm:flex-row sm:items-center'>
            <div>
              <h2 className='text-2xl font-bold text-white'>
                Pronto para acompanhar sua carteira?
              </h2>
              <p className='mt-2 text-sm text-white/70'>
                Crie uma conta gratuita e organize seus ativos e alertas.
              </p>
            </div>
            <Link
              href='/login'
              className='shrink-0 rounded-lg bg-green-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-400'
            >
              Começar agora
            </Link>
          </div>
        </section>

        <footer className='border-t border-border bg-white'>
          <div className='mx-auto flex max-w-6xl gap-3 px-6 py-8 text-sm leading-6 text-gray-500'>
            <CircleAlertIcon className='mt-0.5 shrink-0 text-gray-400' size={18} />
            <p>
              <strong className='text-primary'>Aviso importante:</strong> o
              StockWatcher não é uma corretora, não executa ordens e não oferece
              recomendações de investimento. É uma ferramenta informativa para
              acompanhamento de preços, carteira e alertas. Os preços de ativos podem estar levemente desatualizados
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}

type PreviewMetricProps = {
  label: string;
  value: string;
  positive?: boolean;
};

function PreviewMetric({ label, value, positive = false }: PreviewMetricProps) {
  return (
    <div className='rounded-xl border border-border bg-background-sec p-4'>
      <p className='text-xs font-semibold text-gray-500'>{label}</p>
      <p
        className={`mt-2 text-lg font-bold ${positive ? 'text-green-600' : 'text-primary'}`}
      >
        {value}
      </p>
    </div>
  );
}

type HelpItemProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

function HelpItem({ icon: Icon, title, description }: HelpItemProps) {
  return (
    <div className='flex gap-4 rounded-xl bg-background-sec p-4'>
      <span className='flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-green-700'>
        <Icon size={18} />
      </span>
      <div>
        <h3 className='text-sm font-bold text-primary'>{title}</h3>
        <p className='mt-1 text-sm leading-5 text-gray-500'>{description}</p>
      </div>
    </div>
  );
}
