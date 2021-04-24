import { createContext } from 'react';

type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
}

type PlayerContextData = {
  episodeList: Episode[];
  currentEpisodeIndex: number;
  play: (episode: Episode) => void;
}

//{} as PlayerContextData - passa um objeto vazio e simula e faz uma tipagem meio forçada dizendo que ele é do tipo PlayerContextData 
//com isso {} as PlayerContextData tem a estrutura de PlayerContextData, assim pode-se chamar os seus parametros
export const PlayerContext = createContext({} as PlayerContextData);