import { GetStaticPaths, GetStaticProps } from 'next';
import { api } from '../../services/api';
import { format, parseISO } from 'date-fns';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import ptBR from 'date-fns/locale/pt-BR';
import Image from 'next/image';
import Link from 'next/link';

import styles from './episode.module.scss';
import { usePlayer } from '../../contexts/PlayerContext';

type Epidose = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  duration: number;
  durationAsString: string;
  url: string;
  publishedAt: string;
  description: string;
};

type EpisodeProps = {
  episode: Epidose;
}

export default function Episode({ episode }: EpisodeProps) {

  const { play } = usePlayer();

  return (
    <div className={styles.episode}>
      <div className={styles.thumbnailContainer}>
        <Link href="/">
          <button type="button">
            <img src="/arrow-left.svg" alt="Voltar" />
          </button>
        </Link>

        <Image
          width={700}
          height={160}
          src={episode.thumbnail}
          objectFit="cover"
        />
        <button type="button" onClick={() => play(episode)}>
          <img src="/play.svg" alt="Tocar episódio" />
        </button>
      </div>

      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>
      </header>

      {/* dangerouslySetInnerHTML - interpreta as tag HTML que estão na informação informada */}
      <div className={styles.description} dangerouslySetInnerHTML={{ __html: episode.description }} />


    </div>
  )
}

//getStaticPaths - Metodo obrigatorio em toda rota que esta usando geração estática "getStaticProps" e que tem parâmetros dinâmicos, que tem colchetes no nome do arquivo, no caso esse arquivo [slug].tsx
//Toda rota que tem o colchetes e estiver usando geração estática "getStaticProps", tem que colocar o método getStaticPaths
//fallback: true - roda a requisição no client (front-end)
//fallback: 'blocking' - roda a requisição no next.js(node.js)
export const getStaticPaths: GetStaticPaths = async () => {

  const { data } = await api.get('/episodes', {
    params: {
      _limit: 2,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const paths = data.map(episode => {
    return {
      params: {
        slug: episode.id
      }
    }
  })

  return {
    paths, // colocar quais páginas se quer que sejam geradas estáticamente
    fallback: 'blocking' //Incremental static regeneration
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params;

  const { data } = await api.get(`/episodes/${slug}`);

  const episode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: data.members,
    publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
    duration: Number(data.file.duration),
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
    description: data.description,
    url: data.file.url,
  };

  return {
    props: {
      episode,
    },
    revalidate: 60 * 60 * 24, // 24 hours
  }
}