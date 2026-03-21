'use client';

import { useEffect, useRef, useState } from 'react';
import { Disc3, GripVertical, Pause, Play, Radio, Volume2 } from 'lucide-react';
import styles from './VinylPlayer.module.css';
import { VINYL_PREVIEWS } from '@/lib/vinyl-previews';

const DEFAULT_PREVIEW_LENGTH = 30;

function formatSeconds(value) {
  const safeValue = Math.max(0, Math.floor(value));
  const minutes = Math.floor(safeValue / 60);
  const seconds = safeValue % 60;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function getPreviewWindow(record, audio) {
  const previewStart = record?.previewStart ?? 0;
  const configuredLength = record?.previewDuration ?? DEFAULT_PREVIEW_LENGTH;
  const audioDuration = Number.isFinite(audio?.duration) ? audio.duration : previewStart + configuredLength;
  const previewEnd = Math.min(previewStart + configuredLength, audioDuration);

  return {
    previewStart,
    previewEnd,
    previewLength: Math.max(0, previewEnd - previewStart)
  };
}

function getMissingPreviewMessage() {
  if (process.env.NODE_ENV !== 'production') {
    return 'Preview file missing. Add the MP3 listed in public/audio/previews/README.txt.';
  }

  return 'Preview unavailable right now.';
}

export default function VinylPlayer() {
  const audioRef = useRef(null);
  const [selectedRecordId, setSelectedRecordId] = useState(VINYL_PREVIEWS[0]?.id ?? null);
  const [queuedAutoplayId, setQueuedAutoplayId] = useState(null);
  const [draggingRecordId, setDraggingRecordId] = useState(null);
  const [isDeckActive, setIsDeckActive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [previewLength, setPreviewLength] = useState(DEFAULT_PREVIEW_LENGTH);
  const [errorMessage, setErrorMessage] = useState('');

  const selectedRecord = VINYL_PREVIEWS.find((record) => record.id === selectedRecordId) ?? VINYL_PREVIEWS[0];
  const progress = previewLength > 0 ? Math.min((currentTime / previewLength) * 100, 100) : 0;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !selectedRecord) {
      return;
    }

    audio.pause();
    audio.currentTime = selectedRecord.previewStart ?? 0;
    audio.load();

    setIsPlaying(false);
    setIsReady(false);
    setErrorMessage('');
    setCurrentTime(0);
    setPreviewLength(selectedRecord.previewDuration ?? DEFAULT_PREVIEW_LENGTH);
  }, [selectedRecord]);

  const pausePreview = () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.pause();
    setIsPlaying(false);
  };

  const startPreview = async (forceRestart = false) => {
    const audio = audioRef.current;
    if (!audio || !selectedRecord) {
      return;
    }

    const { previewStart, previewEnd } = getPreviewWindow(selectedRecord, audio);

    if (forceRestart || audio.currentTime < previewStart || audio.currentTime >= previewEnd - 0.15) {
      audio.currentTime = previewStart;
      setCurrentTime(0);
    }

    setErrorMessage('');

    try {
      await audio.play();
      setIsPlaying(true);
    } catch {
      setErrorMessage(getMissingPreviewMessage());
      setIsPlaying(false);
    }
  };

  const handleRecordChange = (recordId, options = {}) => {
    const { autoplay = false } = options;

    setIsDeckActive(false);
    setDraggingRecordId(null);

    if (recordId === selectedRecordId) {
      if (autoplay) {
        setQueuedAutoplayId(null);
        void startPreview(true);
      }

      return;
    }

    setQueuedAutoplayId(autoplay ? recordId : null);
    setSelectedRecordId(recordId);
  };

  const handleDragStart = (event, recordId) => {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', recordId);
    setDraggingRecordId(recordId);
  };

  const handleDrop = (event) => {
    event.preventDefault();

    const recordId = event.dataTransfer.getData('text/plain');
    if (!recordId) {
      setIsDeckActive(false);
      return;
    }

    handleRecordChange(recordId, { autoplay: true });
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (!audio || !selectedRecord) {
      return;
    }

    const { previewStart, previewLength: usablePreviewLength } = getPreviewWindow(selectedRecord, audio);

    audio.currentTime = previewStart;
    setIsReady(true);
    setCurrentTime(0);
    setPreviewLength(usablePreviewLength || selectedRecord.previewDuration || DEFAULT_PREVIEW_LENGTH);

    if (queuedAutoplayId === selectedRecord.id) {
      setQueuedAutoplayId(null);
      void startPreview(true);
    }
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio || !selectedRecord) {
      return;
    }

    const { previewStart, previewEnd, previewLength: usablePreviewLength } = getPreviewWindow(selectedRecord, audio);
    const elapsed = Math.max(0, audio.currentTime - previewStart);

    setCurrentTime(Math.min(elapsed, usablePreviewLength));

    if (audio.currentTime >= previewEnd) {
      audio.pause();
      audio.currentTime = previewStart;
      setIsPlaying(false);
      setCurrentTime(usablePreviewLength);
    }
  };

  const handleAudioError = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
    }

    setIsPlaying(false);
    setIsReady(false);
    setCurrentTime(0);
    setErrorMessage(getMissingPreviewMessage());
  };

  if (!selectedRecord) {
    return null;
  }

  return (
    <section className={`${styles.section} reveal`}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.kicker}>
            <Radio size={16} />
            <span>Drop The Needle</span>
          </div>
          <h2 className="brand-font">Spin A 30-Second Preview</h2>
          <p>
            Drag a vinyl onto the turntable or tap a sleeve from the crate. Each selection loads a
            30-second song preview inside an old-school deck built for the label front page.
          </p>
        </div>

        <div className={styles.console}>
          <div
            className={`${styles.turntableShell} ${isDeckActive ? styles.turntableShellActive : ''}`}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDeckActive(true);
            }}
            onDragLeave={() => setIsDeckActive(false)}
            onDrop={handleDrop}
          >
            <div className={styles.turntableTop}>
              <div className={styles.brandPlate}>HGM Stereo Console</div>
              <div className={styles.deckIndicators}>
                <span className={styles.indicator} />
                <span className={styles.indicatorMuted} />
                <span className={styles.indicatorMuted} />
              </div>
            </div>

            <div className={styles.turntableBody}>
              <div className={styles.deck}>
                <div className={styles.platterShadow} />
                <div className={styles.platter}>
                  <div className={`${styles.record} ${isPlaying ? styles.recordSpinning : ''}`}>
                    <div className={styles.recordGrooves} />
                    <div
                      className={styles.recordLabel}
                      style={{ '--record-accent': selectedRecord.accent }}
                    >
                      <span>{selectedRecord.artist}</span>
                      <strong>{selectedRecord.releaseTitle}</strong>
                      <small>{selectedRecord.trackTitle}</small>
                    </div>
                  </div>

                  <div className={`${styles.tonearm} ${isPlaying ? styles.tonearmEngaged : ''}`}>
                    <span className={styles.tonearmBase} />
                    <span className={styles.tonearmBar} />
                    <span className={styles.tonearmNeedle} />
                  </div>

                  <div className={styles.deckMessage}>
                    {draggingRecordId ? 'Drop the vinyl to load and play the preview.' : 'Drag a vinyl here or hit play.'}
                  </div>
                </div>
              </div>

              <div className={styles.mixer}>
                <div className={styles.nowPlayingCard}>
                  <div className={styles.nowPlayingHeader}>
                    <Disc3 size={18} />
                    <span>Now Loaded</span>
                  </div>
                  <h3>{selectedRecord.releaseTitle}</h3>
                  <p>{selectedRecord.trackTitle}</p>
                  <div className={styles.recordMeta}>
                    <span>{selectedRecord.artist}</span>
                    <span>{selectedRecord.catalogNumber}</span>
                    <span>{selectedRecord.speed}</span>
                  </div>
                  <p className={styles.recordNote}>{selectedRecord.note}</p>
                </div>

                <div className={styles.controlCluster}>
                  <button
                    type="button"
                    className={styles.previewButton}
                    onClick={() => {
                      if (isPlaying) {
                        pausePreview();
                        return;
                      }

                      void startPreview();
                    }}
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                    <span>{isPlaying ? 'Pause Preview' : 'Play 30s Preview'}</span>
                  </button>

                  <div className={styles.progressPanel}>
                    <div className={styles.progressHeader}>
                      <span>Needle Position</span>
                      <span>{isReady ? 'Preview Ready' : 'Loading Record'}</span>
                    </div>
                    <div className={styles.progressTrack}>
                      <span className={styles.progressFill} style={{ width: `${progress}%` }} />
                    </div>
                    <div className={styles.progressClock}>
                      <span>{formatSeconds(currentTime)}</span>
                      <span>{formatSeconds(previewLength)}</span>
                    </div>
                  </div>

                  <div className={styles.levelMeter}>
                    <div className={styles.levelHeader}>
                      <Volume2 size={16} />
                      <span>Warm Tube Meter</span>
                    </div>
                    <div className={styles.levelBars} aria-hidden="true">
                      <span className={isPlaying ? styles.levelBarActive : styles.levelBar} />
                      <span className={isPlaying ? styles.levelBarActiveTall : styles.levelBar} />
                      <span className={isPlaying ? styles.levelBarActive : styles.levelBar} />
                      <span className={isPlaying ? styles.levelBarActiveTall : styles.levelBar} />
                      <span className={isPlaying ? styles.levelBarActive : styles.levelBar} />
                    </div>
                  </div>

                  {errorMessage ? <p className={styles.errorMessage}>{errorMessage}</p> : null}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.cratePanel}>
            <div className={styles.crateHeader}>
              <div>
                <span className={styles.crateEyebrow}>Vinyl Crate</span>
                <h3 className="brand-font">Choose The Record</h3>
              </div>
              <p>Tap on mobile, drag on desktop.</p>
            </div>

            <div className={styles.crateList}>
              {VINYL_PREVIEWS.map((record) => (
                <button
                  key={record.id}
                  type="button"
                  draggable
                  onClick={() => handleRecordChange(record.id)}
                  onDragStart={(event) => handleDragStart(event, record.id)}
                  onDragEnd={() => {
                    setDraggingRecordId(null);
                    setIsDeckActive(false);
                  }}
                  className={`${styles.crateItem} ${record.id === selectedRecord.id ? styles.crateItemActive : ''}`}
                >
                  <div className={styles.dragBadge}>
                    <GripVertical size={14} />
                    <span>Drag or tap</span>
                  </div>

                  <div
                    className={styles.recordSleeve}
                    style={{ '--sleeve-gradient': record.sleeveGradient, '--record-accent': record.accent }}
                  >
                    <div className={styles.sleeveVinyl}>
                      <div className={styles.sleeveLabel} />
                    </div>
                  </div>

                  <div className={styles.crateCopy}>
                    <strong>{record.releaseTitle}</strong>
                    <span>{record.trackTitle}</span>
                    <small>{record.catalogNumber} / {record.year}</small>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <audio
          ref={audioRef}
          src={selectedRecord.previewSrc}
          preload="metadata"
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          onError={handleAudioError}
        />
      </div>
    </section>
  );
}
