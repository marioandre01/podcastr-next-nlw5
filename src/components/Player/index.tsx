
import { useEffect, useRef, useState } from 'react';
import { usePlayer } from '../../contexts/PlayerContext';
import styles from './styles.module.scss';
import Image from 'next/image';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css'; //importar o ccs do rc-slider
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';


export function Player() {

  // referencia a tag audio, para poder usar métodos dela
  const audioRef = useRef<HTMLAudioElement>(null);

  const [progress, setProgress] = useState(0); //armazena em segundos quanto tempo o progresso do player da percorreu.

  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    isLooping,
    isShuffling,
    togglePlay,
    toggleLoop,
    toggleShuffle,
    setPlayingState,
    playNext,
    playPrevious,
    hasPrevious,
    hasNext,
    clearPlayerState
  } = usePlayer();

  //Dispara essa função toda vez que "isPlaying" tiver seu valor alterado
  useEffect(() => {
    //audioRef.current - para buscar o valor dentro da referencia audioRef.current
    //se não tiver nada dentro de audioRef.current então não retorna nada, poi não se tem referncia ao player, vai dar erro dai
    if (!audioRef.current) {
      return;
    }

    if (isPlaying) {
      audioRef.current.play(); //usar método play() da tag audio
    } else {
      audioRef.current.pause(); //usar método pause() da tag audio
    }
  }, [isPlaying]);

  function setupProgressListener() {
    audioRef.current.currentTime = 0; //retorna o tempo atual do player, definiu para começar em zero

    //addEventListener - ouvir evento, qual se quer ouvir, é o 'timeupdate'
    // 'timeupdate' - é disparado varias vezes enquanto o áudio está tocando
    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime)); //seta o progresso com o tempo atual do tempo do áudio
    })
  }

  function handleSeek(amount: number) {
    audioRef.current.currentTime = amount; //retorna o tempo atual do player, defini-se o tempo escolhido pelo slider de progresso do áudio

    setProgress(amount); // seta o progresso para mover o slider de progresso
  }

  function handleEpisodeEnded() {
    if (hasNext) {
      playNext();
    } else {
      clearPlayerState();
    }
  }

  const episode = episodeList[currentEpisodeIndex];

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando agora" />
        <strong>Tocando agora</strong>
      </header>

      { episode ? (
        <div className={styles.currentEpisode}>
          <Image
            width={592}
            height={592}
            src={episode.thumbnail}
            objectFit="cover"
          />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )
      }



      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
          <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
            {episode ? (
              <Slider
                max={episode.duration} //duração maxima que o slider pode chegar, retorna a duração em segundos
                value={progress} //value - o valor que o slider já progrediu
                onChange={handleSeek} // o que acontece quando se arrasta a bolinha do slider de progresso
                trackStyle={{ backgroundColor: '#04d361' }}
                railStyle={{ backgroundColor: '#9f75ff' }}
                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
              />
            ) : (
              <div className={styles.emptySlider}></div>
            )}

          </div>
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>

        {episode && (
          <audio
            src={episode.url}
            ref={audioRef}
            autoPlay
            onEnded={handleEpisodeEnded} // função executada quando o audio chega no final
            loop={isLooping}
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
            onLoadedMetadata={setupProgressListener}
          />
        )}

        <div className={styles.buttons}>
          <button
            type="button"
            disabled={!episode || episodeList.length === 1}
            onClick={toggleShuffle}
            className={isShuffling ? styles.isActive : ''}
          >
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>
          <button type="button" onClick={playPrevious} disabled={!episode || !hasPrevious}>
            <img src="/play-previous.svg" alt="Tocar anterior" />
          </button>
          <button
            type="button"
            className={styles.playButton}
            disabled={!episode}
            onClick={togglePlay}
          >
            {isPlaying
              ? <img src="/pause.svg" alt="Pausar" />
              : <img src="/play.svg" alt="Tocar" />
            }

          </button>
          <button type="button" onClick={playNext} disabled={!episode || !hasNext}>
            <img src="/play-next.svg" alt="Tocar próxima" />
          </button>
          <button
            type="button"
            onClick={toggleLoop}
            disabled={!episode}
            className={isLooping ? styles.isActive : ''}
          >
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div >
  );
}