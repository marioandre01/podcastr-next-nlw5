import { GetStaticProps } from 'next';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';

type Episodes = {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  members: string;
  duration: number;
  durationAsString: string;
  url: string;
  publishedAt: string
  //... 
}

type HomeProps = {
  episodes: Episodes[];
}

export default function Home(props: HomeProps) {

  return (
    <div>
      <h1>Index</h1>
      <p>{JSON.stringify(props.episodes)}</p>
    </div>

  )
}

// Acesso a uma API modelo SSG - Static Site Generation
//Para fazer SSG no Next, basta que em qualquer arquivo da pasta "pages" seja exportado a função "getStaticProps()"
//Só de expotar uma função com o nome "getStaticProps" o Next já vai entender que ele deve executar primeiro essa função
//antes de exibir o conteudo da página para o usuário final onde esta a função "getStaticProps"
export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('/episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      description: episode.description,
      url: episode.file.url,
    };
  })


  return {
    props: {
      episodes,
    },
    revalidate: 60 * 60 * 8, //60 segundos * 60 = 3600 segundos(1 hora) * 8 = 8 horas
    //a cada 8 horas quando uma pessoa acessar essa página, uma nova versão dessa página será gerada, com isso uma nova chamada a API vai ser feita
    //ou seja, durante o dia 3 chamadas a API serão feitas, todas as pessoas que acessarem essa página vão consumir um HTML estatico dessa página
  }
}

//no return deve-se colocar a palavra "props", o nome episodes é escolhido pelo dev, pode ser outro, depois diz qual dado se quer retornar, no caso "data"
//revalidate - recebe um numero em segundos que representa de quanto em quanto tempo se quer gerar uma nova versão dessa página

//Para testar deve-se simular o projeto ja em produção para isso fazer "yarn build" para contruir o projeto em produção
//e depois fazer "yarn start" para testar