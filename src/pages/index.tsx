// SPA - Single Page Application
// SSR - Server Side Rendering
// SSG - Static Site Generation

import { useEffect } from "react"

export default function Home(props) {

  // console.log(props.episodes);

  // Acesso a uma API modelo SPA
  // useEffect(() => {
  //   fetch('http://localhost:3333/episodes')
  //     .then(response => response.json())
  //     .then(data => console.log(data))
  // }, []);

  return (
    <div>
      <h1>Index</h1>
      <p>{JSON.stringify(props.episodes)}</p>
    </div>

  )
}

// Acesso a uma API modelo SSR
//Para fazer SSR no Next, basta que em qualquer arquivo da pasta "pages" seja exportado a função "getServerSideProps()"
//Só de expotar uma função com o nome "getServerSideProps" o Next já vai entender que ele deve executar primeiro essa função
//antes de exibir o conteudo da página para o usuário final onde esta a função "getServerSideProps"

// export async function getServerSideProps() {
//   const response = await fetch('http://localhost:3333/episodes')
//   const data = await response.json();

//   return {
//     props: {
//       episodes: data,
//     }
//   }
// }

//no return deve-se colocar a palavra "props", o nome episodes é escolhido pelo dev, pode ser outro, depois diz qual dado se quer retornar, no caso "data"

// Acesso a uma API modelo SSG
//Para fazer SSG no Next, basta que em qualquer arquivo da pasta "pages" seja exportado a função "getStaticProps()"
//Só de expotar uma função com o nome "getStaticProps" o Next já vai entender que ele deve executar primeiro essa função
//antes de exibir o conteudo da página para o usuário final onde esta a função "getStaticProps"

export async function getStaticProps() {
  const response = await fetch('http://localhost:3333/episodes')
  const data = await response.json();

  return {
    props: {
      episodes: data,
    },
    revalidate: 60 * 60 * 8, //60 segundos * 60 = 3600 segundos(1 hora) * 8 = 8 horas
    //a cada 8 horas quando uma pessoa acessar essa página, uma nova versão dessa página será gerada, com isso uma nova chamada a API vai ser feita
    //ou seja, durante o dia 3 chamadas a API serão feitas, todas as pessoas que acessarem essa página vão consumir um HTML estatico dessa página
  }
}

//revalidate - recebe um numero em segundos que representa de quanto em quanto tempo se quer gerar uma nova versão dessa página

//Para testar deve-se simular o projeto ja em produção para isso fazer "yarn build" para contruir o projeto em produção
//e depois fazer "yarn start" para testar